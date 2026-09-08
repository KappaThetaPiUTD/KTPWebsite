import { redirect } from "next/navigation";
import SemestersManager from "../../../../../components/portal/SemestersManager";
import { getPortalMemberContext } from "../../../../../lib/portal/member";

export default async function PortalAdminSemestersPage() {
  const context = await getPortalMemberContext();
  if (!context.isAdmin) redirect("/portal/dashboard");

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Admin tools</p>
      <h1 className="mt-2 text-3xl font-bold text-gray-950">Semesters</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">Create and manage activity-hour requirements for each semester.</p>
      <SemestersManager />
    </div>
  );
}
