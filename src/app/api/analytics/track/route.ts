import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import {
  checkRateLimit,
  getClientIp,
  tooManyRequestsResponse,
} from "@/lib/api-security";
import { getRequestContext, isLikelyBot } from "@/lib/request-context";

const analyticsSchema = z.object({
  sessionId: z.string().trim().min(1).max(255),
  visitorId: z.string().trim().max(255).optional(),
  eventType: z.string().trim().min(1).max(64),
  page: z.string().trim().max(2048).optional(),
  source: z.string().trim().max(255).optional(),
  medium: z.string().trim().max(255).optional(),
  campaign: z.string().trim().max(255).optional(),
  term: z.string().trim().max(255).optional(),
  content: z.string().trim().max(255).optional(),
  referrer: z.string().trim().max(2048).optional(),
  gclid: z.string().trim().max(255).optional(),
  fbclid: z.string().trim().max(255).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  try {
    const context = getRequestContext(req);
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`analytics:${clientIp}`, 180, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return tooManyRequestsResponse(rateLimit.retryAfterMs);
    }

    const payload = await req.json();
    const parsed = analyticsSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const body = parsed.data;
    const {
      sessionId,
      visitorId,
      eventType,
      page,
      source,
      medium,
      campaign,
      term,
      content,
      referrer,
      gclid,
      fbclid,
      metadata
    } = body;

    if (isLikelyBot(context.userAgent) || context.deviceType === "bot") {
      return NextResponse.json({ success: true, skipped: "bot_traffic" });
    }

    if (!sessionId || !eventType) {
      return NextResponse.json({ error: "sessionId and eventType are required" }, { status: 400 });
    }

    const pagePath = typeof page === "string" ? page : "";
    const sourceValue = typeof source === "string" ? source : "";
    if (
      pagePath === "/admin" ||
      pagePath.startsWith("/admin/") ||
      sourceValue === "admin" ||
      eventType === "dashboard_viewed"
    ) {
      return NextResponse.json({ success: true, skipped: "admin_event" });
    }

    const trustedReferrer = req.headers.get("referer") || referrer || null;

    const { error } = await supabase
      .from("traffic_events")
      .insert({
        session_id: sessionId,
        visitor_id: visitorId || null,
        event_type: eventType,
        page: page || null,
        source: source || "direct",
        medium: medium || null,
        campaign: campaign || null,
        term: term || null,
        content: content || null,
        referrer: trustedReferrer,
        gclid: gclid || null,
        fbclid: fbclid || null,
        metadata: {
          ...(metadata || {}),
          request_ip: context.ip,
          request_user_agent: context.userAgent,
          request_device_type: context.deviceType,
          request_country: context.country,
          request_region: context.region,
          request_city: context.city,
          request_latitude: context.latitude,
          request_longitude: context.longitude,
        }
      });

    if (error) {
      console.error("analytics insert error", error);
      return NextResponse.json({ error: "Could not persist analytics event" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
