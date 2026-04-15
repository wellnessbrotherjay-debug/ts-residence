"use client";

import { useState, useEffect } from "react";

interface DashboardLead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  stay_duration?: string;
  message?: string;
  source: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  referrer?: string;
  status: string;
  created_at: string;
  metadata?: any;
  country?: string;
}

interface TrafficEvent {
  id: number;
  event_type: string;
  page: string;
  source: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  referrer?: string;
  gclid?: string;
  fbclid?: string;
  country?: string;
  region?: string;
  city?: string;
  created_at: string;
  metadata?: any;
  element_type?: string;
  element_text?: string;
  link_url?: string;
}

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
  };
  bySource: { source: string; count: number }[];
  byCampaign: { campaign: string; count: number }[];
  byMedium: { medium: string; count: number }[];
  byPage: { page: string; views: number; unique_visitors: number; avg_time_on_page: number }[];
  byCountry: { country: string; count: number }[];
  byDevice: { device_type: string; count: number }[];
  topClicks: { element_text: string; link_url: string; count: number }[];
  recentEvents: TrafficEvent[];
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

// Helper to categorize traffic source
const categorizeSource = (source: string, medium?: string, gclid?: string, fbclid?: string) => {
  const s = source?.toLowerCase() || "";
  const m = medium?.toLowerCase() || "";

  if (gclid) return { category: "Google Ads", type: "paid", icon: "🔍" };
  if (fbclid) return { category: "Meta/Facebook", type: "paid", icon: "📘" };
  if (s.includes("google")) return { category: "Google", type: m.includes("organic") ? "organic" : "paid", icon: "🔍" };
  if (s.includes("facebook") || s.includes("meta")) return { category: "Meta/Facebook", type: m.includes("organic") ? "organic" : "paid", icon: "📘" };
  if (s.includes("instagram") || s.includes("ig")) return { category: "Instagram", type: m.includes("organic") ? "organic" : "paid", icon: "📸" };
  if (s.includes("tiktok") || s.includes("tt")) return { category: "TikTok", type: m.includes("organic") ? "organic" : "paid", icon: "🎵" };
  if (s.includes("linkedin")) return { category: "LinkedIn", type: m.includes("organic") ? "organic" : "paid", icon: "💼" };
  if (s.includes("twitter") || s.includes("x")) return { category: "Twitter/X", type: m.includes("organic") ? "organic" : "paid", icon: "🐦" };
  if (s.includes("email") || m.includes("email")) return { category: "Email", type: "owned", icon: "📧" };
  if (s.includes("referral")) return { category: "Referral", type: "referral", icon: "🔗" };
  if (s.includes("direct") || !s) return { category: "Direct", type: "direct", icon: "🎯" };

  return { category: s || "Other", type: m || "unknown", icon: "📊" };
};

// Helper functions for country display
const getCountryFlag = (countryCode: string): string => {
  const flags: Record<string, string> = {
    'US': '🇺🇸', 'GB': '🇬🇧', 'AU': '🇦🇺', 'CA': '🇨🇦',
    'ID': '🇮🇩', 'SG': '🇸🇬', 'MY': '🇲🇾', 'TH': '🇹🇭',
    'JP': '🇯🇵', 'KR': '🇰🇷', 'CN': '🇨🇳', 'IN': '🇮🇳',
    'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸',
    'NL': '🳳🇱', 'BE': '🇧🇪', 'AT': '🇦🇹', 'CH': '🇨🇭',
    'BR': '🇧🇷', 'MX': '🇲x️⃣', 'AR': '🇦🇷', 'ZA': '🇿🇦',
    'AE': '🇦🇪', 'SA': '🇸🇦', 'QA': '🇶🇦', 'KW': '🇰🇼',
    'RU': '🇷🇺', 'TR': '🇹🇷', 'IL': '🇮🇱', 'EG': '🇪🇬',
    'NZ': '🇳🇿', 'FJ': '🇫🇯', 'PH': '🇵🇭', 'VN': '🇻🇳',
    'HK': '🇭🇰', 'TW': '🇹🇼', 'MO': '🇲🇴', 'BD': '🇧🇩',
  };
  return flags[countryCode.toUpperCase()] || '🌐';
};

