-- ============================================
-- BEHAVIORAL TRACKING ENGINE - CORRECTED SQL
-- Run this step by step in Supabase SQL Editor
-- ============================================

-- STEP 1: Create new tables first
-- ============================================

-- SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.sessions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  visitor_id UUID,
  user_id BIGINT, -- Will add FK after leads table is updated
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

-- CLICK EVENTS TABLE
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

-- FUNNELS TABLE
CREATE TABLE IF NOT EXISTS public.funnels (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_id UUID,
  user_id BIGINT, -- Will add FK after leads table is updated
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

-- PAGE PERFORMANCE TABLE
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

-- STEP 2: Add columns to existing traffic_events table
-- ============================================

DO $$
BEGIN
  -- Add each column if it doesn't exist
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

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'time_since_page_load') THEN
    ALTER TABLE public.traffic_events ADD COLUMN time_since_page_load NUMERIC;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'form_name') THEN
    ALTER TABLE public.traffic_events ADD COLUMN form_name TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'form_id') THEN
    ALTER TABLE public.traffic_events ADD COLUMN form_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'funnel_name') THEN
    ALTER TABLE public.traffic_events ADD COLUMN funnel_name TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'step_name') THEN
    ALTER TABLE public.traffic_events ADD COLUMN step_name TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'step_number') THEN
    ALTER TABLE public.traffic_events ADD COLUMN step_number INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'value') THEN
    ALTER TABLE public.traffic_events ADD COLUMN value NUMERIC;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'currency') THEN
    ALTER TABLE public.traffic_events ADD COLUMN currency TEXT;
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

-- STEP 3: Add columns to leads table
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'first_source') THEN
    ALTER TABLE public.leads ADD COLUMN first_source TEXT DEFAULT 'direct';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'first_medium') THEN
    ALTER TABLE public.leads ADD COLUMN first_medium TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'first_campaign') THEN
    ALTER TABLE public.leads ADD COLUMN first_campaign TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'first_term') THEN
    ALTER TABLE public.leads ADD COLUMN first_term TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'first_content') THEN
    ALTER TABLE public.leads ADD COLUMN first_content TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'first_gclid') THEN
    ALTER TABLE public.leads ADD COLUMN first_gclid TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'first_fbclid') THEN
    ALTER TABLE public.leads ADD COLUMN first_fbclid TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'first_referrer') THEN
    ALTER TABLE public.leads ADD COLUMN first_referrer TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'first_session_id') THEN
    ALTER TABLE public.leads ADD COLUMN first_session_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'first_touch_at') THEN
    ALTER TABLE public.leads ADD COLUMN first_touch_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'last_source') THEN
    ALTER TABLE public.leads ADD COLUMN last_source TEXT DEFAULT 'direct';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'last_medium') THEN
    ALTER TABLE public.leads ADD COLUMN last_medium TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'last_campaign') THEN
    ALTER TABLE public.leads ADD COLUMN last_campaign TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'last_term') THEN
    ALTER TABLE public.leads ADD COLUMN last_term TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'last_content') THEN
    ALTER TABLE public.leads ADD COLUMN last_content TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'last_gclid') THEN
    ALTER TABLE public.leads ADD COLUMN last_gclid TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'last_fbclid') THEN
    ALTER TABLE public.leads ADD COLUMN last_fbclid TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'last_referrer') THEN
    ALTER TABLE public.leads ADD COLUMN last_referrer TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'last_session_id') THEN
    ALTER TABLE public.leads ADD COLUMN last_session_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'last_touch_at') THEN
    ALTER TABLE public.leads ADD COLUMN last_touch_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'lead_score') THEN
    ALTER TABLE public.leads ADD COLUMN lead_score INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'engagement_score') THEN
    ALTER TABLE public.leads ADD COLUMN engagement_score INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'conversion_score') THEN
    ALTER TABLE public.leads ADD COLUMN conversion_score INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'assigned_to') THEN
    ALTER TABLE public.leads ADD COLUMN assigned_to TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'tags') THEN
    ALTER TABLE public.leads ADD COLUMN tags TEXT[];
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'country') THEN
    ALTER TABLE public.leads ADD COLUMN country TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'region') THEN
    ALTER TABLE public.leads ADD COLUMN region TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'city') THEN
    ALTER TABLE public.leads ADD COLUMN city TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'venue_id') THEN
    ALTER TABLE public.leads ADD COLUMN venue_id TEXT DEFAULT 'ts_residence';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'updated_at') THEN
    ALTER TABLE public.leads ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;

