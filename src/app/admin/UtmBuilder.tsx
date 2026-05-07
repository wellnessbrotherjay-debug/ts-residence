"use client";

import { useState, useEffect } from "react";

const BASE_URL = "https://www.tsresidence.id";

const PAGES = [
  { label: "Homepage", path: "/" },
  { label: "Apartments", path: "/apartments" },
  { label: "SOLO Apartment", path: "/apartments/solo" },
  { label: "STUDIO Apartment", path: "/apartments/studio" },
  { label: "SOHO Apartment", path: "/apartments/soho" },
  { label: "Offers & Promotions", path: "/offers" },
  { label: "Contact Us", path: "/contact" },
  { label: "Gallery", path: "/gallery" },
  { label: "Five-Star Living", path: "/five-star-living" },
  { label: "Wellness Club", path: "/healthy-living" },
  { label: "Easy Living", path: "/easy-living" },
  { label: "FAQ", path: "/faq" },
];

const SOURCE_OPTIONS = [
  { value: "ig", label: "Instagram" },
  { value: "fb", label: "Facebook" },
  { value: "google", label: "Google" },
  { value: "tiktok", label: "TikTok" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
];

const MEDIUM_OPTIONS = [
  { value: "paid", label: "Paid (Generic)" },
  { value: "story", label: "Story" },
  { value: "reel", label: "Reel" },
  { value: "post", label: "Feed Post" },
  { value: "bio", label: "Bio Link" },
  { value: "organic", label: "Organic" },
  { value: "email", label: "Email" },
  { value: "referral", label: "Referral" },
];

interface SavedLink {
  id: string;
  created_at: string;
  name: string;
  full_url: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
}

export default function UtmBuilder() {
  const [page, setPage] = useState("/");
  const [customPath, setCustomPath] = useState("");
  const [source, setSource] = useState("ig");
  const [medium, setMedium] = useState("story");
  const [campaign, setCampaign] = useState("");
  const [content, setContent] = useState("");
  const [term, setTerm] = useState("");
  const [name, setName] = useState("");

  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedLinks, setSavedLinks] = useState<SavedLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copiedRow, setCopiedRow] = useState<string | null>(null);

  // Build the UTM URL
  const finalPath = customPath.trim() || page;
  const params = new URLSearchParams();
  if (source) params.set("utm_source", source.trim());
  if (medium) params.set("utm_medium", medium.trim());
  if (campaign.trim()) params.set("utm_campaign", campaign.trim());
  if (content.trim()) params.set("utm_content", content.trim());
  if (term.trim()) params.set("utm_term", term.trim());
  const generatedUrl = `${BASE_URL}${finalPath}?${params.toString()}`;

  useEffect(() => {
    fetch("/api/admin/utm-links", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: SavedLink[]) => setSavedLinks(data))
      .catch(() => {})
      .finally(() => setLoadingLinks(false));
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyRow = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedRow(id);
    setTimeout(() => setCopiedRow(null), 2000);
  };

  const handleSave = async () => {
    if (!campaign.trim()) {
      setSaveError("Campaign name is required to save.");
      return;
    }
    setSaveError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/utm-links", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || `${source} / ${medium} — ${campaign}`,
          base_url: `${BASE_URL}${finalPath}`,
          utm_source: source,
          utm_medium: medium,
          utm_campaign: campaign.trim(),
          utm_content: content.trim() || null,
          utm_term: term.trim() || null,
          full_url: generatedUrl,
        }),
      });
      if (res.ok) {
        const saved = (await res.json()) as SavedLink;
        setSavedLinks((prev) => [saved, ...prev]);
        setName("");
      } else {
        const payload = await res.json().catch(() => null);
        setSaveError(payload?.error || "Could not save. Check Supabase schema below.");
      }
    } catch {
      setSaveError("Network error saving UTM link.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Builder */}
      <div className="rounded-xl border border-white/5 bg-[#222] p-6">
        <h3 className="text-gold font-semibold text-lg">UTM Link Builder</h3>
        <p className="mt-1 text-sm text-white/55">
          Generate trackable links for Instagram posts, stories, reels, ads, or any campaign. Every visit will be recorded in GA4 and Supabase.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {/* Page */}
          <div className="xl:col-span-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Destination Page</p>
            <div className="flex gap-3">
              <select
                value={page}
                onChange={(e) => { setPage(e.target.value); setCustomPath(""); }}
                className="flex-1 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-gold/50"
              >
                {PAGES.map((p) => (
                  <option key={p.path} value={p.path}>{p.label}</option>
                ))}
              </select>
              <input
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                placeholder="Or type a custom path, e.g. /apartments/solo"
                className="flex-1 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/50"
              />
            </div>
          </div>

          {/* Source */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Source *</p>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-gold/50"
            >
              {SOURCE_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Medium */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Medium *</p>
            <select
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-gold/50"
            >
              {MEDIUM_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Campaign */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Campaign Name *</p>
            <input
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="e.g. may_2026_promo"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/50"
            />
            <p className="mt-1 text-xs text-white/35">Use lowercase, underscores, no spaces</p>
          </div>

          {/* Content */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Content <span className="text-white/30 normal-case font-normal">(optional — e.g. reels_pool_v1)</span></p>
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. reels_pool_v1"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/50"
            />
          </div>

          {/* Term */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Audience / Term <span className="text-white/30 normal-case font-normal">(optional)</span></p>
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="e.g. digital_nomad_lookalike"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/50"
            />
          </div>

          {/* Save label */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Label to Save As <span className="text-white/30 normal-case font-normal">(optional)</span></p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. May IG Story — Solo Promo"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/50"
            />
          </div>
        </div>

        {/* Generated URL */}
        <div className="mt-6 rounded-xl border border-gold/20 bg-black/30 p-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Generated URL</p>
          <p className="break-all font-mono text-sm text-white/90">{generatedUrl}</p>
        </div>

        {saveError && (
          <p className="mt-3 text-sm text-red-400">{saveError}</p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-gold/30 bg-gold/10 px-6 py-3 text-sm font-semibold text-gold transition hover:bg-gold/20"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-gold px-6 py-3 text-sm font-bold text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save to History"}
          </button>
        </div>

        {/* Quick presets */}
        <div className="mt-6 border-t border-white/5 pt-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/45">Quick Presets</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "IG Story → Homepage", src: "ig", med: "story", pg: "/" },
              { label: "IG Reel → Apartments", src: "ig", med: "reel", pg: "/apartments" },
              { label: "IG Bio → Contact", src: "ig", med: "bio", pg: "/contact" },
              { label: "FB Post → Offers", src: "fb", med: "post", pg: "/offers" },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setSource(preset.src);
                  setMedium(preset.med);
                  setPage(preset.pg);
                  setCustomPath("");
                }}
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/65 transition hover:border-gold/40 hover:text-white"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Saved links history */}
      <div className="rounded-xl border border-white/5 bg-[#222] p-6">
        <h3 className="text-gold font-semibold">Saved UTM Links</h3>
        <p className="mt-1 text-sm text-white/55">All generated links saved to Supabase for reference.</p>

        {loadingLinks ? (
          <p className="mt-4 text-sm text-white/40">Loading saved links…</p>
        ) : savedLinks.length === 0 ? (
          <div className="mt-4 rounded-lg border border-white/10 bg-black/10 p-5 text-sm text-white/45">
            No UTM links saved yet. Generate and save one above.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-gold/80">
                  <th className="pb-3 pr-4 font-medium">Name / Label</th>
                  <th className="pb-3 pr-4 font-medium">Source</th>
                  <th className="pb-3 pr-4 font-medium">Medium</th>
                  <th className="pb-3 pr-4 font-medium">Campaign</th>
                  <th className="pb-3 pr-4 font-medium">Created</th>
                  <th className="pb-3 font-medium">Link</th>
                </tr>
              </thead>
              <tbody>
                {savedLinks.map((link) => (
                  <tr key={link.id} className="border-b border-white/5 text-white/80">
                    <td className="py-3 pr-4 font-medium text-white">{link.name}</td>
                    <td className="py-3 pr-4 text-white/65">{link.utm_source}</td>
                    <td className="py-3 pr-4 text-white/65">{link.utm_medium}</td>
                    <td className="py-3 pr-4 text-white/65">{link.utm_campaign}</td>
                    <td className="py-3 pr-4 text-xs text-white/40">
                      {new Date(link.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => handleCopyRow(link.full_url, link.id)}
                        className="rounded border border-white/10 px-3 py-1 text-xs text-white/65 transition hover:border-gold/40 hover:text-white"
                      >
                        {copiedRow === link.id ? "Copied!" : "Copy"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Supabase setup note */}
        <details className="mt-6">
          <summary className="cursor-pointer text-xs text-white/30 hover:text-white/55">
            First time? Run this SQL in Supabase to enable saving →
          </summary>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-4 text-xs text-green-400">{`CREATE TABLE IF NOT EXISTS utm_links (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  name        text,
  base_url    text NOT NULL,
  utm_source  text,
  utm_medium  text,
  utm_campaign text,
  utm_content text,
  utm_term    text,
  full_url    text NOT NULL
);

-- Enable RLS (service role key bypasses this)
ALTER TABLE utm_links ENABLE ROW LEVEL SECURITY;`}</pre>
        </details>
      </div>

      {/* Tracking guide */}
      <div className="rounded-xl border border-gold/10 bg-gold/5 p-6">
        <h3 className="font-semibold text-gold">How tracking works end-to-end</h3>
        <ul className="mt-4 space-y-2 text-sm text-white/70">
          <li className="flex gap-3"><span className="text-gold font-bold">1.</span> Paste the UTM link in your Instagram story, bio, reel caption, or Meta Ad.</li>
          <li className="flex gap-3"><span className="text-gold font-bold">2.</span> When someone clicks, UTM params are captured instantly in <code className="text-gold/80">localStorage</code> and stored in Supabase <code className="text-gold/80">traffic_events</code>.</li>
          <li className="flex gap-3"><span className="text-gold font-bold">3.</span> If they fill the contact form, the UTMs attach to their lead record in <code className="text-gold/80">leads</code> — so you know which campaign converted them.</li>
          <li className="flex gap-3"><span className="text-gold font-bold">4.</span> GA4 receives the same data and shows it in the Marketing tab above under Source Attribution.</li>
          <li className="flex gap-3"><span className="text-gold font-bold">5.</span> Use the <strong className="text-white/90">campaign name</strong> consistently across posts so GA4 groups them correctly.</li>
        </ul>
      </div>
    </div>
  );
}
