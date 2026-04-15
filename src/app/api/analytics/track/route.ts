import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
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
      country,
      region,
      city,
      metadata
    } = body;

    if (!sessionId || !eventType) {
      return NextResponse.json({ error: "sessionId and eventType are required" }, { status: 400 });
    }

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
        referrer: referrer || null,
        gclid: gclid || null,
        fbclid: fbclid || null,
        country: country || null,
        region: region || null,
        city: city || null,
        metadata: metadata || {}
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
