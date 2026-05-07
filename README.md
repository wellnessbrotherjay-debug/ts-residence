# TS Residence — Website Documentation

> Premium long-stay apartment website for TS Residence, Seminyak, Bali.
> Lives at https://www.tsresidence.id — auto-redeploys from `main` via Vercel.

---

## Overview

TS Residence is a Next.js 16 (App Router) marketing + lead-capture site for TS Residence apartments in Seminyak. It serves three purposes:

1. **Acquisition surface** — public marketing pages for SOLO / STUDIO / SOHO apartments, offers, gallery, wellness, FAQ.
2. **Lead engine** — contact + application forms write to Supabase, send branded confirmation + admin notification emails via Resend, capture UTM/click-ID attribution, and dedupe by email within 24 h.
3. **Internal admin** — password-protected `/admin` dashboard (HMAC-signed cookie auth) showing leads, chat history, marketing pulled live from GA4, a UTM builder, and on-demand / cron-scheduled email reports.

---

## Tech Stack

Pulled directly from `package.json`:

**Runtime / framework**
- Next.js `16.2.1` (App Router, Turbopack)
- React `19.2.4` / React DOM `19.2.4`
- TypeScript `^5`
- Tailwind CSS `^4` (`@tailwindcss/postcss`)
- ESLint `^9` + Prettier `^3.8.1` + `prettier-plugin-tailwindcss` + `eslint-plugin-tailwind-canonical-classes`
- Husky `^9.1.7` + `lint-staged` `^16.4.0`

**Data / backend**
- `@supabase/supabase-js` `^2.103.0` (Postgres, traffic + leads + chat)
- `pg` `^8.20.0` (raw Postgres client, available but not heavily used)
- `resend` `^6.10.0` (transactional email)
- `google-auth-library` `^10.6.2` (GA4 Data API — service account JWT or OAuth refresh-token)

**UI / motion**
- `framer-motion` `^12.38.0` + `motion` `^12.38.0`
- `recharts` `^3.8.1` (admin marketing dashboard)
- `lucide-react` `^0.546.0`
- `yet-another-react-lightbox` `^3.30.1`
- `clsx` `^2.1.1`
- `uuid` `^14.0.0`

**Hosting**
- Vercel (project ref pinned in `.vercel/`; cron jobs configured in `vercel.json`).

---

## Project Structure

