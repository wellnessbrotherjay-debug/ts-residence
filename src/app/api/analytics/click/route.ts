import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

// POST - Track individual click events (separate from general events)
export async function POST(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const {
      session_id,
      visitor_id,
      page,
      element_type,
      element_text,
      element_id,
      element_class,
      element_selector,
      link_url,
      click_x,
      click_y,
      viewport_width,
      viewport_height,
      device_type,
    } = body;

    // Get client IP
    const { getClientIp } = await import("@/lib/analytics-enrichment");
    const ip_address = getClientIp(req);

    if (!session_id || !element_type) {
      return NextResponse.json({ error: "session_id and element_type are required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("click_events")
      .insert({
        session_id,
        visitor_id: visitor_id || null,
        page: page || null,
        element_type,
        element_text: element_text?.substring(0, 200) || null,
        element_id: element_id || null,
        element_class: element_class?.substring(0, 200) || null,
        element_selector: element_selector?.substring(0, 500) || null,
        link_url: link_url?.substring(0, 500) || null,
        click_x: click_x || null,
        click_y: click_y || null,
        viewport_width: viewport_width || null,
        viewport_height: viewport_height || null,
        ip_address: ip_address || null,
        metadata: { device_type },
      });

    if (error) {
      console.error("click event insert error", error);
      return NextResponse.json({ error: "Could not persist click event" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}

// GET - Get click analytics (for heatmaps, etc.)
export async function GET(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    const limit = parseInt(searchParams.get("limit") || "100");

    let query = supabase
      .from("click_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (page) {
      query = query.eq("page", page);
    }

    const { data, error } = await query;

    if (error) {
      console.error("click events fetch error", error);
      return NextResponse.json({ error: "Could not fetch click events" }, { status: 500 });
    }

    return NextResponse.json({ clicks: data || [] });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
