# TS Residence Full System Audit (Old vs New)

Date: 2026-05-07
Repository: ts-residense-next
Production: https://www.tsresidence.id
Admin: /admin

## 1) Executive Summary

Old website model (brochure / WordPress-style):
- Primarily informational pages.
- Limited measurable attribution from visit to inquiry to sale.
- Manual follow-up with fragmented records.

New website model (measurable operating system):
- Full Next.js application with API layer, event tracking, lead persistence, admin dashboard, campaign attribution, and automated reporting.
- Integrates first-party event logging, GA4 pull reporting, Meta Pixel dispatch, UTM capture, lead status workflow, and scheduled owner reports.

Owner-facing line:
- The old website guessed. The new website measures.

Operational diagnosis capability now available:
- Traffic source and campaign can be segmented.
- CTA and booking-intent interactions are tracked.
- WhatsApp/contact funnel points are instrumented.
- Leads are persisted with source metadata and lifecycle status.
- Admin review and report automation exist.

Business reality note:
- If leads or bookings drop, the stack now supports diagnosis via funnel checkpoints: traffic source, CTA clicks, WhatsApp interactions, form submissions, response process, lead status progression, and closed-won updates.
- Final revenue/ROAS proof still depends on downstream operational recording (for example VHP/manual booking reconciliation).

## 2) Timeline / Build History

### Git Evidence Commands
- git log --oneline --decorate --all --max-count=80
- git log --stat --max-count=30
- git status --short

### Current Working Tree Snapshot
Repository is dirty (multiple modified and untracked files), including admin/reporting/tracking files. This audit reports current repository state and does not normalize or reset workspace changes.

### Timeline Table (evidence-based)

