import { createClient } from "@supabase/supabase-js";

// Supabase's URL and anon key are public browser configuration, but they still
// need to be present in each environment. Returning null instead of constructing
// an invalid client keeps builds and pages from crashing when Vercel is missing
// configuration. Callers must surface an explicit unavailable/error state.
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}
