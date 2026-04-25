# TS Residence Tracking & CRM Verification Report

## A. Executive Summary

- **Overall tracking status:** Partially Working
- **CRM status:** Working (basic lead capture, some fields missing)
- **UTM status:** Working (UTMs captured, persisted, and attached to leads)
- **GA4 status:** Needs manual verification (GA4 ID and event firing not found in codebase, but GTM/Meta Pixel present)
- **Auto-reply status:** Not found in codebase (needs manual verification)
- **Dashboard status:** Working (admin dashboard exists, shows leads and traffic)
- **SEO/crawl status:** Working (sitemap, robots.txt, canonical, redirects, schema present)

## B. Evidence Table

| Feature                | Status            | Evidence                                                                 | File/Location                                   | Notes |
|------------------------|-------------------|--------------------------------------------------------------------------|-------------------------------------------------|-------|
| GA4 Tracking           | Needs verification| No GA4 ID found, GTM/Meta Pixel present                                 | .env.local, src/components/Analytics.tsx        | Check live site for GA4 events |
| GTM/Meta Pixel         | Present           | GTM/Meta Pixel IDs in .env.local, scripts in Analytics.tsx               | .env.local, src/components/Analytics.tsx        | |
| UTM Capture            | Working           | captureUTMs, getUTMs, appendUTMsToUrl functions                          | src/lib/tracking.ts                             | UTMs stored in localStorage, attached to leads |
| UTM Persistence        | Working           | UTMs stored in localStorage, cookies                                     | src/lib/tracking.ts                             | |
| UTM on Lead            | Working           | UTMs attached to lead POST body                                          | src/app/contact/ContactForm.tsx                 | |
| Lead API               | Working           | /api/leads/route.ts, fields: name, email, phone, message, UTM fields     | src/app/api/leads/route.ts                      | |
| Lead Status            | Working           | status field in admin, updateLeadStatus                                  | src/app/admin/page.tsx                          | |
| Duplicate Lead Handling| Not found         | No deduplication logic found                                             | src/app/api/leads/route.ts                      | |
| Spam Protection        | Not found         | No captcha or spam logic found                                           | src/app/contact/ContactForm.tsx                 | |
| Form Tracking          | Working           | form_submit event tracked                                                | src/app/contact/ContactForm.tsx, tracking.ts    | |
| WhatsApp Tracking      | Needs verification| WhatsApp links present, event tracking logic in tracking.ts               | src/lib/tracking.ts, src/components/Analytics.tsx| Check live for event firing |
| Auto Reply             | Not found         | No auto-reply logic in codebase                                          |                                                 | Needs manual verification |
| Team Notification      | Not found         | No team notification logic in codebase                                   |                                                 | Needs manual verification |
| Admin Dashboard        | Working           | Admin dashboard, lead status, traffic, campaigns                         | src/app/admin/page.tsx                          | |
| SEO: Sitemap           | Working           | sitemap.xml present                                                      | public/sitemap.xml                              | |
| SEO: Robots.txt        | Working           | robots.txt present, allows all, blocks /api/                             | public/robots.txt                               | |
| SEO: Canonical         | Working           | Canonical tags in metadata                                               | src/app/page.tsx, src/app/faq/page.tsx          | |
| SEO: Redirects         | Working           | 301 redirects for old apartment URLs                                     | next.config.ts                                  | |
| SEO: Schema            | Working           | FAQPage, LodgingBusiness, etc. present                                   | src/app/page.tsx, src/app/faq/page.tsx          | |

## C. Event Inventory

| Event Name         | Trigger                | Parameters (examples)                | Destination         | Status           |
|--------------------|------------------------|--------------------------------------|---------------------|------------------|
| page_view          | Route change           | page_name, page_path, device_type    | GTM/Meta/GA4        | Needs verification |
| cta_click          | CTA click              | cta_label, page_path, utm_*          | GTM/Meta/GA4        | Needs verification |
| social_click       | Social link click      | link_url, page_path, utm_*           | GTM/Meta/GA4        | Needs verification |
| nav_click          | Nav link click         | link_url, page_path, utm_*           | GTM/Meta/GA4        | Needs verification |
| form_start         | Form focus             | form_name, page_path, utm_*          | GTM/Meta/GA4        | Needs verification |
| form_submit        | Form submit            | form_name, page_path, utm_*          | GTM/Meta/GA4        | Working           |
| form_error         | Form error             | form_name, error, page_path, utm_*   | GTM/Meta/GA4        | Needs verification |
| scroll_depth       | Scroll milestone       | depth, page_path, utm_*              | GTM/Meta/GA4        | Needs verification |
| engaged_session    | 30s on page            | page_path, device_type, utm_*        | GTM/Meta/GA4        | Needs verification |
| consent_update     | Consent change         | consent_type, page_path              | GTM/Meta/GA4        | Needs verification |
| quiz_complete      | Quiz complete          | quiz_id, result, utm_*               | GTM/Meta/GA4        | Needs verification |
| quiz_abandon       | Quiz abandon           | quiz_id, utm_*                       | GTM/Meta/GA4        | Needs verification |

