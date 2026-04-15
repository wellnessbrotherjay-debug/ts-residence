-- ============================================
-- DIAGNOSTIC: Check current traffic_events structure
-- Run this FIRST to see what columns exist
-- ============================================

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'traffic_events'
ORDER BY ordinal_position;

-- If session_id is missing, run this to add it:
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'session_id') THEN
    ALTER TABLE public.traffic_events ADD COLUMN session_id TEXT NOT NULL DEFAULT 'unknown_session';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traffic_events' AND column_name = 'visitor_id') THEN
    ALTER TABLE public.traffic_events ADD COLUMN visitor_id UUID;
  END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'traffic_events' AND column_name IN ('session_id', 'visitor_id')
ORDER BY column_name;
