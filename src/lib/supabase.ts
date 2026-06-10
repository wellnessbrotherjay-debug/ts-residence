import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Accept either NEXT_PUBLIC_*-prefixed names or the plain names. NEXT_PUBLIC_*
// is the recommended setup for the public anon client (since it can safely be
// inlined into the browser bundle), but the fallback unblocks deploys when only
// the server-side names are configured.
function getPublicCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";
  return { url, key };
}

// Lazy client construction — the previous module-load throw blocked Next.js's
// page-data collection step for every route that imported this file, even if
// the route never actually called into Supabase. Defer the error to first use.
let cachedClient: SupabaseClient | null = null;

function buildClient(): SupabaseClient {
  const { url, key } = getPublicCredentials();
  if (!url || !key) {
    // eslint-disable-next-line no-console
    console.error("[Supabase] Missing env vars at first use:", {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_URL: process.env.SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "UNSET",
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "SET" : "UNSET",
    });
    throw new Error(
      "Supabase environment variables are missing. Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and an anon key.",
    );
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    if (!cachedClient) {
      cachedClient = buildClient();
    }
    const value = Reflect.get(cachedClient as object, prop, receiver);
    return typeof value === "function" ? value.bind(cachedClient) : value;
  },
});
