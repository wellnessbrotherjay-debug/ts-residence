# TS Residence — Changelog

All notable changes to the TS Residence website. Grouped by feature area, derived from git history (`git log --oneline --all` returned 138 commits at time of writing) and code in `src/`.

---

## [Unreleased / In progress]

### Security follow-ups (must-do, BOSS rules)
- Rotate Supabase anon + service-role keys and Resend API key currently exposed in `.env.local.example`.
- Remove hardcoded Resend fallback key in `src/app/api/contact/route.ts:5`.
- Add Zod validation + per-IP rate limiting to every public API route (`/api/leads`, `/api/contact`, `/api/chat`, `/api/chat/log`, `/api/analytics/track`).
- Verify RLS on every Supabase table.
- Add admin login lockout (5 attempts → temp block) and admin session audit log.
- Tighten CSP — drop `'unsafe-inline'` and `'unsafe-eval'` once gtag/GTM injection moves to nonces.

### Functional follow-ups
- Wire Playwright tests for contact submit, lead dedupe, admin login.
- Build WAHA → n8n → Chatwoot WhatsApp inbound flow per `NO1_WELLNESS_IG_RESPONDER_N8N_SPEC.md`.
- Add `supabase/migrations/` with timestamped migrations for current schema.
- Consolidate to a single lockfile (`bun.lock` + `package-lock.json` + `pnpm-lock.yaml` all present).
- Investigate `src/app/api/chat/log.ts` vs `src/app/api/chat/log/route.ts` — likely dead file.

---

## [Latest] — May 2026

### Admin Panel
- Six-tab admin shell: Overview, Applications, Marketing, Chatbot History, UTM Builder, Reports (`src/app/admin/page.tsx`).
- HMAC-signed cookie auth (`ts_admin_session`, 12 h, `httpOnly` + `secure` in prod) replacing earlier client-side gating (commit `94fd548` — SSR-safe password protection for `/admin`).
- Admin login API + session API + delete-session (`src/app/api/admin/login/route.ts`, `src/app/api/admin/session/route.ts`).
- `requireAdminRequest()` guard on every admin API endpoint (`src/lib/admin-auth.ts`).
- Overview KPIs: Page Views, Book Clicks, Total Events, Conversion Rate. Top Pages + Traffic Sources panels. Lead status filter row (All / New / Responded / Open Sale / Won / Pass).
- Real-time lead alerts: 15 s polling, audio chime, `Notification` API, `document.title` flash for 10 s on new leads.
- Email-reply launcher with branded copy (`handleReplyEmail`) and auto-status-bump from `new` → `responded`.
- Lead status PATCH endpoint (`src/app/api/leads/[id]/status/route.ts`) — landed and reverted multiple times for App Router type churn (commits `25c012b`, `38d98bc`, `7336ece`, `99402f1`).
- Marketing dashboard with Recharts line/bar charts, channel bucketing (paid-social / organic-search / direct / referral / other) — fed by `/api/marketing/summary` (commit `fe16aaf`).
- UTM Builder with source/medium presets and Supabase persistence to `utm_links` (graceful fallback when table absent).
- Reports panel with period selector (Daily / Weekly / MTD / All Time / 90 d) and on-demand send button.
- Chatbot History viewer over `chat_sessions` + `chat_messages`.

### Analytics & GA4
- GA4 measurement ID hardcoded in `.env`: `G-ZTL67K3SK0`. Stream ID `14379592164`. Property tagged at `https://www.tsresidence.id`.
- Google Consent Mode v2 with all storage flags defaulted to `denied`, `wait_for_update: 500`, `url_passthrough: true`.
- Custom event taxonomy added in `src/lib/tracking.ts`: `page_view`, `cta_click`, `booking_intent`, `lead_created`, `social_click`, `nav_click`, `gallery_interaction`, `form_start`, `form_submit`, `form_error`, `scroll_depth`, `engaged_session`, `consent_update`, `quiz_complete`, `quiz_abandon`, `performance_metric`, `image_load_time`, `performance_alert`.
- `gtag('config', GA_ID, { send_page_view: false })` — page views fired manually on every App Router pathname change for SPA fidelity.
- Triple-dispatch tracker: every event goes to `dataLayer`, `gtag`, `fbq` (mapped to standard events), and Supabase `traffic_events` via `/api/analytics/track`.
- Scroll-depth milestones at 25 / 50 / 75 / 90 %.
- 30-second `engaged_session` timer.
- Global click delegation classifies clicks as `cta_click` / `nav_click` / `social_click` / `booking_intent` and decorates outbound WA / booking / townsquare links with current UTMs at click time.
- Performance Monitor: web-vitals (`lcp`, `fcp`, `cls`) + per-image load time, with >2000 ms alert event and optional Sentry hook (`window.Sentry?.captureMessage`).
- Tracking auto-disables on non-production hostnames and on `/admin*` (`shouldEnableTracking`).
- GA4 Data API client supports both OAuth refresh-token and service-account JWT auth (`src/lib/ga4-reporting.ts`). OAuth preferred when both configured.
- Marketing integration status endpoint (`/api/marketing/integrations`) reports GA4 + Meta connection state.
- Cookie consent banner (`src/components/ConsentBanner.tsx`) — Accept All / Decline; choice persists in `localStorage.cookie_consent`; `grantConsent()` flips the gtag consent flags.

