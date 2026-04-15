-- ============================================
-- SIMPLIFIED MIGRATION - RUN STEP BY STEP
-- ============================================

-- STEP 1: Ensure core columns exist on traffic_events
-- Run the diagnostic FIRST (01-diagnostic.sql) to confirm

DO $$
BEGIN
  -- Add session_id if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'session_id') THEN
    ALTER TABLE public.traffic_events ADD COLUMN session_id TEXT NOT NULL DEFAULT 'unknown_session';
    RAISE NOTICE 'Added session_id column to traffic_events';
  END IF;

  -- Add visitor_id if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'visitor_id') THEN
    ALTER TABLE public.traffic_events ADD COLUMN visitor_id UUID;
    RAISE NOTICE 'Added visitor_id column to traffic_events';
  END IF;

  -- Add event_type if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'event_type') THEN
    ALTER TABLE public.traffic_events ADD COLUMN event_type TEXT NOT NULL DEFAULT 'page_view';
    RAISE NOTICE 'Added event_type column to traffic_events';
  END IF;
END $$;

-- Verify
SELECT 'Core columns check:' as status,
       EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'session_id') as has_session_id,
       EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'visitor_id') as has_visitor_id,
       EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'event_type') as has_event_type;

-- STEP 2: Create the new tables (sessions, click_events, funnels, page_performance)

CREATE TABLE IF NOT EXISTS public.sessions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  visitor_id UUID,
  user_id BIGINT,
  venue_id TEXT DEFAULT 'ts_residence',
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  total_duration_seconds INTEGER,
  pages_visited INTEGER DEFAULT 1,
  page_count INTEGER DEFAULT 1,
  device_type TEXT,
  device_info JSONB,
  browser_info JSONB,
  os_info TEXT,
  screen_resolution TEXT,
  language TEXT,
  timezone TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  entry_page TEXT,
  exit_page TEXT,
  referrer TEXT,
  referrer_domain TEXT,
  first_source TEXT DEFAULT 'direct',
  first_medium TEXT,
  first_campaign TEXT,
  first_term TEXT,
  first_content TEXT,
  first_gclid TEXT,
  first_fbclid TEXT,
  first_ttclid TEXT,
  first_referrer TEXT,
  last_source TEXT DEFAULT 'direct',
  last_medium TEXT,
  last_campaign TEXT,
  last_term TEXT,
  last_content TEXT,
  last_gclid TEXT,
  last_fbclid TEXT,
  last_ttclid TEXT,
  last_referrer TEXT,
  engaged BOOLEAN DEFAULT FALSE,
  engaged_at TIMESTAMPTZ,
  bounce BOOLEAN DEFAULT TRUE,
  converted BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMPTZ,
  conversion_value NUMERIC DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.click_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_id UUID,
  page TEXT,
  element_type TEXT NOT NULL,
  element_text TEXT,
  element_id TEXT,
  element_class TEXT,
  element_selector TEXT,
  link_url TEXT,
  click_x INTEGER,
  click_y INTEGER,
  viewport_width INTEGER,
  viewport_height INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.funnels (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_id UUID,
  user_id BIGINT,
  venue_id TEXT DEFAULT 'ts_residence',
  funnel_name TEXT DEFAULT 'default',
  step_name TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  step_category TEXT,
  page TEXT,
  action TEXT,
  value NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.page_performance (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  page TEXT NOT NULL,
  venue_id TEXT DEFAULT 'ts_residence',
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  avg_time_on_page_seconds NUMERIC,
  bounce_rate NUMERIC,
  scroll_25_count INTEGER DEFAULT 0,
  scroll_50_count INTEGER DEFAULT 0,
  scroll_75_count INTEGER DEFAULT 0,
  scroll_100_count INTEGER DEFAULT 0,
  exits INTEGER DEFAULT 0,
  entries INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(page, venue_id, date)
);

SELECT 'New tables created' as status;

-- STEP 3: Add new columns to traffic_events (only run after STEP 1 succeeds)

DO $$
BEGIN
  -- Add tracking columns one by one with existence checks
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'event_category') THEN
    ALTER TABLE public.traffic_events ADD COLUMN event_category TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'page_title') THEN
    ALTER TABLE public.traffic_events ADD COLUMN page_title TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'referrer_domain') THEN
    ALTER TABLE public.traffic_events ADD COLUMN referrer_domain TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'ttclid') THEN
    ALTER TABLE public.traffic_events ADD COLUMN ttclid TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'msclkid') THEN
    ALTER TABLE public.traffic_events ADD COLUMN msclkid TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'element_type') THEN
    ALTER TABLE public.traffic_events ADD COLUMN element_type TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'element_text') THEN
    ALTER TABLE public.traffic_events ADD COLUMN element_text TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'element_id') THEN
    ALTER TABLE public.traffic_events ADD COLUMN element_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'element_class') THEN
    ALTER TABLE public.traffic_events ADD COLUMN element_class TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'element_selector') THEN
    ALTER TABLE public.traffic_events ADD COLUMN element_selector TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'link_url') THEN
    ALTER TABLE public.traffic_events ADD COLUMN link_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'scroll_depth') THEN
    ALTER TABLE public.traffic_events ADD COLUMN scroll_depth INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'scroll_max') THEN
    ALTER TABLE public.traffic_events ADD COLUMN scroll_max INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'time_on_page_seconds') THEN
    ALTER TABLE public.traffic_events ADD COLUMN time_on_page_seconds INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'device_info') THEN
    ALTER TABLE public.traffic_events ADD COLUMN device_info JSONB;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'browser_info') THEN
    ALTER TABLE public.traffic_events ADD COLUMN browser_info JSONB;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'os_info') THEN
    ALTER TABLE public.traffic_events ADD COLUMN os_info TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'screen_resolution') THEN
    ALTER TABLE public.traffic_events ADD COLUMN screen_resolution TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'language') THEN
    ALTER TABLE public.traffic_events ADD COLUMN language TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'venue_id') THEN
    ALTER TABLE public.traffic_events ADD COLUMN venue_id TEXT DEFAULT 'ts_residence';
  END IF;
