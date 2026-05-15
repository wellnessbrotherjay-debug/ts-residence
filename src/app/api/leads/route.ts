import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";
import { z } from "zod";
import {
  checkRateLimit,
  getClientIp,
  tooManyRequestsResponse,
} from "@/lib/api-security";
import { getRequestContext, isLikelyBot } from "@/lib/request-context";

const resend = new Resend(process.env.RESEND_API_KEY);

const utmTouchSchema = z.object({
  utm_source: z.string().trim().max(120).nullable().optional(),
  utm_medium: z.string().trim().max(120).nullable().optional(),
  utm_campaign: z.string().trim().max(255).nullable().optional(),
  utm_content: z.string().trim().max(255).nullable().optional(),
  utm_term: z.string().trim().max(255).nullable().optional(),
  gclid: z.string().trim().max(255).nullable().optional(),
  fbclid: z.string().trim().max(255).nullable().optional(),
  ttclid: z.string().trim().max(255).nullable().optional(),
}).optional();

const leadsSchema = z.object({
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(32).nullable().optional(),
  stayDuration: z.string().trim().max(120).nullable().optional(),
  message: z.string().trim().max(4000).nullable().optional(),
  page: z.string().trim().max(255).nullable().optional(),
  source: z.string().trim().max(120).nullable().optional(),
  medium: z.string().trim().max(120).nullable().optional(),
  campaign: z.string().trim().max(255).nullable().optional(),
  term: z.string().trim().max(255).nullable().optional(),
  content: z.string().trim().max(255).nullable().optional(),
  referrer: z.string().trim().max(2048).nullable().optional(),
  gclid: z.string().trim().max(255).nullable().optional(),
  fbclid: z.string().trim().max(255).nullable().optional(),
  ttclid: z.string().trim().max(255).nullable().optional(),
  sessionId: z.string().trim().max(255).nullable().optional(),
  visitorId: z.string().trim().max(255).nullable().optional(),
  deviceType: z.string().trim().max(32).nullable().optional(),
  landingPage: z.string().trim().max(2048).nullable().optional(),
  pageUrl: z.string().trim().max(2048).nullable().optional(),
  firstTouch: utmTouchSchema,
  latestTouch: utmTouchSchema,
  ctaClicked: z.string().trim().max(255).nullable().optional(),
  leadPage: z.string().trim().max(2048).nullable().optional(),
  _honeypot: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const context = getRequestContext(req);
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`leads:${clientIp}`, 8, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return tooManyRequestsResponse(rateLimit.retryAfterMs);
    }

    const payload = await req.json();
    const parsed = leadsSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const body = parsed.data;
    const {
      firstName,
      lastName,
      email,
      phone,
      stayDuration,
      message,
      page,
      source,
      medium,
      campaign,
      term,
      content,
      referrer,
      gclid,
      fbclid,
      ttclid,
      sessionId,
      visitorId,
      deviceType,
      landingPage,
      pageUrl,
      firstTouch,
      latestTouch,
      ctaClicked,
      leadPage,
      _honeypot
    } = body;

    // 1. Basic Spam Protection (Honeypot)
    if (_honeypot) {
      return NextResponse.json({ success: true, message: "Spam detected" });
    }

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "firstName, lastName, and email are required" }, { status: 400 });
    }

    if (isLikelyBot(context.userAgent) || context.deviceType === "bot") {
      return NextResponse.json({ success: true, message: "Bot traffic ignored" });
    }

    // 2. Deduplication (Check for same email in last 24h)
    const { data: existingLeads, error: dedupeError } = await supabase
      .from("leads")
      .select("id")
      .eq("email", email)
      .gt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (dedupeError) {
      console.error("lead dedupe error", dedupeError);
      return NextResponse.json({ error: "Could not check for duplicates", details: dedupeError }, { status: 500 });
    }

    if (existingLeads && existingLeads.length > 0) {
      return NextResponse.json({ success: true, message: "Duplicate lead within 24h" });
    }

    // 2b. Basic risk scoring from recent same-IP submissions
    let recentIpLeadCount = 0;
    if (context.ip) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: recentLeads } = await supabase
        .from("leads")
        .select("metadata")
        .gt("created_at", oneHourAgo)
        .limit(500);

      recentIpLeadCount = (recentLeads || []).filter((row) => {
        const metadata = row.metadata as Record<string, unknown> | null;
        return metadata?.request_ip === context.ip;
      }).length;
    }

    const riskReasons: string[] = [];
    if (recentIpLeadCount >= 3) riskReasons.push("high_ip_velocity");
    if (phone && /^\+?0+$/.test(phone.replace(/\s+/g, ""))) riskReasons.push("invalid_phone_pattern");
    const riskScore = riskReasons.length;

    const trustedReferrer = req.headers.get("referer") || referrer || null;

    // Lock attribution fields at ingest to prevent frontend spoofing of historical touch state
    const safeUrl = (() => {
      try {
        return pageUrl ? new URL(pageUrl, "https://www.tsresidence.id") : null;
      } catch {
        return null;
      }
    })();

    const sourceFromUrl = safeUrl?.searchParams.get("utm_source") || undefined;
    const mediumFromUrl = safeUrl?.searchParams.get("utm_medium") || undefined;
    const campaignFromUrl = safeUrl?.searchParams.get("utm_campaign") || undefined;
    const termFromUrl = safeUrl?.searchParams.get("utm_term") || undefined;
    const contentFromUrl = safeUrl?.searchParams.get("utm_content") || undefined;

    // Attribution priority: URL params > latestTouch localStorage > body fields > direct
    const finalSource = sourceFromUrl || latestTouch?.utm_source || source || "direct";
    const finalMedium = mediumFromUrl || latestTouch?.utm_medium || medium || null;
    const finalCampaign = campaignFromUrl || latestTouch?.utm_campaign || campaign || null;
    const finalTerm = termFromUrl || latestTouch?.utm_term || term || null;
    const finalContent = contentFromUrl || latestTouch?.utm_content || content || null;
    const finalGclid = (safeUrl?.searchParams.get("gclid")) || latestTouch?.gclid || gclid || null;
    const finalFbclid = (safeUrl?.searchParams.get("fbclid")) || latestTouch?.fbclid || fbclid || null;
    const finalTtclid = (safeUrl?.searchParams.get("ttclid")) || latestTouch?.ttclid || ttclid || null;

    const firstSource = firstTouch?.utm_source || finalSource;
    const firstMedium = firstTouch?.utm_medium || finalMedium;
    const firstCampaign = firstTouch?.utm_campaign || finalCampaign;
    const firstTerm = firstTouch?.utm_term || finalTerm;
    const firstContent = firstTouch?.utm_content || finalContent;

    const trustedAttribution = {
      source: finalSource,
      medium: finalMedium,
      campaign: finalCampaign,
      term: finalTerm,
      content: finalContent,
      gclid: finalGclid,
      fbclid: finalFbclid,
      ttclid: finalTtclid,
      first_source: firstSource,
      first_medium: firstMedium,
      first_campaign: firstCampaign,
      first_term: firstTerm,
      first_content: firstContent,
      captured_at: new Date().toISOString(),
      attribution_locked: true,
    };

    const trustedDeviceType =
      context.deviceType !== "unknown" ? context.deviceType : deviceType || null;

    // 3. Insert Lead
    const { data, error } = await supabase
      .from("leads")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        stay_duration: stayDuration || null,
        message: message || null,
        page: page || null,
        // Attribution — top-level columns
        source: finalSource,
        medium: finalMedium,
        campaign: finalCampaign,
        term: finalTerm,
        content: finalContent,
        referrer: trustedReferrer,
        // New attribution columns (added by SQL Fix Pack 1)
        session_id: sessionId || null,
        visitor_id: visitorId || null,
        first_source: firstSource,
        first_medium: firstMedium,
        first_campaign: firstCampaign,
        first_content: firstContent,
        first_term: firstTerm,
        latest_source: finalSource,
        latest_medium: finalMedium,
        latest_campaign: finalCampaign,
        latest_content: finalContent,
        latest_term: finalTerm,
        attribution: trustedAttribution,
        cta_clicked: ctaClicked || null,
        lead_page: leadPage || pageUrl || null,
        // Device/page
        device_type: trustedDeviceType,
        landing_page: landingPage || null,
        page_url: pageUrl || null,
        metadata: {
          device_type: trustedDeviceType,
          landing_page: landingPage || null,
          page_url: pageUrl || null,
          session_id: sessionId || null,
          visitor_id: visitorId || null,
          gclid: finalGclid,
          fbclid: finalFbclid,
          ttclid: finalTtclid,
          first_touch: { source: firstSource, medium: firstMedium, campaign: firstCampaign, term: firstTerm, content: firstContent },
          latest_touch: trustedAttribution,
          cta_clicked: ctaClicked || null,
          risk_score: riskScore,
          risk_reasons: riskReasons,
          recent_ip_lead_count_1h: recentIpLeadCount,
          request_ip: context.ip,
          request_user_agent: context.userAgent,
          request_device_type: context.deviceType,
          request_country: context.country,
          request_region: context.region,
          request_city: context.city,
          request_latitude: context.latitude,
          request_longitude: context.longitude,
        },
      })
      .select("id")
      .single();

    if (error) {
      console.error("lead insert error", error);
      return NextResponse.json({ error: "Could not save lead", details: error }, { status: 500 });
    }

    // 3b. Server-side tracking fallback for WhatsApp capture leads.
    // This keeps admin metrics accurate even if client-side tracking is blocked.
    if (ctaClicked === "whatsapp_button") {
      const fallbackPage = leadPage || page || safeUrl?.pathname || null;
      const fallbackSessionId = sessionId || `lead_${data?.id || Date.now()}`;

      const { error: trafficFallbackError } = await supabaseAdmin
        .from("traffic_events")
        .insert({
          session_id: fallbackSessionId,
          visitor_id: visitorId || null,
          event_type: "booking_intent",
          page: fallbackPage,
          source: finalSource,
          medium: finalMedium,
          campaign: finalCampaign,
          term: finalTerm,
          content: finalContent,
          referrer: trustedReferrer,
          gclid: finalGclid,
          fbclid: finalFbclid,
          metadata: {
            link_url: "https://wa.me/6281119028111",
            link_text: "whatsapp_capture_modal",
            intent_type: "booking_or_inquiry",
            cta_clicked: ctaClicked,
            lead_id: data?.id || null,
            request_ip: context.ip,
            request_user_agent: context.userAgent,
            request_device_type: context.deviceType,
            request_country: context.country,
            request_region: context.region,
            request_city: context.city,
            request_latitude: context.latitude,
            request_longitude: context.longitude,
          },
        });

      if (trafficFallbackError) {
        console.error("whatsapp fallback traffic insert error", trafficFallbackError);
      }
    }

    // 4. Trigger Automations (Resend & Jarvis)
    try {
      const leadName = `${firstName} ${lastName}`;

      // --- Country code extraction ---
      // Simple regex to extract country code from +<code>...
      let countryCode = "";
      let countryName = "";
      if (phone && phone.startsWith("+")) {
        const match = phone.match(/^(\+\d{1,4})/);
        if (match) {
          countryCode = match[1];
        }
      }
      // Minimal country code map (expand as needed)
      const codeMap: Record<string, string> = {
        "+62": "Indonesia",
        "+1": "USA/Canada",
        "+65": "Singapore",
        "+60": "Malaysia",
        "+63": "Philippines",
        "+81": "Japan",
        "+82": "South Korea",
        "+44": "UK",
        "+91": "India",
        "+61": "Australia",
        "+66": "Thailand",
        "+84": "Vietnam",
        "+86": "China",
      };
      if (countryCode && codeMap[countryCode]) {
        countryName = codeMap[countryCode];
      }

      // A. Auto-reply to User
      await resend.emails.send({
        from: "TS Residence <reservations@tsresidence.id>",
        to: email,
        subject: "Thank you for your enquiry - TS Residence",
        html: `
          <div style="font-family: serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
            <h1 style="color: #8b7658; font-size: 24px; border-bottom: 2px solid #8b7658; padding-bottom: 10px;">Enquiry Received</h1>
            <p>Dear ${firstName},</p>
            <p>Thank you for your interest in <strong>TS Residence</strong>. We have received your enquiry regarding a stay for <strong>${stayDuration || "your upcoming visit"}</strong>.</p>
            <p>Our concierge team is currently reviewing your request and will get back to you within 24 hours with availability and pricing.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #666;"><strong>Your Message:</strong></p>
              <p style="margin: 5px 0 0 0; font-style: italic;">"${message || "No message provided"}"</p>
            </div>
            <p>In the meantime, feel free to browse our <a href="https://www.tsresidence.id/apartments" style="color: #8b7658; text-decoration: none; font-weight: bold;">Apartment Gallery</a> or contact us via WhatsApp.</p>
            <p style="margin-top: 30px; font-size: 14px; color: #888;">Warm regards,<br>The TS Residence Team</p>
          </div>
        `,
      });

      // B. Notification to Team
      const isWaCapture = ctaClicked === "whatsapp_button";
      const teamRecipients = [
        "wellnessbrotherjay@gmail.com",
        "randolphbubu4@gmail.com",
        "tsresidence@townsquare.co.id",
      ];
      const teamSubject = isWaCapture
        ? `🟢 WhatsApp Lead: ${leadName} left their email — follow up now`
        : `New Lead: ${leadName} (${finalSource})`;

      await resend.emails.send({
        from: "TS Intelligence <system@tsresidence.id>",
        to: teamRecipients,
        subject: teamSubject,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e5e5e5;">
            <div style="background:${isWaCapture ? "#25D366" : "#1a1a1a"};padding:24px 28px;">
              <p style="color:${isWaCapture ? "#fff" : "#c5a572"};font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 6px;">TS Residence CRM</p>
              <h1 style="color:#fff;font-size:20px;font-weight:700;margin:0;">${isWaCapture ? "🟢 WhatsApp Lead Captured" : "New Lead Captured"}</h1>
              ${isWaCapture ? `<p style="color:rgba(255,255,255,0.85);font-size:13px;margin:8px 0 0;">This person clicked your WhatsApp button and left their email. Contact them before they go cold.</p>` : ""}
            </div>
            <div style="padding:24px 28px;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe3;color:#888;width:130px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Name</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe3;font-weight:700;">${leadName}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe3;color:#888;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe3;"><a href="mailto:${email}" style="color:#8b7658;font-weight:600;">${email}</a></td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe3;color:#888;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe3;">${phone ? `${phone}${countryName ? ` (${countryName})` : ""}` : "—"}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe3;color:#888;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Stay Duration</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe3;">${stayDuration || "—"}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe3;color:#888;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Message</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe3;">${message || "—"}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe3;color:#888;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Source</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe3;">${finalSource}${finalMedium ? ` / ${finalMedium}` : ""}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe3;color:#888;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Campaign</td><td style="padding:10px 0;border-bottom:1px solid #f0ebe3;">${finalCampaign || "—"}</td></tr>
                <tr><td style="padding:10px 0;color:#888;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Page</td><td style="padding:10px 0;">${page || leadPage || "—"}</td></tr>
              </table>
              ${isWaCapture ? `
              <div style="margin-top:20px;background:#f0fdf4;border-radius:8px;padding:16px;border-left:4px solid #25D366;">
                <p style="margin:0;font-size:13px;color:#166534;font-weight:600;">Suggested action: reply to their email or WhatsApp them directly within 24 hours for the highest chance of closing.</p>
              </div>` : ""}
              <div style="margin-top:24px;display:flex;gap:12px;">
                <a href="https://www.tsresidence.id/admin" style="display:inline-block;padding:12px 20px;background:#8b7658;color:#fff;text-decoration:none;border-radius:6px;font-weight:700;font-size:13px;">View in CRM →</a>
                ${phone ? `<a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}" style="display:inline-block;padding:12px 20px;background:#25D366;color:#fff;text-decoration:none;border-radius:6px;font-weight:700;font-size:13px;">WhatsApp Them →</a>` : ""}
              </div>
            </div>
          </div>
        `,
      });

      // C. Log to Jarvis Command Center
      if (process.env.JARVIS_API_URL && process.env.JARVIS_API_KEY) {
        await fetch(process.env.JARVIS_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.JARVIS_API_KEY}`
          },
          body: JSON.stringify({
            actor_type: 'human',
            actor_name: leadName,
            system: 'TS Residence',
            action: 'Lead Captured',
            summary: `New lead captured from ${source}: ${firstName} ${lastName} (${email})`,
            status: 'success',
            metadata: {
              source,
              campaign,
              page,
              stayDuration,
              landingPage,
              gclid,
              fbclid,
              ttclid,
              sessionId,
              visitorId,
            }
          })
        }).catch(err => console.error("Jarvis activity logging failed", err));
      }
    } catch (automationError) {
      console.error("Automation failed", automationError);
      // We don't fail the lead creation if automations fail, but we log it
    }


    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  try {
    await requireAdminRequest();

    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(250);

    if (error) {
      console.error("fetch leads error", error);
      return NextResponse.json({ error: "Could not fetch leads", details: error }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_ADMIN_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("leads GET catch error", err);
    return NextResponse.json({ error: "Invalid get request", details: String(err) }, { status: 400 });
  }
}
