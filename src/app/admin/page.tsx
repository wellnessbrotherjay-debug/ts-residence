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
  recentEvents: { id: number; event_type: string; page: string; created_at: string; metadata: any }[];
}

export default function AdminPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastLeadId, setLastLeadId] = useState<number | null>(null);

  const fetchDashboard = async (isInitial = false) => {
    try {
      const [summaryRes, leadsRes] = await Promise.all([
        fetch('/api/dashboard/summary'),
        fetch('/api/leads'),
      ]);
      if (summaryRes.ok) {
        setSummary(await summaryRes.json());
      }
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data);
        
        // Check for NEW leads to trigger alerts
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
    // 1. Audio alert
    try {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.play();
    } catch (e) {}

    // 2. Browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("New Lead: " + lead.first_name, {
        body: `From ${lead.source} - ${lead.email}`,
        icon: "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/cce3ff72-a0c2-4b10-826e-c47befe5db00/public"
      });
    }

    // 3. Tab Alert
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
    const interval = setInterval(fetchDashboard, 15000); // Faster refresh for CRM
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

  if (loading && !summary) return <div className="p-20 text-center">Loading Dashboard...</div>;

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto text-black">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-serif">TS Residence Intelligence</h1>
        <div className="flex gap-2">
          <button 
            onClick={requestNotificationPermission} 
            className="text-[10px] font-bold bg-gold/10 text-gold-dark px-3 py-1.5 rounded-full hover:bg-gold/20 flex items-center gap-2 border border-gold/20"
          >
            <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
            ENABLE DESKTOP ALERTS
          </button>
          <button onClick={() => fetchDashboard(false)} className="text-[10px] font-mono bg-neutral-100 px-3 py-1.5 rounded-full hover:bg-neutral-200 uppercase tracking-tight">
            Refresh Live
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="border border-neutral-200 rounded-xl p-5 bg-white shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Total Page views</p>
          <p className="text-3xl font-semibold mt-2">{summary?.totals.page_views ?? 0}</p>
        </div>
        <div className="border border-neutral-200 rounded-xl p-5 bg-white shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">High Intent Clicks</p>
          <p className="text-3xl font-semibold mt-2 text-gold-dark">{summary?.totals.book_clicks ?? 0}</p>
        </div>
        <div className="border border-neutral-200 rounded-xl p-5 bg-white shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Total Events tracked</p>
          <p className="text-3xl font-semibold mt-2">{summary?.totals.total_events ?? 0}</p>
        </div>
        <div className="border border-neutral-200 rounded-xl p-5 bg-white shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Leads in CRM</p>
          <p className="text-3xl font-semibold mt-2 text-green-600">{summary?.totals.total_leads ?? 0}</p>
        </div>
      </div>

      {/* Analytics Breakdown */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="border border-neutral-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2">Top Traffic Sources</h3>
          <ul className="space-y-3 text-xs">
            {(summary?.bySource || []).map((item) => (
              <li key={item.source} className="flex justify-between">
                <span className="font-mono">{item.source}</span>
                <span className="font-bold">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2">Top Campaigns</h3>
          <ul className="space-y-3 text-xs">
            {(summary?.byCampaign || []).map((item) => (
              <li key={item.campaign} className="flex justify-between">
                <span className="font-mono">{item.campaign}</span>
                <span className="font-bold">{item.count}</span>
              </li>
            ))}
            {summary?.byCampaign.length === 0 && <li className="text-neutral-400 italic">No campaign data yet</li>}
          </ul>
        </div>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2">Most Visited Pages</h3>
          <ul className="space-y-3 text-xs">
            {(summary?.byPage || []).map((item) => (
              <li key={item.page} className="flex justify-between">
                <span className="font-mono truncate mr-4">{item.page}</span>
                <span className="font-bold">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="mb-12 border border-neutral-200 rounded-xl p-6 bg-neutral-900 text-neutral-300">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live Activity Stream (Last 20)
        </h2>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 text-[11px] font-mono">
          {summary?.recentEvents.map((ev) => (
            <div key={ev.id} className="flex gap-4 border-b border-white/5 pb-2">
              <span className="text-neutral-500">{new Date(ev.created_at).toLocaleTimeString()}</span>
              <span className={`uppercase px-1 rounded ${ev.event_type === 'book_click' ? 'bg-gold/20 text-gold' : 'bg-white/10'}`}>
                {ev.event_type}
              </span>
              <span className="text-neutral-400">{ev.page}</span>
              {ev.metadata?.link_text && (
                <span className="text-blue-400 ml-auto">clicked: "{ev.metadata.link_text}"</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CRM Leads Table */}
      <div className="mb-12 border border-neutral-200 rounded-xl p-6 bg-white shadow-lg overflow-auto">
        <h2 className="text-xl font-bold mb-6 border-b pb-4">Inquiry Pipeline (CRM)</h2>
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-left text-neutral-500 uppercase text-[10px] tracking-widest border-b border-neutral-100">
              <th className="py-4">Lead Detail</th>
              <th className="py-4">Attribution</th>
              <th className="py-4">Interest</th>
              <th className="py-4">Status</th>
              <th className="py-4">Received</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                <td className="py-5">
                  <div className="font-bold text-lg leading-tight">{lead.first_name} {lead.last_name}</div>
                  <div className="text-neutral-500 text-xs mt-1">{lead.email}</div>
                  <div className="text-neutral-500 text-xs">{lead.phone || '-'}</div>
                </td>
                <td className="py-5">
                  <div className="flex flex-col gap-1">
                    <span className="bg-neutral-100 px-2 py-0.5 rounded-full text-[10px] font-bold w-fit uppercase">{lead.source}</span>
                    <span className="text-xs text-neutral-500">{lead.campaign || 'No Campaign'}</span>
                  </div>
                </td>
                <td className="py-5">
                   <div className="text-xs font-bold">{lead.stay_duration} stay</div>
                   <div className="text-xs text-neutral-500 line-clamp-1 italic">"{lead.message || 'No message'}"</div>
                </td>
                <td className="py-5">
                  <select 
                    value={lead.status} 
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value)} 
                    className={`border border-neutral-200 rounded-lg px-3 py-1.5 font-bold text-xs appearance-none outline-none cursor-pointer
                      ${lead.status === 'new' ? 'bg-blue-50 text-blue-700' : ''}
                      ${lead.status === 'contacted' ? 'bg-orange-50 text-orange-700' : ''}
                      ${lead.status === 'qualified' ? 'bg-purple-50 text-purple-700' : ''}
                      ${lead.status === 'closed' ? 'bg-green-50 text-green-700' : ''}
                    `}
                  >
                    <option value="new">NEW</option>
                    <option value="contacted">CONTACTED</option>
                    <option value="qualified">QUALIFIED</option>
                    <option value="closed">CLOSED</option>
                  </select>
                </td>
                <td className="py-5 text-neutral-400 text-xs whitespace-nowrap">
                  {new Date(lead.created_at).toLocaleDateString()}
                  <br />
                  {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={5} className="py-12 text-center text-neutral-400 italic text-lg">No leads in the pipeline yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
