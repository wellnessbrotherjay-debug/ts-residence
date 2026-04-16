import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import {
  anonymizeIp,
  getClientIp,
  getRequestGeo,
  parseCookies,
} from "@/lib/analytics-enrichment";

// POST - Track time on page (sent via sendBeacon on unload)
export async function POST(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { page_path, time_on_page, session_id, visitor_id } = body;
    const ip = getClientIp(req);
    const geo = getRequestGeo(req);
    const cookies = parseCookies(req);

    if (!page_path || time_on_page === undefined) {
      return NextResponse.json({ error: "page_path and time_on_page are required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("traffic_events")
      .insert({
        session_id: session_id || null,
        visitor_id: visitor_id || null,
        event_type: "time_on_page",
        event_category: "engagement",
        page: page_path,
        time_on_page_seconds: time_on_page,
        country: geo.country || null,
        region: geo.region || null,
        city: geo.city || null,
        timezone: geo.timezone || null,
        source: "direct",
        metadata: {
          sent_via_beacon: true,
          ip_address: ip,
          ip_anonymized: anonymizeIp(ip),
          geo_ip: geo,
          cookie_consent: cookies.cookie_consent || null,
        },
      });

    if (error) {
      console.error("time on page insert error", error);
      // Silently fail for beacon requests
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