const getCountryName = (countryCode: string): string => {
  const names: Record<string, string> = {
    'US': 'United States', 'GB': 'United Kingdom', 'AU': 'Australia', 'CA': 'Canada',
    'ID': 'Indonesia', 'SG': 'Singapore', 'MY': 'Malaysia', 'TH': 'Thailand',
    'JP': 'Japan', 'KR': 'South Korea', 'CN': 'China', 'IN': 'India',
    'DE': 'Germany', 'FR': 'France', 'IT': 'Italy', 'ES': 'Spain',
    'NL': 'Netherlands', 'BE': 'Belgium', 'AT': 'Austria', 'CH': 'Switzerland',
    'BR': 'Brazil', 'MX': 'Mexico', 'AR': 'Argentina', 'ZA': 'South Africa',
    'AE': 'UAE', 'SA': 'Saudi Arabia', 'QA': 'Qatar', 'KW': 'Kuwait',
    'RU': 'Russia', 'TR': 'Turkey', 'IL': 'Israel', 'EG': 'Egypt',
    'NZ': 'New Zealand', 'FJ': 'Fiji', 'PH': 'Philippines', 'VN': 'Vietnam',
    'HK': 'Hong Kong', 'TW': 'Taiwan', 'MO': 'Macau', 'BD': 'Bangladesh',
  };
  return names[countryCode.toUpperCase()] || countryCode;
};

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
};

