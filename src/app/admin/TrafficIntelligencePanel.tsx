"use client";

import { useEffect, useState } from "react";

type ContextSummaryRow = {
  key: string;
  events: number;
  leads: number;
  won: number;
  visitToSaleRate: number;
  leadToSaleRate: number;
};

type ContextSummary = {
  periodDays: number;
  hideUnknown?: boolean;
  generatedAt: string;
  totals: {
    pageViews: number;
    leads: number;
    closedWon: number;
  };
  byCountry: ContextSummaryRow[];
  byDevice: ContextSummaryRow[];
};

function RowTable({
  title,
  subtitle,
  rows,
  metricLabel,
}: {
  title: string;
  subtitle: string;
  rows: ContextSummaryRow[];
  metricLabel: "visit" | "lead";
}) {
  return (
    <div className="rounded-lg bg-[#222] p-6">
      <h3 className="text-gold mb-1 text-lg font-semibold">{title}</h3>
      <p className="mb-4 text-xs text-white/50">{subtitle}</p>
      <div className="space-y-2">
        {rows.length === 0 ? (
          <p className="text-sm text-white/60">No data for selected filter.</p>
        ) : (
          rows.slice(0, 12).map((item) => (
            <div key={item.key} className="border-b border-white/10 pb-2">
              <div className="flex items-center justify-between">
                <span className="text-white/90 capitalize">{item.key}</span>
                <span className="font-bold text-white">{item.events.toLocaleString()} views</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-white/60">
                <span>
                  Leads: {item.leads.toLocaleString()} · Won: {item.won.toLocaleString()}
                </span>
                <span>
                  {metricLabel === "visit"
                    ? `Visit→Sale: ${item.visitToSaleRate.toFixed(2)}%`
                    : `Lead→Sale: ${item.leadToSaleRate.toFixed(1)}%`}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function TrafficIntelligencePanel() {
  const [days, setDays] = useState<number>(28);
  const [hideUnknown, setHideUnknown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ContextSummary | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/admin/traffic/context-summary?days=${days}&hideUnknown=${hideUnknown ? "1" : "0"}`,
          { credentials: "same-origin" },
        );

        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(payload?.error || "Unable to load traffic intelligence");
        }

        const payload = (await res.json()) as ContextSummary;
        if (!cancelled) {
          setData(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [days, hideUnknown]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-[#222] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-gold text-lg font-semibold">Traffic Intelligence</h3>
            <p className="mt-1 text-sm text-white/60">
              Server-trusted geo/device conversion and lead quality view.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              className="rounded border border-white/15 bg-[#181818] px-3 py-2 text-sm text-white"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={28}>Last 28 days</option>
              <option value={90}>Last 90 days</option>
            </select>

            <label className="flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={hideUnknown}
                onChange={(e) => setHideUnknown(e.target.checked)}
              />
              Hide Unknown
            </label>
          </div>
        </div>

        {data ? (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded bg-[#181818] p-4">
              <p className="text-xs text-white/50">Page Views</p>
              <p className="mt-1 text-2xl font-bold text-white">{data.totals.pageViews.toLocaleString()}</p>
            </div>
            <div className="rounded bg-[#181818] p-4">
              <p className="text-xs text-white/50">Leads</p>
              <p className="mt-1 text-2xl font-bold text-white">{data.totals.leads.toLocaleString()}</p>
            </div>
            <div className="rounded bg-[#181818] p-4">
              <p className="text-xs text-white/50">Closed Won</p>
              <p className="mt-1 text-2xl font-bold text-white">{data.totals.closedWon.toLocaleString()}</p>
            </div>
          </div>
        ) : null}
      </div>

      {loading ? <div className="text-white/70">Loading traffic intelligence...</div> : null}
      {error ? <div className="rounded border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div> : null}

      {data ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <RowTable
            title={`Top Countries (${data.periodDays} days)`}
            subtitle="Server geo headers from request edge."
            rows={data.byCountry}
            metricLabel="visit"
          />
          <RowTable
            title={`Device Breakdown (${data.periodDays} days)`}
            subtitle="Derived from trusted user-agent parsing on the backend."
            rows={data.byDevice}
            metricLabel="lead"
          />
        </div>
      ) : null}
    </div>
  );
}
