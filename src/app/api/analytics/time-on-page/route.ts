import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

// POST - Track time on page (sent via sendBeacon on unload)
export async function POST(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { page_path, time_on_page, session_id, visitor_id } = body;

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
        source: "direct",
        metadata: { sent_via_beacon: true },
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
