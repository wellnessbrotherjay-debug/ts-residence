"use client";

import { useState, useEffect } from "react";
import AdminApplicationsPanel from "./AdminApplicationsPanel";
import dynamic from "next/dynamic";
const ChatHistoryPanel = dynamic(() => import("./ChatHistoryPanel"), { ssr: false });
const MarketingDashboard = dynamic(() => import("./MarketingDashboard"), { ssr: false });
const UtmBuilder = dynamic(() => import("./UtmBuilder"), { ssr: false });
const ReportPanel = dynamic(() => import("./ReportPanel"), { ssr: false });
const TrafficIntelligencePanel = dynamic(() => import("./TrafficIntelligencePanel"), { ssr: false });

interface DashboardLead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  stay_duration?: string;
  message?: string;
  source: string;
  campaign?: string;
  status: string;
  created_at: string;
}

interface DashboardSummary {
  totals: {
    total_events: number;
    page_views: number;
    book_clicks: number;
    total_leads: number;
    closed_won_leads: number;
    cta_click_rate: number;
    lead_to_sale_rate: number;
    visit_to_sale_rate: number;
  };
  bySource: { source: string; count: number }[];
  byCampaign: { campaign: string; count: number }[];
  byPage: { page: string; count: number }[];
  recentEvents: {
    id: number;
    event_type: string;
    page: string;
    created_at: string;
    metadata: unknown;
  }[];
}

interface ContextSummaryRow {
  key: string;
  events: number;
  leads: number;
  won: number;
  visitToSaleRate: number;
  leadToSaleRate: number;
}

interface ContextSummary {
  periodDays: number;
  generatedAt: string;
  totals: {
    pageViews: number;
    leads: number;
    closedWon: number;
  };
  byCountry: ContextSummaryRow[];
  byDevice: ContextSummaryRow[];
}