export default function AdminPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastLeadId, setLastLeadId] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedTab, setSelectedTab] = useState<string>("overview");

  const fetchDashboard = async (isInitial = false) => {
    try {
      const [summaryRes, leadsRes] = await Promise.all([
        fetch('/api/dashboard/summary'),
        fetch('/api/leads'),
      ]);
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        setSummary(data);
      }
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data);

        if (!isInitial && data.length > 0 && lastLeadId && data[0].id > lastLeadId) {
          triggerLeadAlert(data[0]);
        }
        if (data.length > 0) setLastLeadId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  const triggerLeadAlert = (lead: DashboardLead) => {
    try {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.play();
    } catch (e) {}

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("🎯 New Lead: " + lead.first_name, {
        body: `${lead.email} | Source: ${lead.source}${lead.campaign ? ` | Campaign: ${lead.campaign}` : ''}`,
        icon: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/cce3ff72-a0c2-4b10-826e-c47befe5db00/public"
      });
    }

    const originalTitle = document.title;
    let blink = true;
    const interval = setInterval(() => {
      document.title = blink ? "🚨 NEW LEAD!" : "TS Intelligence";
      blink = !blink;
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      document.title = originalTitle;
    }, 10000);
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    fetchDashboard(true);
    const interval = setInterval(fetchDashboard, 15000);
    return () => clearInterval(interval);
  }, [lastLeadId]);

  const updateLeadStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/leads/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchDashboard();
  };

  // Filter leads
  const filteredLeads = selectedFilter === "all"
    ? leads
    : leads.filter(l => l.status === selectedFilter);

  if (loading && !summary) return <div className="p-20 text-center text-white">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white/90">
      <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-serif tracking-tight mb-2">Analytics & CRM Intelligence</h1>
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-bold">Behavioral tracking, attribution, and conversion funnels</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={requestNotificationPermission}
              className="text-[10px] font-black bg-white/5 text-white/60 px-5 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-2 border border-white/10 transition-all uppercase tracking-widest"
            >
              <span className="w-1.5 h-1.5 bg-[#c5a572] rounded-full animate-pulse"></span>
              Enable Signals
            </button>
            <button onClick={() => fetchDashboard(false)} className="bg-[#c5a572] hover:bg-[#d4b882] text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(197,165,114,0.2)]">
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
          {['overview', 'behavior', 'clicks', 'funnels', 'traffic', 'crm'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedTab === tab
                  ? 'bg-[#c5a572] text-black'
                  : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {selectedTab === 'overview' && (
          <>
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-3">Total Events</p>
                <div className="text-3xl font-serif text-white">{summary?.totals.total_events ?? 0}</div>
              </div>
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-3">Page Views</p>
                <div className="text-3xl font-serif text-white">{summary?.totals.page_views ?? 0}</div>
              </div>
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-3">Unique Sessions</p>
                <div className="text-3xl font-serif text-white">{summary?.totals.unique_sessions ?? 0}</div>
              </div>
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-3">Total Leads</p>
                <div className="text-3xl font-serif text-[#25D366]">{summary?.totals.total_leads ?? 0}</div>
              </div>
            </div>

            {/* Conversion Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-3">Booking Clicks</p>
                <div className="text-2xl font-serif text-[#c5a572]">{summary?.totals.book_clicks ?? 0}</div>
              </div>
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-3">WhatsApp Clicks</p>
                <div className="text-2xl font-serif text-[#25D366]">{summary?.totals.whatsapp_clicks ?? 0}</div>
              </div>
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-3">Engaged Sessions</p>
                <div className="text-2xl font-serif text-blue-400">{summary?.totals.engaged_sessions ?? 0}</div>
              </div>
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-3">Converted</p>
                <div className="text-2xl font-serif text-green-400">{summary?.totals.converted_sessions ?? 0}</div>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 shadow-2xl relative mb-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live Activity Feed
              </h2>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 text-[11px] font-mono">
                {summary?.recentEvents.map((ev) => {
                  const cat = categorizeSource(ev.source, ev.medium, ev.gclid, ev.fbclid);
                  return (
                    <div key={ev.id} className="flex flex-wrap gap-x-3 gap-y-1 border-b border-white/5 pb-2 hover:bg-white/5 transition-colors items-start">
                      <span className="text-white/20 shrink-0">[{new Date(ev.created_at).toLocaleTimeString()}]</span>
                      <span className="shrink-0 text-lg">{cat.icon}</span>
                      <span className={`shrink-0 uppercase px-1.5 rounded text-[9px] font-bold ${
                        ev.event_type === 'booking_click' || ev.event_type === 'quiz_complete' || ev.event_type === 'form_submit'
                          ? 'bg-[#c5a572]/20 text-[#c5a572]'
                          : 'bg-white/5 text-white/40'
                      }`}>
                        {ev.event_type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-white/60 truncate max-w-[120px]">{ev.page}</span>
                      {ev.campaign && (
                        <span className="text-purple-400/80 text-[10px] truncate max-w-[80px]">📢 {ev.campaign}</span>
                      )}
                      {ev.medium && (
                        <span className="text-white/30 text-[10px]">{ev.medium}</span>
                      )}
                      {ev.country && (
                        <span className="text-blue-400/80 text-[10px]">{getCountryFlag(ev.country)} {ev.country}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* BEHAVIOR TAB */}
        {selectedTab === 'behavior' && (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-10">
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Avg Session Duration</p>
                <div className="text-2xl font-serif text-white">{formatDuration(summary?.behaviorMetrics.avg_session_duration || 0)}</div>
              </div>
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Pages / Session</p>
                <div className="text-2xl font-serif text-white">{summary?.behaviorMetrics.avg_pages_per_session || 0}</div>
              </div>
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Bounce Rate</p>
                <div className="text-2xl font-serif text-white">{summary?.behaviorMetrics.bounce_rate || 0}%</div>
              </div>
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Avg Time on Page</p>
                <div className="text-2xl font-serif text-white">{formatDuration(summary?.behaviorMetrics.avg_time_on_page || 0)}</div>
              </div>
            </div>

            {/* Page Performance */}
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 mb-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6">Page Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-white/30 text-[9px] font-black uppercase border-b border-white/10">
                      <th className="px-4 py-3">Page</th>
                      <th className="px-4 py-3">Views</th>
                      <th className="px-4 py-3">Avg Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {summary?.byPage.map((page, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="px-4 py-3 text-white/80 text-sm">{page.page}</td>
                        <td className="px-4 py-3 text-white font-bold">{page.views}</td>
                        <td className="px-4 py-3 text-white/60 text-xs">{formatDuration(page.avg_time_on_page)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* CLICKS TAB */}
        {selectedTab === 'clicks' && (
          <>
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 mb-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6">Top Clicked Elements</h3>
              <div className="space-y-3">
                {summary?.topClicks.map((click, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-white/5 hover:bg-white/5 px-4 rounded-lg">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="text-white/30 text-xs w-6">#{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-white/80 text-sm font-medium truncate">{click.element_text}</div>
                        {click.link_url && (
                          <div className="text-white/30 text-[10px] truncate">{click.link_url}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-[#c5a572] font-bold text-lg">{click.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6">Device Breakdown</h3>
              <div className="grid grid-cols-3 gap-4">
                {summary?.byDevice.map((device) => (
                  <div key={device.device_type} className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{device.count}</div>
                    <div className="text-[10px] uppercase text-white/40 mt-1">{device.device_type}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* FUNNELS TAB */}
        {selectedTab === 'funnels' && (
          <>
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 mb-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6">Conversion Funnels</h3>
              <div className="space-y-8">
                {summary?.funnelData.map((funnel) => (
                  <div key={funnel.name} className="border border-white/10 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-lg font-serif text-white capitalize">{funnel.name} Funnel</h4>
                      <div className="text-right">
                        <div className="text-[10px] text-white/40 uppercase">Conversion Rate</div>
                        <div className="text-2xl font-bold text-green-400">{funnel.conversion_rate}%</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {funnel.steps.map((step, idx) => {
                        const maxCount = funnel.steps[0]?.count || 1;
                        const width = (step.count / maxCount) * 100;
                        return (
                          <div key={idx} className="relative">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-white/80 text-sm">
                                <span className="text-white/40 mr-2">{step.step_number}.</span>
                                {step.step_name}
                              </span>
                              <span className="text-white font-bold">{step.count}</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#c5a572] to-[#d4b882] rounded-full transition-all duration-500"
                                style={{ width: `${width}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TRAFFIC TAB */}
        {selectedTab === 'traffic' && (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {/* Source Breakdown */}
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6">Traffic Sources</h3>
                <div className="space-y-3">
                  {summary?.bySource.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-white/80 text-sm capitalize">{item.source}</span>
                      <span className="text-white font-bold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaign Performance */}
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6">Campaign Performance</h3>
                <div className="space-y-3">
                  {summary?.byCampaign.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-white/80 text-sm truncate max-w-[150px]">{item.campaign}</span>
                      <span className="text-white font-bold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6 flex items-center gap-3">
                <span>🌍</span>
                Geographic Distribution
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {summary?.byCountry.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getCountryFlag(item.country)}</span>
                      <div>
                        <div className="text-white/80 text-sm font-medium">{getCountryName(item.country)}</div>
                        <div className="text-white/30 text-[10px]">{item.country}</div>
                      </div>
                    </div>
                    <div className="text-white font-bold">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* CRM TAB */}
        {selectedTab === 'crm' && (
          <>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 shadow-2xl h-full">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">CRM Pipeline</h2>
                <div className="flex gap-2">
                  {['all', 'new', 'contacted', 'qualified', 'closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedFilter(status)}
                      className={`text-[9px] uppercase px-3 py-1 rounded-lg transition-all ${
                        selectedFilter === status
                          ? 'bg-[#c5a572] text-black font-bold'
                          : 'bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['new', 'contacted', 'qualified', 'closed'].map((status) => {
                  const statusLeads = filteredLeads.filter(l => l.status === status);
                  return (
                    <div key={status} className="bg-[#111111] p-4 rounded-xl border border-white/5 min-h-[180px]">
                      <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] flex justify-between mb-4 border-b border-white/5 pb-2">
                        {status} <span>{statusLeads.length}</span>
                      </h3>
                      <div className="space-y-2 max-h-[100px] overflow-y-auto pr-1">
                        {statusLeads.map((lead) => {
                          const cat = categorizeSource(lead.source, lead.medium);
                          return (
                            <div key={lead.id} className="p-2.5 bg-black/40 rounded-lg border border-white/5 group relative hover:border-[#c5a572]/30 transition-all">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{cat.icon}</span>
                                <div className="text-[10px] font-bold text-white/80">{lead.first_name} {lead.last_name}</div>
                              </div>
                              <div className="text-[9px] text-white/40 truncate">{lead.email}</div>
                              {lead.campaign && (
                                <div className="text-[8px] text-purple-400/80 mt-1">📢 {lead.campaign}</div>
                              )}
                              {lead.country && (
                                <div className="text-[8px] text-blue-400/80">{getCountryFlag(lead.country)} {lead.country}</div>
                              )}

                              <select
                                value={lead.status}
                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              >
                                <option value="new">Move to NEW</option>
                                <option value="contacted">Move to CONTACTED</option>
                                <option value="qualified">Move to QUALIFIED</option>
                                <option value="closed">Move to CLOSED</option>
                              </select>
                            </div>
                          );
                        })}
                        {statusLeads.length === 0 && (
                          <p className="text-[9px] text-white/10 italic text-center mt-6">No leads</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