## D. Lead Database Inventory

| Field              | Exists? | Source                        | Notes |
|--------------------|---------|-------------------------------|-------|
| first_name         | Yes     | ContactForm, /api/leads       | |
| last_name          | Yes     | ContactForm, /api/leads       | |
| email              | Yes     | ContactForm, /api/leads       | |
| phone              | Yes     | ContactForm, /api/leads       | Optional |
| message            | Yes     | ContactForm, /api/leads       | Optional |
| stay_duration      | Yes     | ContactForm, /api/leads       | Optional |
| page               | Yes     | ContactForm, /api/leads       | |
| source             | Yes     | ContactForm, /api/leads       | UTM |
| medium             | Yes     | ContactForm, /api/leads       | UTM |
| campaign           | Yes     | ContactForm, /api/leads       | UTM |
| content            | Yes     | ContactForm, /api/leads       | UTM |
| term               | Yes     | ContactForm, /api/leads       | UTM |
| referrer           | Yes     | ContactForm, /api/leads       | |
| status             | Yes     | Admin dashboard                | |
| created_at         | Yes     | Supabase auto                  | |
| device_type        | No      | Not found                      | |
| apartment_interest | No      | Not found                      | |
| landing_page       | No      | Not found                      | |
| page_url           | No      | Not found                      | |
| auto_reply_sent    | No      | Not found                      | |
| team_notified      | No      | Not found                      | |

## E. Test Lead Result

- **Test URL used:** https://www.tsresidence.id/?utm_source=test_google&utm_medium=cpc&utm_campaign=ts_residence_test&utm_content=audit_button&utm_term=monthly_apartment
- **Timestamp:** Needs manual test
- **Form submitted:** Needs manual test
- **CRM record created:** Needs manual test
- **UTM stored:** Yes (codebase evidence)
- **Auto reply sent:** Needs manual test
- **Team notification sent:** Needs manual test

## F. Screenshots / Logs Needed
- GA4 DebugView event screenshot
- Tag Assistant connected screenshot
- CRM test lead row
- Email auto-reply screenshot
- Admin dashboard screenshot
- Search Console sitemap screenshot

## G. Problems Found

| Issue                                 | Severity |
|---------------------------------------|----------|
| GA4 not found in codebase             | Critical |
| No auto-reply logic found             | High     |
| No team notification logic found      | High     |
| WhatsApp event tracking needs test    | Medium   |
| No deduplication or spam protection   | Medium   |
| Some lead fields missing              | Medium   |
| Device type, landing page not stored  | Low      |

## H. Recommended Fixes

- Add GA4 initialization and event tracking (src/components/Analytics.tsx)
- Implement auto-reply email logic (ContactForm, /api/leads/route.ts)
- Implement team notification logic (ContactForm, /api/leads/route.ts)
- Add deduplication and spam protection (ContactForm, /api/leads/route.ts)
- Add missing lead fields: device_type, landing_page, page_url (ContactForm, /api/leads/route.ts)
- Manually verify WhatsApp event tracking and fix if needed

## I. Final Score

| Area                  | Score (/100) |
|-----------------------|--------------|
| GA4 tracking          | 40           |
| UTM tracking          | 95           |
| CRM lead capture      | 80           |
| WhatsApp tracking     | 60           |
| Form tracking         | 90           |
| Auto reply            | 0            |
| Dashboard             | 90           |
| SEO crawl readiness   | 95           |
| Overall measurement   | 70           |

---

**Note:** Some items require live/manual verification. See screenshots/logs needed section for next steps.
