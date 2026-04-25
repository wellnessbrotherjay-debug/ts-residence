
// TEMP HOTFIX: Disable Supabase client to unblock build/deploy
// export const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
export const supabase = undefined as any;
