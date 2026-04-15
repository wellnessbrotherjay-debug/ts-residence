-- ============================================
-- BEHAVIORAL TRACKING ENGINE SCHEMA
-- Enhanced Analytics & CRM System
-- ============================================

-- ============================================
-- SESSIONS TABLE
-- Tracks user sessions with duration, pages, and attribution
-- ============================================
CREATE TABLE IF NOT EXISTS public.sessions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  visitor_id UUID,
  user_id BIGINT REFERENCES public.leads(id) ON DELETE SET NULL,
  venue_id TEXT DEFAULT 'ts_residence', -- Multi-venue support
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
  -- First touch attribution
  first_source TEXT DEFAULT 'direct',
  first_medium TEXT,
  first_campaign TEXT,
  first_term TEXT,
  first_content TEXT,
  first_gclid TEXT,
  first_fbclid TEXT,
  first_ttclid TEXT,
  first_referrer TEXT,
  -- Last touch attribution
  last_source TEXT DEFAULT 'direct',
  last_medium TEXT,
  last_campaign TEXT,
  last_term TEXT,
  last_content TEXT,
  last_gclid TEXT,
  last_fbclid TEXT,
  last_ttclid TEXT,
  last_referrer TEXT,
  -- Engagement metrics
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

CREATE INDEX IF NOT EXISTS sessions_session_id_idx ON public.sessions (session_id);
CREATE INDEX IF NOT EXISTS sessions_visitor_id_idx ON public.sessions (visitor_id);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON public.sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_venue_id_idx ON public.sessions (venue_id);
CREATE INDEX IF NOT EXISTS sessions_start_time_idx ON public.sessions (start_time DESC);
CREATE INDEX IF NOT EXISTS sessions_first_source_idx ON public.sessions (first_source);
CREATE INDEX IF NOT EXISTS sessions_last_campaign_idx ON public.sessions (last_campaign);
CREATE INDEX IF NOT EXISTS sessions_converted_idx ON public.sessions (converted);
CREATE INDEX IF NOT EXISTS sessions_engaged_idx ON public.sessions (engaged);

-- ============================================
-- ENHANCED TRAFFIC EVENTS TABLE
-- All events with enhanced metadata
-- ============================================
CREATE TABLE IF NOT EXISTS public.traffic_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_id UUID,
  event_type TEXT NOT NULL,
  event_category TEXT, -- page_view, click, scroll, form, purchase, etc.
  page TEXT,
  page_title TEXT,
  referrer TEXT,
  -- Attribution
  source TEXT NOT NULL DEFAULT 'direct',
  medium TEXT,
  campaign TEXT,
  term TEXT,
  content TEXT,
  gclid TEXT,
  fbclid TEXT,
  ttclid TEXT,
  msclkid TEXT,
  -- Click-specific data
  element_type TEXT, -- button, link, icon, nav, etc.
  element_text TEXT,
  element_id TEXT,
  element_class TEXT,
  element_selector TEXT,
  link_url TEXT,
  -- Scroll-specific data
  scroll_depth INTEGER, -- 25, 50, 75, 100
  scroll_max INTEGER, -- Maximum scroll reached
  -- Time tracking
  time_on_page_seconds INTEGER,
  time_since_page_load NUMERIC,
  -- Form-specific data
  form_name TEXT,
  form_id TEXT,
  form_field_names TEXT[],
  -- Location
  country TEXT,
  region TEXT,
  city TEXT,
  timezone TEXT,
  -- Device info
  device_type TEXT,
  device_info JSONB,
  browser_info JSONB,
  os_info TEXT,
  screen_resolution TEXT,
  language TEXT,
  -- Venue support
  venue_id TEXT DEFAULT 'ts_residence',
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS traffic_events_created_at_idx ON public.traffic_events (created_at DESC);
CREATE INDEX IF NOT EXISTS traffic_events_event_type_idx ON public.traffic_events (event_type);
CREATE INDEX IF NOT EXISTS traffic_events_event_category_idx ON public.traffic_events (event_category);
CREATE INDEX IF NOT EXISTS traffic_events_session_id_idx ON public.traffic_events (session_id);
CREATE INDEX IF NOT EXISTS traffic_events_visitor_id_idx ON public.traffic_events (visitor_id);
CREATE INDEX IF NOT EXISTS traffic_events_source_idx ON public.traffic_events (source);
CREATE INDEX IF NOT EXISTS traffic_events_campaign_idx ON public.traffic_events (campaign);
CREATE INDEX IF NOT EXISTS traffic_events_page_idx ON public.traffic_events (page);
CREATE INDEX IF NOT EXISTS traffic_events_element_type_idx ON public.traffic_events (element_type);
CREATE INDEX IF NOT EXISTS traffic_events_link_url_idx ON public.traffic_events (link_url);
CREATE INDEX IF NOT EXISTS traffic_events_venue_id_idx ON public.traffic_events (venue_id);

-- GIN index for JSONB metadata queries
CREATE INDEX IF NOT EXISTS traffic_events_metadata_idx ON public.traffic_events USING GIN (metadata);

