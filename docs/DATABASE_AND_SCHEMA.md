# Database and Schema

## Current Tables

### chat_sessions
| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| created_at | TIMESTAMPTZ | Creation timestamp |
| last_active | TIMESTAMPTZ | Last activity timestamp |
| user_agent | TEXT | Browser user agent |
| ip_address | TEXT | Client IP address |

**Used By**: Chat widget functionality

### chat_messages
| Field | Type | Purpose | Relationships |
|-------|------|---------|--------------|
| id | BIGINT | Auto-incrementing ID | Primary key |
| session_id | UUID | Chat session reference | References chat_sessions.id |
| role | TEXT | Message role ('user'/'assistant') | - |
| content | TEXT | Message content | - |
| created_at | TIMESTAMPTZ | Message timestamp | - |

**Used By**: Chat message history and conversation tracking

### traffic_events
| Field | Type | Purpose | Relationships |
|-------|------|---------|--------------|
| id | BIGINT | Auto-incrementing ID | Primary key |
| session_id | TEXT | Session identifier | - |
| visitor_id | UUID | Cross-session visitor ID | - |
| event_type | TEXT | Event name (page_view, etc.) | - |
| page | TEXT | Page URL | - |
| source | TEXT | Traffic source | - |
| medium | TEXT | Traffic medium | - |
| campaign | TEXT | Campaign name | - |
| term | TEXT | Search term | - |
| content | TEXT | Campaign content | - |
| referrer | TEXT | Referring URL | - |
| gclid | TEXT | Google Click ID | - |
| fbclid | TEXT | Facebook Click ID | - |
| metadata | JSONB | Additional event data | - |
| created_at | TIMESTAMPTZ | Event timestamp | - |

**Used By**: Analytics tracking and user behavior analysis

### leads
| Field | Type | Purpose | Relationships |
|-------|------|---------|--------------|
| id | BIGINT | Auto-incrementing ID | Primary key |
| first_name | TEXT | Lead first name | - |
| last_name | TEXT | Lead last name | - |
| email | TEXT | Lead email | - |
| phone | TEXT | Lead phone | - |
| stay_duration | TEXT | Desired stay duration | - |
| message | TEXT | Lead message | - |
| page | TEXT | Lead source page | - |
| source | TEXT | Lead source | - |
| medium | TEXT | Traffic medium | - |
| campaign | TEXT | Campaign name | - |
| term | TEXT | Search term | - |
| content | TEXT | Campaign content | - |
| referrer | TEXT | Referring URL | - |
| status | TEXT | Lead status | - |
| metadata | JSONB | Additional lead data | - |
| created_at | TIMESTAMPTZ | Lead creation timestamp | - |

**Used By**: Lead capture and CRM functionality

## Missing Shared Fields

### Common Fields Present
- `created_at` - Timestamp for all tables ✅
- `updated_at` - Not present in current schema ❌
- `venue_id` - Not present ❌
- `department_id` - Not present ❌
- `contact_id` - Not present (leads table doesn't use contact management) ❌
- `lead_id` - Not present (foreign key reference) ❌
- `booking_id` - Not present ❌
- `voucher_id` - Not present ❌
- `campaign_id` - Present as campaign field in leads/traffic_events ✅
- `source` - Present in leads/traffic_events ✅
- `medium` - Present in leads/traffic_events ✅
- `campaign` - Present in leads/traffic_events ✅
- `term` - Present in leads/traffic_events ✅
- `content` - Present in leads/traffic_events ✅
- `referrer` - Present in leads/traffic_events ✅
- `status` - Present in leads table ✅
- `page` - Present in leads/traffic_events ✅

## Database Schema Issues

### Critical Missing Tables
1. **contacts** - Central contact management
2. **bookings** - Booking records
3. **availability** - Apartment availability
4. **apartments** - Apartment information
5. **users** - User accounts
6. **departments** - Organization structure
7. **venues** - Multi-venue support
8. **services** - Available services
9. **staff** - Team member information
10. **schedules** - Service availability
11. **vouchers** - Voucher system
12. **voucher_redemptions** - Voucher usage tracking
13. **loyalty_accounts** - Customer loyalty
14. **rewards** - Reward catalog
15. **events** - Calendar events
16. **notifications** - System notifications
17. **payments** - Payment records
18. **webhook_logs** - Integration logging

### Schema Improvements Needed
1. Add `updated_at` timestamp to all tables
2. Implement soft delete fields (`deleted_at`)
3. Add audit trails for data changes
4. Implement proper foreign key relationships
5. Add constraints for data integrity
6. Create indexes for frequently queried fields

## Recommended Database Structure

### contacts table (Missing)
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);
```

### bookings table (Missing)
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id),
  apartment_type TEXT,
  check_in DATE,
  check_out DATE,
  guests INTEGER,
  total_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Integration Table (Missing)
```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name TEXT NOT NULL,
  external_id TEXT NOT NULL,
  reference_type TEXT NOT NULL,
  reference_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```