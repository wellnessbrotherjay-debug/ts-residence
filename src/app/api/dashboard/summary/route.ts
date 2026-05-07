import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    await requireAdminRequest();

    const [
      totalEventsRes,
      pageViewsRes,
      bookClicksRes,
      totalLeadsRes,
      closedWonLeadsRes,
      trafficRowsRes,
      allEventsRes
    ] = await Promise.all([
      supabaseAdmin
        .from("traffic_events")
        .select("*", { count: "exact", head: true })
        .neq("source", "admin")
        .neq("event_type", "dashboard_viewed"),
      supabaseAdmin
        .from("traffic_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "page_view")
        .neq("source", "admin")
        .neq("event_type", "dashboard_viewed"),
      supabaseAdmin
        .from("traffic_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "cta_click")
        .neq("source", "admin")
        .neq("event_type", "dashboard_viewed"),
      supabaseAdmin.from("leads").select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "closed_won"),
      supabaseAdmin
        .from("traffic_events")
        .select("source,campaign,page,event_type")
        .eq("event_type", "page_view")
        .neq("source", "admin")
        .neq("event_type", "dashboard_viewed")
        .limit(10000),
      supabaseAdmin.from("traffic_events").select("id,event_type,page,created_at,metadata").order("created_at", { ascending: false }).limit(20)
    ]);

    // Log all Supabase errors for debugging
    if (totalEventsRes.error) console.error("totalEventsRes error", totalEventsRes.error);
    if (pageViewsRes.error) console.error("pageViewsRes error", pageViewsRes.error);
    if (bookClicksRes.error) console.error("bookClicksRes error", bookClicksRes.error);
    if (totalLeadsRes.error) console.error("totalLeadsRes error", totalLeadsRes.error);
    if (closedWonLeadsRes.error) console.error("closedWonLeadsRes error", closedWonLeadsRes.error);
    if (trafficRowsRes.error) console.error("trafficRowsRes error", trafficRowsRes.error);
    if (allEventsRes.error) console.error("allEventsRes error", allEventsRes.error);

    if (
      totalEventsRes.error ||
      pageViewsRes.error ||
      bookClicksRes.error ||
      totalLeadsRes.error ||
      closedWonLeadsRes.error ||
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
          closedWonLeadsRes: closedWonLeadsRes.error,
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
      if (key === "/admin" || key.startsWith("/admin/")) continue;
      pageMap[key] = (pageMap[key] || 0) + 1;
    }
    const byPage = Object.entries(pageMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([page, count]) => ({ page, count }));

    const closedWonLeads = closedWonLeadsRes.count || 0;
    const pageViews = pageViewsRes.count || 0;
    const bookClicks = bookClicksRes.count || 0;
    const totalLeads = totalLeadsRes.count || 0;

    const totals = {
      total_events: totalEventsRes.count || 0,
      page_views: pageViews,
      book_clicks: bookClicks,
      total_leads: totalLeads,
      closed_won_leads: closedWonLeads,
      cta_click_rate: pageViews > 0 ? Number(((bookClicks / pageViews) * 100).toFixed(1)) : 0,
      lead_to_sale_rate: totalLeads > 0 ? Number(((closedWonLeads / totalLeads) * 100).toFixed(1)) : 0,
      visit_to_sale_rate: pageViews > 0 ? Number(((closedWonLeads / pageViews) * 100).toFixed(2)) : 0,
    };

    return NextResponse.json({
      totals,
      bySource,
      byCampaign,
      byPage,
      recentEvents: allEventsRes.data || []
    });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_ADMIN_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("dashboard summary catch error", err);
    return NextResponse.json({ error: "Invalid get request", details: String(err) }, { status: 400 });
  }
}