-- ============================================
-- FUNNELS TABLE
-- Track user journey through conversion funnel
-- ============================================
CREATE TABLE IF NOT EXISTS public.funnels (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_id UUID,
  user_id BIGINT REFERENCES public.leads(id) ON DELETE SET NULL,
  venue_id TEXT DEFAULT 'ts_residence',
  funnel_name TEXT DEFAULT 'default', -- e.g., 'booking', 'inquiry', 'quiz'
  step_name TEXT NOT NULL, -- view, click, lead, purchase, etc.
  step_number INTEGER NOT NULL,
  step_category TEXT, -- awareness, consideration, conversion, retention
  page TEXT,
  action TEXT,
  value NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS funnels_session_id_idx ON public.funnels (session_id);
CREATE INDEX IF NOT EXISTS funnels_visitor_id_idx ON public.funnels (visitor_id);
CREATE INDEX IF NOT EXISTS funnels_user_id_idx ON public.funnels (user_id);
CREATE INDEX IF NOT EXISTS funnels_funnel_name_idx ON public.funnels (funnel_name);
CREATE INDEX IF NOT EXISTS funnels_step_number_idx ON public.funnels (step_number);
CREATE INDEX IF NOT EXISTS funnels_created_at_idx ON public.funnels (created_at DESC);

-- ============================================
-- ENHANCED LEADS TABLE
-- User profiles with first/last touch attribution
-- ============================================
CREATE TABLE IF NOT EXISTS public.leads (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  stay_duration TEXT,
  message TEXT,
  page TEXT,
  -- First touch attribution (stored when lead is created)
  first_source TEXT DEFAULT 'direct',
  first_medium TEXT,
  first_campaign TEXT,
  first_term TEXT,
  first_content TEXT,
  first_gclid TEXT,
  first_fbclid TEXT,
  first_referrer TEXT,
  first_session_id TEXT,
  first_touch_at TIMESTAMPTZ DEFAULT NOW(),
  -- Last touch attribution (updated on each interaction)
  last_source TEXT DEFAULT 'direct',
  last_medium TEXT,
  last_campaign TEXT,
  last_term TEXT,
  last_content TEXT,
  last_gclid TEXT,
  last_fbclid TEXT,
  last_referrer TEXT,
  last_session_id TEXT,
  last_touch_at TIMESTAMPTZ DEFAULT NOW(),
  -- Lead scoring
  lead_score INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  conversion_score INTEGER DEFAULT 0,
  -- Status management
  status TEXT NOT NULL DEFAULT 'new',
  assigned_to TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  -- Location
  country TEXT,
  region TEXT,
  city TEXT,
  -- Venue support
  venue_id TEXT DEFAULT 'ts_residence',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads (email);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);
CREATE INDEX IF NOT EXISTS leads_first_source_idx ON public.leads (first_source);
CREATE INDEX IF NOT EXISTS leads_last_campaign_idx ON public.leads (last_campaign);
CREATE INDEX IF NOT EXISTS leads_venue_id_idx ON public.leads (venue_id);
CREATE INDEX IF NOT EXISTS leads_tags_idx ON public.leads USING GIN (tags);

-- ============================================
-- CLICK ANALYTICS TABLE
-- Detailed click tracking for heatmaps and behavior analysis
-- ============================================
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
  click_x INTEGER, -- X coordinate for potential heatmap
  click_y INTEGER, -- Y coordinate for potential heatmap
  viewport_width INTEGER,
  viewport_height INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS click_events_session_id_idx ON public.click_events (session_id);
CREATE INDEX IF NOT EXISTS click_events_page_idx ON public.click_events (page);
CREATE INDEX IF NOT EXISTS click_events_element_type_idx ON public.click_events (element_type);
CREATE INDEX IF NOT EXISTS click_events_link_url_idx ON public.click_events (link_url);
CREATE INDEX IF NOT EXISTS click_events_created_at_idx ON public.click_events (created_at DESC);

-- ============================================
-- PAGE PERFORMANCE TABLE
-- Aggregate page-level metrics
-- ============================================
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

CREATE INDEX IF NOT EXISTS page_performance_page_date_idx ON public.page_performance (page, date DESC);
CREATE INDEX IF NOT EXISTS page_performance_venue_id_idx ON public.page_performance (venue_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
DROP TRIGGER IF EXISTS update_sessions_updated_at ON public.sessions;
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_page_performance_updated_at ON public.page_performance;
CREATE TRIGGER update_page_performance_updated_at
  BEFORE UPDATE ON public.page_performance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_performance ENABLE ROW LEVEL SECURITY;

-- Public access for tracking (authenticated via API key)
CREATE POLICY "Allow public read for sessions" ON public.sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert for sessions" ON public.sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for sessions" ON public.sessions FOR UPDATE USING (true);

CREATE POLICY "Allow public read for traffic_events" ON public.traffic_events FOR SELECT USING (true);
CREATE POLICY "Allow public insert for traffic_events" ON public.traffic_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read for funnels" ON public.funnels FOR SELECT USING (true);
CREATE POLICY "Allow public insert for funnels" ON public.funnels FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read for click_events" ON public.click_events FOR SELECT USING (true);
CREATE POLICY "Allow public insert for click_events" ON public.click_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read for page_performance" ON public.page_performance FOR SELECT USING (true);
CREATE POLICY "Allow public insert for page_performance" ON public.page_performance FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for page_performance" ON public.page_performance FOR UPDATE USING (true);

-- Keep existing leads policies (should already be configured)
CREATE POLICY "Allow public read for leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Allow public insert for leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for leads" ON public.leads FOR UPDATE USING (true);
