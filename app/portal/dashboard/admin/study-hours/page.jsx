import { redirect } from "next/navigation";
import AdminStudyHoursManager from "../../../../../components/portal/AdminStudyHoursManager";
import { getPortalMemberContext } from "../../../../../lib/portal/member";

export default async function AdminStudyHoursPage() {
  const context = await getPortalMemberContext();

  if (!context.isAdmin) {
    redirect("/portal/dashboard");
  }

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Admin
      </p>

      <h1 className="mt-2 text-3xl font-bold text-gray-950">
        Study Hours
      </h1>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
        Review Study Hour submissions, approve or reject requests, and track
        member progress.
      </p>

      <AdminStudyHoursManager />
    </div>
  );
}