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
        <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
        {summary && (
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">Summary</h2>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <li>Total Events: {summary.totals.total_events}</li>
              <li>Page Views: {summary.totals.page_views}</li>
              <li>Book Clicks: {summary.totals.book_clicks}</li>
              <li>Total Leads: {summary.totals.total_leads}</li>
            </ul>
          </div>
        )}
        <div>
          <h2 className="mb-2 text-xl font-semibold">Recent Leads</h2>
          <table className="min-w-full overflow-hidden rounded-lg bg-[#181818]">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Source</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 10).map((lead) => (
                <tr key={lead.id} className="border-t border-[#333]">
                  <td className="px-4 py-2">
                    {lead.first_name} {lead.last_name}
                  </td>
                  <td className="px-4 py-2">{lead.email}</td>
                  <td className="px-4 py-2">{lead.source}</td>
                  <td className="px-4 py-2">{lead.status}</td>
                  <td className="px-4 py-2">
                    {new Date(lead.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
