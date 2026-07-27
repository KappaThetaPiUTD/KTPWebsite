"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getPortalConfig } from "./config";

let portalClient;

export function getPortalBrowserClient() {
  const config = getPortalConfig();

  if (!config) {
    return null;
  }

  if (!portalClient) {
    portalClient = createBrowserClient(config.url, config.anonKey);
  }

  return portalClient;
}
