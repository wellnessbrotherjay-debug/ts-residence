# UTM Link Builder Implementation Guide

**Date:** May 15, 2026  
**Built For:** TS Residence (https://www.tsresidence.id)  
**Replicable For:** No1 Wellness & other Next.js projects

---

## Executive Summary

A complete **UTM Link Builder system** for managing marketing campaign tracking. Features:
- ✅ Generate trackable UTM links with one click
- ✅ Save campaign history to Supabase
- ✅ View real-time campaign performance (visits, clicks, leads)
- ✅ Separate marketing team access (password-gated)
- ✅ Admin dashboard integration
- ✅ GA4 + Supabase event tracking

**Time to implement:** 2-3 hours  
**Dependencies:** Next.js 16+, React 19, Supabase, TypeScript

---

## Architecture Overview

```
UTM Builder System
├── Database Layer (Supabase)
│   ├── generated_tracking_links (UTM history)
│   └── traffic_events (campaign analytics)
├── Authentication Layer
│   ├── Admin Auth (existing)
│   ├── Marketing Auth (new)
│   └── Shared UTM Access (both)
├── API Routes
│   ├── /api/admin/utm-links (CRUD)
│   ├── /api/admin/generated-links-performance (analytics)
│   ├── /api/marketing/login (password check)
│   └── /api/marketing/session (auth status)
├── Frontend Pages
│   ├── /admin (admin dashboard)
│   ├── /marketing/utm (marketing-only portal)
│   └── UtmBuilder component (shared)
└── Environment Config
    └── MARKETING_PASSWORD env variable
```

---

## Step-by-Step Implementation

### 1. Database Schema

**Create this table in Supabase SQL Editor:**

```sql
CREATE TABLE IF NOT EXISTS public.generated_tracking_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    brand TEXT NOT NULL,
    campaign_name TEXT NOT NULL,
    note_title TEXT NOT NULL,
    generated_url TEXT NOT NULL,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    created_by TEXT DEFAULT 'team',
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_generated_links_campaign ON public.generated_tracking_links(campaign_name);
CREATE INDEX IF NOT EXISTS idx_generated_links_brand ON public.generated_tracking_links(brand);

ALTER TABLE public.generated_tracking_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role admin access" ON public.generated_tracking_links
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

**Required supporting tables (should exist):**
- `traffic_events` (id, campaign, event_type, created_at, ...)
- `leads` (id, first_campaign, created_at, ...)

---

### 2. Authentication System

#### A. Marketing Auth Library
**File:** `src/lib/marketing-auth.ts`

```typescript
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const MARKETING_SESSION_COOKIE = "ts_marketing_session";
const MARKETING_SESSION_MAX_AGE = 60 * 60 * 12;

function normalizeSecret(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function getMarketingPassword() {
  return (
    normalizeSecret(process.env.MARKETING_PASSWORD) ||
    normalizeSecret(process.env.TS_MARKETING_PASSWORD) ||
    null
  );
}

function getMarketingSessionSecret() {
  return (
    normalizeSecret(process.env.MARKETING_SESSION_SECRET) ||
    normalizeSecret(process.env.ADMIN_SESSION_SECRET) ||
    normalizeSecret(process.env.MARKETING_PASSWORD) ||
    normalizeSecret(process.env.TS_MARKETING_PASSWORD) ||
    normalizeSecret(process.env.ADMIN_PASSWORD) ||
    normalizeSecret(process.env.TS_ADMIN_PASSWORD) ||
    null
  );
}

function signMarketingSession(payload: string) {
  const secret = getMarketingSessionSecret();
  if (!secret) {
    return null;
  }

  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function isConfiguredMarketingPassword(password: string) {
  const configuredPassword = getMarketingPassword();
  return Boolean(configuredPassword && password.trim() === configuredPassword);
}

export function isMarketingPasswordConfigured() {
  return Boolean(getMarketingPassword());
}

export function createMarketingSessionValue() {
  const payload = String(Date.now());
  const signature = signMarketingSession(payload);

  if (!signature) {
    return null;
  }

  return `${payload}.${signature}`;
}

export async function setMarketingSessionCookie() {
  const sessionValue = createMarketingSessionValue();
  if (!sessionValue) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(MARKETING_SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MARKETING_SESSION_MAX_AGE,
  });

  return true;
}

export async function clearMarketingSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(MARKETING_SESSION_COOKIE);
}

export async function isMarketingAuthenticated() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(MARKETING_SESSION_COOKIE)?.value;
  if (!cookieValue) {
    return false;
  }

  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) {
    return false;
  }

  const expectedSignature = signMarketingSession(payload);
  if (!expectedSignature) {
    return false;
  }

  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function requireMarketingRequest() {
  const authenticated = await isMarketingAuthenticated();
  if (!authenticated) {
    throw new Error("UNAUTHORIZED_MARKETING_REQUEST");
  }
}
```

#### B. Shared UTM Access
**File:** `src/lib/utm-auth.ts`

```typescript
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isMarketingAuthenticated } from "@/lib/marketing-auth";

