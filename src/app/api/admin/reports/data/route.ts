import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getGa4MarketingSummary, getGa4ReportForPeriod } from "@/lib/ga4-reporting";

export type ReportPeriod = "weekly" | "mtd" | "alltime";

export async function GET(request: Request) {
  try {
    await requireAdminRequest();

    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") || "mtd") as ReportPeriod;

    const now = new Date();
    let startDate: string;
    let startDateObj: Date;

    if (period === "weekly") {
      // Last 7 days
      startDateObj = new Date(now);
      startDateObj.setDate(startDateObj.getDate() - 6);
      startDate = "7daysAgo";
    } else if (period === "mtd") {
      // Month to date
      startDateObj = new Date(now.getFullYear(), now.getMonth(), 1);
      const dayOfMonth = now.getDate();
      startDate = `${dayOfMonth - 1}daysAgo`;
    } else {
      // All time — 90 days rolling (GA4 max practical window)
      startDateObj = new Date(now);
      startDateObj.setDate(startDateObj.getDate() - 89);
      startDate = "89daysAgo";
    }

    const sinceISO = startDateObj.toISOString();

    // Supabase data in parallel
    const [
      leadsRes,
      trafficRes,
      waClicksRes,
      bookingIntentsRes,
    ] = await Promise.all([
      supabaseAdmin
        .from("leads")
        .select("id, first_name, last_name, source, campaign, status, created_at")
        .gte("created_at", sinceISO)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("traffic_events")
        .select("event_type, source, campaign, page, created_at", { count: "exact" })
        .neq("source", "admin")
        .neq("event_type", "dashboard_viewed")
        .gte("created_at", sinceISO),
      supabaseAdmin
        .from("traffic_events")
        .select("id", { count: "exact", head: true })
        .in("event_type", ["social_click", "cta_click"])
        .neq("source", "admin")
        .neq("event_type", "dashboard_viewed")
        .ilike("page", "%wa.me%")
        .gte("created_at", sinceISO),
      supabaseAdmin
        .from("traffic_events")
        .select("id", { count: "exact", head: true })
        .eq("event_type", "booking_intent")
        .neq("source", "admin")
        .neq("event_type", "dashboard_viewed")
        .gte("created_at", sinceISO),
    ]);

    const leads = leadsRes.data || [];
    const trafficEvents = trafficRes.data || [];
    const totalEvents = trafficRes.count || 0;
    const waClicks = waClicksRes.count || 0;
    const bookingIntents = bookingIntentsRes.count || 0;

    // Lead stats
    const totalLeads = leads.length;
    const newLeads = leads.filter((l) => l.status === "new").length;
    const wonLeads = leads.filter((l) => l.status === "closed_won").length;
    const openSale = leads.filter((l) => l.status === "open_sale").length;

    // Lead source breakdown
    const leadsBySource: Record<string, number> = {};
    for (const lead of leads) {
      const src = lead.source || "direct";
      leadsBySource[src] = (leadsBySource[src] || 0) + 1;
    }

    // Campaign performance from Supabase
    const campaignMap: Record<string, { leads: number; events: number }> = {};
    for (const lead of leads) {
      const camp = lead.campaign || "(none)";
      if (!campaignMap[camp]) campaignMap[camp] = { leads: 0, events: 0 };
      campaignMap[camp].leads++;
    }
    for (const ev of trafficEvents) {
      const camp = ev.campaign || "(none)";
      if (!campaignMap[camp]) campaignMap[camp] = { leads: 0, events: 0 };
      campaignMap[camp].events++;
    }
    const campaignPerformance = Object.entries(campaignMap)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.leads - a.leads || b.events - a.events)
      .slice(0, 10);

    // GA4 data
    const ga4 = await getGa4ReportForPeriod(startDate).catch(() => null);

    return NextResponse.json({
      period,
      generatedAt: now.toISOString(),
      supabase: {
        totalLeads,
        newLeads,
        wonLeads,
        openSale,
        waClicks,
        bookingIntents,
        totalEvents,
        leadsBySource,
        campaignPerformance,
        recentLeads: leads.slice(0, 10),
      },
      ga4: ga4 || null,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_ADMIN_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("reports/data error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
