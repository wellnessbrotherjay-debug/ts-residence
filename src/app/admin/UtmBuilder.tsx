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
  created_by: string;
  note_title: string;
  generated_url: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content?: string | null;
  utm_term?: string | null;
}

interface UtmOpenEvent {
  id: string;
  created_at: string;
  page: string | null;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  term: string | null;
  session_id: string | null;
  visitor_id: string | null;
  referrer: string | null;
  metadata?: Record<string, unknown> | null;
}

interface UtmBuilderProps {
  forcedCreatedBy?: string;
  showProfileManager?: boolean;
}

interface MarketingUserProfile {
  id: string;
  username: string;
  display_name: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

function toReadableError(value: unknown): string {
  if (!value) return "Could not save. Check Supabase schema below.";
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.message;
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.error === "string") return record.error;
    if (typeof record.message === "string") return record.message;
    try {
      return JSON.stringify(value);
    } catch {
      return "Unexpected server response";
    }
  }
  return String(value);
}

function csvCell(value: unknown): string {
  const str = value == null ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export default function UtmBuilder({ forcedCreatedBy, showProfileManager = true }: UtmBuilderProps) {
  const [page, setPage] = useState("/");
  const [customPath, setCustomPath] = useState("");
  const [source, setSource] = useState("ig");
  const [medium, setMedium] = useState("story");
  const [campaign, setCampaign] = useState("");
  const [content, setContent] = useState("");
  const [term, setTerm] = useState("");
  const [name, setName] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");

  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedLinks, setSavedLinks] = useState<SavedLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copiedRow, setCopiedRow] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<SavedLink | null>(null);
  const [openEvents, setOpenEvents] = useState<UtmOpenEvent[]>([]);
  const [loadingOpenEvents, setLoadingOpenEvents] = useState(false);
  const [openEventsError, setOpenEventsError] = useState<string | null>(null);
  const [filterCreatedBy, setFilterCreatedBy] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [filterMedium, setFilterMedium] = useState("");
  const [filterCampaign, setFilterCampaign] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [profiles, setProfiles] = useState<MarketingUserProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(showProfileManager);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("");
  const [profileUsername, setProfileUsername] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [profileUpdateId, setProfileUpdateId] = useState<string | null>(null);
  const [resetPasswordId, setResetPasswordId] = useState<string | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [lastCreatedCredential, setLastCreatedCredential] = useState<{
    link: string;
    username: string;
    password: string;
    displayName: string;
  } | null>(null);
  const resolvedCreatedBy = forcedCreatedBy?.trim() || createdBy;

  interface LinkFilters {
    createdBy: string;
    source: string;
    medium: string;
    campaign: string;
    search: string;
    from: string;
    to: string;
  }

  const currentFilters: LinkFilters = {
    createdBy: filterCreatedBy,
    source: filterSource,
    medium: filterMedium,
    campaign: filterCampaign,
    search: filterSearch,
    from: filterFrom,
    to: filterTo,
  };

  // Build the UTM URL candidate; it is only persisted when Generate + Log is clicked.
  const finalPath = customPath.trim() || page;
  const params = new URLSearchParams();
  if (source) params.set("utm_source", source.trim());
  if (medium) params.set("utm_medium", medium.trim());
  if (campaign.trim()) params.set("utm_campaign", campaign.trim());
  if (content.trim()) params.set("utm_content", content.trim());
  if (term.trim()) params.set("utm_term", term.trim());
  const candidateUrl = `${BASE_URL}${finalPath}?${params.toString()}`;

  const loadSavedLinks = async (filters?: Partial<LinkFilters>) => {
    const resolvedFilters: LinkFilters = {
      ...currentFilters,
      ...(filters || {}),
    };

    const params = new URLSearchParams();
    params.set("limit", "1000");
    if (resolvedFilters.createdBy.trim()) params.set("createdBy", resolvedFilters.createdBy.trim());
    if (resolvedFilters.source.trim()) params.set("source", resolvedFilters.source.trim());
    if (resolvedFilters.medium.trim()) params.set("medium", resolvedFilters.medium.trim());
    if (resolvedFilters.campaign.trim()) params.set("campaign", resolvedFilters.campaign.trim());
    if (resolvedFilters.search.trim()) params.set("search", resolvedFilters.search.trim());
    if (resolvedFilters.from) params.set("from", resolvedFilters.from);
    if (resolvedFilters.to) params.set("to", resolvedFilters.to);

    setLoadingLinks(true);
    try {
      const response = await fetch(`/api/admin/utm-links?${params.toString()}`, {
        credentials: "same-origin",
      });

      if (!response.ok) {
        setSavedLinks([]);
        return;
      }

      const data = (await response.json()) as SavedLink[];
      setSavedLinks(Array.isArray(data) ? data : []);
    } catch {
      setSavedLinks([]);
    } finally {
      setLoadingLinks(false);
    }
  };

  useEffect(() => {
    fetch("/api/admin/utm-links?limit=1000", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: SavedLink[]) => setSavedLinks(Array.isArray(data) ? data : []))
      .catch(() => setSavedLinks([]))
      .finally(() => setLoadingLinks(false));
  }, []);

  useEffect(() => {
    if (!showProfileManager) {
      return;
    }

    fetch("/api/admin/marketing-users", { credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(toReadableError(payload?.error ?? payload));
        }

        return (await response.json()) as MarketingUserProfile[];
      })
      .then((data) => {
        setProfiles(Array.isArray(data) ? data : []);
      })
      .catch((error: unknown) => {
        setProfileError(toReadableError(error));
        setProfiles([]);
      })
      .finally(() => {
        setLoadingProfiles(false);
      });
  }, [showProfileManager]);

  const invalidateGeneratedUrl = () => {
    if (generatedUrl) {
      setGeneratedUrl("");
    }
  };

  const handleCopy = async () => {
    if (!generatedUrl) {
      setSaveError("Generate and log the link first before copying.");
      return;
    }
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyRow = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedRow(id);
    setTimeout(() => setCopiedRow(null), 2000);
  };

  const handleGenerateAndLog = async () => {
    if (!resolvedCreatedBy.trim()) {
      setSaveError("Team member name is required before generating.");
      return;
    }

    if (!campaign.trim()) {
      setSaveError("Campaign name is required before generating.");
      return;
    }

    if (!source.trim() || !medium.trim()) {
      setSaveError("Source and medium are required before generating.");
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
          full_url: candidateUrl,
          created_by: resolvedCreatedBy.trim(),
        }),
      });
      if (res.ok) {
        const saved = (await res.json()) as SavedLink;
        setGeneratedUrl(saved.generated_url);
        await loadSavedLinks();
        setName("");
      } else {
        const payload = await res.json().catch(() => null);
        setSaveError(toReadableError(payload?.error ?? payload));
      }
    } catch {
      setSaveError("Network error saving UTM link.");
    } finally {
      setSaving(false);
    }
  };

  const handleShowOpenHistory = async (link: SavedLink) => {
    setSelectedLink(link);
    setLoadingOpenEvents(true);
    setOpenEventsError(null);

    try {
      const response = await fetch(`/api/admin/utm-link-opens?linkId=${encodeURIComponent(link.id)}`, {
        credentials: "same-origin",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setOpenEventsError(toReadableError(payload?.error ?? payload));
        setOpenEvents([]);
        return;
      }

      const payload = (await response.json()) as { opens: UtmOpenEvent[] };
      setOpenEvents(Array.isArray(payload.opens) ? payload.opens : []);
    } catch {
      setOpenEventsError("Network error loading open history.");
      setOpenEvents([]);
    } finally {
      setLoadingOpenEvents(false);
    }
  };

  const handleExportCsv = () => {
    if (savedLinks.length === 0) {
      setSaveError("No rows to export. Apply filters or generate links first.");
      return;
    }

    const headers = [
      "id",
      "created_at",
      "created_by",
      "note_title",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "generated_url",
    ];

    const rows = savedLinks.map((link) => [
      link.id,
      link.created_at,
      link.created_by,
      link.note_title,
      link.utm_source,
      link.utm_medium,
      link.utm_campaign,
      link.utm_content || "",
      link.utm_term || "",
      link.generated_url,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => csvCell(cell)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    a.href = url;
    a.download = `utm-history-${ts}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCreateProfile = async () => {
    if (!profileUsername.trim()) {
      setProfileError("Username is required.");
      return;
    }

    if (!profilePassword.trim() || profilePassword.trim().length < 6) {
      setProfileError("Password must be at least 6 characters.");
      return;
    }

    setCreatingProfile(true);
    setProfileError(null);

    try {
      const response = await fetch("/api/admin/marketing-users", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: profileName.trim(),
          username: profileUsername.trim(),
          password: profilePassword,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setProfileError(toReadableError(payload?.error ?? payload));
        return;
      }

      const created = (await response.json()) as MarketingUserProfile;
      setProfiles((prev) => [created, ...prev]);
      setLastCreatedCredential({
        link: `${window.location.origin}/marketing/utm`,
        username: created.username,
        password: profilePassword,
        displayName: created.display_name,
      });
      setProfileName("");
      setProfileUsername("");
      setProfilePassword("");
    } catch {
      setProfileError("Network error creating profile.");
    } finally {
      setCreatingProfile(false);
    }
  };

  const handleToggleProfileActive = async (profile: MarketingUserProfile) => {
    setProfileUpdateId(profile.id);
    setProfileError(null);

    try {
      const response = await fetch(`/api/admin/marketing-users/${profile.id}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !profile.is_active }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setProfileError(toReadableError(payload?.error ?? payload));
        return;
      }

      const updated = (await response.json()) as MarketingUserProfile;
      setProfiles((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch {
      setProfileError("Network error updating profile.");
    } finally {
      setProfileUpdateId(null);
    }
  };

  const handleResetPassword = async (profile: MarketingUserProfile) => {
    if (!resetPasswordValue.trim() || resetPasswordValue.trim().length < 6) {
      setProfileError("New password must be at least 6 characters.");
      return;
    }

    setProfileUpdateId(profile.id);
    setProfileError(null);

    try {
      const response = await fetch(`/api/admin/marketing-users/${profile.id}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: resetPasswordValue }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setProfileError(toReadableError(payload?.error ?? payload));
        return;
      }

      const updated = (await response.json()) as MarketingUserProfile;
      setProfiles((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setLastCreatedCredential({
        link: `${window.location.origin}/marketing/utm`,
        username: updated.username,
        password: resetPasswordValue,
        displayName: updated.display_name,
      });
      setResetPasswordId(null);
      setResetPasswordValue("");
    } catch {
      setProfileError("Network error resetting password.");
    } finally {
      setProfileUpdateId(null);
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
                onChange={(e) => { setPage(e.target.value); setCustomPath(""); invalidateGeneratedUrl(); }}
                className="flex-1 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-gold/50"
              >
                {PAGES.map((p) => (
                  <option key={p.path} value={p.path}>{p.label}</option>
                ))}
              </select>
              <input
                value={customPath}
                onChange={(e) => { setCustomPath(e.target.value); invalidateGeneratedUrl(); }}
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
              onChange={(e) => { setSource(e.target.value); invalidateGeneratedUrl(); }}
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
              onChange={(e) => { setMedium(e.target.value); invalidateGeneratedUrl(); }}
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
              onChange={(e) => { setCampaign(e.target.value); invalidateGeneratedUrl(); }}
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
              onChange={(e) => { setContent(e.target.value); invalidateGeneratedUrl(); }}
              placeholder="e.g. reels_pool_v1"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/50"
            />
          </div>

          {/* Term */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Audience / Term <span className="text-white/30 normal-case font-normal">(optional)</span></p>
            <input
              value={term}
              onChange={(e) => { setTerm(e.target.value); invalidateGeneratedUrl(); }}
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

          {/* Created by */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Team Member *</p>
            <input
              value={resolvedCreatedBy}
              onChange={(e) => {
                if (!forcedCreatedBy) {
                  setCreatedBy(e.target.value);
                  invalidateGeneratedUrl();
                }
              }}
              placeholder="e.g. Jayden"
              readOnly={Boolean(forcedCreatedBy)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/50"
            />
            {forcedCreatedBy ? (
              <p className="mt-1 text-xs text-white/35">Auto-filled from logged-in marketing profile.</p>
            ) : null}
          </div>
        </div>

        {/* Generated URL */}
        <div className="mt-6 rounded-xl border border-gold/20 bg-black/30 p-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Generated URL (after required logging)</p>
          {generatedUrl ? (
            <p className="break-all font-mono text-sm text-white/90">{generatedUrl}</p>
          ) : (
            <p className="text-sm text-white/45">
              Enter team member and campaign, then click Generate + Log.
            </p>
          )}
        </div>

        {saveError && (
          <p className="mt-3 text-sm text-red-400">{saveError}</p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!generatedUrl}
            className="rounded-lg border border-gold/30 bg-gold/10 px-6 py-3 text-sm font-semibold text-gold transition hover:bg-gold/20"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            type="button"
            onClick={handleGenerateAndLog}
            disabled={saving}
            className="rounded-lg bg-gold px-6 py-3 text-sm font-bold text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Generating..." : "Generate + Log"}
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
                  invalidateGeneratedUrl();
                }}
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/65 transition hover:border-gold/40 hover:text-white"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showProfileManager ? (
        <div className="rounded-xl border border-white/5 bg-[#222] p-6">
          <h3 className="text-gold font-semibold">Marketing User Profiles</h3>
          <p className="mt-1 text-sm text-white/55">Create username + password profiles for each team member. Login link is shared with the credentials below.</p>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Display name (e.g. Antony)"
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-gold/50"
            />
            <input
              value={profileUsername}
              onChange={(e) => setProfileUsername(e.target.value)}
              placeholder="Username (e.g. antony)"
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-gold/50"
            />
            <input
              type="password"
              value={profilePassword}
              onChange={(e) => setProfilePassword(e.target.value)}
              placeholder="Password"
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-gold/50"
            />
            <button
              type="button"
              onClick={handleCreateProfile}
              disabled={creatingProfile}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {creatingProfile ? "Creating..." : "Create Profile"}
            </button>
          </div>

          {profileError ? <p className="mt-3 text-sm text-red-400">{profileError}</p> : null}

          {lastCreatedCredential ? (
            <div className="mt-4 rounded-lg border border-gold/20 bg-black/30 p-4 text-sm text-white/80">
              <p className="text-gold/85 font-semibold">Share These Details</p>
              <p className="mt-2">Link: {lastCreatedCredential.link}</p>
              <p>Display Name: {lastCreatedCredential.displayName}</p>
              <p>Username: {lastCreatedCredential.username}</p>
              <p>Password: {lastCreatedCredential.password}</p>
            </div>
          ) : null}

          <div className="mt-5 overflow-x-auto">
            {loadingProfiles ? (
              <p className="text-sm text-white/45">Loading profiles...</p>
            ) : profiles.length === 0 ? (
              <p className="text-sm text-white/45">No marketing profiles yet.</p>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-gold/75">
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Username</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Last Login</th>
                    <th className="pb-3 pr-4 font-medium">Created</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="border-b border-white/5 text-white/80">
                      <td className="py-3 pr-4 text-white">{profile.display_name}</td>
                      <td className="py-3 pr-4">{profile.username}</td>
                      <td className="py-3 pr-4">
                        <span className={profile.is_active ? "text-emerald-400" : "text-white/45"}>
                          {profile.is_active ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-xs text-white/50">
                        {profile.last_login_at ? new Date(profile.last_login_at).toLocaleString() : "Never"}
                      </td>
                      <td className="py-3 pr-4 text-xs text-white/50">
                        {new Date(profile.created_at).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleProfileActive(profile)}
                            disabled={profileUpdateId === profile.id}
                            className="rounded border border-white/15 px-3 py-1 text-xs text-white/75 transition hover:border-white/35 hover:text-white disabled:opacity-50"
                          >
                            {profile.is_active ? "Disable" : "Enable"}
                          </button>
                          {resetPasswordId === profile.id ? (
                            <>
                              <input
                                type="password"
                                value={resetPasswordValue}
                                onChange={(e) => setResetPasswordValue(e.target.value)}
                                placeholder="New password"
                                className="rounded border border-white/15 bg-black/25 px-2 py-1 text-xs text-white outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleResetPassword(profile)}
                                disabled={profileUpdateId === profile.id}
                                className="rounded border border-gold/35 px-3 py-1 text-xs text-gold hover:bg-gold/10 disabled:opacity-50"
                              >
                                Save Password
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setResetPasswordId(null);
                                  setResetPasswordValue("");
                                }}
                                className="rounded border border-white/15 px-3 py-1 text-xs text-white/70"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setResetPasswordId(profile.id);
                                setResetPasswordValue("");
                              }}
                              className="rounded border border-gold/35 px-3 py-1 text-xs text-gold hover:bg-gold/10"
                            >
                              Reset Password
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <details className="mt-5">
            <summary className="cursor-pointer text-xs text-white/35 hover:text-white/60">First time? SQL for profile tables</summary>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-4 text-xs text-green-400">{`CREATE TABLE IF NOT EXISTS marketing_user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  password_hash text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS marketing_auth_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  success boolean NOT NULL,
  method text,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);`}</pre>
          </details>
        </div>
      ) : null}

      {/* Saved links history */}
      <div className="rounded-xl border border-white/5 bg-[#222] p-6">
        <h3 className="text-gold font-semibold">Supabase UTM Logs</h3>
        <p className="mt-1 text-sm text-white/55">Every generated link is logged in Supabase with team member and timestamp. Use filters to audit your team activity.</p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Search name, campaign, URL"
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-gold/50"
          />
          <input
            value={filterCreatedBy}
            onChange={(e) => setFilterCreatedBy(e.target.value)}
            placeholder="Filter by team member"
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-gold/50"
          />
          <input
            value={filterCampaign}
            onChange={(e) => setFilterCampaign(e.target.value)}
            placeholder="Filter by campaign"
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-gold/50"
          />
          <div className="flex gap-2">
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
            >
              <option value="">All Sources</option>
              {SOURCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select
              value={filterMedium}
              onChange={(e) => setFilterMedium(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
            >
              <option value="">All Mediums</option>
              {MEDIUM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
          />
          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
          />
          <div className="flex gap-2 xl:col-span-2">
            <button
              type="button"
              onClick={() => { void loadSavedLinks(); }}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="rounded-lg border border-gold/35 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/10"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterCreatedBy("");
                setFilterSource("");
                setFilterMedium("");
                setFilterCampaign("");
                setFilterSearch("");
                setFilterFrom("");
                setFilterTo("");
                void loadSavedLinks({
                  createdBy: "",
                  source: "",
                  medium: "",
                  campaign: "",
                  search: "",
                  from: "",
                  to: "",
                });
              }}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/75 transition hover:border-white/30 hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-white/45">Showing {savedLinks.length} matching UTM logs.</p>

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
                  <th className="pb-3 pr-4 font-medium">Team Member</th>
                  <th className="pb-3 pr-4 font-medium">Source</th>
                  <th className="pb-3 pr-4 font-medium">Medium</th>
                  <th className="pb-3 pr-4 font-medium">Campaign</th>
                  <th className="pb-3 pr-4 font-medium">Created</th>
                  <th className="pb-3 pr-4 font-medium">Link</th>
                  <th className="pb-3 font-medium">Opens</th>
                </tr>
              </thead>
              <tbody>
                {savedLinks.map((link) => (
                  <tr key={link.id} className="border-b border-white/5 text-white/80">
                    <td className="py-3 pr-4 font-medium text-white">{link.note_title}</td>
                    <td className="py-3 pr-4 text-white/65">{link.created_by || "team"}</td>
                    <td className="py-3 pr-4 text-white/65">{link.utm_source}</td>
                    <td className="py-3 pr-4 text-white/65">{link.utm_medium}</td>
                    <td className="py-3 pr-4 text-white/65">{link.utm_campaign}</td>
                    <td className="py-3 pr-4 text-xs text-white/40">
                      {new Date(link.created_at).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => handleCopyRow(link.generated_url, link.id)}
                        className="rounded border border-white/10 px-3 py-1 text-xs text-white/65 transition hover:border-gold/40 hover:text-white"
                      >
                        {copiedRow === link.id ? "Copied!" : "Copy"}
                      </button>
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => handleShowOpenHistory(link)}
                        className="rounded border border-gold/30 px-3 py-1 text-xs text-gold transition hover:bg-gold/10"
                      >
                        View Opens
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedLink ? (
          <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gold/75">Open History</p>
                <p className="text-sm text-white/75">
                  {selectedLink.note_title} ({selectedLink.utm_source} / {selectedLink.utm_medium} / {selectedLink.utm_campaign})
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedLink(null);
                  setOpenEvents([]);
                  setOpenEventsError(null);
                }}
                className="rounded border border-white/15 px-3 py-1 text-xs text-white/65 hover:text-white"
              >
                Close
              </button>
            </div>

            {loadingOpenEvents ? (
              <p className="mt-3 text-sm text-white/45">Loading open events...</p>
            ) : openEventsError ? (
              <p className="mt-3 text-sm text-red-400">{openEventsError}</p>
            ) : openEvents.length === 0 ? (
              <p className="mt-3 text-sm text-white/45">No opens recorded yet for this UTM set.</p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 uppercase tracking-[0.16em] text-white/45">
                      <th className="pb-2 pr-3 font-medium">Time</th>
                      <th className="pb-2 pr-3 font-medium">Page</th>
                      <th className="pb-2 pr-3 font-medium">Visitor</th>
                      <th className="pb-2 pr-3 font-medium">Referrer</th>
                      <th className="pb-2 font-medium">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openEvents.map((event) => {
                      const city = typeof event.metadata?.request_city === "string" ? event.metadata.request_city : "";
                      const country = typeof event.metadata?.request_country === "string" ? event.metadata.request_country : "";
                      const location = city && country ? `${city}, ${country}` : country || city || "Unknown";

                      return (
                        <tr key={event.id} className="border-b border-white/5 text-white/80">
                          <td className="py-2 pr-3">{new Date(event.created_at).toLocaleString()}</td>
                          <td className="py-2 pr-3">{event.page || "-"}</td>
                          <td className="py-2 pr-3">{event.visitor_id || event.session_id || "-"}</td>
                          <td className="py-2 pr-3">{event.referrer || "direct"}</td>
                          <td className="py-2">{location}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}

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
