# UTM Builder - Quick Reference Checklist

## Files to Create (NEW)

### 1. src/lib/marketing-auth.ts
- HMAC-based session auth for marketing team
- Parallel to admin-auth.ts
- 110 lines

### 2. src/lib/utm-auth.ts
- Shared access gate (admin OR marketing)
- 12 lines

### 3. src/app/api/marketing/login/route.ts
- POST: validate marketing password, set session cookie
- 33 lines

### 4. src/app/api/marketing/session/route.ts
- GET: check auth status
- DELETE: logout
- 16 lines

### 5. src/app/marketing/utm/page.tsx
- Marketing-only portal at /marketing/utm
- Password gate + UtmBuilder component
- 120 lines

## Files to MODIFY

### 1. src/app/api/admin/utm-links/route.ts
**Change:**
```typescript
// OLD: select with aliases (breaks Supabase JS client)
.select("id, created_at, note_title as name, generated_url as full_url, ...")

// NEW: select all columns (no aliases)
.select("*")
```

### 2. src/app/api/admin/generated-links-performance/route.ts
**Add at top:**
```typescript
import { requireUtmBuilderRequest } from "@/lib/utm-auth";
```

**Change auth check:**
```typescript
// OLD: await requireAdminRequest();
// NEW: await requireUtmBuilderRequest();
```

### 3. src/app/admin/UtmBuilder.tsx
**Change interface:**
```typescript
// OLD
interface SavedLink {
  name: string;
  full_url: string;
  ...
}

// NEW
interface SavedLink {
  note_title: string;
  generated_url: string;
  ...
}
```

**Change table rendering:**
```typescript
// OLD: {link.name} and handleCopyRow(link.full_url, ...)
// NEW: {link.note_title} and handleCopyRow(link.generated_url, ...)
```

**Change domain:**
```typescript
// OLD
const BASE_URL = "https://www.tsresidence.id";

// NEW (for No1 Wellness)
const BASE_URL = "https://www1wellness.com";
```

## Database Schema (SQL)

```sql
-- Run this in Supabase SQL Editor
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

CREATE POLICY "Allow service role admin access" ON public.generated_tracking_links
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

## Environment Variables

Add to `.env.local` and Vercel:

```env
MARKETING_PASSWORD=your_password_here
TS_MARKETING_PASSWORD=your_password_here
```

## Routes Created

- `POST /api/marketing/login` - Marketing password login
- `GET /api/marketing/session` - Check marketing auth status
- `DELETE /api/marketing/session` - Marketing logout
- `GET /marketing/utm` - Marketing-only UTM builder portal (NEW PAGE)
- `POST /api/admin/utm-links` - Create UTM link (updated to use shared auth)
- `GET /api/admin/utm-links` - List saved UTM links (updated to use shared auth)
- `GET /api/admin/generated-links-performance` - Campaign analytics (updated to use shared auth)

## Testing URLs

**Local:**
- http://localhost:3000/admin (admin dashboard with UTM builder)
- http://localhost:3000/marketing/utm (marketing-only portal)

**Production:**
- https://www.tsresidence.id/admin
- https://www.tsresidence.id/marketing/utm

## Key Improvements

✅ Supabase schema mismatch fixed (no alias corruption)
✅ Marketing team separate access (password-gated)
✅ Shared UTM APIs (admin and marketing use same endpoints)
✅ Session-based auth (HMAC-signed cookies)
✅ Fallback env vars for flexibility
✅ Real-time performance dashboard
✅ Zero errors on build

## Time Estimate

- Setup: 15 min
- File creation: 30 min
- Testing: 15 min
- Deployment: 10 min
- **Total: ~70 minutes**

## Common Mistakes to Avoid

❌ Using column aliases in `.select("as")` statements - causes column name corruption
❌ Forgetting to set MARKETING_PASSWORD env var - returns "not configured" error
❌ Not running SQL schema - returns "table not found" on first save
❌ Wrong domain in BASE_URL - generates links to wrong site
❌ Not updating brand filter in API routes - may conflict with other brands
❌ RLS policy disabled - may cause permission errors

## Support Resources

- Full implementation guide: `/docs/UTM_BUILDER_IMPLEMENTATION_GUIDE.md`
- This checklist: `/docs/UTM_BUILDER_QUICK_REFERENCE.md`
- Example repo: `/Users/jaydengle/ts-residense-next` (reference implementation)

---

**Last updated:** May 15, 2026
**Status:** Production ready ✅
**Tested on:** TS Residence (live at https://www.tsresidence.id)
