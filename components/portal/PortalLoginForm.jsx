"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getPortalBrowserClient } from "../../lib/portal/client";

function getLoginErrorMessage(error) {
  if (error?.message?.toLowerCase().includes("invalid login credentials")) {
    return "The email or password is incorrect.";
  }

  return error?.message || "Unable to sign in right now.";
}

export default function PortalLoginForm({
  configured,
  nextPath,
  notice,
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");

    const supabase = getPortalBrowserClient();
    if (!supabase) {
      setError("The member portal is not configured yet.");
      return;
    }

    setSubmitting(true);
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if (loginError) {
      setError(getLoginErrorMessage(loginError));
      return;
    }

    router.replace(nextPath);
    router.refresh();
  };

  const handlePasswordReset = async () => {
    setError("");
    setStatus("");

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Enter your email before requesting a password reset.");
      return;
    }

    const supabase = getPortalBrowserClient();
    if (!supabase) {
      setError("The member portal is not configured yet.");
      return;
    }

    setResetting(true);
    const callbackUrl = new URL("/portal/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("next", "/portal/reset-password");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      { redirectTo: callbackUrl.toString() }
    );
    setResetting(false);

    if (resetError) {
      setError(resetError.message || "Unable to send a password reset email.");
      return;
    }

    setStatus("Check your email for a secure password reset link.");
  };

  return (
    <div className="grid min-h-[calc(100vh-6rem)] bg-white text-black lg:grid-cols-[1.15fr_0.85fr]">
      <div className="hidden items-center bg-primary px-12 lg:flex xl:px-20">
        <div className="max-w-xl text-white">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/75">
            Kappa Theta Pi UTD
          </p>
          <h1 className="text-5xl font-bold leading-tight">
            Welcome back to the member portal.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-white/85">
            Access your member profile and the secure foundation for future
            events, RSVP, attendance, and chapter administration tools.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary lg:hidden">
            KTP Member Portal
          </p>
          <h2 className="text-3xl font-bold text-primary">Member sign in</h2>
          <p className="mt-2 text-sm leading-6 text-gray-700">
            Use the email and password connected to your KTP Portal account.
          </p>

          {notice && (
            <div
              className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
                configured
                  ? "border-blue-200 bg-blue-50 text-blue-900"
                  : "border-amber-300 bg-amber-50 text-amber-950"
              }`}
              role="status"
            >
              {notice}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-2 block text-sm font-semibold text-gray-900"
                htmlFor="portal-email"
              >
                Email
              </label>
              <input
                id="portal-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={!configured || submitting}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label
                  className="block text-sm font-semibold text-gray-900"
                  htmlFor="portal-password"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={!configured || resetting || submitting}
                  className="text-sm font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  {resetting ? "Sending..." : "Forgot password?"}
                </button>
              </div>
              <input
                id="portal-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={!configured || submitting}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-red-700" role="alert">
                {error}
              </p>
            )}
            {status && (
              <p className="text-sm font-medium text-green-800" role="status">
                {status}
              </p>
            )}

            <button
              type="submit"
              disabled={!configured || submitting}
              className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:bg-[#003f21] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-xs leading-5 text-gray-600">
            Accounts are provisioned by chapter leadership. Public self-signup
            is intentionally disabled.
          </p>
        </div>
      </div>
    </div>
  );
}
