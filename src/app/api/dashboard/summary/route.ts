import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface DashboardSummary {
  totals: {
    total_events: number;
    page_views: number;
    unique_sessions: number;
    book_clicks: number;
    whatsapp_clicks: number;
    total_leads: number;
    converted_sessions: number;
    engaged_sessions: number;
    failed_events: number;
  };
  bySource: { source: string; count: number }[];
  byCampaign: { campaign: string; count: number }[];
  byMedium: { medium: string; count: number }[];
  byPage: { page: string; views: number; unique_visitors: number; avg_time_on_page: number }[];
  byCountry: { country: string; count: number }[];
  byRegion: { region: string; count: number }[];
  byDevice: { device_type: string; count: number }[];
  topClicks: { element_text: string; link_url: string; count: number }[];
  recentEvents: any[];
  behaviorMetrics: {
    avg_session_duration: number;
    avg_pages_per_session: number;
    bounce_rate: number;
    avg_time_on_page: number;
  };
  funnelData: {
    name: string;
    steps: { step_number: number; step_name: string; count: number }[];
    conversion_rate: number;
  }[];
}

export async function GET(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "7");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Run all queries in parallel
    const [
      totalEventsRes,
      pageViewsRes,
      sessionsRes,
      bookClicksRes,
      leadsRes,
      trafficRowsRes,
      clickEventsRes,
      sessionsDetailedRes,
      timeOnPageRes,
      funnelRes,
      allEventsRes
    ] = await Promise.all([
      // Total events count
      supabase.from("traffic_events").select("*", { count: "exact", head: true })
        .gte("created_at", startDate.toISOString()),

      // Page views
      supabase.from("traffic_events").select("*", { count: "exact", head: true })
        .eq("event_type", "page_view")
        .gte("created_at", startDate.toISOString()),

      // Unique sessions
      supabase.from("sessions").select("session_id", { count: "exact", head: true })
        .gte("start_time", startDate.toISOString()),

      // Booking clicks
      supabase.from("traffic_events").select("*", { count: "exact", head: true })
        .eq("event_type", "booking_click")
        .gte("created_at", startDate.toISOString()),

      // Total leads
      supabase.from("leads").select("*", { count: "exact", head: true })
        .gte("created_at", startDate.toISOString()),

      // Traffic breakdown data
      supabase.from("traffic_events")
        .select("source,medium,campaign,page,country,region,device_type,event_type,link_url,element_text,metadata")
        .gte("created_at", startDate.toISOString())
        .limit(10000),

      // Click events for top clicks
      supabase.from("click_events")
        .select("element_text,link_url,page")
        .gte("created_at", startDate.toISOString())
        .limit(5000),

      // Session details for metrics
      supabase.from("sessions")
        .select("*")
        .gte("start_time", startDate.toISOString())
        .limit(5000),

      // Time on page events
      supabase.from("traffic_events")
        .select("page,time_on_page_seconds")
        .eq("event_type", "time_on_page")
        .gte("created_at", startDate.toISOString())
        .not("time_on_page_seconds", "is", null)
        .limit(5000),

      // Funnel data
      supabase.from("funnels")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })
        .limit(10000),

      // Recent events for feed
      supabase.from("traffic_events")
        .select("id,event_type,page,source,medium,campaign,term,content,referrer,gclid,fbclid,created_at,metadata,element_type,element_text")
        .order("created_at", { ascending: false })
        .limit(50)
    ]);

    const trafficRows = trafficRowsRes.data || [];
    const clickRows = clickEventsRes.data || [];
    const sessionRows = sessionsDetailedRes.data || [];
    const timeOnPageRows = timeOnPageRes.data || [];
    const funnelRows = funnelRes.data || [];

    // Calculate WhatsApp clicks
    const whatsappClicks = trafficRows.filter(e =>
      e.event_type === "whatsapp_click" ||
      e.link_url?.includes("wa.me") ||
      e.element_text?.toLowerCase().includes("whatsapp")
    ).length;

    // Calculate engaged and converted sessions
    const engagedSessions = sessionRows.filter(s => s.engaged).length;
    const convertedSessions = sessionRows.filter(s => s.converted).length;
    const failedEvents = trafficRows.filter((e: any) =>
      ["tracking_error", "form_error", "api_error", "session_error"].includes(e.event_type)
    ).length;

    // Aggregate Source
    const bySource = Object.entries(
      trafficRows.reduce<Record<string, number>>((acc, row) => {
        const key = row.source || "direct";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([source, count]) => ({ source, count }));

    // Aggregate Medium
    const byMedium = Object.entries(
      trafficRows.reduce<Record<string, number>>((acc, row) => {
        const key = row.medium || "none";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([medium, count]) => ({ medium, count }));

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

    // Aggregate Pages with enhanced metrics
    const pageMetrics = trafficRows.reduce<Record<string, { views: number; uniqueSessions: Set<string>; timeOnPage: number[] }>>((acc, row) => {
      const key = row.page || "/";
      if (!acc[key]) {
        acc[key] = { views: 0, uniqueSessions: new Set(), timeOnPage: [] };
      }
      acc[key].views++;
      // For unique sessions, we'd need session_id in traffic_events
      return acc;
    }, {});

    // Add time on page data
    timeOnPageRows.forEach(row => {
      const key = row.page || "/";
      if (pageMetrics[key]) {
        pageMetrics[key].timeOnPage.push(row.time_on_page_seconds || 0);
      }
    });

    const byPage = Object.entries(pageMetrics)
      .map(([page, data]) => ({
        page,
        views: data.views,
        unique_visitors: data.uniqueSessions.size,
        avg_time_on_page: data.timeOnPage.length > 0
          ? Math.round(data.timeOnPage.reduce((a, b) => a + b, 0) / data.timeOnPage.length)
          : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Aggregate Country
    const byCountry = Object.entries(
      trafficRows.reduce<Record<string, number>>((acc, row) => {
        if (!row.country) return acc;
        const key = row.country.toUpperCase();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));

    // Aggregate Region
    const byRegion = Object.entries(
      trafficRows.reduce<Record<string, number>>((acc, row) => {
        if (!row.region) return acc;
        const key = row.region;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([region, count]) => ({ region, count }));

    // Aggregate Device
    const byDevice = Object.entries(
      trafficRows.reduce<Record<string, number>>((acc, row) => {
        const key = row.device_type || "unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .map(([device_type, count]) => ({ device_type, count }));

    // Top Clicks
    const clickMap = new Map<string, { element_text: string; link_url: string; count: number }>();
    clickRows.forEach((click: any) => {
      const key = `${click.element_text || 'unknown'}|${click.link_url || 'no-link'}`;
      const existing = clickMap.get(key);
      if (existing) {
        existing.count++;
      } else {
        clickMap.set(key, {
          element_text: click.element_text || 'unknown',
          link_url: click.link_url || null,
          count: 1,
        });
      }
    });

    const topClicks = Array.from(clickMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // Behavior Metrics
    const totalDuration = sessionRows.reduce((sum, s) => sum + (s.total_duration_seconds || 0), 0);
    const totalPagesVisited = sessionRows.reduce((sum, s) => sum + (s.pages_visited || 0), 0);
    const bouncedSessions = sessionRows.filter(s => (s.pages_visited || 0) <= 1).length;

    const avgSessionDuration = sessionRows.length > 0 ? Math.round(totalDuration / sessionRows.length) : 0;
    const avgPagesPerSession = sessionRows.length > 0 ? Math.round((totalPagesVisited / sessionRows.length) * 10) / 10 : 0;
    const bounceRate = sessionRows.length > 0 ? Math.round((bouncedSessions / sessionRows.length) * 100) : 0;
    const avgTimeOnPage = timeOnPageRows.length > 0
      ? Math.round(timeOnPageRows.reduce((sum, row) => sum + (row.time_on_page_seconds || 0), 0) / timeOnPageRows.length)
      : 0;

    // Funnel Analysis
    const funnelMap = new Map<string, Map<number, { step_name: string; count: number; unique_sessions: Set<string> }>>();

    funnelRows.forEach((funnel: any) => {
      const funnelName = funnel.funnel_name || "default";
      if (!funnelMap.has(funnelName)) {
        funnelMap.set(funnelName, new Map());
      }
      const stepMap = funnelMap.get(funnelName)!;
      if (!stepMap.has(funnel.step_number)) {
        stepMap.set(funnel.step_number, {
          step_name: funnel.step_name,
          count: 0,
          unique_sessions: new Set(),
        });
      }
      const step = stepMap.get(funnel.step_number)!;
      step.count++;
      step.unique_sessions.add(funnel.session_id);
    });

    const funnelData = Array.from(funnelMap.entries()).map(([name, stepMap]) => {
      const steps = Array.from(stepMap.entries())
        .map(([stepNum, data]) => ({
          step_number: stepNum,
          step_name: data.step_name,
          count: data.unique_sessions.size,
        }))
        .sort((a, b) => a.step_number - b.step_number);

      const firstStepCount = steps[0]?.count || 1;
      const lastStepCount = steps[steps.length - 1]?.count || 0;
      const conversionRate = Math.round((lastStepCount / firstStepCount) * 100);

      return {
        name,
        steps,
        conversion_rate: conversionRate,
      };
    });

    const totals = {
      total_events: totalEventsRes.count || 0,
      page_views: pageViewsRes.count || 0,
      unique_sessions: sessionsRes.count || 0,
      book_clicks: bookClicksRes.count || 0,
      whatsapp_clicks: whatsappClicks,
      total_leads: leadsRes.count || 0,
      converted_sessions: convertedSessions,
      engaged_sessions: engagedSessions,
      failed_events: failedEvents,
    };

    const summary: DashboardSummary = {
      totals,
      bySource,
      byCampaign,
      byMedium,
      byPage,
      byCountry,
      byRegion,
      byDevice,
      topClicks,
      recentEvents: allEventsRes.data || [],
      behaviorMetrics: {
        avg_session_duration: avgSessionDuration,
        avg_pages_per_session: avgPagesPerSession,
        bounce_rate: bounceRate,
        avg_time_on_page: avgTimeOnPage,
      },
      funnelData,
    };

    return NextResponse.json(summary);
  } catch (err) {
    console.error("dashboard summary error", err);
    return NextResponse.json({ error: "Invalid get request" }, { status: 400 });
  }
}
