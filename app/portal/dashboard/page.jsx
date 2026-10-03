import { getPortalMemberContext } from "../../../lib/portal/member";
import { getPortalServerClient } from "../../../lib/portal/server";

// Members only see their own strike count; RLS limits the rows to their own.
async function loadOwnStrikeCount(userId) {
  if (!userId) return null;

  const supabase = await getPortalServerClient();
  if (!supabase) return null;

  const { count, error } = await supabase
    .from("portal_strikes")
    .select("id", { count: "exact", head: true })
    .eq("member_user_id", userId);

  return error ? null : count ?? 0;
}

export default async function PortalDashboardPage() {
  const context = await getPortalMemberContext();
  const user = context.user;
  const strikeCount = await loadOwnStrikeCount(user?.id);

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Portal overview
      </p>

      <h1 className="mt-2 text-3xl font-bold text-gray-950">
        Welcome, {context.profile?.full_name || user?.email?.split("@")[0]}
      </h1>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
        The secure portal foundation is active. Authentication, protected
        routing, password recovery, sign-out, and member profile editing are
        ready for the separate KTP Portal Supabase project.
      </p>

      <div className="mt-8 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-600">
            Account
          </p>

          <p className="mt-2 text-xl font-bold text-gray-950">
            {user?.email_confirmed_at
              ? "Email verified"
              : "Verification needed"}
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-600">
            Last sign in:{" "}
            {user?.last_sign_in_at
              ? new Date(user.last_sign_in_at).toLocaleString()
              : "Not available"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-600">
            Portal role
          </p>

          <p className="mt-2 text-xl font-bold capitalize text-gray-950">
            {context.member?.role || "member"}
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-600">
            Official roles are controlled by chapter leadership and database
            policy, not editable profile fields.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-600">
            Strikes
          </p>

          <p
            className={`mt-2 text-xl font-bold ${
              strikeCount > 0 ? "text-red-600" : "text-gray-950"
            }`}
          >
            {strikeCount === null ? "Unavailable" : strikeCount}
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-600">
            {strikeCount === null
              ? "Your strike count could not be loaded right now."
              : "Questions about a strike can be directed to chapter leadership."}
          </p>
        </div>
      </div>
    </div>
  );
}