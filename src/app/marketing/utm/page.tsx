"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const UtmBuilder = dynamic(() => import("@/app/admin/UtmBuilder"), { ssr: false });

export default function MarketingUtmPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/marketing/session", { credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) {
          return { authenticated: false };
        }
        return (await response.json()) as { authenticated: boolean };
      })
      .then((payload) => {
        setAuthenticated(Boolean(payload.authenticated));
      })
      .finally(() => {
        setCheckingSession(false);
      });
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);

    const response = await fetch("/api/marketing/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setAuthenticated(true);
      setPassword("");
      return;
    }

    const payload = await response.json().catch(() => null);
    setAuthError(payload?.error || "Incorrect password");
  };

  const handleLogout = async () => {
    await fetch("/api/marketing/session", {
      method: "DELETE",
      credentials: "same-origin",
    });
    setAuthenticated(false);
  };

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-[#0b0b0b] px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#171717] p-8 text-center text-white/70">
          Checking access...
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#0b0b0b] px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#171717] p-8 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold/80">TS Residence</p>
          <h1 className="mt-2 text-3xl font-semibold text-gold">Marketing UTM Portal</h1>
          <p className="mt-3 text-sm text-white/65">
            This page gives the marketing team access only to UTM link creation and campaign tracking history.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label htmlFor="marketing-password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-gold/75">
                Marketing Password
              </label>
              <input
                id="marketing-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter marketing access password"
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-gold/60"
                required
              />
            </div>

            {authError ? <p className="text-sm text-red-400">{authError}</p> : null}

            <button
              type="submit"
              className="rounded-lg bg-gold px-6 py-3 text-sm font-bold text-black transition hover:opacity-90"
            >
              Enter UTM Portal
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#171717] p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold/80">TS Residence</p>
            <h1 className="mt-1 text-2xl font-semibold text-gold">Marketing UTM Portal</h1>
            <p className="mt-2 text-sm text-white/60">Create campaign links and review UTM performance without admin dashboard access.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/75 transition hover:border-white/40 hover:text-white"
          >
            Logout
          </button>
        </div>

        <UtmBuilder />
      </div>
    </main>
  );
}
