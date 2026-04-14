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
  leadBySource: { source: string; count: number }[];
}

export default function AdminPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [leads, setLeads] = useState<DashboardLead[]>([]);

  const fetchDashboard = async () => {
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const updateLeadStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/leads/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      fetchDashboard();
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      <h1 className="text-4xl font-serif mb-10">TS CRM & Analytics Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-10">
        <div className="border border-neutral-200 rounded-xl p-4 bg-white">
          <p className="text-xs uppercase tracking-widest text-neutral-500">Page views</p>
          <p className="text-2xl font-semibold mt-2">{summary?.totals.page_views ?? 0}</p>
        </div>
        <div className="border border-neutral-200 rounded-xl p-4 bg-white">
          <p className="text-xs uppercase tracking-widest text-neutral-500">Book clicks</p>
          <p className="text-2xl font-semibold mt-2">{summary?.totals.book_clicks ?? 0}</p>
        </div>
        <div className="border border-neutral-200 rounded-xl p-4 bg-white">
          <p className="text-xs uppercase tracking-widest text-neutral-500">All events</p>
          <p className="text-2xl font-semibold mt-2">{summary?.totals.total_events ?? 0}</p>
        </div>
        <div className="border border-neutral-200 rounded-xl p-4 bg-white">
          <p className="text-xs uppercase tracking-widest text-neutral-500">Leads captured</p>
          <p className="text-2xl font-semibold mt-2">{summary?.totals.total_leads ?? 0}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-neutral-200 rounded-xl p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4">Traffic by source</h3>
          <ul className="space-y-2 text-sm">
            {(summary?.bySource || []).map((item) => (
              <li key={item.source} className="flex justify-between border-b border-neutral-100 pb-2">
                <span>{item.source}</span><span>{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-neutral-200 rounded-xl p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4">Traffic by campaign</h3>
          <ul className="space-y-2 text-sm">
            {(summary?.byCampaign || []).map((item) => (
              <li key={item.campaign} className="flex justify-between border-b border-neutral-100 pb-2">
                <span>{item.campaign}</span><span>{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-12 border border-neutral-200 rounded-xl p-6 bg-white overflow-auto">
        <h2 className="text-xl font-bold mb-4">CRM Leads</h2>
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left border-b border-neutral-200">
              <th className="py-2">Name</th>
              <th className="py-2">Contact</th>
              <th className="py-2">Source</th>
              <th className="py-2">Campaign</th>
              <th className="py-2">Status</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-neutral-100 align-top">
                <td className="py-3">{lead.first_name} {lead.last_name}</td>
                <td className="py-3">
                  <div>{lead.email}</div>
                  <div className="text-neutral-500">{lead.phone || '-'}</div>
                </td>
                <td className="py-3">{lead.source}</td>
                <td className="py-3">{lead.campaign || '-'}</td>
                <td className="py-3">
                  <select value={lead.status} onChange={(e) => updateLeadStatus(lead.id, e.target.value)} className="border border-neutral-200 rounded px-2 py-1 outline-none text-black">
                    <option value="new">new</option>
                    <option value="contacted">contacted</option>
                    <option value="qualified">qualified</option>
                    <option value="closed">closed</option>
                  </select>
                </td>
                <td className="py-3">{new Date(lead.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={6} className="py-4 text-center text-neutral-500">No leads captured yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
