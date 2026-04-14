import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const [
      totalEventsRes,
      pageViewsRes,
      bookClicksRes,
      totalLeadsRes,
      trafficRowsRes,
      allEventsRes
    ] = await Promise.all([
      supabase.from("traffic_events").select("*", { count: "exact", head: true }),
      supabase.from("traffic_events").select("*", { count: "exact", head: true }).eq("event_type", "page_view"),
      supabase.from("traffic_events").select("*", { count: "exact", head: true }).eq("event_type", "book_click"),
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("traffic_events").select("source,campaign,page").limit(10000),
      supabase.from("traffic_events").select("id,event_type,page,created_at,metadata").order("created_at", { ascending: false }).limit(20)
    ]);

    if (trafficRowsRes.error || allEventsRes.error) {
      console.error("dashboard summary query error", trafficRowsRes.error || allEventsRes.error);
      return NextResponse.json({ error: "Could not load dashboard summary" }, { status: 500 });
    }

    const trafficRows = trafficRowsRes.data || [];
    
    // Aggregate Source
    const bySource = Object.entries(
      trafficRows.reduce<Record<string, number>>((acc, row) => {
        const key = row.source || "direct";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([source, count]) => ({ source, count }));

    // Aggregate Campaign
    const byCampaign = Object.entries(
      trafficRows.reduce<Record<string, number>>((acc, row) => {
        if (!row.campaign) return acc;
        acc[row.campaign] = (acc[row.campaign] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([campaign, count]) => ({ campaign, count }));

    // Aggregate Pages
    const byPage = Object.entries(
      trafficRows.reduce<Record<string, number>>((acc, row) => {
        const key = row.page || "/";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([page, count]) => ({ page, count }));

    const totals = {
      total_events: totalEventsRes.count || 0,
      page_views: pageViewsRes.count || 0,
      book_clicks: bookClicksRes.count || 0,
      total_leads: totalLeadsRes.count || 0,
    };

    return NextResponse.json({
      totals,
      bySource,
      byCampaign,
      byPage,
      recentEvents: allEventsRes.data || []
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid get request" }, { status: 400 });
  }
}