```
ts-residense-next/
├── public/                          Static assets (svg logos, sw.js, ts-fallback.jpg, llms.txt)
├── src/
│   ├── app/                         Next.js App Router
│   │   ├── layout.tsx               Root layout — injects Analytics, PerformanceMonitor,
│   │   │                            ServiceWorkerRegistration, ConsentBanner, UrgencyEngine,
│   │   │                            ApartmentQuiz, JSON-LD ApartmentComplex schema, floating
│   │   │                            Telegram + WhatsApp buttons.
│   │   ├── page.tsx + home-client.tsx       Homepage
│   │   ├── head.tsx                 Static <head> overrides
│   │   ├── robots.ts                /robots.txt — disallow /api/, sitemap link
│   │   ├── sitemap.ts               /sitemap.xml — static routes + dynamic apartment slugs
│   │   ├── apartments/[slug]/       Dynamic per-apartment pages (solo, studio, soho)
│   │   ├── apartments/page.tsx      Apartment index
│   │   ├── applications/page.tsx    Application landing
│   │   ├── contact/                 Contact + ContactForm
│   │   ├── easy-living/             Marketing page
│   │   ├── five-star-living/        Marketing page
│   │   ├── healthy-living/          Wellness page (No.1 Wellness Club)
│   │   ├── gallery/                 Image gallery
│   │   ├── offers/                  Promotions
│   │   ├── faq/                     FAQ
│   │   ├── admin/                   Internal dashboard (auth-gated)
│   │   │   ├── page.tsx                  Tab shell + Overview
│   │   │   ├── AdminApplicationsPanel.tsx Lead/application list
│   │   │   ├── ChatHistoryPanel.tsx      Chatbot session viewer
│   │   │   ├── MarketingDashboard.tsx    GA4-fed Recharts dashboard
│   │   │   ├── UtmBuilder.tsx            UTM link builder + saved links
│   │   │   └── ReportPanel.tsx           On-demand report sender
│   │   └── api/
│   │       ├── leads/route.ts                    POST create lead, GET list (admin)
│   │       ├── leads/[id]/status/route.ts        PATCH lead status (admin)
│   │       ├── contact/route.ts                  POST contact form → Resend dual email
│   │       ├── chat/route.ts                     POST → OpenAI GPT-3.5-turbo proxy
│   │       ├── chat/log/route.ts                 POST persist chat session + messages
│   │       ├── analytics/track/route.ts          POST first-party event ingest
│   │       ├── dashboard/summary/route.ts        GET aggregated dashboard metrics (admin)
│   │       ├── marketing/summary/route.ts        GET live GA4 summary (admin)
│   │       ├── marketing/integrations/route.ts   GET GA4 / Meta connection status (admin)
│   │       ├── admin/login/route.ts              POST password → HMAC session cookie
│   │       ├── admin/session/route.ts            GET / DELETE session
│   │       ├── admin/chat/sessions/route.ts      GET chat sessions (admin)
│   │       ├── admin/chat/messages/[sid]/route.ts GET messages for session (admin)
│   │       ├── admin/utm-links/route.ts          GET / POST saved UTM links
│   │       ├── admin/reports/data/route.ts       GET combined Supabase + GA4 report payload
│   │       ├── admin/reports/send/route.ts       POST trigger email report
│   │       ├── cron/reports/route.ts             GET (Vercel Cron) — daily / weekly emails
│   │       └── image/route.ts                    Allow-listed image proxy with fallback
│   ├── components/                  UI components (Hero V1/V2/V3, Navbar, Footer, ChatWidget,
│   │                                Analytics, ConsentBanner, PerformanceMonitor,
│   │                                ServiceWorkerRegistration, UrgencyEngine, ApartmentQuiz,
│   │                                ApartmentGallery, RotatingAlbum, animations, …)
│   ├── components/home/             Homepage section components
│   ├── components/apartments/       ApartmentDetailClient
│   ├── components/site/             Shared site primitives + GlobalTextReveal
│   ├── hooks/                       useImagePreloader, useLuxuryReveal, useParallaxImage
│   ├── lib/
│   │   ├── tracking.ts              First-party event + UTM capture, attribution snapshot
│   │   ├── seo.ts                   SITE_URL + DEFAULT_SEO
│   │   ├── site-data.ts             Apartment master data + nav groups
│   │   ├── apartments-content.ts    Apartment slug → display data
│   │   ├── supabase.ts              Anon client (browser + non-admin server)
│   │   ├── supabase-admin.ts        Service-role client (server only)
│   │   ├── admin-auth.ts            HMAC-signed admin session cookie (12 h TTL)
│   │   ├── ga4-reporting.ts         GA4 Data API (service-account JWT OR OAuth refresh)
│   │   ├── report-email.ts          Builds + sends Daily/Weekly/MTD/AllTime HTML reports
│   │   ├── chat-session.ts          UUID stored in localStorage for chat
│   │   └── performance.ts           web-vitals → trackEvent + optional Sentry
│   ├── constants.ts                 Button class tokens
│   └── types.ts                     Shared types
├── docs/                            Internal architecture docs (TECH_STACK, SECURITY_AND_ENV,
│                                    DATABASE_AND_SCHEMA, EVENTS_AND_TRACKING, utm-policy, …)
├── skills/                          Agent skill definitions
├── vercel.json                      Vercel cron schedule (daily 10:00, weekly Fri 10:00)
├── next.config.ts                   Redirects, image remote patterns, CSP, cache headers
├── package.json
└── tsconfig.json
```

---

## Admin Panel

