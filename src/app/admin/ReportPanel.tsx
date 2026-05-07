"use client";

import { useState } from "react";

type Period = "daily" | "weekly" | "mtd" | "alltime";

const PERIODS: { value: Period; label: string; desc: string }[] = [
  { value: "daily", label: "Yesterday", desc: "Last 24 hours" },
  { value: "weekly", label: "Last 7 Days", desc: "Rolling 7-day window" },
  { value: "mtd", label: "Month to Date", desc: "Since 1st of this month" },
  { value: "alltime", label: "All Time", desc: "Last 90 days rolling" },
];

interface ReportData {
  period: string;
  generatedAt: string;
  supabase: {
    totalLeads: number;
    newLeads: number;
    wonLeads: number;
    openSale: number;
    waClicks: number;
    bookingIntents: number;
    totalEvents: number;
    leadsBySource: Record<string, number>;
    campaignPerformance: { name: string; leads: number; events: number }[];
    recentLeads: { first_name: string; last_name: string; source: string; campaign?: string; status: string; created_at: string }[];
  };
  ga4: {
    activeUsers: number;
    newUsers: number;
    sessions: number;
    avgSessionDuration: number;
    eventCount: number;
    sources: { source: string; medium: string; campaign: string; activeUsers: number }[];
    topPages: { path: string; title: string; views: number }[];
  } | null;
}

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function fmtDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#1a1a1a] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold/80">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{typeof value === "number" ? fmt(value) : value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  );
}

