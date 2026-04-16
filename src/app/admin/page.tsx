"use client";

import { useState, useEffect } from "react";

interface VisitorProfile {
  ip_address?: string;
  country?: string;
  city?: string;
  region?: string;
  sessions?: any[];
  leads?: any[];
  funnel?: any[];
  interest_flag?: string;

export default function AdminPage() {
  // ...existing code...
}
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
    failed_events: number;
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

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastLeadId, setLastLeadId] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [visitorProfile, setVisitorProfile] = useState<VisitorProfile | null>(null);
  // Helper: Calculate interest flag
  function getInterestFlag(sessions: any[] = [], leads: any[] = []) {
    const totalViews = sessions.reduce((acc, s) => acc + (s.pages_visited || 0), 0);
    const avgTime = sessions.length ? sessions.reduce((acc, s) => acc + (s.total_duration_seconds || 0), 0) / sessions.length : 0;
    const repeat = sessions.length > 1;
    if (leads.some(l => l.status === 'closed_won')) return 'Customer';
    if (repeat && avgTime > 60) return 'Hot';
    if (avgTime > 30) return 'Interested';
    if (totalViews > 2) return 'Browsing';
    return 'Cold';
  }
  // Fetch visitor profile by IP/country/city
  async function openVisitorListByCountry(country: string) {
    setModalTitle(`Visitors from ${getCountryName(country)}`);
    setModalContent(<div className="p-8 text-center text-white/60">Loading...</div>);
    setModalOpen(true);
    // Fetch sessions by country
    const res = await fetch(`/api/analytics/sessions?country=${country}`);
    const data = await res.json();
    setModalContent(
      <div className="max-h-[60vh] overflow-y-auto">
        <table className="w-full text-xs text-left">
          <thead><tr><th>IP</th><th>City</th><th>Sessions</th><th>Leads</th><th>Interest</th></tr></thead>
          <tbody>
            {data.sessions.map((s: any) => (
              <tr key={s.session_id} className="hover:bg-white/10 cursor-pointer" onClick={() => openVisitorProfile(s.ip_address)}>
                <td className="text-blue-300 underline">{s.ip_address}</td>
                <td>{s.city}</td>
                <td>{s.session_count}</td>
                <td>{s.lead_count}</td>
                <td>{getInterestFlag([s], s.leads)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  async function openVisitorProfile(ip: string) {
    setModalTitle(`Visitor Profile: ${ip}`);
    setModalContent(<div className="p-8 text-center text-white/60">Loading...</div>);
    setModalOpen(true);
    // Fetch sessions, leads, funnel by IP
    const res = await fetch(`/api/analytics/visitor-profile?ip=${ip}`);
    const data = await res.json();
    setVisitorProfile(data);
    setModalContent(
      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <span className="font-bold">IP:</span> <span>{data.ip_address}</span>
          <span className="font-bold">Country:</span> <span>{getCountryName(data.country)} {getCountryFlag(data.country)}</span>
          <span className="font-bold">City:</span> <span>{data.city}</span>
          <span className="font-bold">Interest:</span> <span className="px-2 py-1 rounded bg-blue-900/40">{getInterestFlag(data.sessions, data.leads)}</span>
        </div>
        <div>
          <h3 className="font-bold mb-2">Sessions</h3>
          <ul className="space-y-1">
            {data.sessions.map((s: any) => (
              <li key={s.session_id} className="bg-white/5 rounded p-2">
                <span className="font-mono text-xs">{s.session_id}</span> | {s.start_time} | {s.page_count} pages | {s.total_duration_seconds}s
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Leads</h3>
          <ul className="space-y-1">
            {data.leads.map((l: any) => (
              <li key={l.id} className="bg-white/5 rounded p-2">
                {l.first_name} {l.last_name} | {l.email} | Status: {l.status}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Funnel Steps</h3>
          <ul className="space-y-1">
            {data.funnel.map((f: any, idx: number) => (
              <li key={idx} className="bg-white/5 rounded p-2">
                {f.step_number}. {f.step_name} ({f.step_category}) | {f.page}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

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

  const handleReplyEmail = (lead: DashboardLead) => {
    const subject = encodeURIComponent("Re: Your TS Residence Enquiry");
    const body = encodeURIComponent(
      `Dear ${lead.first_name},\n\nThank you for your enquiry regarding TS Residence. Our team would love to assist you.\n\nPlease feel free to reach out via WhatsApp at +62 811 1902 8111 or simply reply to this email and we will get back to you promptly.\n\nWarm regards,\nTS Residence Team\nwww.tsresidence.id`
    );
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, "_blank");
    if (lead.status === "new") updateLeadStatus(lead.id, "responded");
  };

  const newLeadsCount = leads.filter(l => l.status === "new").length;

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
              className={`relative px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedTab === tab
                  ? 'bg-[#c5a572] text-black'
                  : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              {tab === 'crm' ? 'Applications' : tab}
              {tab === 'crm' && newLeadsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 rounded-full text-[8px] font-black text-white flex items-center justify-center px-1 animate-pulse">
                  {newLeadsCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {selectedTab === 'overview' && (
          <>
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
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
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-2xl">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-3">Tracking Failures</p>
                <div className="text-2xl font-serif text-red-400">{summary?.totals.failed_events ?? 0}</div>
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

            {/* Geographic Distribution (clickable) */}
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6 flex items-center gap-3">
                <span>🌍</span>
                Geographic Distribution
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {summary?.byCountry.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 hover:bg-white/10 cursor-pointer" onClick={() => openVisitorListByCountry(item.country)}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getCountryFlag(item.country)}</span>
                      <div>
                        <div className="text-white/80 text-sm font-medium">{getCountryName(item.country)}</div>
                        <div className="text-white/30 text-[10px]">{item.country}</div>
                      </div>
                    </div>
                    <div className="text-white font-bold underline">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
                {/* Modal for visitor lists and profiles */}
                {modalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-[#181818] rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6 relative">
                      <button className="absolute top-3 right-3 text-white/40 hover:text-white text-xl" onClick={() => setModalOpen(false)}>&times;</button>
                      <h2 className="text-lg font-bold mb-4">{modalTitle}</h2>
                      {modalContent}
                    </div>
                  </div>
                )}
          </>
        )}

        {/* APPLICATIONS TAB */}
        {selectedTab === 'crm' && (
          <>
            {/* Pipeline stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
              {[
                { key: 'new', label: 'New', color: '#c5a572', icon: '🔔' },
                { key: 'responded', label: 'Responded', color: '#60a5fa', icon: '✉️' },
                { key: 'open_sale', label: 'Open Sale', color: '#a78bfa', icon: '🤝' },
                { key: 'closed_won', label: 'Closed — Won', color: '#4ade80', icon: '🏆' },
                { key: 'not_interested', label: 'Not Interested', color: '#6b7280', icon: '✕' },
              ].map(({ key, label, color, icon }) => {
                const count = leads.filter(l => l.status === key).length;
                const total = leads.length || 1;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedFilter(key)}
                    className={`bg-[#111111] border rounded-2xl p-5 text-left transition-all hover:border-white/20 ${
                      selectedFilter === key ? 'border-[#c5a572]/50' : 'border-white/5'
                    }`}
                  >
                    <div className="text-lg mb-2">{icon}</div>
                    <div className="text-2xl font-bold" style={{ color }}>{count}</div>
                    <div className="text-[9px] uppercase tracking-[0.12em] text-white/40 mt-1 leading-tight">{label}</div>
                    {key === 'closed_won' && total > 0 && (
                      <div className="text-[9px] text-green-400/60 mt-1">{Math.round((count / total) * 100)}% conv.</div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Filter row */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex gap-2 flex-wrap">
                {['all', 'new', 'responded', 'open_sale', 'closed_won', 'not_interested'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedFilter(s)}
                    className={`text-[9px] uppercase px-3 py-1.5 rounded-lg transition-all tracking-widest font-bold ${
                      selectedFilter === s ? 'bg-[#c5a572] text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {s.replace(/_/g, ' ')}
                    {s !== 'all' && (
                      <span className="ml-1.5 opacity-50">({leads.filter(l => l.status === s).length})</span>
                    )}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-white/20">{filteredLeads.length} application{filteredLeads.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Application cards */}
            <div className="space-y-3">
              {filteredLeads.length === 0 && (
                <div className="text-center py-20 text-white/20 text-sm">No applications in this stage</div>
              )}
              {filteredLeads.map((lead) => {
                const cat = categorizeSource(lead.source, lead.medium);
                const statusConfig: Record<string, { label: string; color: string; borderClass: string }> = {
                  new:            { label: 'New Enquiry',    color: '#c5a572', borderClass: 'border-l-[#c5a572]' },
                  responded:      { label: 'Responded',      color: '#60a5fa', borderClass: 'border-l-blue-400' },
                  open_sale:      { label: 'Open Sale',      color: '#a78bfa', borderClass: 'border-l-violet-400' },
                  closed_won:     { label: 'Closed — Won',   color: '#4ade80', borderClass: 'border-l-green-400' },
                  not_interested: { label: 'Not Interested', color: '#6b7280', borderClass: 'border-l-gray-500' },
                };
                const sc = statusConfig[lead.status] ?? statusConfig['new'];
                const initials = `${lead.first_name?.[0] ?? ''}${lead.last_name?.[0] ?? ''}`.toUpperCase();

                return (
                  <div
                    key={lead.id}
                    className={`bg-[#111111] border border-white/5 border-l-4 ${sc.borderClass} rounded-2xl p-5 transition-all hover:border-white/10 ${
                      lead.status === 'new' ? 'shadow-[0_0_24px_rgba(197,165,114,0.07)]' : ''
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4">

                      {/* Avatar + core info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5"
                          style={{ background: sc.color + '22', color: sc.color }}
                        >
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-sm">{lead.first_name} {lead.last_name}</span>
                            <span
                              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                              style={{ background: sc.color + '20', color: sc.color }}
                            >
                              {sc.label}
                            </span>
                            {lead.status === 'new' && (
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 animate-pulse">
                                ● New
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
                            <a href={`mailto:${lead.email}`} className="text-xs text-white/50 hover:text-white/80 transition-colors">
                              {lead.email}
                            </a>
                            {lead.phone && (
                              <a href={`tel:${lead.phone}`} className="text-xs text-white/50 hover:text-white/80 transition-colors">
                                {lead.phone}
                              </a>
                            )}
                          </div>
                          {lead.message && (
                            <p className="text-[11px] text-white/30 mt-2 line-clamp-2 italic">&ldquo;{lead.message}&rdquo;</p>
                          )}
                        </div>
                      </div>

                      {/* Meta + Actions */}
                      <div className="flex flex-col gap-3 md:items-end shrink-0 md:min-w-[200px]">
                        <div className="flex flex-wrap gap-2 md:justify-end">
                          <span className="text-[9px] bg-white/5 text-white/40 px-2 py-1 rounded-lg uppercase tracking-wider">
                            {cat.icon} {cat.category}
                          </span>
                          {lead.stay_duration && (
                            <span className="text-[9px] bg-white/5 text-white/40 px-2 py-1 rounded-lg">
                              🗓 {lead.stay_duration}
                            </span>
                          )}
                          {lead.country && (
                            <span className="text-[9px] bg-white/5 text-white/40 px-2 py-1 rounded-lg">
                              {getCountryFlag(lead.country)} {lead.country}
                            </span>
                          )}
                          <span className="text-[9px] text-white/20">
                            {new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 flex-wrap md:justify-end">
                          <button
                            onClick={() => handleReplyEmail(lead)}
                            className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 bg-[#c5a572] hover:bg-[#d4b882] text-black rounded-lg transition-all"
                          >
                            ✉ Reply via Email
                          </button>
                          <a
                            href={`https://wa.me/6281119028111?text=${encodeURIComponent(`New lead: ${lead.first_name} ${lead.last_name} (${lead.email}) - ${lead.stay_duration ?? ''}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-lg transition-all"
                          >
                            💬 WhatsApp
                          </a>
                        </div>

                        {/* Status dropdown */}
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white/60 rounded-lg px-3 py-1.5 hover:bg-white/10 transition-all cursor-pointer w-full md:w-auto"
                        >
                          <option value="new">🔔 New Enquiry</option>
                          <option value="responded">✉️ Responded</option>
                          <option value="open_sale">🤝 Open Sale</option>
                          <option value="closed_won">🏆 Closed — Won</option>
                          <option value="not_interested">✕ Not Interested</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
