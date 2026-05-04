import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
      // New fields
      deviceType,
      landingPage,
      pageUrl,
      // Honeypot
      _honeypot
    } = body;

    // 1. Basic Spam Protection (Honeypot)
    if (_honeypot) {
      return NextResponse.json({ success: true, message: "Spam detected" });
    }

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "firstName, lastName, and email are required" }, { status: 400 });
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
        source: source || "direct",
        medium: medium || null,
        campaign: campaign || null,
        term: term || null,
        content: content || null,
        referrer: referrer || null,
        // Attempting to insert new fields (if columns exist)
        device_type: deviceType || null,
        landing_page: landingPage || null,
        page_url: pageUrl || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("lead insert error", error);
      return NextResponse.json({ error: "Could not save lead", details: error }, { status: 500 });
    }

    // 4. Trigger Automations (Resend & Jarvis)
    try {
      const leadName = `${firstName} ${lastName}`;
      
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
      await resend.emails.send({
        from: "TS Intelligence <system@tsresidence.id>",
        to: "wellnessbrotherjay@gmail.com",
        subject: `New Lead: ${leadName} (${source})`,
        html: `
          <h2>New High-Intent Lead Captured</h2>
          <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
            <tr><td><strong>Name</strong></td><td>${leadName}</td></tr>
            <tr><td><strong>Email</strong></td><td>${email}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${phone || "N/A"}</td></tr>
            <tr><td><strong>Stay Duration</strong></td><td>${stayDuration || "N/A"}</td></tr>
            <tr><td><strong>Message</strong></td><td>${message || "N/A"}</td></tr>
            <tr><td><strong>Source</strong></td><td>${source} / ${medium || "organic"}</td></tr>
            <tr><td><strong>Campaign</strong></td><td>${campaign || "N/A"}</td></tr>
            <tr><td><strong>Page</strong></td><td>${page || "N/A"}</td></tr>
            <tr><td><strong>Device</strong></td><td>${deviceType || "N/A"}</td></tr>
          </table>
          <p><a href="https://www.tsresidence.id/admin" style="display: inline-block; padding: 10px 20px; background-color: #8b7658; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;">View in CRM Dashboard</a></p>
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
              stayDuration
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
    const { data, error } = await supabase
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
    console.error("leads GET catch error", err);
    return NextResponse.json({ error: "Invalid get request", details: String(err) }, { status: 400 });
  }
}
