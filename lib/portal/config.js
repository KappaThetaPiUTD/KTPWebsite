export function getPortalConfig() {
  const url = process.env.NEXT_PUBLIC_PORTAL_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_PORTAL_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function isPortalConfigured() {
  return Boolean(getPortalConfig());
}
