# TS Residence Admin System — Complete Guide for Replication

## Overview

The admin system is a complete CRM + analytics + reporting infrastructure built on:
- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Database:** Supabase PostgreSQL
- **Email:** Resend API
- **Analytics:** GA4 + Meta Pixel
- **Scheduling:** Vercel Crons

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Public Website                            │
│  (Homepage, Apartments, Contact, Offers)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
        ┌────────▼─────────┐    ┌─────────▼────────┐
        │  WhatsApp Click  │    │  Booking Modal   │
        │  Capture Modal   │    │  (4-step flow)   │
        └────────┬─────────┘    └─────────┬────────┘
                 │                         │
                 └────────────┬────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Lead Creation    │
                    │  (/api/leads)     │
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼─────┐        ┌──────▼──────┐      ┌──────▼──────┐
   │ Supabase │        │ GA4 + Meta   │      │  Team Alert │
   │ leads    │        │  Pixel       │      │   Email     │
   │ table    │        │  (analytics) │      │ (Resend)    │
   └────┬─────┘        └──────┬──────┘      └──────┬──────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Admin Dashboard │
                    │   (/admin)        │
                    └───────────────────┘
```

---

## Core Tables (Supabase)

### 1. **leads**
Stores all lead submissions from website visitors.

```sql
-- Required columns:
- id (UUID) — primary key
- created_at (timestamp with timezone)
- first_name (text, required)
- last_name (text, required)
- email (text, required, unique per 24h)
- phone (text, optional)
- message (text, optional)
- status (text) — 'new', 'open_sale', 'closed_won', 'closed_lost'
- cta_clicked (text) — 'booking_intent', 'whatsapp_button', etc.
- lead_page (text) — page where lead was captured
- session_id (text) — visitor session ID
- visitor_id (text) — unique visitor ID
- first_source (text) — utm_source from first touch
- first_medium (text) — utm_medium from first touch
- first_campaign (text) — utm_campaign from first touch
- latest_source (text) — utm_source from latest touch
- latest_medium (text) — utm_medium from latest touch
- latest_campaign (text) — utm_campaign from latest touch
- attribution (jsonb) — full attribution object
- metadata (jsonb) — flexible custom fields (wa_followup_sent, risk_score, location, etc.)
```

### 2. **traffic_events**
Stores every page view, CTA click, and event on the website.

```sql
-- Required columns:
- id (UUID) — primary key
- created_at (timestamp with timezone)
- session_id (text) — visitor session
- visitor_id (text) — unique visitor
- event_type (text) — 'page_view', 'cta_click', 'booking_intent', 'booking_intent', etc.
- page (text) — page path
- source (text) — utm_source
- medium (text) — utm_medium
- campaign (text) — utm_campaign
- term (text) — utm_term
- content (text) — utm_content
- referrer (text) — HTTP referer
- gclid (text) — Google Click ID
- fbclid (text) — Facebook Click ID
- metadata (jsonb) — IP, device_type, country, region, city, latitude, longitude, etc.
```

### 3. **generated_tracking_links** (NEW)
Stores team-generated UTM campaign links.

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

CREATE INDEX idx_generated_links_campaign ON public.generated_tracking_links(campaign_name);
CREATE INDEX idx_generated_links_brand ON public.generated_tracking_links(brand);

ALTER TABLE public.generated_tracking_links ENABLE ROW LEVEL SECURITY;
```

---

## Frontend Components

### 1. **WhatsAppCaptureModal.tsx**
Intercepts WhatsApp button clicks and captures email before redirect.

**Location:** `src/components/WhatsAppCaptureModal.tsx`

**Features:**
- Modal pops up when user clicks WhatsApp CTA
- Collects: name (optional), email (optional)
- Offers "Skip" option
- Submits lead with `cta_clicked = 'whatsapp_button'`
- Pre-fills visitor's UTM parameters from localStorage

**Usage:**
```tsx
// Automatically wired in layout.tsx
// Listens for custom event:
window.dispatchEvent(new CustomEvent("wa-capture", { detail: { ... } }))
```

### 2. **BookingModal.tsx**
4-step modal replacing `/contact` page for booking conversions.

**Location:** `src/components/BookingModal.tsx`

