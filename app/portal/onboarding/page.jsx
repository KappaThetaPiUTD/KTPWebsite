import { redirect } from "next/navigation";
import PortalOnboardingForm from "../../../components/portal/PortalOnboardingForm";
import {
  getPortalMemberContext,
  isPortalProfileComplete,
} from "../../../lib/portal/member";

export default async function PortalOnboardingPage() {
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
  if (isPortalProfileComplete(context.profile)) {
    redirect("/portal/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-16 pt-36 text-black">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Member Portal
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950">
          Complete your account
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-700">
          Your invited email is authorized. Add the minimum profile information
          needed for member tools. Official chapter roles remain controlled by
          chapter leadership.
        </p>
        <PortalOnboardingForm
          email={context.user.email || ""}
          initialProfile={context.profile}
        />
      </div>
    </div>
  );
}
