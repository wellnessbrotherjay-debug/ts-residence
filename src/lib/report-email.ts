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
  const now = new Date();
  if (period === "daily") {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    return d.toISOString();
  }
  if (period === "weekly") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d.toISOString();
  }
  if (period === "mtd") {
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  }
  // alltime → 90 days
  const d = new Date(now);
  d.setDate(d.getDate() - 89);
  return d.toISOString();
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

export async function buildAndSendReport(period: ReportPeriod, to?: string[]) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const recipients = to || REPORT_RECIPIENTS;
  const since = supabaseSince(period);
  const label = periodLabel(period);
  const now = new Date();

  const baliDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Makassar" }));
  const dateStr = baliDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = baliDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" });

  // Build date filter — "alltime" means no filter (matches dashboard exactly)
  const isAllTime = period === "alltime";

  const buildTrafficQuery = (selectClause: string, head = false) => {
    return supabaseAdmin
      .from("traffic_events")
      .select(selectClause, head ? { count: "exact", head: true } : undefined)
      .neq("source", "admin")
      .neq("event_type", "dashboard_viewed");
  };

  // Fetch all data in parallel — same queries as /api/dashboard/summary
  const trafficQuery = isAllTime
    ? buildTrafficQuery("source,campaign,page,event_type").limit(50000)
    : buildTrafficQuery("source,campaign,page,event_type").gte("created_at", since).limit(50000);

  const [leadsRes, trafficRowsRes, totalEventsRes, pageViewsRes, bookClicksRes, ga4] = await Promise.all([
    isAllTime
      ? supabaseAdmin.from("leads").select("id, first_name, last_name, source, campaign, status, created_at").order("created_at", { ascending: false })
      : supabaseAdmin.from("leads").select("id, first_name, last_name, source, campaign, status, created_at").gte("created_at", since).order("created_at", { ascending: false }),
    trafficQuery,
    isAllTime
      ? buildTrafficQuery("id", true)
      : buildTrafficQuery("id", true).gte("created_at", since),
    isAllTime
      ? buildTrafficQuery("id", true).eq("event_type", "page_view")
      : buildTrafficQuery("id", true).eq("event_type", "page_view").gte("created_at", since),
    isAllTime
      ? buildTrafficQuery("id", true).eq("event_type", "cta_click")
      : buildTrafficQuery("id", true).eq("event_type", "cta_click").gte("created_at", since),
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
  const conversionRate = pageViews > 0 ? ((bookClicks / pageViews) * 100).toFixed(1) : "—";

  // Traffic source breakdown — same as dashboard (from traffic_events, not leads)
  const srcMap: Record<string, number> = {};
  for (const row of trafficRows) {
    const key = row.source || "direct";
    srcMap[key] = (srcMap[key] || 0) + 1;
  }
  const topSources = Object.entries(srcMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Top pages — same as dashboard
  const pageMap: Record<string, number> = {};
  for (const row of trafficRows) {
    const key = row.page || "/";
    pageMap[key] = (pageMap[key] || 0) + 1;
  }
  const topPages = Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

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

  <!-- KPIs — same metrics as admin dashboard -->
  <div class="section">
    <div class="section-title">Key Performance Indicators</div>
    <div class="kpi-grid">
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
      <div class="kpi">
        <div class="kpi-value">${conversionRate}${conversionRate !== "—" ? "%" : ""}</div>
        <div class="kpi-label">Conversion Rate</div>
      </div>
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
    <div class="section-title">Traffic Sources</div>
    ${topSources.map(([src, count]) => {
      const maxCount = topSources[0][1] || 1;
      const pct = Math.round((count / maxCount) * 100);
      const srcName = src === "direct" ? "Direct" : src.charAt(0).toUpperCase() + src.slice(1);
      return `<div class="bar-row">
        <div class="bar-label">
          <span>${srcName}</span>
          <span><strong>${fmt(count)}</strong> events</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%; background:${sourceBadgeColor(src)};"></div></div>
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

  <!-- Top Pages — from traffic_events (same as dashboard) -->
  ${topPages.length ? `
  <div class="section">
    <div class="section-title">Top Pages</div>
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
    from: "TS Residence Reports <noreply@tsresidence.id>",
    to: recipients,
    subject,
    html,
  });

  return { ok: !result.error, error: result.error, subject };
}