**Flow:**
1. **Step 1 — Apartment Selection:** Choose apartment or "not sure yet"
2. **Step 2 — Stay Dates:** Pick check-in date, duration (1mo-12mo, custom)
3. **Step 3 — Details:** Name (required), email (required), phone (optional), message (optional)
4. **Step 4 — Confirmation:** Summary + dual CTA (WhatsApp or Email)

**Features:**
- Pre-populates apartment if passed in detail object
- Pre-fills WhatsApp message with visitor's selections
- Validates email before submission
- Submits to `/api/leads` with full UTM attribution
- Logs to `traffic_events` with `event_type = 'booking_intent'`

**Usage:**
```tsx
// Wire to all Book buttons:
window.dispatchEvent(new CustomEvent("booking-modal-open", { detail: { apartment: "solo" } }))
```

### 3. **GeneratedLinksPerformance.tsx** (NEW)
Dashboard component showing real-time metrics for each generated campaign link.

**Location:** `src/app/admin/GeneratedLinksPerformance.tsx`

**Metrics per campaign:**
- Total visits (from traffic_events where campaign matches)
- CTA clicks (booking_intent events for that campaign)
- Leads generated (from leads table where first_campaign matches)
- Conversion rate (CTA clicks / visits)

**Data source:** `/api/admin/generated-links-performance`

---

## API Endpoints

### **Public-Facing**