URL: `/admin` (production: https://www.tsresidence.id/admin).

**Auth:** password-only. `POST /api/admin/login` validates the password against `ADMIN_PASSWORD` (or legacy `TS_ADMIN_PASSWORD`), then issues an HMAC-SHA256 signed cookie `ts_admin_session` (`httpOnly`, `sameSite=lax`, `secure` in production, 12 h TTL). Verified server-side via `requireAdminRequest()` on every admin API call. There is no user table — single shared password.

**Tabs (`src/app/admin/page.tsx`):**

1. **Overview** — KPI cards (Page Views, Book Clicks, Total Events, Conversion Rate), Top Pages, Traffic Sources, lead status filter row (All / New / Responded / Open Sale / Won / Pass). Auto-refreshes every 15 s and triggers a sound + browser notification + tab-title flash on new leads. Sources from `GET /api/dashboard/summary` and `GET /api/leads`.
2. **Applications** (`AdminApplicationsPanel`) — application/lead list with status edit and one-click WhatsApp/email reply.
3. **Marketing** (`MarketingDashboard`) — live GA4 trend lines (active users, new users, events), top pages, source/medium/campaign table, channel bucketing (paid-social / organic-search / direct / referral / other). Sources from `GET /api/marketing/summary` + `/integrations`.
4. **Chatbot History** (`ChatHistoryPanel`) — list `chat_sessions`, drill into `chat_messages` per session.
5. **UTM Builder** (`UtmBuilder`) — page/source/medium/campaign/content/term form, generates a `https://www.tsresidence.id/...?utm_*=...` URL, persists to `utm_links` table via `GET / POST /api/admin/utm-links`. Source presets: `ig`, `fb`, `google`, `tiktok`, `email`, `whatsapp`, `telegram`. Medium presets: `paid`, `story`, `reel`, `post`, `bio`, `organic`, `email`, `referral`.
6. **Reports** (`ReportPanel`) — period selector (Daily / Weekly / MTD / AllTime — last 90 d), preview Supabase + GA4 numbers, on-demand send via `POST /api/admin/reports/send`. Default recipients (hardcoded in `src/lib/report-email.ts`): `randolphbubu4@gmail.com`, `wellnessbrotherjay@gmail.com`, `tsresidence@townsquare.co.id`.

---

## Analytics & Tracking

### GA4 Setup

| Field | Value | Source |
|---|---|---|
| Measurement ID | `G-ZTL67K3SK0` | `.env` (`NEXT_PUBLIC_GA_MEASUREMENT_ID`) |
| Stream ID | `14379592164` | `.env.analytics` |
| Stream URL | `https://www.tsresidence.id` | `.env.analytics` |
| Owner email | `wellnessbrotherjay@gmail.com` | `.env.analytics` |
| Property ID (Data API) | env-driven, `GA4_PROPERTY_ID` | `src/lib/ga4-reporting.ts` |

**Loading** — `src/components/Analytics.tsx` is mounted in the root layout inside a `<Suspense>` boundary. On mount it:
- Initializes `dataLayer`.
- Sets Google Consent Mode v2 defaults to **denied** (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`) with `wait_for_update: 500` and `url_passthrough: true`.
- Inserts GTM if `NEXT_PUBLIC_GTM_ID` set.
- Inserts gtag with `send_page_view: false` (we fire `page_view` ourselves on every route change for SPA fidelity).
- Inserts Meta Pixel with `fbq('consent', 'revoke')` until consent.
- Inserts Microsoft Clarity if `NEXT_PUBLIC_CLARITY_ID` set.
- Tracking is **disabled outside `tsresidence.id` / `www.tsresidence.id`** and **disabled on `/admin*`** (`shouldEnableTracking`, `src/lib/tracking.ts:53`).

**Custom events fired** (`TrackingEventName` in `src/lib/tracking.ts:1`):
`page_view`, `cta_click`, `booking_intent`, `lead_created`, `social_click`, `nav_click`, `gallery_interaction`, `form_start`, `form_submit`, `form_error`, `scroll_depth`, `engaged_session`, `consent_update`, `quiz_complete`, `quiz_abandon`, `performance_metric`, `image_load_time`, `performance_alert`.

**Where they fire** (`src/components/Analytics.tsx`):
- `page_view` — every pathname change.
- `scroll_depth` — at 25 / 50 / 75 / 90 % milestones.
- `engaged_session` — once after 30 s on page.
- `cta_click` / `nav_click` / `social_click` / `booking_intent` — global click delegation. `booking_intent` triggers when the link contains `wa.me`, `booking`, `townsquare`, or matches `/book apartment|contact concierge|send inquiry/i`. WA / booking / townsquare links are intercepted and decorated with the latest UTMs via `appendUTMsToUrl` before opening.
- `performance_metric` (`lcp`, `fcp`, `cls`) + `image_load_time` + `performance_alert` — fired by `PerformanceMonitor` and `lib/performance.ts` (>2000 ms image loads alert).

**Triple dispatch** — every event in `trackEvent()` is pushed to:
1. `window.dataLayer` (GTM).
2. `gtag('event', ...)` (GA4) — including `first_*` and current UTMs flattened.
3. `fbq()` — mapped to standard events (`page_view`→`PageView`, `form_submit`/`lead_created`→`Lead`, `booking_intent`→`InitiateCheckout`, `cta_click`→`trackCustom CTAClick`).
4. `POST /api/analytics/track` → Supabase `traffic_events` (first-party, survives ad blockers).

### UTM / Campaign Tracking

Captured params: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `fbclid`, `ttclid`.

**Normalization** — values are lowercased and `[^a-z0-9_-]` is replaced with `_` on capture. See `src/lib/tracking.ts:80` (`captureUTMs`).

**Storage** — three places:
- `localStorage.utm_first` — JSON of the first attribution touch (set once, never overwritten).
- `localStorage.utm_latest` — JSON of the most recent attribution touch (overwritten each time URL contains UTMs).
- `Cookie utm_latest` — same value, `path=/`, `max-age=2592000` (30 d), `SameSite=Lax`, encoded.
- `localStorage.ts_landing_page` — first landing path+search.
- `localStorage.ts_session_id` and `localStorage.ts_visitor_id` — generated client-side via `crypto.randomUUID()` (`ensureTrackingIds`).

**UTM schema (admin builder presets)** — see `src/app/admin/UtmBuilder.tsx`:
- `utm_source`: `ig | fb | google | tiktok | email | whatsapp | telegram`
- `utm_medium`: `paid | story | reel | post | bio | organic | email | referral`
- Saved links live in Supabase `utm_links` table.

**UTM policy** — see `docs/utm-policy.md`.

**Outbound link decoration** — `appendUTMsToUrl` pulls `utm_latest` from localStorage and appends every key not already present in the destination URL. Applied at click time to `wa.me`, `booking`, `townsquare` links.

### Meta Pixel

- Pixel ID env: `NEXT_PUBLIC_META_PIXEL_ID` (also legacy `next_PUBLIC_META_PIXEL_ID`, `META_PIXEL_ID`).
- Loaded inline from `Analytics.tsx` after consent default of `revoke`.
- Standard events fired via `fbq` in `trackEvent()` — see GA4 section above.

### Microsoft Clarity

- Optional, env: `NEXT_PUBLIC_CLARITY_ID`. Inline-loaded when set.

### Cookie Consent

`src/components/ConsentBanner.tsx` — bottom-of-page banner with `Accept All` / `Decline`. Choice stored in `localStorage.cookie_consent`. On accept, `grantConsent()` calls `gtag('consent','update', ...)` to flip storage flags.

---

## Sitemap

- **Route:** `/sitemap.xml` (Next.js `MetadataRoute.Sitemap`, generated at build/request time by `src/app/sitemap.ts`).
- **Generation:** server-rendered. Static routes hand-listed; per-apartment routes mapped from `apartmentDisplayList` in `src/lib/apartments-content.ts`.
- **Static routes (priority / freq):** `/` (1.0 daily), `/apartments` (0.95 weekly), `/offers` (0.9 weekly), `/contact` (0.9 weekly), `/gallery` (0.85 weekly), `/easy-living` (0.8 monthly), `/healthy-living` (0.8 monthly), `/five-star-living` (0.8 monthly), `/faq` (0.7 monthly).
- **Dynamic routes:** `/apartments/{slug}` for every entry in `apartmentDisplayList` — currently `solo`, `studio`, `soho` — priority 0.9 weekly, with `images` field set to the apartment hero image.
- **`/robots.txt`** (`src/app/robots.ts`) — `User-agent: *`, `Allow: /`, `Disallow: /api/`, `Sitemap: https://www.tsresidence.id/sitemap.xml`.

---

## Automation Integrations

### Resend (transactional email)
- API key: `RESEND_API_KEY`.
- Sender: `TS Residence <noreply@tsresidence.id>`.
- **Contact form** (`/api/contact`) — sends two branded HTML emails in parallel: admin notification to `tsresidence@townsquare.co.id` + `wellnessbrotherjay@gmail.com`, and an applicant confirmation.
- **Lead notifications** — `/api/leads` also uses Resend (admin-side notification on each new lead).
- **Daily/Weekly/MTD/AllTime reports** — `src/lib/report-email.ts` builds combined Supabase + GA4 HTML emails and ships to the recipient list above.

### Vercel Cron (`vercel.json`)
- `0 10 * * *` → `GET /api/cron/reports?type=daily` — daily report 10:00 UTC.
- `0 10 * * 5` → `GET /api/cron/reports?type=weekly` — weekly report Fri 10:00 UTC.
- Both protected by `Authorization: Bearer ${CRON_SECRET}` — Vercel sends this automatically when `CRON_SECRET` is configured in env.

### GA4 Data API
- `src/lib/ga4-reporting.ts` authenticates with **either** an OAuth refresh token (`GA4_OAUTH_CLIENT_ID` + `GA4_OAUTH_CLIENT_SECRET` + `GA4_OAUTH_REFRESH_TOKEN`) **or** a service-account (`GOOGLE_SERVICE_ACCOUNT_JSON`, or `GOOGLE_SERVICE_ACCOUNT_EMAIL` + `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`). OAuth is preferred when both are configured.
- Pulls `runReport` against `properties/${GA4_PROPERTY_ID}` with read-only scope.
- Used by `/api/marketing/summary` (admin Marketing tab) and `/api/admin/reports/data` (Reports tab + cron emails).

### OpenAI (chat widget)
- `/api/chat` proxies to `https://api.openai.com/v1/chat/completions` using `gpt-3.5-turbo`, `max_tokens: 600`, `temperature: 0.7`.
- API key env: `OPENAI_API_KEY`.
- System prompt hard-coded in `src/components/ChatWidget.tsx`.
- All conversations persisted via `/api/chat/log` → `chat_sessions` + `chat_messages`.

### WhatsApp / Telegram
- **Floating action buttons** in root layout — `https://wa.me/6281119028111` and `https://t.me/tsresidence`. WA links are runtime-decorated with current UTMs.
- ⚠️ **Not implemented** — there is no inbound WAHA webhook, no n8n integration, no Chatwoot connection in this repo. WhatsApp is currently outbound deep-link only. See "Known gaps" below.

### Image proxy (`/api/image`)
- Allow-listed hosts: `tsresidence.id`, `www.tsresidence.id`, `imagedelivery.net`, `picsum.photos`, `tssuites.com`, `www.tssuites.com`.
- `Analytics.tsx` rewrites failed remote `<img>` loads through this proxy and falls back to `/ts-logo.svg` on a second failure.

### Service Worker
- `public/sw.js` registered by `src/components/ServiceWorkerRegistration.tsx`.
- `Cache-Control: no-cache, no-store, must-revalidate` on `/sw.js` (set in `next.config.ts`).

---

## Database Schema

Inferred from API routes (no migration files committed in `supabase/migrations/` — see Known Gaps).

**`leads`** — written by `POST /api/leads` and `POST /api/contact`.
Columns observed: `id`, `first_name`, `last_name`, `email`, `phone`, `stay_duration`, `message`, `page`, `source`, `medium`, `campaign`, `term`, `content`, `referrer`, `metadata` (jsonb — device_type, landing_page, page_url, session_id, visitor_id, gclid, fbclid, ttclid, first_touch, latest_touch), `device_type`, `landing_page`, `page_url`, `status` (`new` | `responded` | `open_sale` | `closed_won` | `not_interested`), `created_at`. **Dedupe**: 24 h email window before insert.

**`traffic_events`** — written by `POST /api/analytics/track`.
Columns: `id`, `session_id`, `visitor_id`, `event_type`, `page`, `source`, `medium`, `campaign`, `term`, `content`, `referrer`, `gclid`, `fbclid`, `metadata` jsonb, `created_at`.

**`chat_sessions`** — upserted by `POST /api/chat/log`.
Columns: `id` (uuid client-generated), `user_agent`, `ip_address`, `created_at`, `last_active`.

**`chat_messages`** — inserted per turn.
Columns: `id`, `session_id`, `role`, `content`, `created_at`.

**`utm_links`** — saved UTM builder rows.
Columns: `id`, `created_at`, `name`, `base_url`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `full_url`. Code tolerates the table not existing yet (returns `[]`).

⚠️ **RLS status not verified in this repo.** BOSS rule: every Supabase table MUST have RLS enabled. The service-role client (`supabase-admin.ts`) bypasses RLS, so admin reads still work either way — but writes from the public anon client (`/api/leads`, `/api/analytics/track`, `/api/chat/log`) require RLS policies that allow anon insert. Confirm in Supabase dashboard.

---

## Environment Variables

**Currently referenced in code** (full list extracted via `grep`):

```bash
# --- Supabase ---
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=                # server-only, never ship to client

# --- Google Analytics 4 ---
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-ZTL67K3SK0
NEXT_PUBLIC_GTM_ID=                       # optional GTM container
GA_STREAM_URL=https://www.tsresidence.id

# --- GA4 Data API (admin reports & dashboard) ---
GA4_PROPERTY_ID=
GA4_OAUTH_CLIENT_ID=                      # use OAuth OR service account
GA4_OAUTH_CLIENT_SECRET=
GA4_OAUTH_REFRESH_TOKEN=
GOOGLE_SERVICE_ACCOUNT_JSON=              # full JSON string, OR the two below
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
GA4_EXCLUDED_PAGE_KEYWORDS=               # optional comma list to filter from reports

# --- Meta Pixel ---
NEXT_PUBLIC_META_PIXEL_ID=
META_PIXEL_ID=                            # legacy fallback

# --- Microsoft Clarity ---
NEXT_PUBLIC_CLARITY_ID=                   # optional

# --- Email ---
RESEND_API_KEY=

# --- Chatbot ---
OPENAI_API_KEY=

# --- Admin auth ---
ADMIN_PASSWORD=                           # primary
TS_ADMIN_PASSWORD=                        # legacy fallback
ADMIN_SESSION_SECRET=                     # falls back to ADMIN_PASSWORD if unset

# --- Vercel cron ---
CRON_SECRET=

# --- Activity logging (optional / referenced by docs) ---
JARVIS_API_URL=
JARVIS_API_KEY=
```

⚠️ **Security: `.env.local.example` currently contains REAL Supabase anon + service-role keys and a real Resend API key — committed to the repo. ROTATE THESE IMMEDIATELY** and replace the example with placeholders. See "Known issues / TODO" below.

⚠️ **Security: `src/app/api/contact/route.ts:5` hardcodes a fallback Resend key (`re_WE2B2WLY_…`).** Remove the fallback, fail closed if `RESEND_API_KEY` is unset.

⚠️ **Typo guard** — code reads both `NEXT_PUBLIC_*` and `next_PUBLIC_*` (lowercase `next_`) for `GTM_ID`, `GA_MEASUREMENT_ID`, `META_PIXEL_ID`, `CLARITY_ID`. This was added defensively after a deploy mismatch. Standardize on uppercase and delete the lowercase reads.

---

## Deployment

**Platform:** Vercel (Team `team_kcQNkKOimXEK7CGfS74xdjxI` per BOSS skill).

**Build commands:**

```bash
pnpm install         # repo also has bun.lock + package-lock.json — pick one
pnpm dev             # local dev
pnpm build           # production build (Turbopack)
pnpm start           # serve production build
pnpm lint            # eslint
pnpm lint:fix        # eslint --fix
pnpm format          # prettier --write .
pnpm format:check    # prettier --check .
```

**Cron** — configured in `vercel.json`; Vercel injects the bearer token automatically when `CRON_SECRET` is set in the project env.

**Redirects** (`next.config.ts`):
- `/favicon.ico` → `/ts-logo.svg`
- `/solo-apartment` → `/apartments/solo` (301)
- `/studio-apartment` → `/apartments/studio` (301)
- `/soho-apartment` → `/apartments/soho` (301)

**CSP** (`next.config.ts`) — `script-src 'self' 'unsafe-inline' 'unsafe-eval' https:` etc. Permissive; review before tightening.

---

## Known Issues / TODO

**Security — fix this week:**
- `.env.local.example` contains real Supabase anon + service-role keys and a real Resend API key. Rotate all three, replace example with placeholders, and `git log --all -p | grep -E "eyJ|re_"` to scrub history.
- Hardcoded Resend fallback key in `src/app/api/contact/route.ts` — remove.
- `/api/chat` has no rate limiting — anyone can drain the OpenAI key. Add per-IP throttle or move behind admin/consent.
- `/api/chat/log`, `/api/analytics/track`, `/api/leads` (public POST), `/api/contact` — no rate limiting, no Zod validation. Add Zod + per-IP throttle. BOSS rule: every API route is Zod-validated.
- Verify RLS is enabled on every Supabase table (`leads`, `traffic_events`, `chat_sessions`, `chat_messages`, `utm_links`).
- Admin password is single-shared. No lockout after N failures, no audit log of admin sessions. Add lockout + log.
- CSP allows `'unsafe-inline'` and `'unsafe-eval'` — required by current GTM/gtag inline injection but should be tightened with nonces eventually.

**Functional gaps:**
- ⚠️ **No automated test suite** — Playwright is in BOSS stack but not wired here. Add at minimum: contact submit, lead dedupe, admin login.
- ⚠️ **No WAHA / n8n / Chatwoot integration** despite specs in `NO1_WELLNESS_IG_RESPONDER_N8N_SPEC.md`. Inbound WhatsApp flow is unbuilt; current WhatsApp is outbound `wa.me` deep links only.
- ⚠️ **No Supabase migration files** in repo (`supabase/migrations/` does not exist). Schema lives only in production. BOSS rule: track migrations with timestamps.
- ⚠️ Three lockfiles coexist: `bun.lock`, `package-lock.json`, `pnpm-lock.yaml`. Pick one (BOSS stack implies pnpm or npm) and delete the others.
- ⚠️ `src/app/api/chat/log.ts` exists alongside `src/app/api/chat/log/route.ts` — verify the non-route file isn't dead code.
- Service worker (`public/sw.js`) is registered but its scope and offline strategy aren't documented.
- `head.tsx` in App Router is unusual (App Router uses `metadata` export instead) — confirm it isn't fighting the metadata API.

**TODO / FIXME comments in source:** `grep -rn "TODO\|FIXME\|XXX\|HACK" src/` returned no matches. All open work is tracked in `docs/TASKS_AND_GAPS.md` and `summery/lint-fixes-needed.md`.

**Stale dashboards / docs in repo root** — `comprehensive_marketing_report.html`, `Website_Traffic_Audit_Report_Apr14-20_2026.html`, `no1wellness_website_audit.html`, `No1_Wellness_Marketing_Review_May2026.html` are static artifacts unrelated to the live site. Move to `docs/` or delete.

---

## Local Development

```bash
git clone <repo>
cd ts-residense-next
pnpm install
cp .env.local.example .env.local        # then replace placeholders with your dev keys
pnpm dev
```

Visit http://localhost:3000. Tracking auto-disables off `tsresidence.id` (see `shouldEnableTracking`).

---

## Internal docs

Deeper architectural notes live in `docs/`:
- `TECH_STACK.md`
- `SYSTEM_SCOPE.md`
- `DATABASE_AND_SCHEMA.md`
- `EVENTS_AND_TRACKING.md`
- `INTEGRATION_MAP.md`
- `API_AND_WEBHOOKS.md`
- `SECURITY_AND_ENV.md`
- `TASKS_AND_GAPS.md`
- `utm-policy.md`

---

*Proprietary and confidential — TS Group / HTF Solutions.*
