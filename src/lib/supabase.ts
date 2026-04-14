import { createClient } from "@supabase/supabase-js";

const configuredUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const configuredKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(configuredUrl && configuredKey);

const supabaseUrl = configuredUrl || "http://127.0.0.1:54321";
const supabaseKey = configuredKey || "missing-supabase-key";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});
