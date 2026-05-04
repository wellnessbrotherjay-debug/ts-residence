# Events and Tracking

## Current Events

### Analytics Events Tracked

| Event Name | Trigger | Parameters | Destination | File | Status |
|------------|---------|------------|-------------|------|--------|
| `page_view` | Page load | `page_name`, `page_path`, `device_type`, search params | GA4, GTM, Meta Pixel, Supabase | `Analytics.tsx` | ✅ |
| `cta_click` | Button/link click | `page_path`, `link_url`, `link_text`, `device_type` | GA4, GTM, Meta Pixel, Supabase | `Analytics.tsx` | ✅ |
| `social_click` | Social media link click | `page_path`, `link_url`, `link_text`, `device_type` | GA4, GTM, Meta Pixel, Supabase | `Analytics.tsx` | ✅ |
| `nav_click` | Navigation link click | `page_path`, `link_url`, `link_text`, `device_type` | GA4, GTM, Meta Pixel, Supabase | `Analytics.tsx` | ✅ |
| `form_start` | Form interaction initiation | `page_path`, `form_name`, `device_type` | Supabase | `tracking.ts` | ❌ |
| `form_submit` | Form submission | `page_path`, `form_data`, `device_type` | GA4, GTM, Meta Pixel (as Lead), Supabase | `tracking.ts` | ✅ |
| `form_error` | Form validation error | `page_path`, `error_field`, `error_message` | Supabase | `tracking.ts` | ❌ |
| `scroll_depth` | User scrolls to milestone | `page_path`, `depth` (25, 50, 75, 90), `device_type` | GA4, GTM, Meta Pixel, Supabase | `Analytics.tsx` | ✅ |
| `engaged_session` | 30 seconds on page | `page_path`, `device_type` | GA4, GTM, Meta Pixel, Supabase | `Analytics.tsx` | ✅ |
| `consent_update` | GDPR consent change | `consent_type`, `consent_status` | GA4, GTM | `tracking.ts` | ❌ |
| `quiz_complete` | Apartment quiz completion | `quiz_results`, `page_path` | Supabase | `tracking.ts` | ❌ |
| `quiz_abandon` | Quiz abandonment | `progress`, `page_path` | Supabase | `tracking.ts` | ❌ |
| `performance_metric` | Performance measurement | `metric_type`, `value`, `page_path` | Supabase | `tracking.ts` | ❌ |
| `image_load_time` | Image loading performance | `image_url`, `load_time`, `page_path` | Supabase | `tracking.ts` | ❌ |
| `performance_alert` | Performance threshold breach | `metric_type`, `value`, `threshold` | Supabase | `tracking.ts` | ❌ |

### UTM Parameters Captured

| Parameter | Source | Storage | Purpose |
|-----------|--------|---------|---------|
| `utm_source` | URL params | localStorage + cookie | Traffic source |
| `utm_medium` | URL params | localStorage + cookie | Traffic medium |
| `utm_campaign` | URL params | localStorage + cookie | Campaign name |
| `utm_content` | URL params | localStorage + cookie | Ad content |
| `utm_term` | URL params | localStorage + cookie | Search term |
| `gclid` | URL params | localStorage + cookie | Google Click ID |
| `fbclid` | URL params | localStorage + cookie | Facebook Click ID |
| `ttclid` | URL params | localStorage + cookie | TikTok Click ID |

### Tracking Destinations

1. **Google Analytics 4 (GA4)**
   - Configuration: G-ZTL67K3SK0
   - Events: page_view, form_submit, cta_click, scroll_depth, engaged_session
   - Method: gtag() calls

2. **Google Tag Manager (GTM)**
   - Configuration: GTM-XXXXXXX (env-based)
   - Events: All tracked events via dataLayer
   - Method: GTM container script

3. **Meta Pixel (Facebook)**
   - Configuration: 1234567890 (env-based)
   - Events: page_view, form_submit (as Lead), cta_click, scroll_depth
   - Method: fbq() calls

