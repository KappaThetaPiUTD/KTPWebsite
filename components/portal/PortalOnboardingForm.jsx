"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PortalOnboardingForm({ email, initialProfile }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialProfile?.full_name || "");
  const [utdEmail, setUtdEmail] = useState(initialProfile?.utd_email || "");
  const [phone, setPhone] = useState(initialProfile?.phone || "");
  const [graduationYear, setGraduationYear] = useState(
    initialProfile?.graduation_year
      ? String(initialProfile.graduation_year)
      : ""
  );
  const [major, setMajor] = useState(initialProfile?.major || "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/portal/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          utdEmail,
          phone,
          graduationYear,
          major,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to complete onboarding.");
        return;
      }

      router.replace("/portal/dashboard");
      router.refresh();
    } catch {
      setError("Unable to complete onboarding right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-7 space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-900">
          Account email
        </label>
        <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700">
          {email}
        </div>
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-semibold text-gray-900"
          htmlFor="onboarding-full-name"
        >
          Full name
        </label>
        <input
          id="onboarding-full-name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
          disabled={submitting}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-sm font-semibold text-gray-900"
            htmlFor="onboarding-major"
          >
            Major
          </label>
          <input
            id="onboarding-major"
            value={major}
            onChange={(event) => setMajor(event.target.value)}
            required
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label
            className="mb-2 block text-sm font-semibold text-gray-900"
            htmlFor="onboarding-graduation-year"
          >
            Graduation year
          </label>
          <input
            id="onboarding-graduation-year"
            type="number"
            min="2020"
            max="2100"
            value={graduationYear}
            onChange={(event) => setGraduationYear(event.target.value)}
            required
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-sm font-semibold text-gray-900"
            htmlFor="onboarding-utd-email"
          >
            UTD email (optional)
          </label>
          <input
            id="onboarding-utd-email"
            type="email"
            placeholder="netid@utdallas.edu"
            value={utdEmail}
            onChange={(event) => setUtdEmail(event.target.value)}
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label
            className="mb-2 block text-sm font-semibold text-gray-900"
            htmlFor="onboarding-phone"
          >
            Phone number (optional)
          </label>
          <input
            id="onboarding-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-[#003f21] disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {submitting ? "Saving..." : "Finish account setup"}
      </button>
    </form>
  );
}
