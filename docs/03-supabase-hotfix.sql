-- ============================================
-- SUPABASE HOTFIX (IDEMPOTENT)
-- Run this if 02-simple-migration.sql failed
-- ============================================

-- 1) Ensure required columns exist on traffic_events
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='session_id') THEN
    ALTER TABLE public.traffic_events ADD COLUMN session_id TEXT DEFAULT 'unknown_session';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='visitor_id') THEN
    ALTER TABLE public.traffic_events ADD COLUMN visitor_id UUID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='event_type') THEN
    ALTER TABLE public.traffic_events ADD COLUMN event_type TEXT NOT NULL DEFAULT 'page_view';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='event_category') THEN
    ALTER TABLE public.traffic_events ADD COLUMN event_category TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='page_title') THEN
    ALTER TABLE public.traffic_events ADD COLUMN page_title TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='referrer_domain') THEN
    ALTER TABLE public.traffic_events ADD COLUMN referrer_domain TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='ttclid') THEN
    ALTER TABLE public.traffic_events ADD COLUMN ttclid TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='msclkid') THEN
    ALTER TABLE public.traffic_events ADD COLUMN msclkid TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='element_type') THEN
    ALTER TABLE public.traffic_events ADD COLUMN element_type TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='element_text') THEN
    ALTER TABLE public.traffic_events ADD COLUMN element_text TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='element_id') THEN
    ALTER TABLE public.traffic_events ADD COLUMN element_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='element_class') THEN
    ALTER TABLE public.traffic_events ADD COLUMN element_class TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='element_selector') THEN
    ALTER TABLE public.traffic_events ADD COLUMN element_selector TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='link_url') THEN
    ALTER TABLE public.traffic_events ADD COLUMN link_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='scroll_depth') THEN
    ALTER TABLE public.traffic_events ADD COLUMN scroll_depth INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='scroll_max') THEN
    ALTER TABLE public.traffic_events ADD COLUMN scroll_max INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='time_on_page_seconds') THEN
    ALTER TABLE public.traffic_events ADD COLUMN time_on_page_seconds INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='time_since_page_load') THEN
    ALTER TABLE public.traffic_events ADD COLUMN time_since_page_load NUMERIC;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='form_name') THEN
    ALTER TABLE public.traffic_events ADD COLUMN form_name TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='form_id') THEN
    ALTER TABLE public.traffic_events ADD COLUMN form_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='funnel_name') THEN
    ALTER TABLE public.traffic_events ADD COLUMN funnel_name TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='step_name') THEN
    ALTER TABLE public.traffic_events ADD COLUMN step_name TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='step_number') THEN
    ALTER TABLE public.traffic_events ADD COLUMN step_number INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='value') THEN
    ALTER TABLE public.traffic_events ADD COLUMN value NUMERIC;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='currency') THEN
    ALTER TABLE public.traffic_events ADD COLUMN currency TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='country') THEN
    ALTER TABLE public.traffic_events ADD COLUMN country TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='region') THEN
    ALTER TABLE public.traffic_events ADD COLUMN region TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='city') THEN
    ALTER TABLE public.traffic_events ADD COLUMN city TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='timezone') THEN
    ALTER TABLE public.traffic_events ADD COLUMN timezone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='device_type') THEN
    ALTER TABLE public.traffic_events ADD COLUMN device_type TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='device_info') THEN
    ALTER TABLE public.traffic_events ADD COLUMN device_info JSONB;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='browser_info') THEN
    ALTER TABLE public.traffic_events ADD COLUMN browser_info JSONB;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='os_info') THEN
    ALTER TABLE public.traffic_events ADD COLUMN os_info TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='screen_resolution') THEN
    ALTER TABLE public.traffic_events ADD COLUMN screen_resolution TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='language') THEN
    ALTER TABLE public.traffic_events ADD COLUMN language TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='traffic_events' AND column_name='venue_id') THEN
    ALTER TABLE public.traffic_events ADD COLUMN venue_id TEXT DEFAULT 'ts_residence';
  END IF;
END $$;

-- Allow nullable session_id for beacon/unload events
ALTER TABLE public.traffic_events ALTER COLUMN session_id DROP NOT NULL;

