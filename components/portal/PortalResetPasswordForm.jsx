"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPortalBrowserClient } from "../../lib/portal/client";

export default function PortalResetPasswordForm({ configured }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Use at least 8 characters for your new password.");
      return;
    }

    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    const supabase = getPortalBrowserClient();
    if (!supabase) {
      setError("The member portal is not configured yet.");
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(
        updateError.message ||
          "The reset link is invalid or expired. Request a new link."
      );
      return;
    }

    setSaved(true);
  };

  if (saved) {
    return (
      <div className="rounded-2xl border border-green-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-primary">Password updated</h1>
        <p className="mt-3 text-sm leading-6 text-gray-700">
          Your new password is active.
        </p>
        <button
          type="button"
          onClick={() => {
            router.replace("/portal/dashboard");
            router.refresh();
          }}
          className="mt-6 rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-[#003f21]"
        >
          Return to the portal
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-primary">Choose a new password</h1>
      <p className="mt-2 text-sm leading-6 text-gray-700">
        Open this page from the secure link in your password reset email.
      </p>

      {!configured && (
        <p
          className="mt-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="status"
        >
          The KTP Portal Supabase project is not connected in this environment.
        </p>
      )}

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            className="mb-2 block text-sm font-semibold text-gray-900"
            htmlFor="new-password"
          >
            New password
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={!configured || submitting}
            minLength={8}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-semibold text-gray-900"
            htmlFor="confirm-password"
          >
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            disabled={!configured || submitting}
            minLength={8}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100"
          />
        </div>

        {error && (
          <p className="text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!configured || submitting}
          className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white hover:bg-[#003f21] disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {submitting ? "Updating..." : "Update password"}
        </button>
      </form>

      <Link
        href="/portal/login"
        className="mt-5 block text-center text-sm font-semibold text-primary hover:underline"
      >
        Back to sign in
      </Link>
    </div>
  );
}
