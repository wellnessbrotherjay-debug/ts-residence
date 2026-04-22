"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface Application {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  stay_duration?: string;
  message?: string;
  status: string;
  created_at: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load applications");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-cream text-ink py-24 px-6 md:px-12 lg:px-24">
      <h1 className="mb-2 text-3xl font-bold">Applications</h1>
      <p className="mb-8 text-lg text-ink/70">All submitted apartment applications.</p>
      {loading && (
        <div className="flex items-center gap-2 text-gold"><Loader2 className="animate-spin" /> Loading...</div>
      )}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-gold/10 bg-white shadow">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gold/5 text-[11px] font-black uppercase tracking-[0.2em] text-gold">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Stay Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {applications.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-ink/40 italic">
                    No applications found.
                  </td>
                </tr>
              )}
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="px-6 py-4 font-semibold">{app.first_name} {app.last_name}</td>
                  <td className="px-6 py-4">{app.email}</td>
                  <td className="px-6 py-4">{app.phone || "-"}</td>
                  <td className="px-6 py-4">{app.stay_duration || "-"}</td>
                  <td className="px-6 py-4 uppercase text-xs font-bold">{app.status}</td>
                  <td className="px-6 py-4 font-mono text-xs">{new Date(app.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 max-w-[300px] truncate">{app.message || <span className="italic text-ink/30">No message</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
