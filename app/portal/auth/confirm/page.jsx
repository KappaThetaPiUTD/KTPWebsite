"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPortalBrowserClient } from "../../../../lib/portal/client";

function getSafeNextPath(value) {
  return typeof value === "string" && value.startsWith("/portal/") && !value.startsWith("//")
    ? value
    : "/portal/dashboard";
}

export default function PortalAuthConfirmPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getPortalBrowserClient();
    if (!supabase) {
      setError("The member portal is not configured.");
      return;
    }

    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get("access_token");
    const refreshToken = fragment.get("refresh_token");
    const authError = fragment.get("error_description") || fragment.get("error");
    const nextPath = getSafeNextPath(
      new URLSearchParams(window.location.search).get("next")
    );

    if (authError || !accessToken || !refreshToken) {
      setError("This secure email link is invalid or has expired. Request a new link.");
      return;
    }

    async function establishSession() {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) {
        setError("This secure email link is invalid or has expired. Request a new link.");
        return;
      }

      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      router.replace(nextPath);
      router.refresh();
    }

    establishSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-16 pt-36 text-black">
      <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-primary">Confirming your secure link</h1>
        {error ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
            {error}
          </p>
        ) : (
          <p className="mt-3 text-sm leading-6 text-gray-700">One moment while we securely sign you in.</p>
        )}
      </div>
    </div>
  );
}
