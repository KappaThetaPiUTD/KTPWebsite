"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCheck, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { getPortalBrowserClient } from "../../lib/portal/client";

const SPECIAL_CHAR_REGEX = /[!@#$%^&*()\-_=+[\]{}|;:',.<>?/"\\`~]/;

const PASSWORD_REQUIREMENTS_BASE = [
  {
    id: "minLength",
    label: "At least 8 characters",
    test: (p) => p.length >= 8,
  },
  {
    id: "maxLength",
    label: "Maximum 64 characters",
    test: (p) => p.length <= 64,
  },
  {
    id: "upper",
    label: "At least one uppercase letter (A–Z)",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "lower",
    label: "At least one lowercase letter (a–z)",
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: "number",
    label: "At least one number (0–9)",
    test: (p) => /\d/.test(p),
  },
  {
    id: "special",
    label: "At least one special character (e.g. ! @ # $ % ^ & *)",
    test: (p) => SPECIAL_CHAR_REGEX.test(p),
  },
];

function getPasswordStrength(p) {
  if (!p.length) return { level: 0, label: "Weak" };
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[a-z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (SPECIAL_CHAR_REGEX.test(p)) score++;
  const level = score <= 1 ? 1 : score <= 2 ? 2 : score <= 3 ? 3 : 4;
  const labels = ["Weak", "Weak", "Fair", "Good", "Strong"];
  return { level, label: labels[level] };
}

function getPasswordRequirements(userEmail) {
  return [
    ...PASSWORD_REQUIREMENTS_BASE,
    {
      id: "notMatch",
      label: "Must not match username or email",
      test: (p) =>
        p.length > 0 && p.toLowerCase() !== (userEmail || "").toLowerCase(),
    },
  ];
}

export default function PortalResetPasswordForm({ configured }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const supabase = getPortalBrowserClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? "");
    });
  }, []);

  const requirements = getPasswordRequirements(userEmail);
  const { level, label } = getPasswordStrength(password);
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!requirements.every((requirement) => requirement.test(password))) {
      setError("Please meet all password requirements below.");
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
        Open this page from the secure link in your invitation or password reset email.
      </p>

      {!configured && (
        <p
          className="mt-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="status"
        >
          The KTP Portal Supabase project is not connected in this environment.
          You can still preview the password requirements below.
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
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={submitting}
              maxLength={64}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="h-4 w-4 text-gray-600 hover:text-gray-800" />
              ) : (
                <FaEye className="h-4 w-4 text-gray-600 hover:text-gray-800" />
              )}
            </button>
          </div>

          {password.length > 0 && (
            <div className="mt-2">
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-1.5 flex-1 gap-0.5 overflow-hidden rounded-full bg-gray-200">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`flex-1 transition-colors ${
                        index < level ? strengthColors[level - 1] : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium capitalize text-black">
                  {label}
                </span>
              </div>
            </div>
          )}

          <div className="mt-3 space-y-1.5">
            <p className="mb-1.5 text-xs font-medium text-black">
              Password requirements:
            </p>
            {requirements.map((requirement) => {
              const met = requirement.test(password);
              return (
                <div key={requirement.id} className="flex items-center gap-2 text-sm">
                  {met ? (
                    <FaCheck className="h-4 w-4 shrink-0 text-green-600" aria-hidden />
                  ) : (
                    <FaTimes className="h-4 w-4 shrink-0 text-red-500" aria-hidden />
                  )}
                  <span className="text-black">{requirement.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-semibold text-gray-900"
            htmlFor="confirm-password"
          >
            Confirm new password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmation ? "text" : "password"}
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              disabled={submitting}
              maxLength={64}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowConfirmation((current) => !current)}
              aria-label={
                showConfirmation ? "Hide confirmation" : "Show confirmation"
              }
            >
              {showConfirmation ? (
                <FaEyeSlash className="h-4 w-4 text-gray-600 hover:text-gray-800" />
              ) : (
                <FaEye className="h-4 w-4 text-gray-600 hover:text-gray-800" />
              )}
            </button>
          </div>
          {confirmation.length > 0 && (
            <div className="mt-1.5 flex items-center gap-2 text-sm">
              {password === confirmation ? (
                <>
                  <FaCheck className="h-4 w-4 shrink-0 text-green-600" />
                  <span className="text-gray-700">Passwords match</span>
                </>
              ) : (
                <>
                  <FaTimes className="h-4 w-4 shrink-0 text-red-500" />
                  <span className="text-black">Passwords do not match</span>
                </>
              )}
            </div>
          )}
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
