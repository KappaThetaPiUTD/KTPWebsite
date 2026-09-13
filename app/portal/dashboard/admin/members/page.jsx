import { redirect } from "next/navigation";
import PortalMembersManager from "../../../../../components/portal/PortalMembersManager";
import { getPortalMemberContext } from "../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../lib/portal/server";

export default async function PortalAdminMembersPage() {
  const context = await getPortalMemberContext();
  if (!context.isAdmin) {
    redirect("/portal/dashboard");
  }

  const supabase = await getPortalServerClient();
  const [membersResult, profilesResult, countsResult, strikesResult] =
    await Promise.all([
      supabase
        .from("portal_members")
        .select("id, email, role, status, user_id, created_at")
        .order("email"),
      supabase.from("portal_profiles").select("user_id, full_name"),
      supabase.rpc("portal_strike_counts"),
      supabase
        .from("portal_strikes")
        .select("id, member_user_id, reason, issued_by, created_at")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  const profiles = new Map(
    (profilesResult.data || []).map((profile) => [
      profile.user_id,
      profile.full_name,
    ])
  );
  const membersByUserId = new Map(
    (membersResult.data || [])
      .filter((member) => member.user_id)
      .map((member) => [member.user_id, member])
  );
  const strikeCounts = new Map(
    (countsResult.data || []).map((count) => [
      count.member_user_id,
      Number(count.total),
    ])
  );
  const members = (membersResult.data || []).map((member) => ({
    id: member.id,
    email: member.email,
    role: member.role,
    status: member.status,
    userId: member.user_id,
    name: profiles.get(member.user_id) || member.email,
    strikeCount: strikeCounts.get(member.user_id) || 0,
    hasLoggedIn: Boolean(member.user_id),
  }));
  const recentStrikes = (strikesResult.data || []).map((strike) => ({
    id: strike.id,
    reason: strike.reason,
    createdAt: strike.created_at,
    memberName:
      profiles.get(strike.member_user_id) ||
      membersByUserId.get(strike.member_user_id)?.email ||
      "Unknown member",
    issuerName:
      profiles.get(strike.issued_by) ||
      membersByUserId.get(strike.issued_by)?.email ||
      "Unknown admin",
  }));
  const error =
    membersResult.error ||
    profilesResult.error ||
    countsResult.error ||
    strikesResult.error;

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Admin tools
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-950">Member whitelist</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
        Add new member emails, manage roles and access, and record auditable
        strikes. Changes are enforced by database row-level security.
      </p>
      <PortalMembersManager
        members={members}
        recentStrikes={recentStrikes}
        error={error ? "Unable to load the complete member and strike records." : ""}
      />
    </div>
  );
}
