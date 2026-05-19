"use client";

import { useState, useEffect } from "react";
import { Loader2, ExternalLink } from "lucide-react";

interface LinkPerformance {
  id: string;
  created_at: string;
  campaign_name: string;
  note_title: string;
  utm_campaign: string;
  utm_source: string;
  utm_medium: string;
  generated_url: string;
  total_visits: number;
  cta_clicks: number;
  leads_generated: number;
  conversion_rate: string;
}

export default function GeneratedLinksPerformance({ brand = "ts-residence" }: { brand?: string }) {
  const [performance, setPerformance] = useState<LinkPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/admin/generated-links-performance?brand=${encodeURIComponent(brand)}`, {
          credentials: "same-origin",
        });

        if (!res.ok) {
          throw new Error(`Failed to load performance data: ${res.status}`);
        }

        const data = await res.json();
        setPerformance(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [brand]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-4 text-red-200">
        <p className="font-semibold">Error loading performance data</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  if (performance.length === 0) {
    return (
      <div className="rounded-lg border border-white/5 bg-black/20 p-8 text-center">
        <p className="text-white/50">No generated links yet. Create one in the UTM Builder above.</p>
      </div>
    );
  }

  const totalVisits = performance.reduce((sum, p) => sum + p.total_visits, 0);
  const totalClicks = performance.reduce((sum, p) => sum + p.cta_clicks, 0);
  const totalLeads = performance.reduce((sum, p) => sum + p.leads_generated, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/50">Total Visits</p>
          <p className="mt-2 text-3xl font-bold text-white">{totalVisits.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/50">CTA Clicks</p>
          <p className="mt-2 text-3xl font-bold text-gold">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/50">Leads Generated</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">{totalLeads.toLocaleString()}</p>
        </div>
      </div>

      {/* Performance Table */}
      <div className="overflow-x-auto rounded-lg border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-black/30">
              <th className="px-4 py-3 text-left font-semibold text-white/70">Campaign</th>
              <th className="px-4 py-3 text-center font-semibold text-white/70">Visits</th>
              <th className="px-4 py-3 text-center font-semibold text-white/70">CTA Clicks</th>
              <th className="px-4 py-3 text-center font-semibold text-white/70">Leads</th>
              <th className="px-4 py-3 text-center font-semibold text-white/70">Conv. Rate</th>
              <th className="px-4 py-3 text-right font-semibold text-white/70">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {performance.map((link) => (
              <tr key={link.id} className="hover:bg-black/20 transition">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold text-white">{link.campaign_name}</p>
                    <p className="mt-1 text-xs text-white/50">{link.note_title}</p>
                    <p className="mt-1 text-xs text-white/40">
                      {link.utm_source} • {link.utm_medium}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-white">
                  {link.total_visits.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center text-gold font-semibold">
                  {link.cta_clicks.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center text-emerald-400 font-semibold">
                  {link.leads_generated.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center text-white/70">
                  {link.conversion_rate}
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={link.generated_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-gold/10 px-2 py-1 text-xs font-semibold text-gold hover:bg-gold/20 transition"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