#### `POST /api/leads`
Create a lead record.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+62123456789",
  "message": "Interested in SOLO apartment",
  "apartment": "solo",
  "utm_source": "instagram",
  "utm_medium": "story",
  "utm_campaign": "may-promo"
}
```

**Response:**
```json
{
  "id": "uuid",
  "created_at": "2026-05-11T...",
  "first_name": "John",
  "email": "john@example.com",
  "status": "new",
  "attribution": { "first_source": "instagram", ... }
}
```

**Features:**
- Deduplication: checks for duplicate email within 24h
- Risk scoring: flags high IP velocity, invalid phone
- Attribution locking: URL params > localStorage > body > direct
- Auto-reply email to visitor
- Team notification email
- Jarvis activity logging

---

#### `POST /api/analytics/track`
Log traffic event (page view, CTA click, etc.).

**Request:**
```json
{
  "sessionId": "session-uuid",
  "visitorId": "visitor-uuid",
  "eventType": "cta_click",
  "page": "/apartments/solo",
  "source": "instagram",
  "medium": "story",
  "campaign": "may-promo",
  "term": null,
  "content": null,
  "referrer": "https://instagram.com",
  "metadata": { "link_url": "https://wa.me/..." }
}
```

**Response:**
```json
{
  "success": true
}
```

**Features:**
- Rate limiting: 180 requests per 10 minutes per IP
- Bot detection: skips bot traffic
- Admin traffic filtering: skips internal events
- Geolocation: enriches with IP-based country/city/lat/long

---

#### `GET /api/leads/unsubscribe?leadId=X&email=Y&token=Z`
One-click unsubscribe from WhatsApp follow-ups.

**Features:**
- HMAC-SHA256 token validation
- Updates lead metadata: `wa_followup_opt_out = true`
- Returns HTML confirmation page (no redirect)

---

### **Admin-Only**

#### `GET /api/admin/session`
Validates admin session.

**Response:**
```json
{
  "authenticated": true,
  "sessionId": "session-uuid"
}
```

---

#### `POST /api/admin/utm-links`
Create a new tracked UTM campaign link.

**Request:**
```json
{
  "name": "May Story Promo",
  "utm_source": "instagram",
  "utm_medium": "story",
  "utm_campaign": "may-promo",
  "utm_content": "solo-apt",
  "utm_term": null,
  "full_url": "https://www.tsresidence.id/apartments/solo?utm_source=...",
  "brand": "ts-residence"
}
```

**Response:**
```json
{
  "id": "uuid",
  "created_at": "2026-05-11T...",
  "campaign_name": "may-promo",
  "note_title": "May Story Promo",
  "generated_url": "https://...",
  "utm_source": "instagram",
  "utm_medium": "story"
}
```

**Features:**
- Saves to `generated_tracking_links` table
- Brand filtering (ts-residence vs no1-wellness)
- Accessible from Admin UTM Builder

---

#### `GET /api/admin/generated-links-performance?brand=ts-residence`
Get real-time performance for each generated link.

**Response:**
```json
[
  {
    "id": "uuid",
    "campaign_name": "may-promo",
    "utm_campaign": "may-promo",
    "total_visits": 1245,
    "cta_clicks": 47,
    "leads_generated": 12,
    "conversion_rate": "3.78%"
  }
]
```

---

#### `GET /api/admin/reports/data?period=daily&to=email@example.com`
Fetch report data without sending email.

**Response:**
```json
{
  "pageViews": 145,
  "bookClicks": 23,
  "totalEvents": 512,
  "whatsappClicks": 5,
  "conversionRate": "15.9%",
  "totalLeads": 8,
  "wonLeads": 2,
  "newLeads": 4,
  "openSale": 2,
  "topSources": [ ... ],
  "topPages": [ ... ],
  "topCampaigns": [ ... ]
}
```

---

#### `POST /api/admin/reports/send?type=daily&to=email@example.com`
Manually send a report email.

**Features:**
- Daily/weekly/mtd/alltime periods
- Timezone-aware: converts to Bali time (UTC+8) before querying
- Customizable recipients
- HTML formatted email with KPI cards, charts, lead pipeline

---

### **Cron Endpoints** (Vercel Crons)

#### `GET /api/cron/reports?type=daily` 
Scheduled daily report (10am UTC = 6pm Bali time).

**Auth:** `Authorization: Bearer ${CRON_SECRET}` (Vercel injects automatically)

**Features:**
- Runs daily at 10am UTC
- Queries traffic from yesterday's Bali timezone boundary
- Sends to REPORT_RECIPIENTS
- Fallback: emails are also sent via `/api/admin/reports/send` endpoint

---

#### `GET /api/cron/wa-followup`
Scheduled 2-day follow-up email to WhatsApp captures.

**Auth:** `Authorization: Bearer ${CRON_SECRET}`

**Features:**
- Runs daily at 1am UTC
- Finds leads with `cta_clicked = 'whatsapp_button'`, aged 44-52 hours
- Skips leads with `wa_followup_sent = true` or `wa_followup_opt_out = true`
- Generates HMAC-signed unsubscribe token
- Sends personalized email via Resend
- Updates lead metadata: `wa_followup_sent = true`

---

## Admin Dashboard Pages

### **1. /admin**
Main dashboard entry point with tabs:
- **Dashboard:** Overall KPIs, lead pipeline, recent activity
- **Applications:** Lead management with full attribution
- **Marketing:** GA4 source attribution, traffic trends
- **Reports:** Manual report generation and download
- **UTM Builder:** Campaign link generator with performance dashboard
- **Chat:** AI-powered lead research assistant
- **Traffic Intelligence:** Source breakdown, page performance

### **2. /admin/page.tsx** (Main Layout)
- Tab navigation
- Session validation
- Protected routes (redirects to login if unauthenticated)
- Component mounting based on tab selection

### **3. Key Admin Components**

**AdminApplicationsPanel.tsx**
- Table of all leads with sortable columns
- Filters: status, source, campaign
- Shows: name, email, phone, source, campaign, status, created date
- Actions: update status (new → open_sale → closed_won), delete lead
- Inline editing for campaign/source fields

**ReportPanel.tsx**
- Period selector: daily, weekly, mtd, alltime
- Recipient input (defaults to REPORT_RECIPIENTS)
- Manual send button
- Shows last sent date/time
- Email preview

**UtmBuilder.tsx**
- Link generator with dropdowns for source, medium, campaign
- Quick presets (IG Story, IG Reel, etc.)
- Save to history button
- Saved links table with copy button
- Performance dashboard showing real-time metrics per link

**TrafficIntelligencePanel.tsx**
- Traffic source breakdown (bar chart)
- Top pages by views
- Device/OS distribution
- Geographic heatmap
- Time series chart (ga4 data)

**MarketingDashboard.tsx**
- GA4 integration pulling real data
- Source attribution breakdown
- Channel performance (paid-social, organic-search, direct, referral)
- Top landing pages
- Conversion events

---

## Key Features & Workflows

### **1. Lead Capture**

**Flow:**
```
Visitor lands on site 
  → UTM params captured in localStorage (getUTMs function)
  → Visitor clicks "Book" button
  → BookingModal opens (4-step flow)
  → Visitor fills details
  → Submit to /api/leads
  → Lead created in Supabase
  → Attribution locked (first/latest touch saved)
  → Traffic event logged (event_type = 'booking_intent')
  → Team notification email sent
