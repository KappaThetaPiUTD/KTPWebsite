import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPortalConfig } from "./config";

export function getPortalServerClient() {
  const config = getPortalConfig();

  if (!config) {
    return null;
  }

  const cookieStore = cookies();

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