-- 2) Ensure sessions table has ALL required columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions' AND column_name='session_id') THEN
    ALTER TABLE public.sessions ADD COLUMN session_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions' AND column_name='visitor_id') THEN
    ALTER TABLE public.sessions ADD COLUMN visitor_id UUID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions' AND column_name='user_id') THEN
    ALTER TABLE public.sessions ADD COLUMN user_id BIGINT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions' AND column_name='start_time') THEN
    ALTER TABLE public.sessions ADD COLUMN start_time TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions' AND column_name='end_time') THEN
    ALTER TABLE public.sessions ADD COLUMN end_time TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions' AND column_name='total_duration_seconds') THEN
    ALTER TABLE public.sessions ADD COLUMN total_duration_seconds INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions' AND column_name='pages_visited') THEN
    ALTER TABLE public.sessions ADD COLUMN pages_visited INTEGER DEFAULT 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions' AND column_name='engaged') THEN
    ALTER TABLE public.sessions ADD COLUMN engaged BOOLEAN DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions' AND column_name='converted') THEN
    ALTER TABLE public.sessions ADD COLUMN converted BOOLEAN DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions' AND column_name='conversion_value') THEN
    ALTER TABLE public.sessions ADD COLUMN conversion_value NUMERIC DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions' AND column_name='exit_page') THEN
    ALTER TABLE public.sessions ADD COLUMN exit_page TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions' AND column_name='updated_at') THEN
    ALTER TABLE public.sessions ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='click_events' AND column_name='session_id') THEN
    ALTER TABLE public.click_events ADD COLUMN session_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='funnels' AND column_name='session_id') THEN
    ALTER TABLE public.funnels ADD COLUMN session_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='leads' AND column_name='updated_at') THEN
    ALTER TABLE public.leads ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;

-- 3) Create update trigger function (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers on sessions and leads (skip if already exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_sessions_updated_at') THEN
    CREATE TRIGGER update_sessions_updated_at
      BEFORE UPDATE ON public.sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_leads_updated_at') THEN
    CREATE TRIGGER update_leads_updated_at
      BEFORE UPDATE ON public.leads
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- 4) Recreate core indexes
CREATE INDEX IF NOT EXISTS sessions_session_id_idx ON public.sessions (session_id);
CREATE INDEX IF NOT EXISTS sessions_visitor_id_idx ON public.sessions (visitor_id);
CREATE INDEX IF NOT EXISTS sessions_start_time_idx ON public.sessions (start_time DESC);
CREATE INDEX IF NOT EXISTS traffic_events_session_id_idx ON public.traffic_events (session_id);
CREATE INDEX IF NOT EXISTS traffic_events_created_at_idx ON public.traffic_events (created_at DESC);
CREATE INDEX IF NOT EXISTS click_events_session_id_idx ON public.click_events (session_id);
CREATE INDEX IF NOT EXISTS click_events_page_idx ON public.click_events (page);
CREATE INDEX IF NOT EXISTS click_events_created_at_idx ON public.click_events (created_at DESC);
CREATE INDEX IF NOT EXISTS funnels_session_id_idx ON public.funnels (session_id);
CREATE INDEX IF NOT EXISTS funnels_funnel_name_idx ON public.funnels (funnel_name);
CREATE INDEX IF NOT EXISTS funnels_created_at_idx ON public.funnels (created_at DESC);

-- 5) Hard-reset RLS policies on analytics tables (safe - won't cause deadlock)
DO $$
DECLARE p RECORD;
BEGIN
  ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.page_performance ENABLE ROW LEVEL SECURITY;
END $$;

-- Drop old policies and create new ones
DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='sessions' AND policyname LIKE 'Allow%' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.sessions', p.policyname);
  END LOOP;
END $$;

DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='click_events' AND policyname LIKE 'Allow%' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.click_events', p.policyname);
  END LOOP;
END $$;

DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='funnels' AND policyname LIKE 'Allow%' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.funnels', p.policyname);
  END LOOP;
END $$;

DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='page_performance' AND policyname LIKE 'Allow%' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.page_performance', p.policyname);
  END LOOP;
END $$;

-- Create policies (they won't exist after drop)
CREATE POLICY "Allow public read for sessions" ON public.sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert for sessions" ON public.sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for sessions" ON public.sessions FOR UPDATE USING (true);

CREATE POLICY "Allow public read for click_events" ON public.click_events FOR SELECT USING (true);
CREATE POLICY "Allow public insert for click_events" ON public.click_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read for funnels" ON public.funnels FOR SELECT USING (true);
CREATE POLICY "Allow public insert for funnels" ON public.funnels FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read for page_performance" ON public.page_performance FOR SELECT USING (true);
CREATE POLICY "Allow public insert for page_performance" ON public.page_performance FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for page_performance" ON public.page_performance FOR UPDATE USING (true);

-- 6) Verification output
SELECT 'hotfix complete' AS status;

SELECT 'Session ID columns verification:' AS check_type;
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema='public'
  AND table_name IN ('traffic_events', 'sessions', 'click_events', 'funnels')
  AND column_name = 'session_id'
ORDER BY table_name;

SELECT 'Sessions table columns verification:' AS check_type;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema='public' AND table_name='sessions'
ORDER BY ordinal_position;

SELECT 'Triggers verification:' AS check_type;
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema='public' AND trigger_name LIKE 'update_%'
ORDER BY event_object_table;
