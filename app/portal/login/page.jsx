import PortalLoginForm from "../../../components/portal/PortalLoginForm";
import { isPortalConfigured } from "../../../lib/portal/config";

const notices = {
  "not-configured":
    "The portal code is ready, but the KTP Portal Supabase project is not connected in this environment.",
  unavailable:
    "The portal service could not be reached. The KTP Portal Supabase project may still be paused.",
  "signed-out": "Sign in to continue to the member portal.",
  "callback-error":
    "The secure email link could not be verified. Request a new password reset link.",
  "schema-missing":
    "The portal database schema has not been installed yet. Contact the VP of Technology.",
};

function getSafeNextPath(value) {
  if (
    typeof value === "string" &&
    value.startsWith("/portal/dashboard") &&
    !value.startsWith("//")
  ) {
    return value;
  }

  return "/portal/dashboard";
}

export default function PortalLoginPage({ searchParams }) {
  const configured = isPortalConfigured();
  const nextPath = getSafeNextPath(searchParams?.next);
  const reason =
    typeof searchParams?.reason === "string" ? searchParams.reason : "";
  const notice =
    (Object.hasOwn(notices, reason) ? notices[reason] : "") ||
    (!configured ? notices["not-configured"] : "");

  return (
    <div className="pt-24">
      <PortalLoginForm
        configured={configured}
        nextPath={nextPath}
        notice={notice}
      />
    </div>
  );
}
