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
      leadRowsRes
    ] = await Promise.all([
      supabase.from("traffic_events").select("*", { count: "exact", head: true }),
      supabase.from("traffic_events").select("*", { count: "exact", head: true }).eq("event_type", "page_view"),
      supabase.from("traffic_events").select("*", { count: "exact", head: true }).eq("event_type", "book_click"),
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("traffic_events").select("source,campaign,event_type").limit(5000),
      supabase.from("leads").select("source").limit(5000)
    ]);

    if (totalEventsRes.error || pageViewsRes.error || bookClicksRes.error || totalLeadsRes.error || trafficRowsRes.error || leadRowsRes.error) {
      console.error("dashboard summary query error");
      return NextResponse.json({ error: "Could not load dashboard summary" }, { status: 500 });
    }

    const trafficRows = (trafficRowsRes.data || []) as { source: string | null; campaign: string | null }[];
    const leadRows = (leadRowsRes.data || []) as { source: string | null }[];

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

    const leadBySource = Object.entries(
      leadRows.reduce<Record<string, number>>((acc, row) => {
        const key = row.source || "direct";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([source, count]) => ({ source, count }));

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
      leadBySource
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid get request" }, { status: 400 });
  }
}
