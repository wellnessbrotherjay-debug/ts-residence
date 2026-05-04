# API and Webhooks

## Current API Endpoints

### Leads API
| Endpoint | Method | Purpose | Input Payload | Output | Auth | Reads From | Writes To | Triggered By | Status |
|----------|--------|---------|--------------|---------|------|------------|-----------|--------------|--------|
| `/api/leads` | POST | Create lead with deduplication | `{firstName, lastName, email, phone, stayDuration, message, page, source, medium, campaign, term, content, referrer, deviceType, landingPage, pageUrl, _honeypot}` | `{success, id}` | None | - | `leads` table | Form submission | ✅ |
| `/api/leads` | GET | Get recent leads | - | Lead array | None | `leads` table | - | Admin dashboard | ✅ |

### Contact API
| Endpoint | Method | Purpose | Input Payload | Output | Auth | Reads From | Writes To | Triggered By | Status |
|----------|--------|---------|--------------|---------|------|------------|-----------|--------------|--------|
| `/api/contact` | POST | Contact form submission | `{firstName, lastName, email, countryCode, phone, stayDuration, message}` | `{success}` | None | - | Email via Resend | Form submission | ✅ |

### Chat API
| Endpoint | Method | Purpose | Input Payload | Output | Auth | Reads From | Writes To | Triggered By | Status |
|----------|--------|---------|--------------|---------|------|------------|-----------|--------------|--------|
| `/api/chat` | POST | Chatbot response | `{messages: [{role, content}]}` | `{reply, usage}` | None | - | `chat_messages` | User chat | ✅ |
| `/api/chat/log` | POST | Log chat messages | Chat data | `{success}` | None | - | `chat_messages` | Chat interaction | ✅ |

### Analytics API
| Endpoint | Method | Purpose | Input Payload | Output | Auth | Reads From | Writes To | Triggered By | Status |
|----------|--------|---------|--------------|---------|------|------------|-----------|--------------|--------|
| `/api/analytics/track` | POST | Track analytics events | `{sessionId, visitorId, eventType, page, source, medium, campaign, term, content, gclid, fbclid, referrer, metadata}` | `{success}` | None | - | `traffic_events` | User interactions | ✅ |
| `/api/dashboard/summary` | GET | Dashboard summary metrics | - | Summary data | None | `leads`, `traffic_events` | - | Admin dashboard | ✅ |

### Image API
| Endpoint | Method | Purpose | Input Payload | Output | Auth | Reads From | Writes To | Triggered By | Status |
|----------|--------|---------|--------------|---------|------|------------|-----------|--------------|--------|
| `/api/image` | GET | Image proxy with fallback | `?url=<encoded_url>` | Image/error | None | - | - | Image loading | ✅ |

## Missing Webhooks

### Critical Missing Webhooks
1. **WhatsApp Webhook** - For WhatsApp message automation
2. **Telegram Webhook** - For Telegram bot integration
3. **Resend Webhook** - For email delivery tracking
4. **Google Analytics Webhook** - For GA4 data import
5. **Meta Pixel Webhook** - For Facebook pixel events
6. **Stripe Webhook** - For payment processing
7. **Supabase Webhook** - For database changes

## Recommended API Contracts Needed

### Booking System API
```typescript
// Create booking
POST /api/bookings
{
  contactId: string,
  apartmentType: 'solo' | 'studio' | 'soho',
  checkIn: string,
  checkOut: string,
  guests: number,
  source: string,
  medium?: string,
  campaign?: string
}

// Check availability
GET /api/availability
{
  apartmentType: string,
  checkIn: string,
  checkOut: string
}

// Get booking details
GET /api/bookings/[id]
```

### Voucher System API
```typescript
// Issue voucher
POST /api/vouchers
{
  contactId: string,
  type: string,
  amount: number,
  expiry: string,
  source: string
}

// Redeem voucher
POST /api/vouchers/redeem
{
  code: string,
  bookingId: string
}

// Get voucher details
GET /api/vouchers/[code]
```

### Schedule System API
```typescript
// Get availability
GET /api/schedule/availability
{
  service: string,
  date: string,
  timeSlot?: string
}

// Create appointment
POST /api/schedule/appointments
{
  contactId: string,
  service: string,
  date: string,
  time: string,
  duration: number
}
```

### User Authentication API
```typescript
// Register user
POST /api/auth/register
{
  email: string,
  password: string,
  profile: {
    firstName: string,
    lastName: string,
    phone?: string
  }
}

// Login user
POST /api/auth/login
{
  email: string,
  password: string
}

// Refresh token
POST /api/auth/refresh
```

### Notification API
```typescript
// Send notification
POST /api/notifications
{
  contactId: string,
  type: 'email' | 'sms' | 'whatsapp',
  template: string,
  data: Record<string, any>
}

// Get notification history
GET /api/notifications?contactId=xxx
```

## API Security Considerations

### Current Security Issues
1. **No Authentication** - All APIs are public
2. **No Rate Limiting** - Vulnerable to abuse
3. **No Input Validation** - Basic validation only
4. **No API Key Management** - No API authentication
5. **No Webhook Verification** - No signature validation

### Recommended Security Improvements
1. Implement API authentication
2. Add rate limiting
3. Validate all inputs
4. Use environment variables for secrets
5. Implement webhook signatures
6. Add CORS policies
7. Use HTTPS only
8. Implement request logging

## API Documentation Standards

### Response Format
```typescript
{
  success: boolean,
  data?: any,
  error?: string,
  metadata?: {
    timestamp: string,
    requestId: string,
    version: string
  }
}
```

### Error Responses
```typescript
// 400 Bad Request
{
  success: false,
  error: "Invalid input",
  details: {
    field: "email",
    message: "Invalid email format"
  }
}

// 401 Unauthorized
{
  success: false,
  error: "Authentication required"
}

// 500 Internal Server Error
{
  success: false,
  error: "Internal server error"
}
```