-- STEP 4: Verify and add any missing columns to traffic_events
-- ============================================

DO $$
BEGIN
  -- Ensure session_id exists (it should from original schema, but let's verify)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'session_id') THEN
    ALTER TABLE public.traffic_events ADD COLUMN session_id TEXT NOT NULL DEFAULT '';
  END IF;

  -- Ensure visitor_id exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'visitor_id') THEN
    ALTER TABLE public.traffic_events ADD COLUMN visitor_id UUID;
  END IF;

  -- Ensure event_type exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'event_type') THEN
    ALTER TABLE public.traffic_events ADD COLUMN event_type TEXT NOT NULL DEFAULT 'page_view';
  END IF;

  -- Ensure page exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'page') THEN
    ALTER TABLE public.traffic_events ADD COLUMN page TEXT;
  END IF;
END $$;

-- STEP 5: Create indexes (only after columns exist)
-- ============================================

-- Sessions indexes
CREATE INDEX IF NOT EXISTS sessions_session_id_idx ON public.sessions (session_id);
CREATE INDEX IF NOT EXISTS sessions_visitor_id_idx ON public.sessions (visitor_id);
CREATE INDEX IF NOT EXISTS sessions_venue_id_idx ON public.sessions (venue_id);
CREATE INDEX IF NOT EXISTS sessions_start_time_idx ON public.sessions (start_time DESC);
CREATE INDEX IF NOT EXISTS sessions_first_source_idx ON public.sessions (first_source);
CREATE INDEX IF NOT EXISTS sessions_last_campaign_idx ON public.sessions (last_campaign);
CREATE INDEX IF NOT EXISTS sessions_converted_idx ON public.sessions (converted);
CREATE INDEX IF NOT EXISTS sessions_engaged_idx ON public.sessions (engaged);

-- Traffic events indexes - ensure the index only references existing columns
DO $$
BEGIN
  -- Only create indexes for columns that exist
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'event_category') THEN
    CREATE INDEX IF NOT EXISTS traffic_events_event_category_idx ON public.traffic_events (event_category);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'element_type') THEN
    CREATE INDEX IF NOT EXISTS traffic_events_element_type_idx ON public.traffic_events (element_type);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'link_url') THEN
    CREATE INDEX IF NOT EXISTS traffic_events_link_url_idx ON public.traffic_events (link_url);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'venue_id') THEN
    CREATE INDEX IF NOT EXISTS traffic_events_venue_id_idx ON public.traffic_events (venue_id);
  END IF;

  -- Always create these core indexes (these columns should exist)
  CREATE INDEX IF NOT EXISTS traffic_events_session_id_idx ON public.traffic_events (session_id);
  CREATE INDEX IF NOT EXISTS traffic_events_created_at_idx ON public.traffic_events (created_at DESC);
END $$;

-- Traffic events indexes
CREATE INDEX IF NOT EXISTS traffic_events_event_category_idx ON public.traffic_events (event_category);
CREATE INDEX IF NOT EXISTS traffic_events_element_type_idx ON public.traffic_events (element_type);
CREATE INDEX IF NOT EXISTS traffic_events_link_url_idx ON public.traffic_events (link_url);
CREATE INDEX IF NOT EXISTS traffic_events_venue_id_idx ON public.traffic_events (venue_id);

-- Click events indexes
CREATE INDEX IF NOT EXISTS click_events_session_id_idx ON public.click_events (session_id);
CREATE INDEX IF NOT EXISTS click_events_page_idx ON public.click_events (page);
CREATE INDEX IF NOT EXISTS click_events_element_type_idx ON public.click_events (element_type);
CREATE INDEX IF NOT EXISTS click_events_link_url_idx ON public.click_events (link_url);
CREATE INDEX IF NOT EXISTS click_events_created_at_idx ON public.click_events (created_at DESC);

