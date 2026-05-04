# System Scope

## Public Routes
| Route | Purpose | Main component | Data source | Status |
|-------|---------|---------------|------------|--------|
| `/` | Homepage | HomeClient | Static + Supabase | ✅ |
| `/apartments` | Apartment showcase | Apartments page | Static | ✅ |
| `/contact` | Contact form | Contact page | Form data | ✅ |
| `/gallery` | Image gallery | Gallery page | Static | ✅ |
| `/offers` | Special offers | Offers page | Static | ✅ |
| `/faq` | Frequently asked questions | FAQ page | Static | ✅ |
| `/five-star-living` | Five-star living features | Feature page | Static | ✅ |
| `/easy-living` | Easy living options | Options page | Static | ✅ |
| `/healthy-living` | Healthy living features | Wellness page | Static | ✅ |
| `/admin` | Admin dashboard | Dashboard | Supabase leads | ✅ |

## Admin Routes
| Route | Purpose | Main component | Data source | Status |
|-------|---------|---------------|------------|--------|
| `/admin` | Dashboard overview | Admin page | Supabase leads | ✅ |

## API Routes
| Endpoint | Method | Purpose | Input | Output | Auth | Status |
|----------|--------|---------|--------|---------|------|--------|
| `/api/leads` | POST | Create lead with deduplication | Lead form data | Success/error | None | ✅ |
| `/api/leads` | GET | Get recent leads | - | Lead array | None | ✅ |
| `/api/contact` | POST | Contact form submission | Contact data | Success/error | None | ✅ |
| `/api/chat` | POST | Chatbot response | Chat messages | AI reply | None | ✅ |
| `/api/chat/log` | POST | Log chat messages | Chat data | Success/error | None | ✅ |
| `/api/analytics/track` | POST | Track analytics events | Event data | Success/error | None | ✅ |
| `/api/dashboard/summary` | GET | Dashboard summary metrics | - | Summary data | None | ✅ |
| `/api/image` | GET | Image proxy with fallback | URL | Image/error | None | ✅ |

## Main User Flows

### Lead Capture Flow
1. User visits landing page (UTM captured)
2. User fills out lead form with personal details
3. Form validates required fields (name, email)
4. System checks for duplicate leads (24h window)
5. Lead saved to Supabase database
6. Auto-reply sent to user via Resend
7. Admin notification sent to team
8. Activity logged to Jarvis (if configured)

### Contact Form Flow
1. User accesses contact page
2. User fills out contact form
3. Form data submitted to API
4. Confirmation email sent to user
5. Admin notification sent to team
6. Success response returned

### Chatbot Flow
1. User opens chat widget
2. Chat session created (new or existing)
3. User sends message
4. Message sent to OpenAI API
5. AI response received
6. Response displayed to user
7. Chat messages logged to database

### Analytics Flow
1. User loads page
2. Page view event tracked (GA4, GTM, Meta Pixel)
3. UTM parameters captured
4. Session and visitor IDs generated
5. Events sent to tracking endpoints
6. Traffic events stored in Supabase

## Missing Routes
- Booking system integration routes
- Availability search endpoints
- Payment processing routes
- User authentication flows
- File upload endpoints