import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

// GET /api/analytics/sessions?country=ID[&region=East Java][&city=Surabaya]
export async function GET(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country");
    const region = searchParams.get("region");
    const city = searchParams.get("city");
    if (!country) {
      return NextResponse.json({ error: "country is required" }, { status: 400 });
    }
    // Build filter
    let query = supabase.from("sessions").select("ip_address, city, region, session_id").eq("country", country).neq("ip_address", null);
    if (region) query = query.eq("region", region);
    if (city) query = query.eq("city", city);
    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // If no region/city specified, return region/city breakdowns
    if (!region) {
      // Group by region
      const regions: Record<string, number> = {};
      for (const s of data) {
        if (!s.region) continue;
        regions[s.region] = (regions[s.region] || 0) + 1;
      }
      return NextResponse.json({ regions });
    }
    if (region && !city) {
      // Group by city
      const cities: Record<string, number> = {};
      for (const s of data) {
        if (!s.city) continue;
        cities[s.city] = (cities[s.city] || 0) + 1;
      }
      return NextResponse.json({ cities });
    }
    // Group by ip_address, city
    const grouped: Record<string, { ip_address: string, city: string, session_count: number, session_ids: string[] }> = {};
    for (const s of data) {
      if (!s.ip_address) continue;
      const key = `${s.ip_address}|${s.city || ''}`;
      if (!grouped[key]) grouped[key] = { ip_address: s.ip_address, city: s.city, session_count: 0, session_ids: [] };
      grouped[key].session_count++;
      grouped[key].session_ids.push(s.session_id);
    }
    // For each IP, count leads
    const ipList = Object.values(grouped).map((g) => g.ip_address);
    let leadsByIp: Record<string, number> = {};
    if (ipList.length) {
      const { data: leads } = await supabase
        .from("leads")
        .select("ip_address, id");
      for (const l of leads || []) {
        if (!l.ip_address) continue;
        leadsByIp[l.ip_address] = (leadsByIp[l.ip_address] || 0) + 1;
      }
    }
    // Attach lead count
    const sessions = Object.values(grouped).map((g) => ({
      ip_address: g.ip_address,
      city: g.city,
      session_count: g.session_count,
      lead_count: leadsByIp[g.ip_address] || 0,
      session_ids: g.session_ids,
      leads: [], // can be filled in visitor-profile endpoint
    }));
    return NextResponse.json({ sessions });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