-- Funnels indexes
CREATE INDEX IF NOT EXISTS funnels_session_id_idx ON public.funnels (session_id);
CREATE INDEX IF NOT EXISTS funnels_visitor_id_idx ON public.funnels (visitor_id);
CREATE INDEX IF NOT EXISTS funnels_funnel_name_idx ON public.funnels (funnel_name);
CREATE INDEX IF NOT EXISTS funnels_step_number_idx ON public.funnels (step_number);
CREATE INDEX IF NOT EXISTS funnels_created_at_idx ON public.funnels (created_at DESC);

-- Leads indexes
CREATE INDEX IF NOT EXISTS leads_first_source_idx ON public.leads (first_source);
CREATE INDEX IF NOT EXISTS leads_last_campaign_idx ON public.leads (last_campaign);
CREATE INDEX IF NOT EXISTS leads_venue_id_idx ON public.leads (venue_id);
CREATE INDEX IF NOT EXISTS leads_tags_idx ON public.leads USING GIN (tags);

-- Page performance indexes
CREATE INDEX IF NOT EXISTS page_performance_page_date_idx ON public.page_performance (page, date DESC);
CREATE INDEX IF NOT EXISTS page_performance_venue_id_idx ON public.page_performance (venue_id);

-- GIN index for traffic_events metadata (only if column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'metadata') THEN
    CREATE INDEX IF NOT EXISTS traffic_events_metadata_idx ON public.traffic_events USING GIN (metadata);
  END IF;
END $$;

-- STEP 6: Add foreign keys and triggers
-- ============================================

-- Add FK to sessions.user_id
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'sessions_user_id_fkey') THEN
    ALTER TABLE public.sessions ADD CONSTRAINT sessions_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.leads(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add FK to funnels.user_id
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'funnels_user_id_fkey') THEN
    ALTER TABLE public.funnels ADD CONSTRAINT funnels_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.leads(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to sessions
DROP TRIGGER IF EXISTS update_sessions_updated_at ON public.sessions;
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to leads
DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to page_performance
DROP TRIGGER IF EXISTS update_page_performance_updated_at ON public.page_performance;
CREATE TRIGGER update_page_performance_updated_at
  BEFORE UPDATE ON public.page_performance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- STEP 7: Enable RLS and create policies
-- ============================================

-- Enable RLS on new tables
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_performance ENABLE ROW LEVEL SECURITY;

-- Sessions policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Allow public read for sessions') THEN
    CREATE POLICY "Allow public read for sessions" ON public.sessions FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Allow public insert for sessions') THEN
    CREATE POLICY "Allow public insert for sessions" ON public.sessions FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Allow public update for sessions') THEN
    CREATE POLICY "Allow public update for sessions" ON public.sessions FOR UPDATE USING (true);
  END IF;
END $$;

-- Click events policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'click_events' AND policyname = 'Allow public read for click_events') THEN
    CREATE POLICY "Allow public read for click_events" ON public.click_events FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'click_events' AND policyname = 'Allow public insert for click_events') THEN
    CREATE POLICY "Allow public insert for click_events" ON public.click_events FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Funnels policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funnels' AND policyname = 'Allow public read for funnels') THEN
    CREATE POLICY "Allow public read for funnels" ON public.funnels FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funnels' AND policyname = 'Allow public insert for funnels') THEN
    CREATE POLICY "Allow public insert for funnels" ON public.funnels FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Page performance policies
DO $$
BEGIN
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

-- Ensure traffic_events and leads policies exist
DO $$
BEGIN
  -- traffic_events policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'traffic_events' AND policyname = 'Allow public read for traffic_events') THEN
    CREATE POLICY "Allow public read for traffic_events" ON public.traffic_events FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'traffic_events' AND policyname = 'Allow public insert for traffic_events') THEN
    CREATE POLICY "Allow public insert for traffic_events" ON public.traffic_events FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  -- leads policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Allow public read for leads') THEN
    CREATE POLICY "Allow public read for leads" ON public.leads FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Allow public insert for leads') THEN
    CREATE POLICY "Allow public insert for leads" ON public.leads FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Allow public update for leads') THEN
    CREATE POLICY "Allow public update for leads" ON public.leads FOR UPDATE USING (true);
  END IF;
END $$;
