import PortalResetPasswordForm from "../../../components/portal/PortalResetPasswordForm";
import { isPortalConfigured } from "../../../lib/portal/config";

export default function PortalResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-16 pt-36 text-black">
      <div className="mx-auto max-w-lg">
        <PortalResetPasswordForm configured={isPortalConfigured()} />
      </div>
    </div>
  );
}
