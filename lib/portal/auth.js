import { cache } from "react";
import { getPortalServerClient } from "./server";
import { isPortalSessionMissingError } from "./errors";

export const getPortalAuth = cache(async () => {
  const supabase = getPortalServerClient();

  if (!supabase) {
    return {
      configured: false,
      user: null,
      error: null,
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return {
    configured: true,
    user: user ?? null,
    error: isPortalSessionMissingError(error) ? null : error,
  };
});

export function getPortalDisplayName(user) {
  const fullName = user?.user_metadata?.full_name;

  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim();
  }

  return user?.email?.split("@")[0] || "Member";
}