END $$;

SELECT 'New columns added to traffic_events' as status;

-- STEP 4: Add columns to leads table

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'updated_at') THEN
    ALTER TABLE public.leads ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;

SELECT 'Leads table updated' as status;

-- STEP 5: Create indexes (safe version)

-- Sessions indexes
CREATE INDEX IF NOT EXISTS sessions_session_id_idx ON public.sessions (session_id);
CREATE INDEX IF NOT EXISTS sessions_visitor_id_idx ON public.sessions (visitor_id);
CREATE INDEX IF NOT EXISTS sessions_start_time_idx ON public.sessions (start_time DESC);

-- Traffic events core indexes (only create if column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'session_id') THEN
    CREATE INDEX IF NOT EXISTS traffic_events_session_id_idx ON public.traffic_events (session_id);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'created_at') THEN
    CREATE INDEX IF NOT EXISTS traffic_events_created_at_idx ON public.traffic_events (created_at DESC);
  END IF;
END $$;

-- Click events indexes
CREATE INDEX IF NOT EXISTS click_events_session_id_idx ON public.click_events (session_id);
CREATE INDEX IF NOT EXISTS click_events_page_idx ON public.click_events (page);
CREATE INDEX IF NOT EXISTS click_events_created_at_idx ON public.click_events (created_at DESC);

-- Funnels indexes
CREATE INDEX IF NOT EXISTS funnels_session_id_idx ON public.funnels (session_id);
CREATE INDEX IF NOT EXISTS funnels_funnel_name_idx ON public.funnels (funnel_name);
CREATE INDEX IF NOT EXISTS funnels_created_at_idx ON public.funnels (created_at DESC);

SELECT 'Indexes created' as status;

-- STEP 6: Triggers

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  -- Drop trigger if exists
  DROP TRIGGER IF EXISTS update_sessions_updated_at ON public.sessions;
  CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
END $$;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
  CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
END $$;

SELECT 'Triggers created' as status;

-- STEP 7: RLS Policies

DO $$
BEGIN
  -- Enable RLS
  ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.page_performance ENABLE ROW LEVEL SECURITY;

  -- Sessions policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Allow public read for sessions') THEN
    CREATE POLICY "Allow public read for sessions" ON public.sessions FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Allow public insert for sessions') THEN
    CREATE POLICY "Allow public insert for sessions" ON public.sessions FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Allow public update for sessions') THEN
    CREATE POLICY "Allow public update for sessions" ON public.sessions FOR UPDATE USING (true);
  END IF;

  -- Click events policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'click_events' AND policyname = 'Allow public read for click_events') THEN
    CREATE POLICY "Allow public read for click_events" ON public.click_events FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'click_events' AND policyname = 'Allow public insert for click_events') THEN
    CREATE POLICY "Allow public insert for click_events" ON public.click_events FOR INSERT WITH CHECK (true);
  END IF;

  -- Funnels policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funnels' AND policyname = 'Allow public read for funnels') THEN
    CREATE POLICY "Allow public read for funnels" ON public.funnels FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funnels' AND policyname = 'Allow public insert for funnels') THEN
    CREATE POLICY "Allow public insert for funnels" ON public.funnels FOR INSERT WITH CHECK (true);
  END IF;

  -- Page performance policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'page_performance' AND policyname = 'Allow public read for page_performance') THEN
    CREATE POLICY "Allow public read for page_performance" ON public.page_performance FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'page_performance' AND policyname = 'Allow public insert for page_performance') THEN
    CREATE POLICY "Allow public insert for page_performance" ON public.page_performance FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'page_performance' AND policyname = 'Allow public update for page_performance') THEN
    CREATE POLICY "Allow public update for page_performance" ON public.page_performance FOR UPDATE USING (true);
  END IF;
END $$;

SELECT 'RLS policies created' as status;
