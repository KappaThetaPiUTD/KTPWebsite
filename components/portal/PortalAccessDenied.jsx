"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getPortalBrowserClient } from "../../lib/portal/client";

export default function PortalAccessDenied() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  const signOut = async () => {
    setSigningOut(true);
    setError("");

    const supabase = getPortalBrowserClient();
    if (!supabase) {
      setError("Portal configuration is unavailable.");
      setSigningOut(false);
      return;
    }

    const { error: signOutError } = await supabase.auth.signOut();
    setSigningOut(false);

    if (signOutError) {
      setError(signOutError.message || "Unable to sign out.");
      return;
    }

    router.replace("/portal/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-16 pt-36 text-black">
      <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Member Portal
        </p>
        <h1 className="mt-3 text-3xl font-bold text-gray-950">
          Account not authorized
        </h1>
        <p className="mt-4 text-sm leading-6 text-gray-700">
          Your authenticated email is not on the active KTP Portal membership
          list. Contact chapter leadership if this should be corrected.
        </p>
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="mt-7 rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-[#003f21] disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {signingOut ? "Signing out..." : "Sign out"}
        </button>
        {error && (
          <p className="mt-4 text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
