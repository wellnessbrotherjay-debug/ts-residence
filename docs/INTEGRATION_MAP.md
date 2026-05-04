# Integration Map

## This Repo's Role
- **Website / acquisition layer** ✅
- **CRM / lead layer** ⚠️ (Partial - only leads, no full CRM)
- **Booking layer** ❌ (Not implemented)
- **Schedule layer** ❌ (Not implemented)
- **Voucher layer** ❌ (Not implemented)
- **Chatbot layer** ⚠️ (Basic chatbot only)
- **Rewards / guest app layer** ❌ (Not implemented)
- **Dashboard / reporting layer** ✅ (Basic admin dashboard)
- **POS / VHP bridge layer** ❌ (Not implemented)

## Sends Data To

| Destination System | Data Sent | Method | Status |
|-------------------|-----------|--------|--------|
| **Resend** | Email notifications | SMTP API | ✅ |
| **Google Analytics 4** | Page views, events, conversions | Measurement Protocol | ✅ |
| **Google Tag Manager** | All tracking events | GTM DataLayer | ✅ |
| **Meta Pixel** | Page views, form submissions | Facebook Pixel | ✅ |
| **Microsoft Clarity** | Session recordings (optional) | Clarity SDK | ✅ |
| **Supabase** | Leads, traffic events, chat messages | Direct database writes | ✅ |
| **Jarvis Command Center** | Activity logs (if configured) | REST API | ⚠️ (Optional) |

## Receives Data From

| Source System | Data Received | Method | Status |
|---------------|--------------|--------|--------|
| **Supabase** | Leads, traffic events, chat data | Database queries | ✅ |
| **OpenAI** | Chatbot responses | OpenAI API | ✅ |
| **External Images** | Images via proxy | Image proxy endpoint | ✅ |

## Shared IDs Needed

| ID | Present? | Notes |
|----|----------|-------|
| `venue_id` | ❌ | Not present, needed for multi-venue support |
| `department_id` | ❌ | Not present, needed for organization structure |
| `contact_id` | ❌ | Not implemented, central contact management needed |
| `lead_id` | ✅ | Present in leads table |
| `booking_id` | ❌ | Not implemented, booking system missing |
| `voucher_id` | ❌ | Not implemented, voucher system missing |
| `campaign_id` | ✅ | Present as campaign field in traffic_events/leads |
| `app_user_id` | ❌ | Not implemented, user system missing |

## Current Integration Details

### Lead Capture Integration
- **Sources**: Direct form submissions
- **Destinations**: 
  - Supabase (leads table)
  - Resend (emails)
  - Analytics platforms (GA4, GTM, Meta)
- **Automation**: Auto-reply and admin notifications

### Chatbot Integration
- **Source**: User interactions
- **Destination**: OpenAI API
- **Storage**: Supabase chat_sessions and chat_messages
- **Limitations**: Basic GPT-3.5 only, no context persistence

### Analytics Integration
- **Sources**: User interactions, page views
- **Destinations**: 
  - GA4 (primary analytics)
  - GTM (tag management)
  - Meta Pixel (Facebook tracking)
  - Supabase (first-party storage)
- **UTM Tracking**: Full UTM parameter capture and persistence

## Missing Integrations

### Critical Missing Integrations
1. **Booking System Integration**
   - Current status: ❌ None
   - Needed: API endpoints for booking creation, management, and availability
   - Dependencies: Contact ID, apartment inventory, payment processing

2. **Schedule System Integration**
   - Current status: ❌ None
   - Needed: API for appointment/booking scheduling
   - Dependencies: Staff availability, service catalog, time slot management

3. **Voucher System Integration**
   - Current status: ❌ None
   - Needed: Voucher issuance and redemption tracking
   - Dependencies: Customer accounts, booking integration

4. **WhatsApp/Telegram Integration**
   - Current status: ❌ None
   - Needed: Webhook endpoints for messaging platforms
   - Dependencies: Message templates, automation rules

5. **Payment Processing**
   - Current status: ❌ None
   - Needed: Stripe or similar integration
   - Dependencies: Booking system, financial tracking

### Communication Integrations
1. **Email Marketing**
   - Current status: ✅ Basic Resend integration
   - Enhancement needed: Drip campaigns, segmentation, templates

2. **SMS Integration**
   - Current status: ❌ None
   - Needed: Twilio or similar SMS provider

3. **Push Notifications**
   - Current status: ❌ None
   - Needed: Web push notification service

## Integration Risks

### Data Synchronization Issues
1. **Duplicated Contacts** - No central contact management
   - Risk: Multiple entries for same person across systems
   - Impact: Poor customer experience, marketing inefficiency
   
2. **Missing Shared IDs** - Lack of unified identifiers
   - Risk: Data fragmentation across systems
   - Impact: Cannot correlate customer journey across touchpoints

3. **Inconsistent Event Naming** - Multiple tracking systems
   - Risk: Analytics discrepancies
   - Impact: Cannot measure true conversion rates

### System Integration Risks
1. **No Webhook Logs** - No integration error tracking
   - Risk: Silent failures in external integrations
   - Impact: Missing critical notifications or data

2. **No Retry Mechanisms** - Failed API calls not retried
   - Risk: Data loss during temporary outages
   - Impact: Incomplete customer journeys

3. **Weak Authentication** - No API authentication
   - Risk: Unauthorized access to data
   - Impact: Data breaches, privacy violations

4. **Missing Rate Limiting** - No protection against abuse
   - Risk: Service abuse, cost overruns
   - Impact: Increased operational costs

### Business Logic Risks
1. **No UTM Persistence** - Campaign attribution lost
   - Risk: Inaccurate ROI measurement
   - Impact: Poor marketing decisions

2. **No Dashboard Rollups** - Limited reporting capabilities
   - Risk: Lack of business insights
   - Impact: Informed decision-making impaired

## Recommended Integration Architecture

### Core Integration Layer
```typescript
// Central integration service
interface IntegrationService {
  // Unified contact management
  syncContact(data: ContactData): Promise<ContactId>;
  
  // Cross-system event propagation
  propagateEvent(event: IntegrationEvent): Promise<void>;
  
  // Data synchronization
  syncData(source: System, target: System): Promise<void>;
}
```

### Webhook Management
```typescript
// Webhook handler with retry logic
interface WebhookHandler {
  registerEndpoint(endpoint: string, handler: Function): void;
  processWithRetry(data: any, maxRetries: number): Promise<void>;
  logErrors(error: Error): void;
}
```

### Event Bus System
```typescript
// Unified event system
interface EventBus {
  publish(event: string, data: any): void;
  subscribe(event: string, handler: Function): void;
  ensureDelivery(event: string, data: any): Promise<void>;
}
```

## Integration Testing Strategy

1. **Unit Tests**: Individual integration handlers
2. **Integration Tests**: End-to-end data flows
3. **Failure Scenarios**: Network timeouts, API errors
4. **Performance Tests**: High-volume data processing
5. **Security Tests**: Authentication, authorization, data validation