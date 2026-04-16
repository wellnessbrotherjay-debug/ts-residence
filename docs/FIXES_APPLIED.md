# Supabase SQL Migration Fixes Summary

## Problem
The initial 02-simple-migration.sql failed at **STEP 7 (RLS Policies)** with error:
```
column "session_id" does not exist
```

## Root Cause
- Triggers were never created, so `updated_at` columns couldn't be maintained
- sessions table missing critical columns (visitor_id, start_time, end_time, etc.)
- click_events and funnels tables missing `session_id` column entirely
- leads table missing `updated_at` column for trigger

## Solution: 03-supabase-hotfix.sql

### 6 Complete Repair Steps

#### STEP 1: Ensure traffic_events has 30+ columns
- Core tracking: session_id, visitor_id, event_type
- Event classification: event_category, page_title, referrer_domain
- Click data: element_type, element_text, link_url, etc.
- Scroll tracking: scroll_depth, scroll_max
- Time tracking: time_on_page_seconds, time_since_page_load
- Form events: form_name, form_id
- Funnel data: funnel_name, step_name, step_number, value, currency
- Geo data: country, region, city, timezone
- Device data: device_type, device_info, browser_info, os_info, screen_resolution, language
- Tenant: venue_id

**KEY**: session_id made NULLABLE (for beacon tracking)

#### STEP 2: Ensure sessions table has 17+ columns
- **IDs**: session_id, visitor_id, user_id
- **Timing**: start_time, end_time, total_duration_seconds, updated_at ← **NEW**
- **Events**: pages_visited, engaged, converted, conversion_value, exit_page

#### STEP 3: Add session_id to related tables
- click_events.session_id ← **NEW**
- funnels.session_id ← **NEW**
- leads.updated_at ← **NEW**

#### STEP 4: Create triggers (MISSING from 02)
```sql
-- Function to auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER

-- Trigger 1: Auto-update sessions.updated_at on row update
CREATE TRIGGER update_sessions_updated_at ON public.sessions

-- Trigger 2: Auto-update leads.updated_at on row update
CREATE TRIGGER update_leads_updated_at ON public.leads
```

#### STEP 5: Create 11 core indexes
- 3 sessions indexes (session_id, visitor_id, start_time)
- 2 traffic_events indexes (session_id, created_at)
- 3 click_events indexes (session_id, page, created_at)
- 3 funnels indexes (session_id, funnel_name, created_at)

#### STEP 6: Hard-reset RLS policies
- Drop all existing policies (clean slate)
- Recreate for each table: sessions, click_events, funnels, page_performance
- All allow public SELECT, INSERT, UPDATE access
- Policies created AFTER all columns exist (prevents "column not found" errors)

---

## Files Updated

| File | Changes |
|------|---------|
| `docs/03-supabase-hotfix.sql` | +Step 4 (triggers), +Step 2 (expanded), +5 trigger lines, +6 session indexes, +verification queries |
| `docs/HOTFIX_CHECKLIST.md` | **NEW** - Complete audit trail of all fixes |

---

## Verification

After running hotfix, you should see output:
```
✓ hotfix complete
✓ click_events | session_id
✓ funnels | session_id  
✓ sessions | session_id
✓ traffic_events | session_id
✓ [All sessions columns listed with types]
✓ update_leads_updated_at | leads
✓ update_sessions_updated_at | sessions
```

If you see these, the schema is ready for analytics tracking! 🎉

---

## Next Steps

1. **Run hotfix in Supabase SQL Editor**
2. **Test analytics**: Submit contact form → check leads table
3. **Test clicks**: Click site buttons → check click_events table
4. **Test sessions**: Navigate pages → check sessions table
5. **Check dashboard**: Open /admin → verify analytics aggregation works
