import { redirect } from "next/navigation";
import PortalStrikesManager from "../../../../../components/portal/PortalStrikesManager";
import { getPortalMemberContext } from "../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../lib/portal/server";

export default async function PortalAdminStrikesPage() {
  const context = await getPortalMemberContext();
  if (!context.isAdmin) {
    redirect("/portal/dashboard");
  }

  const supabase = getPortalServerClient();
  const [membersResult, profilesResult, countsResult, strikesResult] =
    await Promise.all([
    supabase
      .from("portal_members")
      .select("user_id, email, role, status")
      .eq("status", "active")
      .not("user_id", "is", null)
      .order("email"),
    supabase
      .from("portal_profiles")
      .select("user_id, full_name"),
    supabase.rpc("portal_strike_counts"),
    supabase
      .from("portal_strikes")
      .select("id, member_user_id, reason, issued_by, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
    ]);

  const error =
    membersResult.error ||
    profilesResult.error ||
    countsResult.error ||
    strikesResult.error;
  const profiles = new Map(
    (profilesResult.data || []).map((profile) => [profile.user_id, profile])
  );
  const membersById = new Map(
    (membersResult.data || []).map((member) => [member.user_id, member])
  );
  const strikeCounts = new Map(
    (countsResult.data || []).map((row) => [
      row.member_user_id,
      Number(row.total),
    ])
  );

  const members = (membersResult.data || []).map((member) => ({
    userId: member.user_id,
    email: member.email,
    role: member.role,
    name: profiles.get(member.user_id)?.full_name || member.email,
    strikeCount: strikeCounts.get(member.user_id) || 0,
  }));

  const recentStrikes = (strikesResult.data || []).slice(0, 20).map((strike) => {
    const member = membersById.get(strike.member_user_id);
    const issuer = membersById.get(strike.issued_by);
    return {
      id: strike.id,
      reason: strike.reason,
      createdAt: strike.created_at,
      memberName:
        profiles.get(strike.member_user_id)?.full_name ||
        member?.email ||
        "Unknown member",
      issuerName:
        profiles.get(strike.issued_by)?.full_name ||
        issuer?.email ||
        "Unknown admin",
    };
  });

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Admin tools
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-950">Strike log</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
        Record auditable member strikes. The database verifies admin access and
        records the issuing officer from the authenticated session.
      </p>
      <PortalStrikesManager
        members={members}
        recentStrikes={recentStrikes}
        error={error ? "Unable to load the complete strike log." : ""}
      />
    </div>
  );
}
