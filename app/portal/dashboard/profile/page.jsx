import PortalProfileForm from "../../../../components/portal/PortalProfileForm";
import { getPortalMemberContext } from "../../../../lib/portal/member";

export default async function PortalProfilePage() {
  const context = await getPortalMemberContext();
  const profile = context.profile || {};

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Member account
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-950">Profile</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-700">
        Keep your personal contact information current. Official chapter roles
        are intentionally managed separately and cannot be changed here.
      </p>

      <PortalProfileForm
        email={context.user?.email || ""}
        initialFullName={profile.full_name || ""}
        initialUtdEmail={profile.utd_email || ""}
        initialGraduationYear={profile.graduation_year || ""}
        initialPhone={profile.phone || ""}
        initialMajor={profile.major || ""}
      />
    </div>
  );
}
