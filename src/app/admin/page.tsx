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

export default function AdminPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastLeadId, setLastLeadId] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const fetchDashboard = async (isInitial = false) => {
    try {
      const [summaryRes, leadsRes] = await Promise.all([
        fetch("/api/dashboard/summary"),
        fetch("/api/leads"),
      ]);
      if (summaryRes.ok) {
        setSummary(await summaryRes.json());
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
    } catch (err) {
      console.error(err);
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
    } catch (e) {}
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
    fetchDashboard(true);
    const interval = setInterval(fetchDashboard, 15000);
    return () => clearInterval(interval);
  }, [lastLeadId]);

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

  if (loading && !summary) {
    return (
      <div className="p-20 text-center text-white">Loading Dashboard...</div>
    );
  }

  // Main return block
  return (
    <div className="min-h-screen bg-[#050505] text-white/90">
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-20 md:px-12 lg:px-24">
        <h1 className="mb-8 text-3xl font-bold">
          Analytics & CRM Intelligence
        </h1>
        <p className="mb-8 text-lg text-white/70">
          Behavioral tracking, attribution, and conversion funnels
        </p>
        {/* Tab Navigation */}
        <div className="mb-8 flex gap-2">
          <button className="rounded bg-[#181818] px-4 py-2 font-semibold text-white">
            Overview
          </button>
          <button className="rounded bg-[#181818] px-4 py-2 text-white/70">
            Behavior
          </button>
          <button className="rounded bg-[#181818] px-4 py-2 text-white/70">
            Clicks
          </button>
          <button className="rounded bg-[#181818] px-4 py-2 text-white/70">
            Funnels
          </button>
          <button className="rounded bg-[#181818] px-4 py-2 text-white/70">
            Traffic
          </button>
          <button className="rounded bg-[#181818] px-4 py-2 text-white/70">
            Applications{" "}
            <span className="ml-1 rounded-full bg-yellow-500 px-2 py-0.5 text-xs text-black">
              •
            </span>
          </button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="flex flex-col items-center rounded-lg bg-[#181818] p-6">
              <span className="text-2xl font-bold">
                {leads.filter((l) => l.status === "new").length}
              </span>
              <span className="mt-2 text-sm text-white/70">NEW</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-[#181818] p-6">
              <span className="text-2xl font-bold">
                {leads.filter((l) => l.status === "responded").length}
              </span>
              <span className="mt-2 text-sm text-white/70">RESPONDED</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-[#181818] p-6">
              <span className="text-2xl font-bold">
                {leads.filter((l) => l.status === "open_sale").length}
              </span>
              <span className="mt-2 text-sm text-white/70">OPEN SALE</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-[#181818] p-6">
              <span className="text-2xl font-bold">
                {leads.filter((l) => l.status === "closed_won").length}
              </span>
              <span className="mt-2 text-sm text-white/70">CLOSED – WON</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-[#181818] p-6">
              <span className="text-2xl font-bold">
                {leads.filter((l) => l.status === "not_interested").length}
              </span>
              <span className="mt-2 text-sm text-white/70">NOT INTERESTED</span>
            </div>
          </div>
        )}
        {/* Lead Filters */}
        <div className="mb-6 flex gap-2">
          {[
            "all",
            "new",
            "responded",
            "open_sale",
            "closed_won",
            "not_interested",
          ].map((filter) => (
            <button
              key={filter}
              className={`rounded px-4 py-2 font-semibold transition-colors ${
                filter === selectedFilter
                  ? "bg-yellow-600 text-black"
                  : "bg-[#181818] text-white/80"
              }`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter === "all"
                ? "All"
                : filter
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
              {filter !== "all" &&
                ` (${leads.filter((l) => l.status === filter).length})`}
            </button>
          ))}
        </div>

        {/* Lead Cards */}
        <div className="space-y-6">
          {leads
            .filter((l) =>
              selectedFilter === "all" ? true : l.status === selectedFilter,
            )
            .map((lead) => {
              const statusColors: Record<string, string> = {
                new: "bg-yellow-500 text-black",
                responded: "bg-blue-500 text-white",
                open_sale: "bg-purple-600 text-white",
                closed_won: "bg-green-600 text-white",
                not_interested: "bg-red-600 text-white",
              };
              const borderColors: Record<string, string> = {
                new: "border-yellow-500",
                responded: "border-blue-500",
                open_sale: "border-purple-600",
                closed_won: "border-green-600",
                not_interested: "border-red-600",
              };
              const borderColor = borderColors[lead.status] || "border-[#222]";
              return (
                <div
                  key={lead.id}
                  className={`flex flex-col gap-4 rounded-lg border-2 bg-[#181818] p-6 md:flex-row md:items-center md:justify-between ${borderColor}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-[#222] text-xl font-bold text-white/80 ${borderColor}`}
                    >
                      {lead.first_name?.[0]?.toUpperCase()}
                      {lead.last_name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-lg font-semibold text-white">
                        {lead.first_name} {lead.last_name}
                        <span
                          className={`ml-2 rounded px-2 py-1 text-xs font-bold ${statusColors[lead.status]}`}
                        >
                          {lead.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <span>📧 {lead.email}</span>
                        {lead.phone && <span>📱 {lead.phone}</span>}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-white/40">
                        <span>
                          🕒{" "}
                          {lead.created_at
                            ? new Date(lead.created_at).toLocaleString()
                            : ""}
                        </span>
                        {lead.source && (
                          <span className="rounded bg-[#222] px-2 py-1 text-xs text-white/80">
                            {lead.source?.toUpperCase()}
                          </span>
                        )}
                        {lead.campaign && (
                          <span className="rounded bg-[#333] px-2 py-1 text-xs text-white/60">
                            {lead.campaign}
                          </span>
                        )}
                        {lead.stay_duration && (
                          <span className="rounded bg-[#333] px-2 py-1 text-xs text-white/60">
                            {lead.stay_duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex-1 md:mt-0">
                    {lead.message && (
                      <div className="mb-2 text-white/80 italic">
                        &quot;{lead.message}&quot;
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-45 flex-col gap-2">
                    <button
                      className="rounded bg-yellow-600 px-3 py-1 text-xs font-semibold text-black hover:bg-yellow-500"
                      onClick={() => handleReplyEmail(lead)}
                    >
                      Reply via Email
                    </button>
                    {lead.phone && (
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^\d]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded bg-green-600 px-3 py-1 text-center text-xs font-semibold text-white hover:bg-green-500"
                      >
                        WhatsApp
                      </a>
                    )}
                    <select
                      className="mt-1 rounded bg-[#222] px-2 py-1 text-xs text-white/80"
                      value={lead.status}
                      onChange={(e) =>
                        updateLeadStatus(lead.id, e.target.value)
                      }
                    >
                      <option value="new">New</option>
                      <option value="responded">Responded</option>
                      <option value="open_sale">Open Sale</option>
                      <option value="closed_won">Closed Won</option>
                      <option value="not_interested">Not Interested</option>
                    </select>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
