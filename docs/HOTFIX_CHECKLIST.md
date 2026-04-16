# Supabase Hotfix Verification Checklist

**File**: `docs/03-supabase-hotfix.sql`  
**Status**: ✅ COMPLETE - All missing steps added

---

## What Was Fixed

### ✅ Step 1: traffic_events Table Columns (30+ fields)
All columns now guaranteed to exist:
- Core: `session_id`, `visitor_id`, `event_type`
- Event data: `event_category`, `page_title`, `referrer_domain`, `ttclid`, `msclkid`
- Click tracking: `element_type`, `element_text`, `element_id`, `element_class`, `element_selector`, `link_url`
- Scroll data: `scroll_depth`, `scroll_max`
- Time: `time_on_page_seconds`, `time_since_page_load`
- Form: `form_name`, `form_id`
- Funnel: `funnel_name`, `step_name`, `step_number`
- Conversion: `value`, `currency`
- Geo: `country`, `region`, `city`, `timezone`
- Device: `device_type`, `device_info`, `browser_info`, `os_info`, `screen_resolution`, `language`
- Venue: `venue_id`

**Action**: `session_id` made nullable (for beacon events sent on page unload)

### ✅ Step 2: sessions Table Columns (17+ fields)
All required columns now guaranteed:
- IDs: `session_id`, `visitor_id`, `user_id`
- Timing: `start_time`, `end_time`, `total_duration_seconds`, `updated_at`
- Events: `pages_visited`, `engaged`, `converted`, `conversion_value`, `exit_page`
- **NEW**: `updated_at` - Required for trigger to work

### ✅ Step 3: click_events Table
- `session_id` column added (was missing before)

### ✅ Step 4: funnels Table
- `session_id` column added (was missing before)

### ✅ Step 5: leads Table
- `updated_at` column added (required for updated_at trigger)

### ✅ Step 6: Triggers (NEW - WAS MISSING)
Two update triggers now created:

1. **update_sessions_updated_at**
   - Automatically sets `updated_at = NOW()` when sessions row is updated
   - Required for session heartbeat tracking

2. **update_leads_updated_at**
   - Automatically sets `updated_at = NOW()` when leads row is updated
   - Required for lead status tracking

**Function**: `update_updated_at_column()` - Idempotent (can be created multiple times safely)

### ✅ Step 7: Indexes (Expanded)
All 11 core indexes now created:

**Sessions**:
- `sessions_session_id_idx` - Query by session_id
- `sessions_visitor_id_idx` - Query by visitor_id
- `sessions_start_time_idx` - Sort by session start (DESC)

**Traffic Events**:
- `traffic_events_session_id_idx` - Query by session_id
- `traffic_events_created_at_idx` - Sort by timestamp (DESC)

**Click Events**:
- `click_events_session_id_idx` - Query by session_id
- `click_events_page_idx` - Query by page path
- `click_events_created_at_idx` - Sort by timestamp (DESC)

**Funnels**:
- `funnels_session_id_idx` - Query by session_id
- `funnels_funnel_name_idx` - Query by funnel type
- `funnels_created_at_idx` - Sort by timestamp (DESC)

### ✅ Step 8: Row Level Security (RLS) Policies
Hard-reset all RLS policies with clean recreation:

**Sessions**: SELECT, INSERT, UPDATE (public)
**Click Events**: SELECT, INSERT (public)
**Funnels**: SELECT, INSERT (public)
**Page Performance**: SELECT, INSERT, UPDATE (public)

All policies use `USING (true)` for public unrestricted access.

### ✅ Step 9: Verification Queries
Three verification queries added at end:
1. Session ID columns verification - Confirms session_id exists on all tracking tables
2. Sessions table structure - Lists all columns on sessions table
3. Triggers verification - Confirms update triggers are created

---

## Missing from Previous Version (02-simple-migration.sql)

| Step | Item | Was In 02 | Now In 03 |
|------|------|-----------|----------|
| 1 | traffic_events columns | ✓ | ✓ |
| 2 | Table creation (sessions, click_events, funnels) | ✓ (tables only) | ✓ (+ all columns verified) |
| 3 | Indexes | ✓ | ✓ (expanded) |
| 4 | Triggers + Function | ✓ | **✓ NEW** |
| 5 | RLS Policies | ✓ | ✓ (hard reset) |
| 6 | Verification | Partial | ✓ (comprehensive) |

---

## Why This Matters

The 02-simple-migration.sql failed because:

1. **Triggers were never created** - `updated_at` columns exist but without triggers they're never updated
2. **sessions table was incomplete** - Missing all the session tracking columns API routes expect
3. **RLS policies failed** - Policies tried to reference columns that weren't fully added yet

The hotfix ensures:
- All columns exist FIRST before policies reference them
- Triggers are created so `updated_at` columns are maintained automatically
- Proper dependency ordering: columns → indexes → policies

---

## How to Run

1. Open [Supabase Dashboard](https://app.supabase.co) → Your Project → SQL Editor
2. Copy entire contents of `docs/03-supabase-hotfix.sql`
3. Paste into SQL Editor
4. Click "Run" button
5. Verify output shows:
   - "hotfix complete"
   - All session_id columns listed
   - All sessions columns listed (including updated_at)
   - Both update triggers listed

---

## Expected Output

```
hotfix complete

Session ID columns verification:
click_events | session_id
funnels | session_id
sessions | session_id
traffic_events | session_id

Sessions table columns verification:
[Full list of columns including: session_id, visitor_id, start_time, end_time, pages_visited, engaged, converted, updated_at, etc.]

Triggers verification:
update_leads_updated_at | leads
update_sessions_updated_at | sessions
```

---

## After Running Hotfix

1. ✅ All analytics tables fully populated with required columns
2. ✅ Triggers automatically maintain `updated_at` timestamps
3. ✅ Indexes created for fast queries
4. ✅ RLS policies allow public read/write access
5. ✅ Ready for analytics API routes to insert/query data

Next: Test by submitting contact form at `/contact` page
