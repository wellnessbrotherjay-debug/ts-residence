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
          <button className="rounded bg-[#222] px-4 py-2 font-semibold text-white">
            All
          </button>
          <button className="rounded bg-[#181818] px-4 py-2 text-white/80">
            New ({leads.filter((l) => l.status === "new").length})
          </button>
          <button className="rounded bg-[#181818] px-4 py-2 text-white/80">
            Responded ({leads.filter((l) => l.status === "responded").length})
          </button>
          <button className="rounded bg-[#181818] px-4 py-2 text-white/80">
            Open Sale ({leads.filter((l) => l.status === "open_sale").length})
          </button>
          <button className="rounded bg-[#181818] px-4 py-2 text-white/80">
            Closed Won ({leads.filter((l) => l.status === "closed_won").length})
          </button>
          <button className="rounded bg-[#181818] px-4 py-2 text-white/80">
            Not Interested (
            {leads.filter((l) => l.status === "not_interested").length})
          </button>
        </div>

        {/* ...existing code for leads table or cards will go here... */}
      </div>
    </div>
  );
}
