import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Accept either the NEXT_PUBLIC_*-prefixed names or the plain server-side names.
// supabase-admin is used only from server code (API routes, server actions), so the
// plain SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY pair is the recommended setup —
// never inline the service-role key into the client bundle.
function getAdminCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  return { url, key };
}

// Lazy client construction. The previous module-load throw made every API route
// that imports this file fail Next.js's page-data collection step at build time,
// even when those routes weren't going to be hit. Defer the throw to first use
// so build-time imports succeed and runtime gets a clear, route-specific error.
let cachedClient: SupabaseClient | null = null;

function buildClient(): SupabaseClient {
  const { url, key } = getAdminCredentials();
  if (!url || !key) {
    throw new Error(
      "Supabase admin environment variables are missing. Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Proxy preserves the existing `supabaseAdmin.from(...)` call shape used across
// the codebase while keeping client construction lazy. The proxy resolves on
// first property access (the first method call after import).
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    if (!cachedClient) {
      cachedClient = buildClient();
    }
    const value = Reflect.get(cachedClient as object, prop, receiver);
    return typeof value === "function" ? value.bind(cachedClient) : value;
  },
});