export default function AdminPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [contextSummary, setContextSummary] = useState<ContextSummary | null>(null);
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastLeadId, setLastLeadId] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [hideUnknownOverview, setHideUnknownOverview] = useState<boolean>(false);

  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    fetch("/api/admin/session", { credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) {
          return { authenticated: false };
        }

        return (await response.json()) as { authenticated: boolean };
      })
      .then((payload) => {
        setAuthed(Boolean(payload.authenticated));
      })
      .finally(() => {
        setMounted(true);
      });
  }, []);

  const handlePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ password: pw }),
    });

    if (response.ok) {
      setAuthed(true);
    } else {
      const payload = await response.json().catch(() => null);
      setAuthError(payload?.error || "Incorrect password");
    }
  };

  const fetchDashboard = async (isInitial = false) => {
    try {
      const [summaryRes, leadsRes, contextSummaryRes] = await Promise.all([
        fetch("/api/dashboard/summary"),
        fetch("/api/leads"),
        fetch("/api/admin/traffic/context-summary?days=28"),
      ]);
      if (summaryRes.ok) {
        setSummary(await summaryRes.json());
      }
      if (contextSummaryRes.ok) {
        setContextSummary(await contextSummaryRes.json());
      }
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data);
        if (
          !isInitial &&
          data.length > 0 &&
          lastLeadId &&
          data[0].id > lastLeadId
        ) {
          triggerLeadAlert(data[0]);
        }
        if (data.length > 0) setLastLeadId(data[0].id);
      }
    } catch (_err: unknown) {
      // error handled silently
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  const triggerLeadAlert = (lead: DashboardLead) => {
    try {
      const audio = new Audio(
        "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
      );
      audio.play();
    } catch {}
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("New Lead: " + lead.first_name, {
        body: `From ${lead.source} - ${lead.email}`,
        icon: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/cce3ff72-a0c2-4b10-826e-c47befe5db00/public",
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
    if (!mounted || !authed) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard(true);
    const interval = setInterval(() => fetchDashboard(), 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, mounted, lastLeadId]);

  const updateLeadStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/leads/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchDashboard();
  };

  const handleReplyEmail = (lead: DashboardLead) => {
    const subject = encodeURIComponent("Re: Your TS Residence Enquiry");
    const body = encodeURIComponent(
      `Dear ${lead.first_name},\n\nThank you for your enquiry regarding TS Residence. Our team would love to assist you.\n\nPlease feel free to reach out via WhatsApp at +62 811 1902 8111 or simply reply to this email and we will get back to you promptly.\n\nWarm regards,\nTS Residence Team\nwww.tsresidence.id`,
    );
    window.open(
      `mailto:${lead.email}?subject=${subject}&body=${body}`,
      "_blank",
    );
    if (lead.status === "new") updateLeadStatus(lead.id, "responded");
  };

  const filteredLeads =
    selectedFilter === "all"
      ? leads
      : leads.filter((l) => l.status === selectedFilter);

  const overviewCountryRows = contextSummary
    ? hideUnknownOverview
      ? contextSummary.byCountry.filter((item) => item.key.toLowerCase() !== "unknown")
      : contextSummary.byCountry
    : [];

  const overviewDeviceRows = contextSummary
    ? hideUnknownOverview
      ? contextSummary.byDevice.filter((item) => item.key.toLowerCase() !== "unknown")
      : contextSummary.byDevice
    : [];

  if (!mounted) {
    return null;
  }

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f1eb" }}>
        <form onSubmit={handlePw} style={{ background: "white", padding: 32, borderRadius: 12, boxShadow: "0 2px 16px #0001", display: "flex", flexDirection: "column", gap: 16, minWidth: 320 }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24 }}>Admin Login</h2>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="Enter password"
            style={{ padding: 12, fontSize: 18, borderRadius: 6, border: "1px solid #ccc" }}
            autoFocus
          />
          {authError ? <p style={{ margin: 0, color: "#b91c1c", fontSize: 14 }}>{authError}</p> : null}
          <button type="submit" style={{ padding: 12, fontSize: 18, borderRadius: 6, background: "#8b7658", color: "white", border: "none", fontWeight: 600 }}>Login</button>
        </form>
      </div>
    );
  }

  if (loading && !summary) {
    return (
      <div className="p-20 text-center text-white">Loading Dashboard...</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded font-bold ${activeTab === "overview" ? "bg-gold text-black" : "bg-[#222] text-gold"}`}
            onClick={() => setActiveTab("overview")}
          >Overview</button>
          <button
            className={`px-4 py-2 rounded font-bold ${activeTab === "applications" ? "bg-gold text-black" : "bg-[#222] text-gold"}`}
            onClick={() => setActiveTab("applications")}
          >Applications</button>
          <button
            className={`px-4 py-2 rounded font-bold ${activeTab === "marketing" ? "bg-gold text-black" : "bg-[#222] text-gold"}`}
            onClick={() => setActiveTab("marketing")}
          >Marketing</button>
          <button
            className={`px-4 py-2 rounded font-bold ${activeTab === "chat" ? "bg-gold text-black" : "bg-[#222] text-gold"}`}
            onClick={() => setActiveTab("chat")}
          >Chatbot History</button>
          <button
            className={`px-4 py-2 rounded font-bold ${activeTab === "utm" ? "bg-gold text-black" : "bg-[#222] text-gold"}`}
            onClick={() => setActiveTab("utm")}
          >UTM Builder</button>
          <button
            className={`px-4 py-2 rounded font-bold ${activeTab === "reports" ? "bg-gold text-black" : "bg-[#222] text-gold"}`}
            onClick={() => setActiveTab("reports")}
          >Reports</button>
          <button
            className={`px-4 py-2 rounded font-bold ${activeTab === "traffic" ? "bg-gold text-black" : "bg-[#222] text-gold"}`}
            onClick={() => setActiveTab("traffic")}
          >Traffic Intel</button>
        </div>
        {activeTab === "overview" && (
          <div>
            {summary ? (
              <>
                <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                  <div className="rounded-lg bg-[#222] p-6">
                    <p className="text-gold text-sm font-semibold uppercase">Page Views</p>
                    <p className="mt-2 text-3xl font-bold">{summary.totals.page_views.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-[#222] p-6">
                    <p className="text-gold text-sm font-semibold uppercase">Book Clicks</p>
                    <p className="mt-2 text-3xl font-bold">{summary.totals.book_clicks.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-[#222] p-6">
                    <p className="text-gold text-sm font-semibold uppercase">CTA Click Rate</p>
                    <p className="mt-2 text-3xl font-bold">{summary.totals.cta_click_rate.toFixed(1)}%</p>
                  </div>
                  <div className="rounded-lg bg-[#222] p-6">
                    <p className="text-gold text-sm font-semibold uppercase">Closed Won</p>
                    <p className="mt-2 text-3xl font-bold">{summary.totals.closed_won_leads.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-[#222] p-6">
                    <p className="text-gold text-sm font-semibold uppercase">Visit to Sale Rate</p>
                    <p className="mt-2 text-3xl font-bold">{summary.totals.visit_to_sale_rate.toFixed(2)}%</p>
                  </div>
                  <div className="rounded-lg bg-[#222] p-6">
                    <p className="text-gold text-sm font-semibold uppercase">Lead to Sale Rate</p>
                    <p className="mt-2 text-3xl font-bold">{summary.totals.lead_to_sale_rate.toFixed(1)}%</p>
                  </div>
                </div>

                <p className="mb-10 text-xs text-white/55">
                  CTA Click Rate = Book Clicks / Page Views. Visit to Sale Rate = Closed Won / Page Views. Lead to Sale Rate = Closed Won / Total Leads.
                </p>

                <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-lg bg-[#222] p-6">
                    <h3 className="text-gold mb-4 text-lg font-semibold">Top Pages</h3>
                    <div className="space-y-2">
                      {summary.byPage.slice(0, 5).map((item) => (
                        <div key={item.page} className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-white/80">{item.page}</span>
                          <span className="font-bold">{item.count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#222] p-6">
                    <h3 className="text-gold mb-4 text-lg font-semibold">Traffic Sources</h3>
                    <div className="space-y-2">
                      {summary.bySource.slice(0, 5).map((item) => (
                        <div key={item.source} className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-white/80">{item.source || "Direct"}</span>
                          <span className="font-bold">{item.count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {contextSummary ? (
                  <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-lg bg-[#222] p-6">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-gold mb-1 text-lg font-semibold">Top Countries (Last 28 Days)</h3>
                          <p className="text-xs text-white/50">From server-verified request geo headers.</p>
                        </div>
                        <label className="flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-xs text-white/75">
                          <input
                            type="checkbox"
                            checked={hideUnknownOverview}
                            onChange={(e) => setHideUnknownOverview(e.target.checked)}
                          />
                          Hide Unknown
                        </label>
                      </div>
                      <div className="space-y-2">
                        {overviewCountryRows.slice(0, 6).map((item) => (
                          <div key={item.key} className="border-b border-white/10 pb-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white/90">{item.key}</span>
                              <span className="font-bold text-white">{item.events.toLocaleString()} views</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-xs text-white/60">
                              <span>Leads: {item.leads.toLocaleString()} · Won: {item.won.toLocaleString()}</span>
                              <span>Visit→Sale: {item.visitToSaleRate.toFixed(2)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg bg-[#222] p-6">
                      <h3 className="text-gold mb-1 text-lg font-semibold">Device Breakdown (Last 28 Days)</h3>
                      <p className="mb-4 text-xs text-white/50">Server-derived device type from user-agent.</p>
                      <div className="space-y-2">
                        {overviewDeviceRows.slice(0, 6).map((item) => (
                          <div key={item.key} className="border-b border-white/10 pb-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white/90 capitalize">{item.key}</span>
                              <span className="font-bold text-white">{item.events.toLocaleString()} views</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-xs text-white/60">
                              <span>Leads: {item.leads.toLocaleString()} · Won: {item.won.toLocaleString()}</span>
                              <span>Lead→Sale: {item.leadToSaleRate.toFixed(1)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}

            <div className="mb-6">
              <h3 className="text-gold mb-4 text-lg font-semibold">Leads Overview</h3>
            </div>

            <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-6">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`flex transform flex-col items-center rounded-lg bg-[#181818] p-6 transition-all hover:scale-105 ${
                  selectedFilter === "all"
                    ? "border-2 border-[#c5a572] ring-2 ring-[#c5a572]/20"
                    : "border-2 border-transparent"
                }`}
              >
                <span className="text-2xl font-bold">{leads.length}</span>
                <span className="mt-2 text-sm text-white/70">ALL LEADS</span>
              </button>
              <button
                onClick={() => setSelectedFilter("new")}
                className={`flex transform flex-col items-center rounded-lg bg-[#181818] p-6 transition-all hover:scale-105 ${
                  selectedFilter === "new"
                    ? "border-2 border-[#c5a572] ring-2 ring-[#c5a572]/20"
                    : "border-2 border-transparent"
                }`}
              >
                <span className="text-2xl font-bold">{leads.filter((l) => l.status === "new").length}</span>
                <span className="mt-2 text-sm text-white/70">NEW LEADS</span>
              </button>
              <button
                onClick={() => setSelectedFilter("responded")}
                className={`flex transform flex-col items-center rounded-lg bg-[#181818] p-6 transition-all hover:scale-105 ${
                  selectedFilter === "responded"
                    ? "border-2 border-[#c5a572] ring-2 ring-[#c5a572]/20"
                    : "border-2 border-transparent"
                }`}
              >
                <span className="text-2xl font-bold">{leads.filter((l) => l.status === "responded").length}</span>
                <span className="mt-2 text-sm text-white/70">RESPONDED</span>
              </button>
              <button
                onClick={() => setSelectedFilter("open_sale")}
                className={`flex transform flex-col items-center rounded-lg bg-[#181818] p-6 transition-all hover:scale-105 ${
                  selectedFilter === "open_sale"
                    ? "border-2 border-[#c5a572] ring-2 ring-[#c5a572]/20"
                    : "border-2 border-transparent"
                }`}
              >
                <span className="text-2xl font-bold">{leads.filter((l) => l.status === "open_sale").length}</span>
                <span className="mt-2 text-sm text-white/70">OPEN SALE</span>
              </button>
              <button
                onClick={() => setSelectedFilter("closed_won")}
                className={`flex transform flex-col items-center rounded-lg bg-[#181818] p-6 transition-all hover:scale-105 ${
                  selectedFilter === "closed_won"
                    ? "border-2 border-[#c5a572] ring-2 ring-[#c5a572]/20"
                    : "border-2 border-transparent"
                }`}
              >
                <span className="text-2xl font-bold">{leads.filter((l) => l.status === "closed_won").length}</span>
                <span className="mt-2 text-sm text-white/70">WON</span>
              </button>
              <button
                onClick={() => setSelectedFilter("not_interested")}
                className={`flex transform flex-col items-center rounded-lg bg-[#181818] p-6 transition-all hover:scale-105 ${
                  selectedFilter === "not_interested"
                    ? "border-2 border-[#c5a572] ring-2 ring-[#c5a572]/20"
                    : "border-2 border-transparent"
                }`}
              >
                <span className="text-2xl font-bold">{leads.filter((l) => l.status === "not_interested").length}</span>
                <span className="mt-2 text-sm text-white/70">PASS</span>
              </button>
            </div>
          </div>
        )}
        {activeTab === "applications" && <AdminApplicationsPanel />}
        {activeTab === "marketing" && <MarketingDashboard />}
        {activeTab === "chat" && <ChatHistoryPanel />}
        {activeTab === "utm" && <UtmBuilder />}
        {activeTab === "reports" && <ReportPanel />}
        {activeTab === "traffic" && <TrafficIntelligencePanel />}
      </div>
    </div>
  );
}
