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
    <div className="min-h-screen bg-[#050505] text-white/90">
      <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-serif tracking-tight mb-2">Analytics & CRM Intelligence</h1>
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-bold">Real-time first-party traffic, behavior, and lead operations</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={requestNotificationPermission} 
              className="text-[10px] font-black bg-white/5 text-white/60 px-5 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-2 border border-white/10 transition-all uppercase tracking-widest"
            >
              <span className="w-1.5 h-1.5 bg-[#c5a572] rounded-full animate-pulse"></span>
              Enable Desktop Signals
            </button>
            <button onClick={() => fetchDashboard(false)} className="bg-[#c5a572] hover:bg-[#d4b882] text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(197,165,114,0.2)]">
              Refresh Feed
            </button>
          </div>
        </div>

        {/* Intelligence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a572]/5 rounded-full -translate-y-16 translate-x-16"></div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-6">Page Views</p>
            <div className="text-5xl font-serif text-white">{summary?.totals.page_views ?? 0}</div>
          </div>
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-6">High-Intent Clicks</p>
            <div className="text-5xl font-serif text-white">{summary?.totals.book_clicks ?? 0}</div>
          </div>
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-6">Active Leads</p>
            <div className="text-5xl font-serif text-[#25D366]">{summary?.totals.total_leads ?? 0}</div>
          </div>
        </div>

        {/* Attribution Breakdown */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6 flex justify-between">Top Sources</h3>
            <ul className="space-y-3">
              {(summary?.bySource || []).map((item) => (
                <li key={item.source} className="flex justify-between text-xs items-center">
                  <span className="text-white/60 font-mono">{item.source}</span>
                  <span className="text-white/20 h-[1px] flex-1 mx-4 bg-white/5"></span>
                  <span className="text-white/80 font-bold">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6 flex justify-between">Top Campaigns</h3>
            <ul className="space-y-3">
              {(summary?.byCampaign || []).map((item) => (
                <li key={item.campaign} className="flex justify-between text-xs items-center">
                  <span className="text-white/60 font-mono italic">{item.campaign}</span>
                  <span className="text-white/20 h-[1px] flex-1 mx-4 bg-white/5"></span>
                  <span className="text-white/80 font-bold">{item.count}</span>
                </li>
              ))}
              {summary?.byCampaign.length === 0 && <li className="text-white/20 italic text-[10px] tracking-widest text-center py-4 uppercase">Waiting for traffic...</li>}
            </ul>
          </div>
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6 flex justify-between">Top Pages</h3>
            <ul className="space-y-3">
              {(summary?.byPage || []).map((item) => (
                <li key={item.page} className="flex justify-between text-xs items-center">
                  <span className="text-white/60 font-mono truncate mr-4">{item.page}</span>
                  <span className="text-white/80 font-bold">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
          {/* Live Activity Feed */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 shadow-2xl relative">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               Live Activity
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 text-[11px] font-mono custom-scrollbar">
              {summary?.recentEvents.map((ev) => (
                <div key={ev.id} className="flex flex-wrap gap-x-4 gap-y-1 border-b border-white/5 pb-2 hover:bg-white/5 transition-colors">
                  <span className="text-white/20 shrink-0">[{new Date(ev.created_at).toLocaleTimeString()}]</span>
                  <span className={`shrink-0 uppercase px-1 rounded text-[9px] font-bold ${ev.event_type === 'book_click' || ev.event_type === 'quiz_complete' ? 'bg-[#c5a572]/20 text-[#c5a572]' : 'bg-white/5 text-white/40'}`}>
                    {ev.event_type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-white/60 truncate max-w-[150px]">{ev.page}</span>
                  {ev.event_type === 'scroll_depth' && (
                    <span className="text-white/30 italic">scrolled to {ev.metadata?.depth}%</span>
                  )}
                  {ev.metadata?.link_text && (
                    <span className="text-blue-500/60 ml-auto truncate">| "{ev.metadata.link_text}"</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CRM Kanban */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 shadow-2xl h-full">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8 border-b border-white/5 pb-4">CRM Kanban</h2>
            <div className="grid grid-cols-2 gap-4">
              {['new', 'contacted', 'qualified', 'closed'].map((status) => (
                <div key={status} className="bg-[#111111] p-4 rounded-xl border border-white/5 min-h-[180px]">
                  <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] flex justify-between mb-4 border-b border-white/5 pb-2">
                    {status} <span>{leads.filter(l => l.status === status).length}</span>
                  </h3>
                  <div className="space-y-2 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
                    {leads.filter(l => l.status === status).map((lead) => (
                      <div key={lead.id} className="p-2.5 bg-black/40 rounded-lg border border-white/5 group relative hover:border-[#c5a572]/30 transition-all">
                        <div className="text-[10px] font-bold text-white/80">{lead.first_name}</div>
                        <div className="text-[9px] text-white/40 mt-0.5 truncate">{lead.email}</div>
                        
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
                    ))}
                    {leads.filter(l => l.status === status).length === 0 && (
                      <p className="text-[9px] text-white/10 italic text-center mt-6">No leads</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leads Table Detail */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Detailed Lead Logs</h2>
            <div className="text-[10px] text-white/20">Total Database: {leads.length} Records</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111111] text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Guest Detail</th>
                  <th className="px-8 py-5">Attribution</th>
                  <th className="px-8 py-5">Intent Signal</th>
                  <th className="px-8 py-5">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <tr key={lead.id} className="group hover:bg-white/5 transition-all">
                    <td className="px-8 py-6">
                      <div className="font-bold text-white text-base group-hover:text-[#c5a572] transition-colors">{lead.first_name} {lead.last_name}</div>
                      <div className="text-white/40 text-[10px] mt-1 font-mono">{lead.email}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="bg-[#c5a572]/10 text-[#c5a572] px-2 py-0.5 rounded text-[9px] font-bold w-fit uppercase tracking-tighter border border-[#c5a572]/20">{lead.source}</span>
                        <span className="text-[10px] text-white/30 font-mono italic">{lead.campaign || 'direct'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-[11px] text-white/60 font-medium">{lead.stay_duration || 'General Inquiry'} stay</div>
                      <div className="text-[10px] text-white/30 mt-1.5 italic line-clamp-1">"{lead.message || 'No specific requests'}"</div>
                    </td>
                    <td className="px-8 py-6 text-white/20 text-[10px] font-mono whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString()} · {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
