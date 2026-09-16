import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getPortalConfig } from "./config";

export async function getPortalServerClient() {
  const config = getPortalConfig();

  if (!config) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. Portal middleware refreshes
          // the session before rendering, while Route Handlers can persist them.
        }
      },
    },
  });
}

// This client bypasses RLS and is only for server-side admin operations such
// as sending Supabase Auth invitations. Never expose this key to the browser.
export function getPortalServiceRoleClient() {
  const config = getPortalConfig();
  const serviceRoleKey =
    process.env.PORTAL_SUPABASE_SECRET_KEY?.trim() ||
    process.env.PORTAL_SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!config || !serviceRoleKey) {
    return null;
  }

  return createClient(config.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
