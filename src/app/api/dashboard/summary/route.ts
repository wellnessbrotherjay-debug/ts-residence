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

    // Log all Supabase errors for debugging
    if (totalEventsRes.error) console.error("totalEventsRes error", totalEventsRes.error);
    if (pageViewsRes.error) console.error("pageViewsRes error", pageViewsRes.error);
    if (bookClicksRes.error) console.error("bookClicksRes error", bookClicksRes.error);
    if (totalLeadsRes.error) console.error("totalLeadsRes error", totalLeadsRes.error);
    if (trafficRowsRes.error) console.error("trafficRowsRes error", trafficRowsRes.error);
    if (allEventsRes.error) console.error("allEventsRes error", allEventsRes.error);

    if (
      totalEventsRes.error ||
      pageViewsRes.error ||
      bookClicksRes.error ||
      totalLeadsRes.error ||
      trafficRowsRes.error ||
      allEventsRes.error
    ) {
      return NextResponse.json({
        error: "Supabase query error",
        details: {
          totalEventsRes: totalEventsRes.error,
          pageViewsRes: pageViewsRes.error,
          bookClicksRes: bookClicksRes.error,
          totalLeadsRes: totalLeadsRes.error,
          trafficRowsRes: trafficRowsRes.error,
          allEventsRes: allEventsRes.error
        }
      }, { status: 500 });
    }

    const trafficRows = trafficRowsRes.data || [];

    // Aggregate Source
    const sourceMap: Record<string, number> = {};
    for (const row of trafficRows) {
      const key = row.source || "direct";
      sourceMap[key] = (sourceMap[key] || 0) + 1;
    }
    const bySource = Object.entries(sourceMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([source, count]) => ({ source, count }));

    // Aggregate Campaign
    const campaignMap: Record<string, number> = {};
    for (const row of trafficRows) {
      if (!row.campaign) continue;
      campaignMap[row.campaign] = (campaignMap[row.campaign] || 0) + 1;
    }
    const byCampaign = Object.entries(campaignMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([campaign, count]) => ({ campaign, count }));

    // Aggregate Pages
    const pageMap: Record<string, number> = {};
    for (const row of trafficRows) {
      const key = row.page || "/";
      pageMap[key] = (pageMap[key] || 0) + 1;
    }
    const byPage = Object.entries(pageMap)
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
    console.error("dashboard summary catch error", err);
    return NextResponse.json({ error: "Invalid get request", details: String(err) }, { status: 400 });
  }
}
