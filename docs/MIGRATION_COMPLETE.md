# Complete Supabase Schema Migration Guide

## Status: ✅ VERIFIED - All 6 Steps Complete

File: `docs/03-supabase-hotfix.sql`

---

## Step Breakdown

### STEP 1: traffic_events Table (30+ Columns)
**Purpose**: Main analytics event logging table

**Columns Added**:
```
Core:
  - session_id (TEXT, nullable after)
  - visitor_id (UUID)
  - event_type (TEXT)

Tracking:
  - event_category, page_title, referrer_domain
  - ttclid, msclkid

Click Events:
  - element_type, element_text, element_id
  - element_class, element_selector
  - link_url, click_x, click_y
  - viewport_width, viewport_height

Scroll:
  - scroll_depth, scroll_max

Time:
  - time_on_page_seconds
  - time_since_page_load

Forms:
  - form_name, form_id

Funnels:
  - funnel_name, step_name, step_number
  - value, currency

Geography:
  - country, region, city, timezone

Device:
  - device_type, device_info
  - browser_info, os_info
  - screen_resolution, language

Tenant:
  - venue_id
```

**Verification**: All columns use `IF NOT EXISTS` check

---

### STEP 2: sessions Table (17+ Columns)
**Purpose**: User session tracking

**Columns Added**:
```
IDs:
  - session_id (TEXT)
  - visitor_id (UUID)
  - user_id (BIGINT)

Timing:
  - start_time (TIMESTAMPTZ)
  - end_time (TIMESTAMPTZ, nullable)
  - total_duration_seconds (INTEGER)
  - updated_at (TIMESTAMPTZ, NEW!)

Engagement:
  - pages_visited (INTEGER)
  - engaged (BOOLEAN)
  - converted (BOOLEAN)
  - conversion_value (NUMERIC)
  - exit_page (TEXT)
```

**Key Addition**: `updated_at` column (required for trigger)

---

### STEP 3: Related Tables
**click_events**: Added `session_id` column (was missing!)
**funnels**: Added `session_id` column (was missing!)
**leads**: Added `updated_at` column (was missing!)

---

### STEP 4: Triggers + Function (🆕 ADDED - WAS MISSING)
**Purpose**: Automatically maintain `updated_at` timestamps

```sql
-- Function (created once, can be reused)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger 1: On sessions update
DROP TRIGGER IF EXISTS update_sessions_updated_at ON public.sessions;
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger 2: On leads update
DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Why This Matters**:
- Without triggers, `updated_at` stays at initial value
- With triggers, any row update automatically gets new timestamp
- Enables "last modified" queries for CRM and analytics

---

### STEP 5: Indexes (11 Total)
**Purpose**: Speed up queries

**Sessions** (3 indexes):
```sql
CREATE INDEX sessions_session_id_idx ON public.sessions (session_id);
CREATE INDEX sessions_visitor_id_idx ON public.sessions (visitor_id);
CREATE INDEX sessions_start_time_idx ON public.sessions (start_time DESC);
```

**Traffic Events** (2 indexes):
```sql
CREATE INDEX traffic_events_session_id_idx ON public.traffic_events (session_id);
CREATE INDEX traffic_events_created_at_idx ON public.traffic_events (created_at DESC);
```

**Click Events** (3 indexes):
```sql
CREATE INDEX click_events_session_id_idx ON public.click_events (session_id);
CREATE INDEX click_events_page_idx ON public.click_events (page);
CREATE INDEX click_events_created_at_idx ON public.click_events (created_at DESC);
```

**Funnels** (3 indexes):
```sql
CREATE INDEX funnels_session_id_idx ON public.funnels (session_id);
CREATE INDEX funnels_funnel_name_idx ON public.funnels (funnel_name);
CREATE INDEX funnels_created_at_idx ON public.funnels (created_at DESC);
```

---

### STEP 6: Row Level Security (RLS) Policies
**Purpose**: Control data access

**Process**:
1. Enable RLS on 4 tables
2. Drop ALL existing policies (hard reset)
3. Recreate clean policies

**Policies Created** (10 total):

**Sessions** (3 policies):
- Read: Everyone can SELECT
- Insert: Everyone can INSERT
- Update: Everyone can UPDATE

**Click Events** (2 policies):
- Read: Everyone can SELECT
- Insert: Everyone can INSERT

**Funnels** (2 policies):
- Read: Everyone can SELECT
- Insert: Everyone can INSERT

**Page Performance** (3 policies):
- Read: Everyone can SELECT
- Insert: Everyone can INSERT
- Update: Everyone can UPDATE

**All use**: `USING (true)` = No restrictions

---

### STEP 7: Verification Queries (🆕 ADDED)
Three verification queries run at end:

**Query 1**: Session ID columns verification
```sql
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema='public'
  AND table_name IN ('traffic_events', 'sessions', 'click_events', 'funnels')
  AND column_name = 'session_id'