### Campaign Tracking
- UTM parameters captured: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` + click IDs `gclid`, `fbclid`, `ttclid`.
- Values normalized at capture: lowercased, `[^a-z0-9_-]` replaced with `_` (`captureUTMs`).
- Stored in three places:
  - `localStorage.utm_first` — never overwritten (first-touch attribution).
  - `localStorage.utm_latest` — overwritten on each new UTM hit.
  - Cookie `utm_latest` — `path=/`, 30 d, `SameSite=Lax`, URL-encoded.
- Landing page captured to `localStorage.ts_landing_page` on first arrival.
- Visitor + session IDs generated client-side via `crypto.randomUUID()` and persisted (`ts_visitor_id`, `ts_session_id`).
- `appendUTMsToUrl()` helper decorates outbound URLs with current `utm_latest` keys not already present.
- Attribution snapshot helper (`getAttributionSnapshot`) bundles first + latest UTMs, IDs, landing page, current page, page URL, referrer for lead/event payloads.
- UTM Builder admin tool with source/medium presets:
  - Source: `ig`, `fb`, `google`, `tiktok`, `email`, `whatsapp`, `telegram`.
  - Medium: `paid`, `story`, `reel`, `post`, `bio`, `organic`, `email`, `referral`.
- Saved UTM links persisted to Supabase `utm_links` table via `/api/admin/utm-links`.
- UTM policy committed at `docs/utm-policy.md`.
- Tracking + CRM hardening pass: `feat: Enhance tracking, lead automation, and CRM hardening` (commit `fbd6126`).

### Sitemap
- Dynamic `/sitemap.xml` generated by `src/app/sitemap.ts` using Next.js `MetadataRoute.Sitemap`.
- Static routes hand-listed with priority + change frequency (homepage 1.0/daily down to FAQ 0.7/monthly).
- Apartment routes generated dynamically from `apartmentDisplayList` (slugs: `solo`, `studio`, `soho`) at priority 0.9 weekly, with hero `images` field populated.
- `/robots.txt` (`src/app/robots.ts`) allows everything except `/api/`, points UAs to the sitemap.
- 301 redirects from legacy `/solo-apartment`, `/studio-apartment`, `/soho-apartment` to `/apartments/{slug}` (commit `17a0d0a` — "Fix apartment slug routing for async params").
- JSON-LD `ApartmentComplex` schema in root layout with address, geo (`-8.6974, 115.174`), telephone, amenities (`Coworking Space`, `No.1 Wellness Club`, `Rooftop Pool`).

### Automation / Integrations
- Resend transactional email — applicant confirmation + admin notification on contact form (`src/app/api/contact/route.ts`).
- Resend admin notification on every new lead (`src/app/api/leads/route.ts`).
- 24-hour lead deduplication by email — duplicates short-circuit with `success: true` to keep UX consistent (commit `fbd6126`).
- Honeypot field (`_honeypot`) on lead submissions — silent success on detect.
- Vercel Cron — daily at `10:00 *` and weekly Friday `10:00 5` UTC, both calling `/api/cron/reports?type=...` with `Authorization: Bearer ${CRON_SECRET}` (`vercel.json`).
- Combined Supabase + GA4 HTML email reports for periods Daily / Weekly / MTD / AllTime, recipients hardcoded: `randolphbubu4@gmail.com`, `wellnessbrotherjay@gmail.com`, `tsresidence@townsquare.co.id` (`src/lib/report-email.ts`).
- OpenAI `gpt-3.5-turbo` proxy at `/api/chat` (max 600 tokens, temp 0.7), conversations logged to `chat_sessions` + `chat_messages`.
- Chat widget with greeting auto-dismiss after 4 s and per-visitor session UUID in localStorage.
- Image proxy (`/api/image`) with allow-list (`tsresidence.id`, `imagedelivery.net`, `picsum.photos`, `tssuites.com`) and `force-cache` upstream fetch.
- Global `<img>` error handler swaps to image proxy on first failure, then to `/ts-logo.svg`.
- Floating Telegram (`t.me/tsresidence`) and WhatsApp (`wa.me/6281119028111`) action buttons in root layout.
- Service worker registered via `ServiceWorkerRegistration` component (`public/sw.js`, `Cache-Control: no-cache, no-store, must-revalidate`).
- Cookie name `ts_admin_session`; chat session key `tsr_chat_session_id`; analytics keys `ts_session_id` / `ts_visitor_id` / `ts_landing_page` / `utm_first` / `utm_latest`.

### Pages & UX
- Apartment detail pages with gallery + lightbox (`yet-another-react-lightbox`).
- Hero V1/V2/V3 variants with cinematic transitions and rotating album.
- Five-Star Living, Healthy Living (No.1 Wellness Club), Easy Living, Offers, Gallery, FAQ pages.
- Apartment Quiz overlay (`ApartmentQuiz`) and Urgency Engine (`UrgencyEngine`) global components.
- Country-code field added to Contact form, surfaced in admin/client emails (commits `5e51bc1`, `3690a2b`).
- IV Therapy / Massage / Pilates booking links on Healthy Living (commit `7b65b12`); Massage tab + IV refinement (commit `ade5dde`).
- Premium redesigns: contact, healthy-living, gallery, easy-living, five-star-living (commits `eada4a4`, `e180f60`, `097f269`, `d6d8c6e`, `e551ac5`).
- Mobile/tablet viewport optimization pass (commit `002cb87`).
- Footer responsiveness (commit `ecd54c9`).
- Accessibility pass across key pages (commit `5581106`).
- SEO + technical performance pass (commit `1acfe2a`); a follow-up perf/SEO commit was reverted (`248ea80`).

### Bug Fixes
- `Fix admin dashboard hook order and marketing tab` (`fe16aaf`).
- `Fix public page image rendering` (`9ea8b16`).
- `Fix public routing and crawlability issues` (`fae670b`).
- `Fix Google Maps links for TS Residence` (`f6d1433`).
- `Fix apartment slug routing for async params` (`17a0d0a`).
- `Remove package-lock.json and set turbopack.root for correct Next.js workspace root` (`8d171de`) — note: lockfile is back in tree, see Unreleased.
- `Fix API route type error and rebuild for apartments/solo 404 fix` (`a2ef428`).
- PATCH handler signature churn for App Router (`99402f1`, `7336ece`, `38d98bc`, `25c012b`, `97cc781`).
- `SSR-safe password protection for /admin (hydration error #310)` (`94fd548`).
- `Fix hero image blur/flash and /admin password protection` (`e8ecdea`).
- `Debug: log missing Supabase env vars and fail fast` (`6308e42`).
- `Debug: log all Supabase errors in leads API / dashboard summary API` (`85c7be8`, `ee33d8a`).
- `chore: trigger redeploy for env update` (`e4c3deb`).
- `chore: add framer-motion for SSR build compatibility` (`1a42d73`).
- `Fix TS Residence QA blockers and production readiness` (`57ffb04`).
- `HOTFIX: Remove type arguments from reduce in dashboard summary API route for Next.js/TypeScript compatibility` (`fe1784a`).
- `Fix Analytics: correct Object.keys type for scrollMilestones to fix build error` (`53e6842`).
- `Fix ContactForm: add missing countryCode to reset state after submit` (`d7bbe3e`).
- `Remove unused @ts-expect-error in Analytics.tsx to fix build error` (`23c15fd`).

---

## Initial Foundation

- `Initial commit from Create Next App` (`33a1e78`) — Next.js scaffold.
- Add agent skills for frontend design, React best practices, Claude Code (`316f803`).
- Add `clsx`, `motion.dev`, `husky`, `lint-staged`, `prettier` (`d89faa4`).
- Migrate landing pages from old repo and fix runtime console errors (`c2a03f2`).
- Tailwind canonical class autofix configured (`08d566d`).
- Prettier scripts wired (`b5d737d`).

---

*Generated from a static scan of `src/`, `package.json`, `vercel.json`, `next.config.ts`, `.env*`, and `git log`. Update as you ship.*