```

**Attribution Priority:**
1. URL query params (`?utm_source=...`)
2. Latest touch from localStorage
3. Body field defaults
4. Direct (no source)

---

### **2. WhatsApp Follow-Up Automation**

**Flow:**
```
Visitor clicks WhatsApp button
  → WhatsAppCaptureModal intercepts
  → Visitor provides email (optional)
  → Lead created with cta_clicked = 'whatsapp_button'
  → 44-52 hours later...
  → /api/cron/wa-followup triggers (1am UTC daily)
  → Queries: leads WHERE cta_clicked = 'whatsapp_button' AND created_at 44-52h ago
  → Filters: skip if wa_followup_sent = true OR wa_followup_opt_out = true
  → For each lead: generate HMAC token, send email with unsubscribe link
  → Lead metadata updated: wa_followup_sent = true
  → Visitor can click unsubscribe link
  → Lead metadata updated: wa_followup_opt_out = true
  → Future crons skip this lead
```

---

### **3. Campaign Link Tracking**

**Flow:**
```
Team member goes to /admin → UTM Builder
  → Fills campaign details (source, medium, campaign, page)
  → Clicks "Save to History"
  → POST to /api/admin/utm-links
  → Link saved to generated_tracking_links table
  → Team member shares link on Instagram/Facebook/Email
  → Visitor clicks link
  → UTM params captured in localStorage
  → Traffic logged to traffic_events
  → /api/admin/generated-links-performance joins data:
     - traffic_events.campaign matches generated_tracking_links.utm_campaign
     - Count visits, clicks, leads
     - Calculate conversion rate
  → Performance dashboard shows real-time metrics
```

---

### **4. Daily Email Reports**

**Schedule:** 10am UTC (6pm Bali time) daily

**Timezone Fix:**
The report queries use **Bali timezone (UTC+8)** to calculate date boundaries:
- When cron runs at 10am UTC = 6pm Bali
- Report should include all Bali traffic from yesterday midnight
- Query window: yesterday Bali midnight → today Bali midnight
- Converts to UTC ISO format for Supabase query

**Data Included:**
- KPIs: page views, CTA clicks, WhatsApp clicks, leads, closed won
- Lead pipeline: new, open_sale, closed_won percentages
- Top traffic sources with bar chart
- Top pages by views
- Top campaigns
- Recent leads list (first 5)
- GA4 integration summary

---

## Environment Variables

```bash
# Public (next.config.ts accessible)
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key]
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXX
NEXT_PUBLIC_META_PIXEL_ID=123456789

# Server-only
SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[service role key]
RESEND_API_KEY=re_XXXXX
CRON_SECRET=[random 32-char hex]
ADMIN_PASSWORD=[shared password]
LEAD_UNSUBSCRIBE_SECRET=[random 32-char hex] (fallback: CRON_SECRET)

# GA4 Integration
GA4_PROPERTY_ID=123456789
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=...
GA4_OAUTH_CLIENT_ID=...
GA4_OAUTH_CLIENT_SECRET=...
GA4_OAUTH_REFRESH_TOKEN=...