export async function isUtmBuilderAuthenticated() {
  const [adminAuthenticated, marketingAuthenticated] = await Promise.all([
    isAdminAuthenticated(),
    isMarketingAuthenticated(),
  ]);

  return adminAuthenticated || marketingAuthenticated;
}

export async function requireUtmBuilderRequest() {
  const authenticated = await isUtmBuilderAuthenticated();
  if (!authenticated) {
    throw new Error("UNAUTHORIZED_UTM_REQUEST");
  }
}
```

---

### 3. API Routes

#### A. Marketing Login
**File:** `src/app/api/marketing/login/route.ts`

```typescript
import { NextResponse } from "next/server";
import {
  isConfiguredMarketingPassword,
  isMarketingPasswordConfigured,
  setMarketingSessionCookie,
} from "@/lib/marketing-auth";

export async function POST(request: Request) {
  try {
    if (!isMarketingPasswordConfigured()) {
      return NextResponse.json(
        { error: "Marketing password is not configured on the server" },
        { status: 500 },
      );
    }

    const { password } = await request.json();
    if (!password || !isConfiguredMarketingPassword(password)) {
      return NextResponse.json(
        { error: "Invalid marketing password" },
        { status: 401 },
      );
    }

    const sessionSet = await setMarketingSessionCookie();
    if (!sessionSet) {
      return NextResponse.json(
        { error: "Marketing auth is not configured on the server" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
```

#### B. Marketing Session Status
**File:** `src/app/api/marketing/session/route.ts`

```typescript
import { NextResponse } from "next/server";
import {
  clearMarketingSessionCookie,
  isMarketingAuthenticated,
} from "@/lib/marketing-auth";

export async function GET() {
  const authenticated = await isMarketingAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function DELETE() {
  await clearMarketingSessionCookie();
  return NextResponse.json({ success: true });
}
```

#### C. UTM Links CRUD
**File:** `src/app/api/admin/utm-links/route.ts`

```typescript
import { NextResponse } from "next/server";
import { requireUtmBuilderRequest } from "@/lib/utm-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

function getErrorMessage(err: unknown) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;

  if (typeof err === "object") {
    const maybe = err as {
      message?: unknown;
      details?: unknown;
      hint?: unknown;
      code?: unknown;
    };

    const parts = [
      typeof maybe.message === "string" ? maybe.message : null,
      typeof maybe.details === "string" ? maybe.details : null,
      typeof maybe.hint === "string" ? `Hint: ${maybe.hint}` : null,
      typeof maybe.code === "string" ? `Code: ${maybe.code}` : null,
    ].filter(Boolean);

    if (parts.length > 0) {
      return parts.join(" | ");
    }
  }

  return "Unexpected server error";
}

export async function GET(request: Request) {
  try {
    await requireUtmBuilderRequest();

    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand") || "ts-residence";

    const { data, error } = await supabaseAdmin
      .from("generated_tracking_links")
      .select("*")
      .eq("brand", brand)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      if (String(error.code) === "42P01") {
        return NextResponse.json([]);
      }
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_UTM_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("utm-links GET error", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    await requireUtmBuilderRequest();

    const body = await request.json();
    const { name, utm_source, utm_medium, utm_campaign, utm_content, utm_term, full_url, brand = "ts-residence" } = body;

    if (!full_url) {
      return NextResponse.json({ error: "full_url is required" }, { status: 400 });
    }

    const noteTitle = name || `${utm_source} / ${utm_medium} — ${utm_campaign}`;
    const campaignName = utm_campaign || "unknown";

    const { data, error } = await supabaseAdmin
      .from("generated_tracking_links")
      .insert([{
        brand,
        campaign_name: campaignName,
        note_title: noteTitle,
        generated_url: full_url,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content: utm_content || null,
        utm_term: utm_term || null,
        created_by: "admin-utm-builder",
        is_active: true
      }])
      .select("*")
      .single();

    if (error) {
      if (String(error.code) === "42P01") {
        return NextResponse.json(
          { error: "generated_tracking_links table not found. Create it in Supabase SQL Editor first." },
          { status: 503 },
        );
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_UTM_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("utm-links POST error", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
```

#### D. Campaign Performance Analytics
**File:** `src/app/api/admin/generated-links-performance/route.ts`

```typescript
import { NextResponse } from "next/server";
import { requireUtmBuilderRequest } from "@/lib/utm-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  try {
    await requireUtmBuilderRequest();

    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand") || "ts-residence";

    const { data: links, error: linksError } = await supabaseAdmin
      .from("generated_tracking_links")
      .select("*")
      .eq("brand", brand)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (linksError) throw linksError;

    if (!links || links.length === 0) {
      return NextResponse.json([]);
    }

    const performance = await Promise.all(
      links.map(async (link) => {
        const { count: totalVisits } = await supabaseAdmin
          .from("traffic_events")
          .select("*", { count: "exact", head: true })
          .eq("campaign", link.utm_campaign);

        const { count: ctaClicks } = await supabaseAdmin
          .from("traffic_events")
          .select("*", { count: "exact", head: true })
          .eq("campaign", link.utm_campaign)
          .eq("event_type", "booking_intent");

        const { count: leadsGenerated } = await supabaseAdmin
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("first_campaign", link.utm_campaign);

        return {
          id: link.id,
          created_at: link.created_at,
          campaign_name: link.campaign_name,
          note_title: link.note_title,
          utm_campaign: link.utm_campaign,
          utm_source: link.utm_source,
          utm_medium: link.utm_medium,
          generated_url: link.generated_url,
          total_visits: totalVisits || 0,
          cta_clicks: ctaClicks || 0,
          leads_generated: leadsGenerated || 0,
          conversion_rate: totalVisits ? ((ctaClicks || 0) / totalVisits * 100).toFixed(2) + "%" : "0%",
        };
      })
    );

    const sorted = performance.sort((a, b) => b.total_visits - a.total_visits);

    return NextResponse.json(sorted);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_UTM_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("generated-links-performance error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
```

---

### 4. Frontend Components

#### A. UTM Builder Component (Shared)
**File:** `src/app/admin/UtmBuilder.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import GeneratedLinksPerformance from "./GeneratedLinksPerformance";

const BASE_URL = "https://www.tsresidence.id"; // Change to your domain

const PAGES = [
  { label: "Homepage", path: "/" },
  { label: "Apartments", path: "/apartments" },
  { label: "SOLO Apartment", path: "/apartments/solo" },
  { label: "STUDIO Apartment", path: "/apartments/studio" },
  { label: "SOHO Apartment", path: "/apartments/soho" },
  { label: "Offers & Promotions", path: "/offers" },
  { label: "Contact Us", path: "/contact" },
  { label: "Gallery", path: "/gallery" },
];

const SOURCE_OPTIONS = [
  { value: "ig", label: "Instagram" },
  { value: "fb", label: "Facebook" },
  { value: "google", label: "Google" },
  { value: "tiktok", label: "TikTok" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
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
  note_title: string;
  generated_url: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
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
        setSaveError(toReadableError(payload?.error ?? payload));
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
          Generate trackable links for campaigns. Every visit is recorded in GA4 and Supabase.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {/* Page Selection */}
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
              placeholder="e.g. may_promo"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/50"
            />
            <p className="mt-1 text-xs text-white/30">Use lowercase, underscores, no spaces</p>
          </div>

          {/* Content (optional) */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Content <span className="text-white/30 normal-case font-normal">(optional)</span></p>
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. reels_pool_v1"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/50"
            />
          </div>

          {/* Term (optional) */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold/80">Term <span className="text-white/30 normal-case font-normal">(optional)</span></p>
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="e.g. digital_nomad_lookalike"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/50"
            />
          </div>

          {/* Label */}
          <div className="xl:col-span-3">
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
      </div>

      {/* Saved Links */}
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
                    <td className="py-3 pr-4 font-medium text-white">{link.note_title}</td>
                    <td className="py-3 pr-4 text-white/65">{link.utm_source}</td>
                    <td className="py-3 pr-4 text-white/65">{link.utm_medium}</td>
                    <td className="py-3 pr-4 text-white/65">{link.utm_campaign}</td>
                    <td className="py-3 pr-4 text-xs text-white/40">
                      {new Date(link.created_at).toLocaleDateString()}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Performance Dashboard */}
      <div className="rounded-xl border border-emerald-500/10 bg-emerald-950/5 p-6">
        <h3 className="text-emerald-400 font-semibold">Campaign Performance</h3>
        <p className="mt-1 text-sm text-white/55">Real-time traffic, clicks, and lead conversion for each generated link.</p>
        <div className="mt-6">
          <GeneratedLinksPerformance brand="ts-residence" />
        </div>
      </div>
    </div>
  );
}
```

#### B. Marketing Portal Page
**File:** `src/app/marketing/utm/page.tsx`

```typescript
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
              Access Marketing Portal
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold/80">TS Residence</p>
            <h1 className="mt-2 text-3xl font-semibold text-gold">Marketing UTM Portal</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/20 px-6 py-2 text-sm text-white/75 transition hover:border-white/40"
          >
            Logout
          </button>
        </div>

        <UtmBuilder />
      </div>
    </main>
  );
}
```

---

### 5. Environment Variables

**Add to `.env.local` and Vercel:**

```env
# Marketing Team Access
MARKETING_PASSWORD=your_secure_password_here
TS_MARKETING_PASSWORD=your_secure_password_here  # Fallback

# Existing Admin Auth
ADMIN_PASSWORD=your_admin_password
TS_ADMIN_PASSWORD=your_admin_password

# Existing Session Secrets
ADMIN_SESSION_SECRET=your_session_secret
MARKETING_SESSION_SECRET=your_marketing_session_secret

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

### 6. File Structure Summary

```
src/
├── lib/
│   ├── marketing-auth.ts          [NEW]
│   ├── utm-auth.ts                [NEW]
│   ├── admin-auth.ts              (existing)
│   ├── supabase-admin.ts          (existing)
│   └── ...
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── utm-links/
│   │   │   │   └── route.ts       [MODIFIED]
│   │   │   └── generated-links-performance/
│   │   │       └── route.ts       [MODIFIED]
│   │   └── marketing/
│   │       ├── login/
│   │       │   └── route.ts       [NEW]
│   │       └── session/
│   │           └── route.ts       [NEW]
│   ├── admin/
│   │   ├── UtmBuilder.tsx         [MODIFIED]
│   │   └── GeneratedLinksPerformance.tsx (existing)
│   ├── marketing/
│   │   └── utm/
│   │       └── page.tsx           [NEW]
│   └── ...
└── ...
```

---

## Implementation Checklist for No1 Wellness

- [ ] 1. Copy database schema SQL and run in Supabase
- [ ] 2. Create `src/lib/marketing-auth.ts`
- [ ] 3. Create `src/lib/utm-auth.ts`
- [ ] 4. Create `src/app/api/marketing/login/route.ts`
- [ ] 5. Create `src/app/api/marketing/session/route.ts`
- [ ] 6. Modify `src/app/api/admin/utm-links/route.ts` (use `.select("*")` instead of aliases)
- [ ] 7. Modify `src/app/api/admin/generated-links-performance/route.ts`
- [ ] 8. Update `src/app/admin/UtmBuilder.tsx` (change BASE_URL, update column names)
- [ ] 9. Create `src/app/marketing/utm/page.tsx`
- [ ] 10. Add environment variables to `.env.local` and Vercel
- [ ] 11. Test locally: `npm run dev` → visit `/marketing/utm`
- [ ] 12. Build: `pnpm build` (should pass with 0 errors)
- [ ] 13. Deploy to production
- [ ] 14. Test with marketing password on production

---

## Testing Guide

### Local Testing
```bash
# 1. Start dev server
npm run dev

# 2. Visit admin dashboard
# http://localhost:3000/admin

# 3. Visit marketing portal
# http://localhost:3000/marketing/utm

# 4. Try generating a UTM link
# Source: Instagram
# Medium: Story
# Campaign: test_may
# → Should see URL generated and "Save to History" button

# 5. Save link
# Should appear in table below immediately

# 6. Check Supabase
# Supabase → Tables → generated_tracking_links
# Should see new row with your UTM parameters
```

### Production Testing
```bash
# 1. Deploy to Vercel
vercel --prod

# 2. Test marketing login at /marketing/utm
# Should prompt for password

# 3. Generate link and save
# Should persist in Supabase

# 4. Check performance dashboard
# Should show 0 visits initially (no traffic yet)
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "generated_tracking_links table not found" | Run SQL schema in Supabase SQL Editor |
| "column generated_urlasfull_url does not exist" | Use `select("*")` instead of aliased columns |
| "Invalid marketing password" | Check MARKETING_PASSWORD env var is set in Vercel |
| "Marketing UTM page blank" | Check `/api/marketing/session` endpoint returns `{"authenticated": false/true}` |
| Build errors on UtmBuilder | Make sure `BASE_URL` matches your domain |

---

## Key Differences for No1 Wellness

When implementing for No1 Wellness, change:

1. **Domain:** Replace `https://www.tsresidence.id` with `https://www1wellness.com` (or your domain)
2. **Brand:** Change default brand from `"ts-residence"` to `"no1-wellness"` in API routes
3. **Pages:** Update PAGES array in UtmBuilder with your site's actual pages
4. **Colors:** Adapt gold/emerald theme to No1 Wellness brand colors
5. **Brand Name:** Update text from "TS Residence" to "No1 Wellness"
6. **Password:** Use a different marketing password (not the same as TS Residence)

---

## Performance & Scale Notes

- ✅ Query performance: Indexed on `brand` and `campaign_name`
- ✅ Concurrent saves: RLS policy allows multiple simultaneous inserts
- ✅ Historical growth: No pagination needed for first 1000+ links
- ⚠️  If exceeding 10k links: Add pagination to SavedLinks table
- ⚠️  Campaign performance API: Use caching if traffic events > 100k

---

## Security Notes

- ✅ Session secrets are HMAC-signed
- ✅ Passwords stored only in env (never in code)
- ✅ HTTP-only cookies (XSS-safe)
- ✅ RLS enabled on table
- ⚠️  Consider rate-limiting login attempts (not implemented yet)
- ⚠️  Consider rotating passwords quarterly

---

## Support & Questions

For questions on implementation:
1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Check Supabase logs for database errors
4. Verify your domain/BASE_URL matches deployed site

---

**Created:** May 15, 2026  
**For:** TS Residence UTM Builder System  
**Ready to copy-paste:** ✅
