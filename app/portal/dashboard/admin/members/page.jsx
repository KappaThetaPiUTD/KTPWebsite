import { redirect } from "next/navigation";
import PortalMembersManager from "../../../../../components/portal/PortalMembersManager";
import { getPortalMemberContext } from "../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../lib/portal/server";

export default async function PortalAdminMembersPage() {
  const context = await getPortalMemberContext();
  if (!context.isAdmin) {
    redirect("/portal/dashboard");
  }

  const supabase = getPortalServerClient();
  const { data, error } = await supabase
    .from("portal_members")
    .select("id, email, role, status, user_id, created_at")
    .order("email");

  const members = (data || []).map((member) => ({
    id: member.id,
    email: member.email,
    role: member.role,
    status: member.status,
    hasLoggedIn: Boolean(member.user_id),
  }));

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Admin tools
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-950">Member whitelist</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
        Add new member emails, update roles, or deactivate accounts. Changes are
        enforced by database row-level security and take effect immediately.
      </p>
      <PortalMembersManager
        members={members}
        error={error ? "Unable to load the complete member list." : ""}
      />
    </div>
  );
}
