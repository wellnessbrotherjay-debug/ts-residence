-- Chatbot session and message logging
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  ip_address TEXT
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_messages_session_id_idx ON public.chat_messages (session_id);
CREATE INDEX IF NOT EXISTS chat_sessions_created_at_idx ON public.chat_sessions (created_at DESC);

-- Traffic and lead tracking
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

-- Lead tracking
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

-- Generated UTM tracking links
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

CREATE INDEX IF NOT EXISTS idx_generated_links_campaign ON public.generated_tracking_links(campaign_name);
CREATE INDEX IF NOT EXISTS idx_generated_links_brand ON public.generated_tracking_links(brand);

ALTER TABLE public.generated_tracking_links ENABLE ROW LEVEL SECURITY;

-- Marketing user profiles for UTM builder access
CREATE TABLE IF NOT EXISTS public.marketing_user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_user_profiles_username ON public.marketing_user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_marketing_user_profiles_active ON public.marketing_user_profiles(is_active);

ALTER TABLE public.marketing_user_profiles ENABLE ROW LEVEL SECURITY;

-- Marketing user activity tracking
CREATE TABLE IF NOT EXISTS public.marketing_user_activities (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES public.marketing_user_profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  activity_type TEXT NOT NULL, -- 'login', 'logout', 'utm_create', 'utm_copy', 'utm_view', 'campaign_create', 'site_visit', 'button_click'
  activity_data JSONB DEFAULT '{}'::jsonb,
  page_url TEXT,
  referrer TEXT,
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_activities_user_id ON public.marketing_user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_marketing_activities_username ON public.marketing_user_activities(username);
CREATE INDEX IF NOT EXISTS idx_marketing_activities_type ON public.marketing_user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_marketing_activities_created_at ON public.marketing_user_activities(created_at DESC);

ALTER TABLE public.marketing_user_activities ENABLE ROW LEVEL SECURITY;