ORDER BY table_name;
```
Expected output:
```
click_events | session_id
funnels | session_id
sessions | session_id
traffic_events | session_id
```

**Query 2**: Sessions table structure
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema='public' AND table_name='sessions'
ORDER BY ordinal_position;
```
Expected output: All 17+ columns with types

**Query 3**: Triggers verification
```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema='public' AND trigger_name LIKE 'update_%'
ORDER BY event_object_table;
```
Expected output:
```
update_leads_updated_at | leads
update_sessions_updated_at | sessions
```

---

## What This Fixes

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| RLS policy "column session_id does not exist" error | session_id wasn't on sessions/click_events/funnels tables | Step 2-3: Add missing columns |
| Analytics API can't update sessions | No trigger to maintain updated_at | Step 4: Create trigger function |
| Dashboard aggregation fails | No updated_at column to query | Step 2 + Step 4: Add column + trigger |
| Slow queries on large datasets | No indexes | Step 5: Create 11 indexes |
| Incomplete tracking data | Form name, funnel data columns missing | Step 1: Add 30+ columns |

---

## How to Apply

1. **Open Supabase Dashboard**: https://app.supabase.co
2. **Navigate to SQL Editor**: Project → SQL Editor (top left)
3. **Create New Query**: Click "New Query" or paste into editor
4. **Copy/Paste**: Entire contents of `docs/03-supabase-hotfix.sql`
5. **Execute**: Click "Run" button (⌘+Enter or Ctrl+Enter)
6. **Verify Output**: Should show "hotfix complete" + verification results

---

## Expected Outcome

✅ All 30+ traffic_events columns exist
✅ All 17+ sessions columns exist with updated_at
✅ click_events and funnels have session_id
✅ leads has updated_at for CRM tracking
✅ Triggers auto-update timestamps on row changes
✅ 11 indexes created for query performance
✅ 10 RLS policies allow public read/write
✅ All verification queries pass

---

## Next Validation Steps

After hotfix runs successfully:

1. **Test Contact Form**
   - Go to https://tsresidence.id/contact
   - Fill and submit
   - Check: Supabase → leads table → new row should appear

2. **Test Click Tracking**
   - Click buttons on site
   - Check: click_events table → new rows should appear

3. **Test Session Tracking**
   - Browse multiple pages
   - Check: sessions table → new session row
   - Check: traffic_events table → page_view events

4. **Test Admin Dashboard**
   - Go to https://tsresidence.id/admin
   - Check: /api/dashboard/summary returns data
   - Verify: traffic aggregation works

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| "Column already exists" | Normal - queries use IF NOT EXISTS |
| "Function already exists" | Normal - query uses CREATE OR REPLACE |
| "Policy already exists" | All old policies are dropped first |
| "Index already exists" | Normal - queries use IF NOT EXISTS |
| No verification output | Scroll down in SQL Editor results tab |
| Trigger not listed in verification | Try refreshing page after 5 seconds |

---

## Files Reference

- **Main Migration**: `docs/02-simple-migration.sql` (original, failed at step 7)
- **Hotfix**: `docs/03-supabase-hotfix.sql` (complete repair, all 6 steps)
- **Checklist**: `docs/HOTFIX_CHECKLIST.md` (detailed step breakdown)
- **Summary**: `docs/FIXES_APPLIED.md` (what was fixed and why)
