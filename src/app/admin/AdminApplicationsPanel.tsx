"use client";

import { useEffect, useState } from "react";

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

export default function AdminApplicationsPanel() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  function fetchApplications() {
    setLoading(true);
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
  }

  async function updateStatus(id: number, status: string) {
    setUpdatingId(id);
    await fetch(`/api/leads/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchApplications();
    setUpdatingId(null);
  }

  function handleEmail(app: Application) {
    const subject = encodeURIComponent("Re: Your TS Residence Application");
    const body = encodeURIComponent(
      `Dear ${app.first_name},\n\nThank you for your application regarding TS Residence. Our team would love to assist you.\n\nPlease feel free to reach out via WhatsApp at +62 811 1902 8111 or simply reply to this email and we will get back to you promptly.\n\nWarm regards,\nTS Residence Team\nwww.tsresidence.id`
    );
    window.open(`mailto:${app.email}?subject=${subject}&body=${body}`, "_blank");
  }

  function handleWhatsApp(app: Application) {
    const phone = app.phone?.replace(/[^\d]/g, "") || "";
    const wa = phone ? `https://wa.me/${phone}` : "https://wa.me/6281119028111";
    window.open(wa, "_blank");
  }

  return (
    <div className="bg-[#181818] rounded-xl p-8 border border-gold/10 text-white">
      <h2 className="mb-2 text-2xl font-bold">Applications</h2>
      <p className="mb-8 text-base text-white/60">All submitted apartment applications.</p>
      {loading && (
        <div className="flex items-center gap-2 text-gold"><span className="animate-spin">⏳</span> Loading...</div>
      )}
      {error && <div className="text-red-400">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-gold/10 bg-[#111] shadow">
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
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {applications.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-white/40 italic">
                    No applications found.
                  </td>
                </tr>
              )}
              {applications.map((app) => (
                <tr key={app.id} className={
                  app.status === "closed_won"
                    ? "bg-green-900/30"
                    : app.status === "not_interested"
                    ? "bg-red-900/20"
                    : ""
                }>
                  <td className="px-6 py-4 font-semibold">{app.first_name} {app.last_name}</td>
                  <td className="px-6 py-4">{app.email}</td>
                  <td className="px-6 py-4">{app.phone || "-"}</td>
                  <td className="px-6 py-4">{app.stay_duration || "-"}</td>
                  <td className="px-6 py-4 uppercase text-xs font-bold">
                    <select
                      value={app.status}
                      disabled={updatingId === app.id}
                      className={`rounded px-2 py-1 bg-[#222] border border-gold/20 text-white ${
                        app.status === "closed_won"
                          ? "bg-green-700/60 border-green-400 text-green-200"
                          : app.status === "not_interested"
                          ? "bg-red-700/60 border-red-400 text-red-200"
                          : ""
                      }`}
                      onChange={e => updateStatus(app.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="responded">Responded</option>
                      <option value="open_sale">Open Sale</option>
                      <option value="closed_won">Closed Sale</option>
                      <option value="not_interested">Not Interested</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{new Date(app.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 max-w-[300px] truncate">{app.message || <span className="italic text-white/30">No message</span>}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEmail(app)}
                      className="rounded bg-blue-800/60 px-3 py-1 text-xs hover:bg-blue-600/80"
                      title="Email"
                    >
                      Email
                    </button>
                    <button
                      onClick={() => handleWhatsApp(app)}
                      className="rounded bg-green-800/60 px-3 py-1 text-xs hover:bg-green-600/80"
                      title="WhatsApp"
                    >
                      WhatsApp
                    </button>
                    {app.status !== "closed_won" && (
                      <button
                        onClick={() => updateStatus(app.id, "closed_won")}
                        disabled={updatingId === app.id}
                        className="rounded bg-gold/80 px-3 py-1 text-xs text-black font-bold hover:bg-gold/60"
                        title="Mark as Closed Sale"
                      >
                        Close Sale
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}