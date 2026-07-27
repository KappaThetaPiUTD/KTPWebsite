import { cache } from "react";
import { getPortalAuth } from "./auth";
import { getPortalServerClient } from "./server";

export function isPortalAdminRole(role) {
  return role === "admin" || role === "exec";
}

export function isPortalProfileComplete(profile) {
  return Boolean(
    profile?.full_name?.trim() &&
      profile?.major?.trim() &&
      profile?.graduation_year
  );
}

export async function loadPortalMemberContext() {
  const auth = await getPortalAuth();
  const base = {
    ...auth,
    member: null,
    profile: null,
    memberError: null,
    authorized: false,
    isAdmin: false,
  };

  if (!auth.configured || auth.error || !auth.user) {
    return base;
  }

  const supabase = getPortalServerClient();
  if (!supabase) {
    return base;
  }

  let { data: member, error: memberError } = await supabase
    .from("portal_members")
    .select("user_id, email, role, status")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (!member && !memberError && auth.user.email) {
    const normalizedEmail = auth.user.email.trim().toLowerCase();
    const byEmail = await supabase
      .from("portal_members")
      .select("user_id, email, role, status")
      .eq("email", normalizedEmail)
      .maybeSingle();

    member = byEmail.data;
    memberError = byEmail.error;

    if (member && !member.user_id && member.status === "active") {
      const claim = await supabase.rpc("claim_portal_membership");
      if (claim.error) {
        memberError = claim.error;
      } else {
        member = Array.isArray(claim.data) ? claim.data[0] : claim.data;
      }
    }
  }

  const authorized = Boolean(
    member &&
      member.user_id === auth.user.id &&
      member.status === "active"
  );

  if (!authorized || memberError) {
    return {
      ...base,
      member: member ?? null,
      memberError,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("portal_profiles")
    .select(
      "user_id, full_name, utd_email, phone, graduation_year, major, updated_at"
    )
    .eq("user_id", auth.user.id)
    .maybeSingle();

  return {
    ...base,
    member,
    profile: profile ?? null,
    memberError: profileError,
    authorized: !profileError,
    isAdmin: isPortalAdminRole(member.role),
  };
}

export const getPortalMemberContext = cache(loadPortalMemberContext);
