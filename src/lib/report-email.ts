import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getGa4ReportForPeriod } from "@/lib/ga4-reporting";

const REPORT_RECIPIENTS = [
  "randolphbubu4@gmail.com",
  "wellnessbrotherjay@gmail.com",
  "tsresidence@townsquare.co.id",
];

type ReportPeriod = "daily" | "weekly" | "mtd" | "alltime";

type LeadRow = {
  first_name: string | null;
  last_name: string | null;
  source: string | null;
  status: string | null;
  created_at: string;
  campaign?: string | null;
};

function periodLabel(period: ReportPeriod) {
  if (period === "daily") return "Daily";
  if (period === "weekly") return "Weekly";
  if (period === "mtd") return "Month-to-Date";
  return "All Time (90 days)";
}

function ga4StartDate(period: ReportPeriod) {
  if (period === "daily") return "yesterday";
  if (period === "weekly") return "7daysAgo";
  if (period === "mtd") {
    const now = new Date();
    return `${now.getDate() - 1}daysAgo`;
  }
  return "89daysAgo";
}

function supabaseSince(period: ReportPeriod) {
  // Bali time is UTC+8
  const baliUtcOffset = 8 * 60 * 60 * 1000;
  const now = new Date();
  const baliNow = new Date(now.getTime() + baliUtcOffset);
  
  if (period === "daily") {
    // TODAY in Bali time (start of day = midnight Bali time)
    // Get ms elapsed since midnight in Bali timezone
    const msSinceMidnightBali = (baliNow.getHours() * 3600 + baliNow.getMinutes() * 60 + baliNow.getSeconds()) * 1000 + baliNow.getMilliseconds();
    // Subtract elapsed time to get midnight Bali time
    const midnightBaliTime = new Date(baliNow.getTime() - msSinceMidnightBali);
    // Convert back to UTC
    const sinceUTC = new Date(midnightBaliTime.getTime() - baliUtcOffset);
    return sinceUTC.toISOString();
  }
  if (period === "weekly") {
    // 7 days ago (in UTC, close enough for weekly)
    const sinceDate = new Date(now);
    sinceDate.setDate(sinceDate.getDate() - 7);
    return sinceDate.toISOString();
  }
  if (period === "mtd") {
    // Start of month (UTC)
    const sinceDate = new Date(now.getFullYear(), now.getMonth(), 1);
    return sinceDate.toISOString();
  }
  // alltime → 90 days
  const sinceDate = new Date(now);
  sinceDate.setDate(sinceDate.getDate() - 89);
  return sinceDate.toISOString();
}

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function fmtDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function sourceBadgeColor(source: string) {
  const s = source.toLowerCase();
  if (s === "ig" || s === "instagram") return "#E1306C";
  if (s === "fb" || s === "facebook") return "#1877F2";
  if (s === "google") return "#4285F4";
  return "#8b7658";
}

function normalizeRecipients(to?: string[]) {
  if (!Array.isArray(to)) return REPORT_RECIPIENTS;
  const clean = to
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  return clean.length ? clean : REPORT_RECIPIENTS;
}

function reportFromAddress() {
  const configured =
    process.env.REPORT_FROM_EMAIL?.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.RESEND_FROM?.trim();
  if (configured) return configured;
  // Fall back to the branded sender used by the rest of the app.
  return "TS Residence <noreply@tsresidence.id>";
}