| Period | Build Milestone | Evidence |
|---|---|---|
| 2026-04-25 | Core analytics/CRM implementation wave begins | commit 851850e (analytics, CRM, dashboard implementation) |
| 2026-04-25 | UTM attribution persistence + Meta mapping | commit 164ee63 |
| 2026-04-25 to 2026-04-27 | Homepage/UX and tracking hardening iterations | commits ebf800a, e33e52e, fbd6126 |
| 2026-05-04 | Admin protection and lead status API stabilization | commits e8ecdea, 94fd548, 25c012b, 38d98bc, 99402f1 |
| 2026-05-04 | Documentation and internal architecture packs added | commit a399579 (docs/* added) |
| 2026-05-05 | Route and build/runtime fixes for apartments and API typing | commits 17a0d0a, a2ef428, 8d171de |
| 2026-05-06 | Crawlability/public routing fixes and GA marketing dashboard expansion | commits fae670b, fe16aaf |
| 2026-05-07 (current state) | Expanded reporting + traffic intelligence + admin tabs present in workspace | files under src/app/admin/*, src/app/api/admin/*, src/lib/report-email.ts |

## 3) Current Tech Stack

### Framework / Language / Frontend
- Next.js 16.2.1
- React 19.2.4
- TypeScript ^5
- Tailwind CSS ^4
- Recharts ^3.8.1
- Framer Motion ^12.38.0

### Backend/API Layer
- Next.js App Router API routes under src/app/api/*
- Zod validation on key POST routes
- In-memory API rate limiting helper

### Data / CRM Libraries
- @supabase/supabase-js ^2.103.0
- pg ^8.20.0 (present)

### Email / Reporting
- resend ^6.10.0
- Scheduled report sending via Vercel Cron

### Analytics / Tracking
- GA4 script + dataLayer + gtag dispatch in client
- Meta Pixel initialization and event mapping in client
- First-party server event ingestion endpoint /api/analytics/track

### Hosting / Deployment
- Vercel deployment model (vercel.json present)
- Build target: Next.js app routes

### Image/CDN Strategy
- next/image remotePatterns include imagedelivery.net and production hostnames
- Image proxy endpoint /api/image with allowlist

### Third-party Services Detected
- Supabase
- Google Analytics Data API (via google-auth-library)
- Meta Pixel
- Resend
- Optional Microsoft Clarity
- OpenAI chat completions endpoint usage in /api/chat

## 4) Site Architecture

### Route Map (selected owner-relevant)

| Route | Purpose | Conversion Role | Tracking/CRM Role | Notes |
|---|---|---|---|---|
| / | Home marketing entry | Primary awareness and CTA launching | page_view and click events | Static route |
| /apartments | Apartment index | Comparison and intent | page/event tracking | Static route |
| /apartments/[slug] | Apartment detail (SOLO/STUDIO/SOHO) | Core conversion pre-contact page | metadata and engagement tracking | SSG params generated |
| /apartments/solo | SOLO offer route | Product conversion route | tracked like detail pages | Confirmed live 200 |
| /apartments/studio | STUDIO offer route | Product conversion route | tracked like detail pages | Confirmed live 200 |
| /apartments/soho | SOHO offer route | Product conversion route | tracked like detail pages | Confirmed live 200 |
| /offers | Promo campaigns and offer CTA | Offer-driven conversion | page/click tracking | Confirmed live 200 |
| /contact | Lead form and direct handoff | Main form conversion endpoint | sends /api/contact and /api/leads | Confirmed live 200 |
| /faq | Objection handling and SEO FAQ intent | Assist conversion | FAQ schema and tracked navigation | FAQ JSON-LD present |
| /admin | Internal operations dashboard | Lead handling and reporting | reads leads/events via secured APIs | Password-based session auth |
| /robots.txt | Crawl policy | SEO infrastructure | n/a | Generated by app route |
| /sitemap.xml | Crawl discovery | SEO infrastructure | n/a | Generated by app route |
| /solo-apartment | Legacy URL | Redirect conversion continuity | n/a | 308 to /apartments/solo |
| /studio-apartment | Legacy URL | Redirect conversion continuity | n/a | 308 to /apartments/studio |
| /soho-apartment | Legacy URL | Redirect conversion continuity | n/a | 308 to /apartments/soho |

### API route families
- /api/leads, /api/leads/[id]/status
- /api/contact
- /api/analytics/track
- /api/dashboard/summary
- /api/admin/* (session/login/reports/traffic/chat/utm)
- /api/marketing/summary and /api/marketing/integrations
- /api/cron/reports

### AI crawl readiness
- public/llms.txt exists and is populated with business descriptors and route pointers.

## 5) Public Website Funnel

### Old funnel (brochure-era model)
Traffic -> website page -> manual contact attempt -> manual handling -> weak attribution continuity -> unclear campaign-to-booking proof.

### New funnel (code-proven)
Traffic -> UTM/source capture -> page/event capture -> CTA/booking-intent tracking -> lead persistence -> notification/reporting -> admin status workflow -> closed_won readiness.

### Current funnel signal chain present in code
- Source capture and local persistence: src/lib/tracking.ts
- Event ingest to DB: src/app/api/analytics/track/route.ts
- Form->lead payload with attribution snapshot: src/app/contact/ContactForm.tsx
- Lead persistence and status controls: src/app/api/leads/route.ts, src/app/api/leads/[id]/status/route.ts
- Dashboard metrics and reports: src/app/api/dashboard/summary/route.ts, src/lib/report-email.ts

## 6) CRM / Database Audit

### Database provider
- Supabase Postgres via @supabase/supabase-js.

### Inferred tables from code
- leads
- traffic_events
- chat_sessions
- chat_messages
- utm_links

### Lead fields captured (observed)
- first_name, last_name, email, phone, stay_duration, message
- source, medium, campaign, term, content, referrer
- page, page_url, landing_page, device_type
- session_id/visitor_id (metadata)
- gclid, fbclid, ttclid
- status lifecycle: new/responded/open_sale/closed_won/not_interested
- request context metadata: ip/user_agent/device/country/region/city/lat/long

### Event fields captured (observed)
- session_id, visitor_id
- event_type
- page
- source/medium/campaign/term/content
- referrer
- gclid/fbclid
- metadata with request context

### Admin dashboard visible fields
- KPI totals (events, views, clicks, leads, won, rates)
- traffic by source/campaign/page
- lead status and update controls
- country/device summary buckets

### Suggested CRM fields verification against requested list
Status:
- id: present
- created_at: present
- name: split first_name/last_name
- email: present
- phone: present
- whatsapp: not dedicated field (phone used)
- apartment_type: not explicitly persisted in leads route (gap)
- stay_duration: present
- check_in_date: not observed (gap)
- message: present
- source/medium/campaign/content/term: present
- landing_page/referrer/device: present
- cta_clicked: event-side, not direct lead field
- lead_status: present as status
- assigned_to: not observed (gap)
- notes: not observed as dedicated field (gap)
- booking_status: partially via status; dedicated booking model not observed (gap)
- revenue: not observed (gap)
- vhp_reference: not observed (gap)

## 7) Admin Dashboard Audit

### What admin currently shows
- Overview KPIs and top source/page views
- Lead list and status updates
- Marketing tab with GA4 trends, source explorer, and campaign links
- Chat history panel
- UTM builder and saved links
- Reporting panel (preview and send)
- Traffic intelligence panel with country/device segmentation and hide-unknown filtering

### Lead controls
- Status transitions supported by PATCH endpoint.
- Quick mailto/WhatsApp action buttons in applications panel.

### Filters/exports
- Lead status filters in overview.
- Marketing source/channel filters.
- Report send and PDF intent UI exists.
- No robust CSV export endpoint observed.

### Authentication method
- Password login endpoint issues signed session cookie.
- Session validation performed server-side on admin APIs.

### Security risk assessment (priority)
High priority findings:
1. Single shared password model (no user identities, no role separation, no MFA).
2. Admin login endpoint has no explicit brute-force/rate-limit guard.
3. Session signing secret falls back to admin password when dedicated secret is absent.
4. No audit log table/mechanism observed for admin actions.
5. CSP allows unsafe-inline and unsafe-eval with broad https script allowance; hardening recommended.

Medium priority findings:
1. X-Frame-Options uses ALLOW-FROM (legacy behavior, inconsistent modern browser support).
2. supabase-admin fallback to anon key if service key missing can cause privilege ambiguity and operational misconfiguration risk.

Required recommendation set (owner priority):
- Implement Supabase Auth or equivalent identity provider with per-user accounts.
- Enforce role-based access control for admin data/actions.
- Add rate limiting + lockout policy on admin login.
- Separate ADMIN_SESSION_SECRET from password and rotate both.
- Add admin audit logging (login, status changes, report sends).

## 8) GA4 / Google Analytics Audit

### GA4 installation status
- Present in client analytics component.
- Measurement ID read from env (NEXT_PUBLIC_GA_MEASUREMENT_ID).
- gtag and dataLayer setup present.
- send_page_view disabled in config; custom page_view fired manually on route changes.

### What is tracked in code
- page_view: yes
- CTA and booking-intent style events: yes (cta_click, booking_intent)
- form_start/form_submit/lead_created: yes
- scroll_depth and engaged_session: yes
- performance metrics and image load alerts: yes

### Required events vs current
Implemented or close equivalents:
- page_view
- apartment-page and offer interactions inferred through page_path + cta_click
- book_now/book_apartment style intent via booking_intent
- whatsapp_click is not dedicated event name; captured via social_click and/or booking_intent classification
- form_start
- form_submit

Not explicitly found as distinct named events (recommend add as explicit events):
- source_detected
- landing_page_view (currently derivable but not explicit event)
- solo_view/studio_view/soho_view as explicit names
- offer_view as explicit event
- email_click as explicit event
- auto_reply_sent/team_notification_sent
- lead_status_updated
- booking_confirmed
- revenue_recorded
- lost_lead_reason

### Measurement ID handling
- Use masked reporting in owner outputs; do not expose full sensitive config values.

## 9) Meta Pixel / Ads Tracking Audit

### Status
- Meta Pixel init script present when NEXT_PUBLIC_META_PIXEL_ID exists.
- fbq consent defaults to revoke until consent update.
- Event mapping includes PageView and Lead equivalents.

### Tracked
- PageView: yes
- Lead (mapped from form_submit/lead_created): yes
- CTA custom event: yes

### Missing or not explicit
- Dedicated WhatsAppLead custom event name
- Dedicated ApartmentInterest and OfferInterest event names
- Standard Contact/Schedule/CompleteRegistration style events not explicitly mapped

## 10) Google Ads / Conversion Tracking Audit

### Status
- No AW- tag or gtag_report_conversion implementation found in source.
- Current Google Ads mention is policy/template documentation and dashboard linking.

### Implication
- Google Ads conversion proof is not code-proven in this repository.

### Recommendation
- Add dedicated Google Ads conversion tags for key conversion points:
  - WhatsApp click
  - Form submit
  - Qualified lead status
  - Booking confirmed (if operationally available)

## 11) UTM and Source Attribution Audit

### How UTMs are captured
- Query params parsed and normalized to lowercase snake_case.
- latest and first touch saved in localStorage and a cookie.
- Session/visitor IDs generated client-side and included in lead/event payloads.

### Storage path
- UTM fields sent to /api/leads and persisted.
- Event stream /api/analytics/track stores source/campaign dimensions.

### WhatsApp/source preservation
- Outbound booking/contact links are decorated with latest UTM values when clicked.

### Forms and attribution
- ContactForm enriches lead payload with attribution snapshot before posting to /api/leads.

### Dashboard attribution visibility
- Overview source/campaign and marketing source tables exist.
- UTM Builder exists for campaign URL governance.

### Remaining risks
- If manual booking entry system does not carry source/campaign identifiers forward, end-to-end revenue attribution breaks downstream.

## 12) Automations Audit

| Trigger | Action | Data Sent | Destination | Business Value | Proof |
|---|---|---|---|---|---|
| Contact form submit | Admin + user confirmation emails | Name, email, phone, stay duration, message | Resend recipients + user | Fast acknowledgment and ops alerting | src/app/api/contact/route.ts |
| Lead API submit | Auto-reply + internal lead alert | Lead identity + attribution + context | Resend | Immediate follow-up signal | src/app/api/leads/route.ts |
| Lead API submit (conditional) | External activity log POST | actor/action/metadata | JARVIS endpoint | Operational visibility if configured | src/app/api/leads/route.ts |
| Manual report send | Build and send HTML report | Supabase + GA4 aggregates | Resend recipients | Owner-facing periodic insight | src/app/api/admin/reports/send/route.ts, src/lib/report-email.ts |
| Scheduled cron daily | Calls report build/send | Daily period payload | /api/cron/reports | Automated reporting cadence | vercel.json, src/app/api/cron/reports/route.ts |
| Scheduled cron weekly | Calls report build/send | Weekly period payload | /api/cron/reports | Weekly management summary | vercel.json, src/app/api/cron/reports/route.ts |

Observed not implemented in production website code:
- Telegram inbound automation flow
- n8n/Zapier runtime webhook pipelines for TS Residence website funnel
- Native WhatsApp CRM writeback

## 13) SEO / Technical Search Audit

### Present
- Metadata configured in root layout and page-level metadata.
- Canonicals present in multiple routes (for example /faq and apartment details).
- Sitemap generated at /sitemap.xml via app route.
- Robots generated at /robots.txt via app route.
- FAQ schema present (/faq).
- ApartmentComplex JSON-LD present in root layout.
- Open Graph and Twitter cards configured in root and apartment metadata.
- llms.txt present.

### Redirect checks (requested legacy routes)
Live verification:
- /solo-apartment -> 308 -> /apartments/solo
- /studio-apartment -> 308 -> /apartments/studio
- /soho-apartment -> 308 -> /apartments/soho
- /apartments/solo, /apartments/studio, /apartments/soho all return 200

## 14) Performance / Build Audit

### Package manager
- pnpm (pnpm-lock.yaml present).

### Commands executed
- pnpm -s lint
- pnpm -s build

### Results
Build:
- PASS. Next.js production build completed; route manifest generated.

Lint:
- FAIL (61 issues: 20 errors, 41 warnings).
- Main error clusters:
  - react-hooks/set-state-in-effect in admin/page/navbar/applications panels
  - no-explicit-any in tracking/report-email/analytics
  - unescaped apostrophes in report/admin and five-star page

### Route health spot checks (production via curl -I)
- /, /offers, /contact, /admin -> 200
- legacy redirects -> 308 to canonical apartment routes
- /robots.txt and /sitemap.xml -> 200

### Playwright/browser functional testing
- Not executed as a full scripted suite in this audit pass.
- HTTP route availability validated via curl; browser pages are open in session but no full transactional E2E run was performed.

## 15) Old vs New Comparison

| Category | Old Website | New System | Business Impact |
|---|---|---|---|
| Tech stack | Typical brochure CMS model | Next.js App Router + API + typed code | Faster iteration and system control |
| Speed/performance | Limited code-level controls | Modern build pipeline and route optimization | Better UX and SEO resilience |
| Mobile UX | Content-first pages | Componentized responsive UX + CTA instrumentation | Better conversion opportunities |
| Image delivery | Basic/static model | remotePatterns + proxy fallback + modern formats | More reliable media delivery |
| SEO | Basic pages | metadata, sitemap, robots, canonicals, schema | Better crawl and discoverability |
| Analytics | Partial/guesswork | GA4 + first-party event persistence | Measurable behavior insight |
| Meta Pixel | Often inconsistent | Pixel init + event mapping in tracking layer | Better paid social signal quality |
| Google Ads | Weak/no proof | gclid handling present, but no conversion tag proof | Partial readiness, not complete |
| UTM tracking | Inconsistent manual | first/latest touch capture + UTM builder + DB fields | Campaign attribution visibility |
| Lead capture | Form/email only | Form + lead API + dedupe + metadata capture | Less lead loss, better context |
| Database | Not centralized | Supabase tables inferred for leads/events/chats/utm | Data ownership and retrieval |
| CRM/admin | Minimal | /admin with lead statuses, filters, reports | Operational control panel |
| WhatsApp tracking | Manual click unknown | click classification + booking_intent + UTM decoration | Better handoff attribution |
| Form tracking | Basic submit | form_start/form_submit/lead_created instrumentation | Better dropoff analysis |
| Email auto-response | Often manual | Automated via Resend routes | Faster response expectations |
| Team alerts | Manual relay | Automated lead/admin notifications | Faster sales response |
| Dashboard visibility | Fragmented | Unified admin metrics + traffic intelligence | Management clarity |
| Sales pipeline | Unstructured | status workflow (new -> won etc.) | Better pipeline governance |
| Reporting | Manual compilation | On-demand + scheduled reports | Owner-ready recurring insight |
| Scalability | Plugin-dependent | Modular app + API architecture | Stronger long-term extensibility |
| Ownership of data | Limited export/control | first-party event + lead storage | Improved strategic independence |
| Error detection | Reactive | lint/build observability and typed code | Faster issue isolation |
| Revenue attribution readiness | Weak | strong upper funnel instrumentation, downstream gaps remain | Requires VHP/ops integration for full ROAS proof |

## 16) What We Can Prove vs Cannot Prove

| Claim | Can prove from code? | Can prove from live site? | Need screenshot/data? | Evidence |
|---|---|---|---|---|
| Public pages exist | Yes | Yes | Optional | src/app/*/page.tsx + live 200 checks |
| Admin dashboard exists | Yes | Yes | Optional | src/app/admin/page.tsx + live /admin 200 |
| Lead DB integration exists | Yes | Partially | Yes (DB rows) | src/app/api/leads/route.ts |
| GA4 installed | Yes | Partially | Yes (Realtime) | src/components/Analytics.tsx |
| Meta Pixel installed | Yes | Partially | Yes (Pixel helper/events manager) | src/components/Analytics.tsx, src/lib/tracking.ts |
| Google Ads conversion tracking installed | No strong proof | No | Yes | search result: no AW-/gtag_report_conversion |
| Emails send | Code path yes | Not proven in this run | Yes (delivery logs) | src/app/api/contact/route.ts, src/lib/report-email.ts |
| Team alerts send | Code path yes | Not proven in this run | Yes | src/app/api/leads/route.ts |
| Leads stored | Code path yes | Not proven in this run | Yes (Supabase query) | src/app/api/leads/route.ts |
| VHP booking conversion loop complete | No | No | Yes (ops data) | no direct VHP integration found |
| ROAS end-to-end proof | Not complete | Not complete | Yes | depends on downstream booking/revenue capture |

Critical data bottleneck statement:
- If VHP/manual booking records do not preserve lead source and campaign identifiers, true ad-to-booking ROAS cannot be fully proven. This is a cross-system attribution continuity gap, not purely a website rendering issue.

## 17) Management Explanation

The new platform enables diagnosis instead of guessing. If sales are down, management can ask:
- Did traffic volume drop?
- Did acquisition channel mix change?
- Did users still click CTAs and booking intent links?
- Did form submissions and lead volume hold?
- Did follow-up status move from new to won?
- Did booking outcomes fail due to pricing/availability/response process?
- Did manual booking systems preserve source metadata?

This changes decision-making from opinion-led to data-led.

## 18) Action Plan

### P0 (Urgent)
1. Replace shared password admin auth with identity-based auth (Supabase Auth or equivalent) and RBAC.
2. Add login rate limiting/lockout and admin audit logs.
3. Rotate admin/session/email/data credentials and enforce dedicated session secret.
4. Validate GA4/Meta live events with production debugging and event QA checklist.
5. Confirm lead persistence and email delivery with monitored test transactions.
6. Confirm legacy redirects continue passing in production after each deploy.

### P1
1. Add lead-assignment and notes fields.
2. Add lost_lead_reason and structured pipeline reason codes.
3. Add vhp_reference, booking_status, revenue fields and admin UI controls.
4. Add dashboard export (CSV/API) and richer filtering.
5. Add explicit WhatsApp and email click event names for cleaner reporting.

### P2
1. Weekly owner dashboard automation with richer KPI templates.
2. HTML->PDF report pipeline hardened (server-side render/export strategy).
3. Ads platform API ingestion (Meta/Google) for spend + performance joins.
4. Search Console integration and ranking diagnostics.
5. BigQuery/Looker Studio integration for executive BI.
6. WhatsApp CRM integration for closed-loop tracking.

## 19) Evidence Appendix

### Core app and routes
- src/app/layout.tsx
- src/app/sitemap.ts
- src/app/robots.ts
- src/app/apartments/[slug]/page.tsx
- src/app/admin/page.tsx

### API routes
- src/app/api/leads/route.ts
- src/app/api/leads/[id]/status/route.ts
- src/app/api/contact/route.ts
- src/app/api/analytics/track/route.ts
- src/app/api/dashboard/summary/route.ts
- src/app/api/admin/reports/data/route.ts
- src/app/api/admin/reports/send/route.ts
- src/app/api/admin/traffic/context-summary/route.ts
- src/app/api/admin/utm-links/route.ts
- src/app/api/marketing/summary/route.ts
- src/app/api/marketing/integrations/route.ts
- src/app/api/cron/reports/route.ts
- src/app/api/chat/route.ts
- src/app/api/chat/log/route.ts

### Libraries and tracking
- src/lib/tracking.ts
- src/components/Analytics.tsx
- src/lib/ga4-reporting.ts
- src/lib/report-email.ts
- src/lib/admin-auth.ts
- src/lib/api-security.ts
- src/lib/request-context.ts
- src/lib/supabase.ts
- src/lib/supabase-admin.ts

### Deployment/config
- package.json
- next.config.ts
- tsconfig.json
- vercel.json
- .env.local.example
- public/llms.txt

### Build/lint evidence summary
- Build: pass (pnpm -s build)
- Lint: fail (pnpm -s lint; 20 errors, 41 warnings)

## 20) Final Owner-Facing Summary

Before, TS Residence had a website that showed information. Now it has a measurable digital operating system. The system can track where traffic comes from, what users click, which apartments they view, when they contact the team, and whether follow-up happens.

The remaining gap is not the website structure; it is completing proof between website leads, manual sales handling, VHP booking entry, and final revenue attribution.