# Email Recipients
# (hard-coded in report-email.ts)
const REPORT_RECIPIENTS = [
  "email1@example.com",
  "email2@example.com",
  "email3@example.com"
];
```

---

## Deployment Checklist for No.1 Wellness

### **1. Database Setup**
- [ ] Create Supabase project
- [ ] Create `leads` table with all attribution columns
- [ ] Create `traffic_events` table
- [ ] Create `generated_tracking_links` table
- [ ] Enable RLS on all tables
- [ ] Create indexes on campaign, source, created_at

### **2. Environment Variables**
- [ ] Set all SUPABASE_* keys in Vercel
- [ ] Generate and set CRON_SECRET
- [ ] Set RESEND_API_KEY
- [ ] Configure GA4 integration (or skip if not using)
- [ ] Update ADMIN_PASSWORD (or replace with user auth)

### **3. Email & Recipients**
- [ ] Update REPORT_RECIPIENTS in `src/lib/report-email.ts`
- [ ] Update team alert recipients in `/api/leads` route
- [ ] Test Resend API with sample email

### **4. Cron Configuration**
- [ ] Update `vercel.json` with correct cron schedules
- [ ] Update timezone function in `report-email.ts` if not UTC+8
- [ ] Test cron endpoints locally with CRON_SECRET

### **5. Frontend Branding**
- [ ] Update colors in Tailwind (currently gold #c5a572)
- [ ] Update apartment options in BookingModal
- [ ] Update page list in UtmBuilder
- [ ] Update logo/header text in admin dashboard

### **6. Testing**
- [ ] Test lead submission flow
- [ ] Test booking modal
- [ ] Test WhatsApp capture
- [ ] Test daily report generation
- [ ] Test UTM link creation
- [ ] Test performance dashboard
- [ ] Test unsubscribe link

### **7. Security**
- [ ] Replace shared ADMIN_PASSWORD with user accounts (TODO)
- [ ] Add rate limiting to login (TODO)
- [ ] Rotate CRON_SECRET and LEAD_UNSUBSCRIBE_SECRET quarterly
- [ ] Enable VPC (Vercel) if using enterprise
- [ ] Regular backups of Supabase database

---

## File Structure Reference

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx                    (main dashboard)
│   │   ├── AdminApplicationsPanel.tsx  (leads table)
│   │   ├── ReportPanel.tsx             (manual reports)
│   │   ├── UtmBuilder.tsx              (campaign links + performance)
│   │   ├── MarketingDashboard.tsx      (GA4 integration)
│   │   ├── TrafficIntelligencePanel.tsx
│   │   ├── ChatHistoryPanel.tsx
│   │   └── GeneratedLinksPerformance.tsx (NEW)
│   ├── api/
│   │   ├── leads/
│   │   │   ├── route.ts               (POST: create lead)
│   │   │   ├── [id]/status/route.ts   (PUT: update status)
│   │   │   └── unsubscribe/route.ts   (GET: opt-out)
│   │   ├── analytics/track/route.ts   (POST: log event)
│   │   ├── admin/
│   │   │   ├── login/route.ts
│   │   │   ├── session/route.ts
│   │   │   ├── utm-links/route.ts     (UPDATED: uses generated_tracking_links)
│   │   │   ├── generated-links-performance/route.ts (NEW)
│   │   │   └── reports/...
│   │   └── cron/
│   │       ├── reports/route.ts       (daily/weekly email)
│   │       └── wa-followup/route.ts   (2-day WhatsApp follow-up)
│   ├── components/
│   │   ├── WhatsAppCaptureModal.tsx
│   │   ├── BookingModal.tsx
│   │   └── ... (other UI components)
│   └── globals.css
├── lib/
│   ├── tracking.ts                    (getUTMs, trackEvent)
│   ├── report-email.ts                (email HTML builder, timezone fix)
│   ├── supabase-admin.ts              (admin client)
│   ├── api-security.ts                (rate limiting, bot detection)
│   ├── request-context.ts             (geolocation, device detection)
│   ├── admin-auth.ts                  (session validation)
│   └── ... (other utilities)
```

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Daily report blank | Timezone mismatch | Use Bali timezone (UTC+8) in `supabaseSince()` |
| Reports not sending | CRON_SECRET not set | Add to Vercel env vars, restart dev server |
| Leads not saving | Email dedup within 24h | Change email or wait 24h |
| UTM params not captured | localStorage not being read | Check `getUTMs()` in tracking.ts |
| Campaign links not showing metrics | Wrong table name | Verify `generated_tracking_links` table exists |
| High bounce rate on generated links | Long URL | Use URL shortener (bit.ly, etc.) |

---

## Next Steps for No.1 Wellness

1. **Clone the codebase structure** to your project
2. **Update branding** (colors, logos, apartment options)
3. **Create Supabase tables** using the SQL above
4. **Set environment variables** in Vercel
5. **Test all flows locally** before deploying
6. **Deploy to Vercel** with GitHub integration
7. **Monitor admin dashboard** for data accuracy
8. **Adjust email recipients** and cron schedules as needed

---

## Support References

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Resend Docs:** https://resend.com/docs
- **Vercel Crons:** https://vercel.com/docs/cron-jobs
- **GA4 Reporting API:** https://developers.google.com/analytics/devguides/reporting/core/v4