4. **Microsoft Clarity**
   - Configuration: Optional env-based
   - Method: Clarity script injection

5. **Supabase Database**
   - Tables: traffic_events
   - Storage: All events with full metadata
   - Purpose: First-party analytics and CRM integration

## Missing Events

### Critical Business Events
1. **`lead_created`** - Lead submission successful
2. **`booking_intent`** - User shows booking interest
3. **`booking_created`** - Booking reservation made
4. **`booking_confirmed`** - Booking confirmed and paid
5. **`booking_cancelled`** - Booking cancelled
6. **`booking_completed`** - Stay completed
7. **`voucher_issued`** - Voucher given to customer
8. **`voucher_redeemed`** - Voucher used
9. **`chatbot_started`** - Chat widget opened
10. **`chatbot_lead_created`** - Lead from chatbot
11. **`chatbot_booking_requested`** - Booking requested via chat
12. **`reward_earned`** - Loyalty points earned
13. **`reward_redeemed`** - Reward redeemed
14. **`report_submitted`** - Report generated/downloaded
15. **`dashboard_viewed`** - Admin dashboard access

### User Journey Events
1. **`page_enter`** - User enters page
2. **`page_exit`** - User leaves page
3. **`session_start`** - New session begins
4. **`session_end`** - Session ends
5. **`abandon_cart`** - Booking cart abandoned
6. **`view_apartment`** - Specific apartment viewed
7. **`compare_apartments`** - Apartments compared
8. **`download_brochure`** - Brochure downloaded
9. **`schedule_tour`** - Property tour scheduled
10. **`request_quote`** - Quote requested

### Technical Events
1. **`error_occurred`** - JavaScript errors
2. **`api_call`** - API request/response
3. **`page_load`** - Page load timing
4. **`interaction_delay`** - Slow interactions
5. **`network_error`** - Network failures

## Event Tracking Implementation

### Current Implementation Pattern
```typescript
// Standard event tracking
trackEvent("page_view", {
  page_name: "home",
  page_path: "/",
  device_type: buildDeviceType(),
});

// UTM capture
captureUTMs(searchParams.toString());

// Event with metadata
trackEvent("form_submit", {
  page_path: "/contact",
  form_name: "contact_form",
  device_type: "desktop",
  ...utmParams
});
```

### Recommended Event Structure
```typescript
interface EventData {
  // Core fields
  event_name: string;
  timestamp: string;
  session_id: string;
  visitor_id: string;
  
  // Context fields
  page_path: string;
  page_title: string;
  referrer: string;
  device_type: string;
  user_agent: string;
  
  // Business fields
  user_id?: string;
  contact_id?: string;
  lead_id?: string;
  booking_id?: string;
  venue_id?: string;
  
  // UTM fields
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  
  // Custom fields
  [key: string]: any;
}
```

## Tracking Integration Points

### Form Tracking
- Contact form: `form_start`, `form_submit`, `form_error`
- Lead form: Additional `lead_created` event
- Quiz forms: `quiz_complete`, `quiz_abandon`

### Navigation Tracking
- All internal links: `nav_click`
- External links: `cta_click`
- Social links: `social_click`

### User Behavior Tracking
- Scroll depth: `scroll_depth` (25, 50, 75, 90)
- Time on page: `engaged_session` (30s)
- Page transitions: `page_view`

### Conversion Tracking
- Lead submissions: `form_submit` + custom `lead_created`
- Chat interactions: `chatbot_started`, `chatbot_lead_created`
- Booking intents: `booking_intent`

## Privacy and Compliance

### Current Privacy Features
- GDPR consent management
- Consent default: denied
- Optional opt-in for tracking
- No personal data in tracking events (except email for leads)

### Recommended Privacy Enhancements
- Implement cookie consent banner
- Allow user preference persistence
- Provide data export option
- Implement right to be forgotten
- Minimize PII collection