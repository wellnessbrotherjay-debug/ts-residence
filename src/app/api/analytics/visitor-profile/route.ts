import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

// GET /api/analytics/visitor-profile?ip=xxx.xxx.xxx.xxx
export async function GET(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const ip = searchParams.get("ip");
    if (!ip) {
      return NextResponse.json({ error: "ip is required" }, { status: 400 });
    }
    // Fetch sessions for this IP
    const { data: sessions } = await supabase
      .from("sessions")
      .select("*")
      .eq("ip_address", ip)
      .order("start_time", { ascending: false });
    // Fetch leads for this IP
    const { data: leads } = await supabase
      .from("leads")
      .select("*")
      .eq("ip_address", ip)
      .order("created_at", { ascending: false });
    // Fetch funnel steps for all session_ids
    const sessionIds = (sessions || []).map((s: any) => s.session_id);
    let funnel = [];
    if (sessionIds.length) {
      const { data: funnelData } = await supabase
        .from("funnels")
        .select("*")
        .in("session_id", sessionIds)
        .order("created_at", { ascending: true });
      funnel = funnelData || [];
    }
    // Use first session for geo info
    const geo = sessions && sessions[0] ? {
      country: sessions[0].country,
      city: sessions[0].city,
      region: sessions[0].region,
    } : {};
    return NextResponse.json({
      ip_address: ip,
      ...geo,
      sessions: sessions || [],
      leads: leads || [],
      funnel,
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