export default function ReportPanel() {
  const [period, setPeriod] = useState<Period>("alltime");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState("wellnessbrotherjay@gmail.com");

  const loadPreview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reports/data?period=${period}`, { credentials: "same-origin" });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || "Failed to load report data");
      }
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (toOverride?: string[]) => {
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/admin/reports/send", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period, to: toOverride }),
      });
      const payload = await res.json();
      if (res.ok) {
        const dest = toOverride ? toOverride.join(", ") : "all 3 recipients";
        setSendResult({ ok: true, msg: `Sent to ${dest} ✓` });
      } else {
        setSendResult({ ok: false, msg: payload.error || "Send failed" });
      }
    } catch {
      setSendResult({ ok: false, msg: "Network error sending report" });
    } finally {
      setSending(false);
    }
  };

  const handleDownloadPdf = () => {
    // Open print-optimised report page in new tab — user saves as PDF
    window.open(`/admin/report-print?period=${period}`, "_blank");
  };

  const periodLabel = PERIODS.find((p) => p.value === period)?.label || period;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Controls */}
      <div className="rounded-xl border border-white/5 bg-[#222] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-gold text-lg font-semibold">Reports & Analytics</h3>
            <p className="mt-1 text-sm text-white/55">
              Email the full performance report to the team or download as PDF. Auto-sent daily at 6pm Bali + every Friday.
            </p>
            <p className="mt-2 text-xs text-white/35">
              Recipients: randolphbubu4@gmail.com · wellnessbrotherjay@gmail.com · tsresidence@townsquare.co.id
            </p>
          </div>

          {/* Period selector */}
          <div className="flex flex-wrap gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => { setPeriod(p.value); setData(null); setSendResult(null); }}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                  period === p.value
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-white/10 text-white/60 hover:border-gold/30 hover:text-white"
                }`}
                title={p.desc}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {/* Test email row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/40 font-medium uppercase tracking-widest">Test email:</span>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-gold/40 focus:outline-none"
              placeholder="your@email.com"
            />
            <button
              type="button"
              onClick={() => handleSend([testEmail])}
              disabled={sending || !testEmail}
              className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/15 disabled:opacity-50"
            >
              {sending ? "Sending…" : "📧 Send to Just Me"}
            </button>
          </div>

          {/* Main action row */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadPreview}
              disabled={loading}
              className="rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-gold/40 hover:text-white disabled:opacity-50"
            >
              {loading ? "Loading…" : `Preview ${periodLabel} Report`}
            </button>
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={sending}
              className="rounded-lg bg-gold px-6 py-3 text-sm font-bold text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {sending ? "Sending…" : `📨 Send to All (3 recipients)`}
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="rounded-lg border border-gold/30 bg-gold/5 px-5 py-3 text-sm font-semibold text-gold transition hover:bg-gold/10"
            >
              ⬇ Download PDF
            </button>
          </div>
        </div>

        {sendResult && (
          <div className={`mt-4 rounded-lg border px-4 py-3 text-sm ${sendResult.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-red-500/30 bg-red-500/10 text-red-300"}`}>
            {sendResult.msg}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Auto-schedule info */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Daily Report</p>
          <p className="mt-2 text-white/80 text-sm">Sent every day at <strong className="text-white">6:00 PM Bali time</strong></p>
          <p className="mt-1 text-xs text-white/40">Covers yesterday&apos;s traffic, leads, WhatsApp clicks &amp; campaign performance</p>
        </div>
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Weekly Report</p>
          <p className="mt-2 text-white/80 text-sm">Sent every <strong className="text-white">Friday at 6:00 PM Bali time</strong></p>
          <p className="mt-1 text-xs text-white/40">Full 7-day summary with source attribution, campaign ROI &amp; lead pipeline</p>
        </div>
      </div>

      {/* Live Preview */}
      {data && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gold font-semibold">Live Preview — {periodLabel}</h3>
            <span className="text-xs text-white/30">Generated {new Date(data.generatedAt).toLocaleTimeString()}</span>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard label="Active Users" value={data.ga4?.activeUsers ?? 0} sub="GA4" />
            <StatCard label="Sessions" value={data.ga4?.sessions ?? 0} sub="GA4" />
            <StatCard label="Total Leads" value={data.supabase.totalLeads} sub="Supabase" />
            <StatCard label="Closed Won" value={data.supabase.wonLeads} sub="Supabase" />
            <StatCard label="WhatsApp Clicks" value={data.supabase.waClicks} sub="Supabase" />
            <StatCard label="Booking Intents" value={data.supabase.bookingIntents} sub="Supabase" />
            <StatCard label="New Leads" value={data.supabase.newLeads} sub="Supabase" />
            <StatCard
              label="Avg. Session"
              value={data.ga4 ? fmtDuration(data.ga4.avgSessionDuration) : "—"}
              sub="GA4"
            />
          </div>

          {/* Traffic Sources */}
          {data.ga4?.sources.length ? (
            <div className="rounded-xl border border-white/5 bg-[#222] p-6">
              <h4 className="text-gold font-semibold mb-4">Traffic Sources (GA4)</h4>
              <div className="space-y-3">
                {data.ga4.sources.map((s, i) => {
                  const max = data.ga4!.sources[0]?.activeUsers || 1;
                  const pct = Math.round((s.activeUsers / max) * 100);
                  const src = s.source === "(direct)" ? "Direct" : s.source.charAt(0).toUpperCase() + s.source.slice(1);
                  return (
                    <div key={`${s.source}-${s.medium}-${i}`}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">{src} / {s.medium}{s.campaign !== "(not set)" ? ` — ${s.campaign.length > 22 ? s.campaign.slice(0,22)+"…" : s.campaign}` : ""}</span>
                        <span className="font-bold text-white">{fmt(s.activeUsers)}</span>
                      </div>
                      <div className="h-2 rounded bg-white/5">
                        <div className="h-2 rounded bg-gold/70" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Campaign Performance */}
          {data.supabase.campaignPerformance.length ? (
            <div className="rounded-xl border border-white/5 bg-[#222] p-6">
              <h4 className="text-gold font-semibold mb-4">Campaign Performance</h4>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-gold/70">
                    <th className="pb-3 pr-4 text-left font-medium">Campaign</th>
                    <th className="pb-3 pr-4 text-right font-medium">Leads</th>
                    <th className="pb-3 text-right font-medium">Events</th>
                  </tr>
                </thead>
                <tbody>
                  {data.supabase.campaignPerformance.map((c, i) => (
                    <tr key={`${c.name}-${i}`} className="border-b border-white/5">
                      <td className="py-3 pr-4 text-white/80">{c.name}</td>
                      <td className="py-3 pr-4 text-right font-bold text-white">{fmt(c.leads)}</td>
                      <td className="py-3 text-right text-white/50">{fmt(c.events)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {/* Top Pages */}
          {data.ga4?.topPages.length ? (
            <div className="rounded-xl border border-white/5 bg-[#222] p-6">
              <h4 className="text-gold font-semibold mb-4">Top Pages (GA4)</h4>
              <div className="space-y-2">
                {data.ga4.topPages.map((p, i) => (
                  <div key={`${p.path}-${i}`} className="flex justify-between border-b border-white/5 pb-2 text-sm">
                    <div>
                      <div className="text-white/85">{p.title}</div>
                      <div className="text-xs text-white/35">{p.path}</div>
                    </div>
                    <span className="font-bold text-white">{fmt(p.views)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Recent Leads */}
          {data.supabase.recentLeads.length ? (
            <div className="rounded-xl border border-white/5 bg-[#222] p-6">
              <h4 className="text-gold font-semibold mb-4">Recent Leads</h4>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-gold/70">
                    <th className="pb-3 pr-4 text-left font-medium">Name</th>
                    <th className="pb-3 pr-4 text-left font-medium">Source</th>
                    <th className="pb-3 pr-4 text-left font-medium">Status</th>
                    <th className="pb-3 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.supabase.recentLeads.map((l, i) => (
                    <tr key={i} className="border-b border-white/5 text-white/80">
                      <td className="py-3 pr-4">{l.first_name} {l.last_name}</td>
                      <td className="py-3 pr-4 text-white/55">{l.source || "—"}</td>
                      <td className="py-3 pr-4">
                        <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 text-xs font-semibold text-gold">{l.status}</span>
                      </td>
                      <td className="py-3 text-xs text-white/35">{new Date(l.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
