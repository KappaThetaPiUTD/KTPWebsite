import { redirect } from "next/navigation";
import AdminActivityHoursManager from "../../../../../components/portal/AdminActivityHoursManager";
import SemestersManager from "../../../../../components/portal/SemestersManager";
import { getPortalMemberContext } from "../../../../../lib/portal/member";

export default async function AdminActivityHoursPage() {
  const context = await getPortalMemberContext();
  if (!context.isAdmin) redirect("/portal/dashboard");

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Admin</p>
      <h1 className="mt-2 text-3xl font-bold text-gray-950">Activity Hours</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">Set up semesters and requirements, review photo evidence, approve or reject submissions, and track progress.</p>
      <AdminActivityHoursManager />
      <section className="mt-12 border-t border-gray-200 pt-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Configuration</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-950">Semester settings</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-700">
            Create semesters, set their activity-hour requirements, and choose the active semester.
          </p>
        </div>
        <SemestersManager />
      </section>
    </div>
  );
}
