CREATE TABLE IF NOT EXISTS public.traffic_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_id UUID, -- Added for cross-session tracking
  event_type TEXT NOT NULL,
  page TEXT,
  source TEXT NOT NULL DEFAULT 'direct',
  medium TEXT,
  campaign TEXT,
  term TEXT,
  content TEXT,
  referrer TEXT,
  gclid TEXT,
  fbclid TEXT,
  metadata JSONB DEFAULT '{}'::jsonb, -- Unified metadata store
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS traffic_events_created_at_idx ON public.traffic_events (created_at DESC);
CREATE INDEX IF NOT EXISTS traffic_events_event_type_idx ON public.traffic_events (event_type);
CREATE INDEX IF NOT EXISTS traffic_events_source_idx ON public.traffic_events (source);
CREATE INDEX IF NOT EXISTS traffic_events_campaign_idx ON public.traffic_events (campaign);
CREATE INDEX IF NOT EXISTS traffic_events_visitor_id_idx ON public.traffic_events (visitor_id);
CREATE INDEX IF NOT EXISTS traffic_events_session_id_idx ON public.traffic_events (session_id);

CREATE TABLE IF NOT EXISTS public.leads (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT, -- Made optional
  email TEXT NOT NULL,
  phone TEXT,
  stay_duration TEXT,
  message TEXT,
  page TEXT,
  source TEXT NOT NULL DEFAULT 'direct',
  medium TEXT,
  campaign TEXT,
  term TEXT,
  content TEXT,
  referrer TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  metadata JSONB DEFAULT '{}'::jsonb, -- Unified metadata store for quiz results, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_source_idx ON public.leads (source);
CREATE INDEX IF NOT EXISTS leads_campaign_idx ON public.leads (campaign);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);
