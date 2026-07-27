import { redirect } from "next/navigation";
import PortalNav from "../../../components/portal/PortalNav";
import {
  getPortalMemberContext,
  isPortalProfileComplete,
} from "../../../lib/portal/member";

export default async function PortalDashboardLayout({ children }) {
  const context = await getPortalMemberContext();

  if (!context.configured) {
    redirect("/portal/login?reason=not-configured");
  }

  if (context.error || context.memberError) {
    redirect("/portal/login?reason=unavailable");
  }

  if (!context.user) {
    redirect("/portal/login?reason=signed-out");
  }
  if (!context.authorized) {
    redirect("/portal/access-denied");
  }
  if (!isPortalProfileComplete(context.profile)) {
    redirect("/portal/onboarding");
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 text-black">
      <div className="mx-auto grid max-w-7xl md:grid-cols-[240px_minmax(0,1fr)]">
        <PortalNav
          displayName={context.profile.full_name}
          email={context.user.email || ""}
          isAdmin={context.isAdmin}
        />
        <main className="min-w-0 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
