import Link from "next/link";
import { getPortalMemberContext } from "../../../lib/portal/member";

const featureCards = [
  {
    title: "Events and RSVP",
    description:
      "The archived event and RSVP screens are reusable after their data access moves behind row-level security.",
    status: "Schema review next",
  },
  {
    title: "Attendance",
    description:
      "Attendance needs a server-verified check-in flow before member records can be enabled.",
    status: "Security rewrite required",
  },
  {
    title: "Admin tools",
    description:
      "The previous admin tables and filters can be reused after roles are enforced by database policies.",
    status: "Role policies required",
  },
];

export default async function PortalDashboardPage() {
  const context = await getPortalMemberContext();
  const user = context.user;

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

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-600">Account</p>
          <p className="mt-2 text-xl font-bold text-gray-950">
            {user?.email_confirmed_at ? "Email verified" : "Verification needed"}
          </p>
          <p className="mt-2 text-xs leading-5 text-gray-600">
            Last sign in:{" "}
            {user?.last_sign_in_at
              ? new Date(user.last_sign_in_at).toLocaleString()
              : "Not available"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-600">Member profile</p>
          <p className="mt-2 text-xl font-bold text-gray-950">
            Complete
          </p>
          <Link
            href="/portal/dashboard/profile"
            className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Review profile
          </Link>
        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
          <p className="text-sm font-semibold text-green-900">
            Authentication status
          </p>
          <p className="mt-2 text-xl font-bold text-green-950">Protected</p>
          <p className="mt-2 text-xs leading-5 text-green-900">
            Portal dashboard routes require a server-verified Supabase session.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-600">Portal role</p>
          <p className="mt-2 text-xl font-bold capitalize text-gray-950">
            {context.member?.role || "member"}
          </p>
          <p className="mt-2 text-xs leading-5 text-gray-600">
            Official roles are controlled by chapter leadership and database
            policy, not editable profile fields.
          </p>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold text-gray-950">
        Features recovered from the archived branch
      </h2>
      <div className="mt-4 grid gap-5 lg:grid-cols-3">
        {featureCards.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h3 className="font-bold text-gray-950">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              {feature.description}
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-primary">
              {feature.status}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
