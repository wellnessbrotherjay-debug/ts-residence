"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";

interface MarketingTrend {
  date: string;
  activeUsers: number;
  newUsers: number;
  eventCount: number;
}

interface MarketingResponse {
  totals: {
    activeUsers: number;
    newUsers: number;
    averageSessionDuration: number;
    eventCount: number;
  };
  trends: MarketingTrend[];
  topPages: { path: string; title: string; views: number }[];
  sources: {
    source: string;
    medium: string;
    campaign: string;
    activeUsers: number;
  }[];
}

interface IntegrationStatusItem {
  connected: boolean;
  label: string;
  url: string;
}

interface MarketingIntegrations {
  ga4: IntegrationStatusItem;
  meta: IntegrationStatusItem;
}

type ChannelBucket = "all" | "paid-social" | "organic-search" | "direct" | "referral" | "other";
type MarketingChannel = Exclude<ChannelBucket, "all">;

type DecoratedSource = MarketingResponse["sources"][number] & {
  channel: MarketingChannel;
  channelLabel: string;
  sourceLabel: string;
  mediumLabel: string;
};

function titleCase(value: string) {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getSourceLabel(source: string) {
  const normalized = source.trim().toLowerCase();

  if (normalized === "ig") return "Instagram";
  if (normalized === "fb") return "Facebook";
  if (normalized === "google") return "Google";
  if (normalized === "(direct)") return "Direct";
  if (normalized === "(not set)") return "Unassigned";

  return titleCase(source);
}

function getMediumLabel(medium: string) {
  const normalized = medium.trim().toLowerCase();

  if (normalized === "(none)") return "None";
  if (normalized === "(not set)") return "Unassigned";

  return titleCase(medium);
}

function classifyChannel(source: string, medium: string): DecoratedSource["channel"] {
  const normalizedSource = source.trim().toLowerCase();
  const normalizedMedium = medium.trim().toLowerCase();

  if (["paid", "paid_social", "paidsocial", "cpc", "ppc"].includes(normalizedMedium)) {
    return "paid-social";
  }

  if (normalizedMedium === "organic" || normalizedSource === "google") {
    return "organic-search";
  }

  if (normalizedSource === "(direct)" || normalizedMedium === "(none)") {
    return "direct";
  }

  if (["referral", "social", "email"].includes(normalizedMedium)) {
    return "referral";
  }

  return "other";
}

function getChannelLabel(channel: MarketingChannel) {
  if (channel === "paid-social") return "Paid Social";
  if (channel === "organic-search") return "Organic Search";
  if (channel === "direct") return "Direct";
  if (channel === "referral") return "Referral";
  return "Other";
}

function getCampaignUrl(
  campaign: string,
  channel: MarketingChannel,
  source: string,
): string | null {
  const normalized = campaign.trim().toLowerCase();
  if (
    !campaign ||
    normalized === "(not set)" ||
    normalized === "(organic)" ||
    normalized === "(referral)" ||
    normalized === "(direct)"
  ) {
    return null;
  }

  // Meta campaign IDs are purely numeric and 10–20 digits long
  if (/^\d{10,20}$/.test(campaign.trim())) {
    if (
      channel === "paid-social" ||
      source === "Instagram" ||
      source === "Facebook"
    ) {
      return `https://business.facebook.com/adsmanager/manage/campaigns?selected_campaign_ids=${campaign.trim()}`;
    }
  }

  // Google Ads — link to campaigns list (no account ID needed for the overview)
  if (source === "Google" && channel === "paid-social") {
    return "https://ads.google.com/aw/campaigns";
  }

  return null;
}

export default function MarketingDashboard() {
  const [data, setData] = useState<MarketingResponse | null>(null);
  const [integrations, setIntegrations] = useState<MarketingIntegrations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channelFilter, setChannelFilter] = useState<ChannelBucket>("all");
  const [mediumFilter, setMediumFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, integrationsRes] = await Promise.all([
          fetch("/api/marketing/summary"),
          fetch("/api/marketing/integrations"),
        ]);

        if (summaryRes.ok) {
          setData((await summaryRes.json()) as MarketingResponse);
        } else {
          const payload = await summaryRes.json().catch(() => null);
          setError(payload?.error || "Unable to load GA4 marketing data.");
        }

        if (integrationsRes.ok) {
          setIntegrations((await integrationsRes.json()) as MarketingIntegrations);
        }
      } catch (err) {
        setError("Unable to load GA4 marketing data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-white p-10">Loading Marketing Data...</div>;

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-white">
        <h3 className="mb-2 text-lg font-semibold text-red-200">Marketing data unavailable</h3>
        <p className="text-sm text-white/80">{error}</p>
        <p className="mt-3 text-xs text-white/50">
          Configure `GA4_PROPERTY_ID` and Google service account credentials on the server to load real Google Analytics data.
        </p>
      </div>
    );
  }

  if (!data) {
    return <div className="text-white p-10">No marketing data available.</div>;
  }

  const decoratedSources: DecoratedSource[] = data.sources.map((item) => {
    const channel = classifyChannel(item.source, item.medium);

    return {
      ...item,
      channel,
      channelLabel: getChannelLabel(channel),
      sourceLabel: getSourceLabel(item.source),
      mediumLabel: getMediumLabel(item.medium),
    };
  });

  const mediumOptions = Array.from(
    new Set(decoratedSources.map((item) => item.mediumLabel)),
  ).sort((left, right) => left.localeCompare(right));

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredSources = decoratedSources.filter((item) => {
    if (channelFilter !== "all" && item.channel !== channelFilter) {
      return false;
    }

    if (mediumFilter !== "all" && item.mediumLabel !== mediumFilter) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const haystack = [
      item.sourceLabel,
      item.mediumLabel,
      item.campaign,
      item.channelLabel,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedSearch);
  });

  const channelSummary = ([
    "paid-social",
    "organic-search",
    "direct",
    "referral",
    "other",
  ] as MarketingChannel[]).map((channel) => {
    const items = decoratedSources.filter((item) => item.channel === channel);
    return {
      channel,
      label: getChannelLabel(channel),
      activeUsers: items.reduce((sum, item) => sum + item.activeUsers, 0),
      sources: items.length,
    };
  });

  const topFilteredSources = filteredSources.slice(0, 8);
  const filteredActiveUsers = filteredSources.reduce(
    (sum, item) => sum + item.activeUsers,
    0,
  );

  const ga4Integration = integrations?.ga4 || {
    connected: Boolean(data),
    label: data ? "Connected" : "Not Connected",
    url: "https://analytics.google.com/analytics/web/",
  };

  const metaIntegration = integrations?.meta || {
    connected: false,
    label: "Not Connected",
    url: "https://business.facebook.com/events_manager2",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <a
          href={ga4Integration.url}
          target="_blank"
          rel="noreferrer"
          className={`rounded-xl border p-5 transition ${
            ga4Integration.connected
              ? "border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/15"
              : "border-red-400/40 bg-red-500/10 hover:bg-red-500/15"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Google Analytics 4</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ga4Integration.connected ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/20 text-red-200"}`}>
              {ga4Integration.label}
            </span>
            <span className="text-sm font-semibold text-white/90">Open GA4</span>
          </div>
        </a>

        <a
          href={metaIntegration.url}
          target="_blank"
          rel="noreferrer"
          className={`rounded-xl border p-5 transition ${
            metaIntegration.connected
              ? "border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/15"
              : "border-red-400/40 bg-red-500/10 hover:bg-red-500/15"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Meta Ads / Pixel</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${metaIntegration.connected ? "bg-emerald-500/20 text-emerald-200" : "bg-red-500/20 text-red-200"}`}>
              {metaIntegration.label}
            </span>
            <span className="text-sm font-semibold text-white/90">Open Meta</span>
          </div>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#222] p-6 rounded-xl border border-white/5">
          <p className="text-gold text-xs font-bold uppercase tracking-wider">Active Users</p>
          <p className="text-2xl font-bold mt-2">{data.totals.activeUsers.toLocaleString()}</p>
        </div>
        <div className="bg-[#222] p-6 rounded-xl border border-white/5">
          <p className="text-gold text-xs font-bold uppercase tracking-wider">New Users</p>
          <p className="text-2xl font-bold mt-2">{data.totals.newUsers.toLocaleString()}</p>
        </div>
        <div className="bg-[#222] p-6 rounded-xl border border-white/5">
          <p className="text-gold text-xs font-bold uppercase tracking-wider">Avg. Session Duration</p>
          <p className="text-2xl font-bold mt-2">{Math.round(data.totals.averageSessionDuration)}s</p>
        </div>
        <div className="bg-[#222] p-6 rounded-xl border border-white/5">
          <p className="text-gold text-xs font-bold uppercase tracking-wider">Event Count</p>
          <p className="text-2xl font-bold mt-2">{data.totals.eventCount.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {channelSummary.map((item) => (
          <button
            key={item.channel}
            type="button"
            onClick={() => setChannelFilter(item.channel as ChannelBucket)}
            className={`rounded-xl border p-5 text-left transition ${
              channelFilter === item.channel
                ? "border-gold bg-gold/10"
                : "border-white/5 bg-[#222] hover:border-gold/40"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold/80">{item.label}</p>
            <p className="mt-3 text-2xl font-bold text-white">{item.activeUsers.toLocaleString()}</p>
            <p className="mt-1 text-xs text-white/55">{item.sources} source entries</p>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-white/5 bg-[#222] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-gold font-semibold">Traffic Source Explorer</h3>
            <p className="mt-2 text-sm text-white/60">
              Filter by channel, medium, or campaign to separate paid social, organic search, direct traffic, and referrals.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setChannelFilter("all");
              setMediumFilter("all");
              setSearchTerm("");
            }}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:border-gold/40 hover:text-white"
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Search</p>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search source, medium, or campaign"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/50"
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Channel</p>
            <select
              value={channelFilter}
              onChange={(event) => setChannelFilter(event.target.value as ChannelBucket)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-gold/50"
            >
              <option value="all">All Channels</option>
              {channelSummary.map((item) => (
                <option key={item.channel} value={item.channel}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Medium</p>
            <select
              value={mediumFilter}
              onChange={(event) => setMediumFilter(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-gold/50"
            >
              <option value="all">All Mediums</option>
              {mediumOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/65">
          <span className="rounded-full border border-white/10 px-3 py-1">Filtered Users: {filteredActiveUsers.toLocaleString()}</span>
          <span className="rounded-full border border-white/10 px-3 py-1">Rows: {filteredSources.length}</span>
          <span className="rounded-full border border-white/10 px-3 py-1">Showing live GA4 acquisition data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#222] p-6 rounded-xl border border-white/5">
          <h3 className="text-gold font-semibold mb-6">GA4 Traffic Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#181818", border: "1px solid #333", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Line yAxisId="left" type="monotone" dataKey="activeUsers" stroke="#c5a572" strokeWidth={3} dot={{ r: 3 }} name="Active Users" />
                <Line yAxisId="left" type="monotone" dataKey="newUsers" stroke="#8b7658" strokeWidth={2} dot={{ r: 3 }} name="New Users" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#222] p-6 rounded-xl border border-white/5">
          <h3 className="text-gold font-semibold mb-2">Top Sources</h3>
          <p className="mb-6 text-sm text-white/55">Top filtered traffic sources by active users.</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topFilteredSources.map((item) => ({
                  name: `${item.sourceLabel} / ${item.mediumLabel}`,
                  activeUsers: item.activeUsers,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#181818", border: "1px solid #333", borderRadius: "8px" }}
                />
                <Bar dataKey="activeUsers" radius={[4, 4, 0, 0]}>
                  {topFilteredSources.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#c5a572" : "#8b7658"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[#222] p-6 rounded-xl border border-white/5">
        <h3 className="text-gold font-semibold mb-6">Top Pages From GA4</h3>
        <div className="space-y-3">
          {data.topPages.map((page, index) => (
            <div key={`${page.path}-${page.title}-${index}`} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 text-sm">
              <div className="min-w-0">
                <div className="truncate text-white/90">{page.title}</div>
                <div className="truncate text-xs text-white/45">{page.path}</div>
              </div>
              <span className="shrink-0 font-bold text-white">{page.views.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#222] p-6 rounded-xl border border-white/5">
        <h3 className="text-gold font-semibold mb-6">Source Attribution From GA4</h3>
        {filteredSources.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-black/10 p-6 text-sm text-white/60">
            No GA4 traffic sources match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-gold/80">
                  <th className="pb-3 pr-4 font-medium">Channel</th>
                  <th className="pb-3 pr-4 font-medium">Source</th>
                  <th className="pb-3 pr-4 font-medium">Medium</th>
                  <th className="pb-3 pr-4 font-medium">Campaign</th>
                  <th className="pb-3 text-right font-medium">Active Users</th>
                </tr>
              </thead>
              <tbody>
                {filteredSources.map((item, index) => (
                  <tr
                    key={`${item.source}-${item.medium}-${item.campaign}-${index}`}
                    className="border-b border-white/8 text-white/85"
                  >
                    <td className="py-4 pr-4">
                      <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                        {item.channelLabel}
                      </span>
                    </td>
                    <td className="py-4 pr-4 font-semibold">{item.sourceLabel}</td>
                    <td className="py-4 pr-4 text-white/65">{item.mediumLabel}</td>
                    <td className="py-4 pr-4 text-white/65">
                      {(() => {
                        const url = getCampaignUrl(item.campaign, item.channel, item.sourceLabel);
                        return url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            title="Open campaign in Ads Manager"
                            className="inline-flex items-center gap-1.5 rounded border border-gold/20 bg-gold/5 px-2.5 py-1 text-xs font-medium text-gold/90 transition hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
                          >
                            {item.campaign.length > 18 ? `${item.campaign.slice(0, 6)}…${item.campaign.slice(-6)}` : item.campaign}
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </a>
                        ) : (
                          <span className="text-white/50">{item.campaign}</span>
                        );
                      })()}
                    </td>
                    <td className="py-4 text-right font-bold text-white">{item.activeUsers.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
