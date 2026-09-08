import { redirect } from "next/navigation";
import AdminActivityHoursManager from "../../../../../components/portal/AdminActivityHoursManager";
import { getPortalMemberContext } from "../../../../../lib/portal/member";

export default async function AdminActivityHoursPage() {
  const context = await getPortalMemberContext();
  if (!context.isAdmin) redirect("/portal/dashboard");

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Admin</p>
      <h1 className="mt-2 text-3xl font-bold text-gray-950">Activity Hours</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">Review photo evidence, approve or reject one-time submissions, and track semester progress.</p>
      <AdminActivityHoursManager />
    </div>
  );
}