export async function buildAndSendReport(period: ReportPeriod, to?: string[]) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const recipients = normalizeRecipients(to);
  const since = supabaseSince(period);
  const label = periodLabel(period);
  const now = new Date();

  // For daily reports, add upper bound to exclude tomorrow's data
  let until: string | null = null;
  if (period === "daily") {
    const baliUtcOffset = 8 * 60 * 60 * 1000;
    const baliNow = new Date(now.getTime() + baliUtcOffset);
    
    // Calculate ms since midnight Bali time
    const msSinceMidnightBali = (baliNow.getHours() * 3600 + baliNow.getMinutes() * 60 + baliNow.getSeconds()) * 1000 + baliNow.getMilliseconds();
    
    // Midnight Bali time (start of today)
    const midnightBaliTime = new Date(baliNow.getTime() - msSinceMidnightBali);
    
    // Add 24 hours to get midnight tomorrow (end of today)
    const tomorrowMidnightBaliTime = new Date(midnightBaliTime.getTime() + 24 * 3600 * 1000);
    
    // Convert back to UTC
    const untilUTC = new Date(tomorrowMidnightBaliTime.getTime() - baliUtcOffset);
    until = untilUTC.toISOString();
  }

  console.log(`[${period}] Report period: ${label}`);
  console.log(`[${period}] Query since (UTC): ${since}`);
  if (until) console.log(`[${period}] Query until (UTC): ${until}`);
  console.log(`[${period}] Report sent at (Bali): ${now.toLocaleString("en-US", { timeZone: "Asia/Makassar" })}`);


  const baliDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Makassar" }));
  const dateStr = baliDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = baliDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" });

  // Build date filter — "alltime" means no filter (matches dashboard exactly)
  const isAllTime = period === "alltime";

  const buildTrafficQuery = (selectClause: string, head = false) => {
    const query = supabaseAdmin
      .from("traffic_events")
      .select(selectClause, head ? { count: "exact", head: true } : undefined)
      .neq("source", "admin")
      .neq("event_type", "dashboard_viewed");
    
    if (!isAllTime && period === "daily" && until) {
      return query.gte("created_at", since).lt("created_at", until);
    } else if (!isAllTime) {
      return query.gte("created_at", since);
    }
    return query;
  };

  // Fetch all data in parallel — same queries as /api/dashboard/summary
  const trafficQuery = buildTrafficQuery("source,campaign,page,event_type").limit(50000);

  const [leadsRes, trafficRowsRes, totalEventsRes, pageViewsRes, bookClicksRes, waClicksRes, ga4] = await Promise.all([
    isAllTime
      ? supabaseAdmin.from("leads").select("id, first_name, last_name, source, campaign, status, created_at").order("created_at", { ascending: false })
      : period === "daily" && until
        ? supabaseAdmin.from("leads").select("id, first_name, last_name, source, campaign, status, created_at").gte("created_at", since).lt("created_at", until).order("created_at", { ascending: false })
        : supabaseAdmin.from("leads").select("id, first_name, last_name, source, campaign, status, created_at").gte("created_at", since).order("created_at", { ascending: false }),
    trafficQuery,
    buildTrafficQuery("id", true),
    buildTrafficQuery("event_type", true).eq("event_type", "page_view"),
    buildTrafficQuery("event_type", true).eq("event_type", "cta_click"),
    buildTrafficQuery("metadata", true).eq("event_type", "booking_intent").filter("metadata->>link_url", "ilike", "%wa.me%"),
    getGa4ReportForPeriod(ga4StartDate(period)).catch(() => null),
  ]);

  const leads: LeadRow[] = leadsRes.data || [];
  const trafficRows: Array<{
    source: string | null;
    campaign: string | null;
    page: string | null;
    event_type: string | null;
  }> = (trafficRowsRes.data as unknown as Array<{ source: string | null; campaign: string | null; page: string | null; event_type: string | null }>) || [];
  const totalLeads = leads.length;
  const newLeads = leads.filter((l: LeadRow) => l.status === "new").length;
  const wonLeads = leads.filter((l: LeadRow) => l.status === "closed_won").length;
  const openSale = leads.filter((l: LeadRow) => l.status === "open_sale").length;
  const totalEvents = totalEventsRes.count || 0;
  const pageViews = pageViewsRes.count || 0;
  const bookClicks = bookClicksRes.count || 0;
  const waClicks = waClicksRes.count || 0;
  const conversionRate = pageViews > 0 ? ((bookClicks / pageViews) * 100).toFixed(1) : "—";

  // GA4 metrics — use as primary traffic source when Supabase data is sparse
  const ga4ActiveUsers = ga4?.activeUsers ?? 0;
  const ga4Sessions = ga4?.sessions ?? 0;
  const ga4EventCount = ga4?.eventCount ?? 0;
  const ga4AvgDuration = ga4?.avgSessionDuration ?? 0;
  const ga4NewUsers = ga4?.newUsers ?? 0;
  const hasGa4Traffic = ga4ActiveUsers > 0 && ga4EventCount > 0;
  const weeklySparseSupabaseTraffic =
    period === "weekly" && (pageViews <= 10 || totalEvents < ga4EventCount * 0.25);
  const useGa4Traffic = hasGa4Traffic && (totalEvents === 0 || weeklySparseSupabaseTraffic);

  // Traffic source breakdown — prefer Supabase; fall back to GA4 if Supabase is empty
  const srcMap: Record<string, number> = {};
  for (const row of trafficRows) {
    const key = row.source || "direct";
    srcMap[key] = (srcMap[key] || 0) + 1;
  }
  const supabaseSources = Object.entries(srcMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const ga4Sources: [string, number][] = (ga4?.sources || [])
    .map((s) => [`${s.source}${s.medium && s.medium !== "(none)" ? ` / ${s.medium}` : ""}`, s.activeUsers] as [string, number])
    .filter(([, n]) => n > 0)
    .slice(0, 8);
  const topSources = supabaseSources.length > 0 ? supabaseSources : ga4Sources;
  const sourcesFromGa4 = supabaseSources.length === 0 && ga4Sources.length > 0;

  // Top pages — prefer Supabase; fall back to GA4 if Supabase is empty
  const pageMap: Record<string, number> = {};
  for (const row of trafficRows) {
    const key = row.page || "/";
    pageMap[key] = (pageMap[key] || 0) + 1;
  }
  const supabasePages = Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const ga4Pages: [string, number][] = (ga4?.topPages || [])
    .map((p) => [p.path, p.views] as [string, number])
    .filter(([, n]) => n > 0)
    .slice(0, 8);
  const topPages = supabasePages.length > 0 ? supabasePages : ga4Pages;
  const pagesFromGa4 = supabasePages.length === 0 && ga4Pages.length > 0;

  const trafficSourceNote = useGa4Traffic
    ? `Supabase captured only ${fmt(pageViews)} page views / ${fmt(totalEvents)} total events for this period, so traffic KPIs below are shown via GA4 for accuracy.`
    : null;

  // Campaign breakdown — from traffic_events (same source as dashboard byCampaign)
  const campMap: Record<string, number> = {};
  for (const row of trafficRows) {
    if (!row.campaign) continue;
    campMap[row.campaign] = (campMap[row.campaign] || 0) + 1;
  }
  const topCampaigns = Object.entries(campMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Build HTML
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #f5f1eb; color: #1a1a1a; }
  .wrap { max-width: 640px; margin: 0 auto; background: #fff; }
  .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 32px; text-align: center; }
  .header-logo { color: #c5a572; font-size: 11px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 8px; }
  .header-title { color: #fff; font-size: 26px; font-weight: 700; margin-bottom: 4px; }
  .header-subtitle { color: #c5a572; font-size: 13px; letter-spacing: 0.1em; }
  .header-date { color: rgba(255,255,255,0.5); font-size: 11px; margin-top: 12px; }
  .section { padding: 28px 32px; }
  .section-title { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #8b7658; margin-bottom: 16px; border-bottom: 1px solid #f0ebe3; padding-bottom: 8px; }
  .kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .kpi { background: #f9f7f4; border-radius: 10px; padding: 18px 20px; border-left: 3px solid #c5a572; }
  .kpi-value { font-size: 32px; font-weight: 800; color: #1a1a1a; line-height: 1; }
  .kpi-label { font-size: 11px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }
  .kpi.highlight { border-left-color: #2ecc71; }
  .kpi.warning { border-left-color: #e67e22; }
  .table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .table th { text-align: left; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #8b7658; padding: 6px 8px; border-bottom: 1px solid #f0ebe3; }
  .table td { padding: 10px 8px; border-bottom: 1px solid #f9f7f4; color: #333; }
  .table tr:last-child td { border-bottom: none; }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
  .badge-gold { background: #f5ede0; color: #8b7658; }
  .badge-green { background: #e8f8f0; color: #27ae60; }
  .badge-blue { background: #e8f0fd; color: #1877F2; }
  .cta-section { background: #1a1a1a; padding: 28px 32px; text-align: center; }
  .cta-btn { display: inline-block; background: #c5a572; color: #1a1a1a; font-weight: 700; font-size: 13px; letter-spacing: 0.1em; text-decoration: none; padding: 14px 28px; border-radius: 6px; }
  .footer { padding: 20px 32px; text-align: center; font-size: 11px; color: #aaa; }
  .divider { height: 1px; background: #f0ebe3; margin: 0 32px; }
  .ga4-note { background: #f0f7ff; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #555; }
  .bar-row { margin-bottom: 10px; }
  .bar-label { display: flex; justify-content: space-between; font-size: 12px; color: #555; margin-bottom: 4px; }
  .bar-track { background: #f0ebe3; border-radius: 4px; height: 8px; }
  .bar-fill { background: #c5a572; height: 8px; border-radius: 4px; }
  @media (max-width: 600px) { .kpi-grid { grid-template-columns: 1fr; } .section { padding: 20px; } }
</style>
</head>
<body>
<div class="wrap">

  <!-- Header -->
  <div class="header">
    <div class="header-logo">TS Residence — Intelligence Report</div>
    <div class="header-title">${label} Performance Report</div>
    <div class="header-subtitle">Bali's Premier Serviced Apartments</div>
    <div class="header-date">${dateStr} · ${timeStr}</div>
  </div>

  <!-- KPIs — traffic from GA4 when Supabase data is unavailable, leads always from Supabase -->
  <div class="section">
    <div class="section-title">Key Performance Indicators${useGa4Traffic ? ' <span style="font-size:9px;font-weight:400;color:#888;text-transform:none;letter-spacing:0;">(traffic via GA4)</span>' : ''}</div>
    ${trafficSourceNote ? `<div class="ga4-note" style="margin-bottom:14px;">${trafficSourceNote}</div>` : ""}
    <div class="kpi-grid">
      ${useGa4Traffic ? `
      <div class="kpi">
        <div class="kpi-value">${fmt(ga4ActiveUsers)}</div>
        <div class="kpi-label">Active Users</div>
      </div>
      <div class="kpi">
        <div class="kpi-value">${fmt(ga4NewUsers)}</div>
        <div class="kpi-label">New Users</div>
      </div>
      <div class="kpi">
        <div class="kpi-value">${fmt(ga4Sessions)}</div>
        <div class="kpi-label">Sessions</div>
      </div>
      <div class="kpi">
        <div class="kpi-value">${fmtDuration(ga4AvgDuration)}</div>
        <div class="kpi-label">Avg Session</div>
      </div>
      <div class="kpi">
        <div class="kpi-value">${fmt(ga4EventCount)}</div>
        <div class="kpi-label">Total Events</div>
      </div>
      ` : `
      <div class="kpi">
        <div class="kpi-value">${fmt(pageViews)}</div>
        <div class="kpi-label">Page Views</div>
      </div>
      <div class="kpi">
        <div class="kpi-value">${fmt(bookClicks)}</div>
        <div class="kpi-label">Book / CTA Clicks</div>
      </div>
      <div class="kpi">
        <div class="kpi-value">${fmt(totalEvents)}</div>
        <div class="kpi-label">Total Events</div>
      </div>
      <div class="kpi" style="border-left-color:#25D366;">
        <div class="kpi-value">${fmt(waClicks)}</div>
        <div class="kpi-label">WhatsApp Clicks</div>
      </div>
      <div class="kpi">
        <div class="kpi-value">${conversionRate}${conversionRate !== "—" ? "%" : ""}</div>
        <div class="kpi-label">Conversion Rate</div>
      </div>
      `}
      <div class="kpi highlight">
        <div class="kpi-value">${fmt(totalLeads)}</div>
        <div class="kpi-label">Total Leads</div>
      </div>
      <div class="kpi highlight">
        <div class="kpi-value">${fmt(wonLeads)}</div>
        <div class="kpi-label">Closed Won</div>
      </div>
      <div class="kpi">
        <div class="kpi-value">${fmt(newLeads)}</div>
        <div class="kpi-label">New Leads</div>
      </div>
      <div class="kpi warning">
        <div class="kpi-value">${fmt(openSale)}</div>
        <div class="kpi-label">Open Sale</div>
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <!-- Lead Pipeline -->
  <div class="section">
    <div class="section-title">Lead Pipeline</div>
    <table class="table">
      <thead><tr>
        <th>Status</th><th>Count</th><th>% of Total</th>
      </tr></thead>
      <tbody>
        <tr><td><span class="badge badge-blue">New</span></td><td>${fmt(newLeads)}</td><td>${totalLeads > 0 ? ((newLeads/totalLeads)*100).toFixed(0) : 0}%</td></tr>
        <tr><td><span class="badge badge-gold">Open Sale</span></td><td>${fmt(openSale)}</td><td>${totalLeads > 0 ? ((openSale/totalLeads)*100).toFixed(0) : 0}%</td></tr>
        <tr><td><span class="badge badge-green">Closed Won</span></td><td>${fmt(wonLeads)}</td><td>${totalLeads > 0 ? ((wonLeads/totalLeads)*100).toFixed(0) : 0}%</td></tr>
      </tbody>
    </table>
  </div>

  <div class="divider"></div>

  <!-- Traffic Sources — from traffic_events (same as dashboard) -->
  ${topSources.length ? `
  <div class="section">
    <div class="section-title">Traffic Sources${sourcesFromGa4 ? ' <span style="font-size:9px;font-weight:400;color:#888;text-transform:none;letter-spacing:0;">(via GA4)</span>' : ''}</div>
    ${topSources.map(([src, count]) => {
      const maxCount = topSources[0][1] || 1;
      const pct = Math.round((count / maxCount) * 100);
      const srcName = sourcesFromGa4 ? src : (src === "direct" ? "Direct" : src.charAt(0).toUpperCase() + src.slice(1));
      const barColor = sourcesFromGa4 ? "#4285F4" : sourceBadgeColor(src);
      return `<div class="bar-row">
        <div class="bar-label">
          <span>${srcName}</span>
          <span><strong>${fmt(count)}</strong> events</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%; background:${barColor};"></div></div>
      </div>`;
    }).join("")}
  </div>
  <div class="divider"></div>
  ` : ""}

  <!-- Campaign Performance — from traffic_events -->
  ${topCampaigns.length ? `
  <div class="section">
    <div class="section-title">Campaign Performance</div>
    <table class="table">
      <thead><tr><th>Campaign</th><th>Events</th></tr></thead>
      <tbody>
        ${topCampaigns.map(([camp, count]) => `
        <tr><td>${camp}</td><td>${fmt(count)}</td></tr>
        `).join("")}
      </tbody>
    </table>
  </div>
  <div class="divider"></div>
  ` : ""}

  <!-- Top Pages — from traffic_events or GA4 -->
  ${topPages.length ? `
  <div class="section">
    <div class="section-title">Top Pages${pagesFromGa4 ? ' <span style="font-size:9px;font-weight:400;color:#888;text-transform:none;letter-spacing:0;">(via GA4)</span>' : ''}</div>
    <table class="table">
      <thead><tr><th>Page</th><th>Views</th></tr></thead>
      <tbody>
        ${topPages.map(([page, count]) => `
        <tr><td>${page}</td><td>${fmt(count)}</td></tr>
        `).join("")}
      </tbody>
    </table>
  </div>
  <div class="divider"></div>
  ` : ""}

  <!-- Recent Leads -->
  ${leads.length ? `
  <div class="section">
    <div class="section-title">Recent Leads (${Math.min(leads.length, 8)} shown)</div>
    <table class="table">
      <thead><tr><th>Name</th><th>Source</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>
        ${leads.slice(0, 8).map((l: LeadRow) => `
        <tr>
          <td>${l.first_name || ""} ${l.last_name || ""}</td>
          <td>${l.source || "—"}</td>
          <td><span class="badge badge-gold">${l.status}</span></td>
          <td style="font-size:11px;color:#aaa;">${new Date(l.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</td>
        </tr>
        `).join("")}
      </tbody>
    </table>
  </div>
  <div class="divider"></div>
  ` : ""}

  <!-- CTA -->
  <div class="cta-section">
    <p style="color:#c5a572;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:16px;">View Full Dashboard</p>
    <a href="https://www.tsresidence.id/admin" class="cta-btn">Open Admin Dashboard →</a>
  </div>

  <div class="footer">
    <p>TS Residence Intelligence · Auto-generated ${dateStr}</p>
    <p style="margin-top:4px;">Jl. Nakula No.18, Legian, Seminyak, Bali</p>
  </div>
</div>
</body>
</html>`;

  const subject = `📊 TS Residence ${label} Report — ${baliDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;


  const result = await resend.emails.send({
    from: reportFromAddress(),
    to: recipients,
    subject,
    html,
  });

  if (result.error) {
    console.error(`[${period}] Resend error:`, {
      code: (result.error as any)?.code || "unknown",
      message: (result.error as any)?.message || String(result.error),
      details: result.error,
      from: reportFromAddress(),
      recipients,
      htmlLength: html.length,
      subjectLength: subject.length,
    });
  } else {
    console.log(`[${period}] Email sent successfully:`, result.data?.id);
  }
  return {
    ok: !result.error,
    error: result.error,
    subject,
    from: reportFromAddress(),
    recipients,
  };
}
