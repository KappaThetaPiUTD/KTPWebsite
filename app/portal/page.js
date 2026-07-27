import { redirect } from "next/navigation";
import {
  getPortalMemberContext,
  isPortalProfileComplete,
} from "../../lib/portal/member";

export default async function PortalPage() {
  const context = await getPortalMemberContext();

  if (!context.configured) {
    redirect("/portal/login?reason=not-configured");
  }

  if (context.error || context.memberError) {
    redirect("/portal/login?reason=unavailable");
  }

  if (!context.user) {
    redirect("/portal/login");
  }
  if (!context.authorized) {
    redirect("/portal/access-denied");
  }
  if (!isPortalProfileComplete(context.profile)) {
    redirect("/portal/onboarding");
  }

  redirect("/portal/dashboard");
}
