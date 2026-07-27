"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function validateProfile({ fullName, utdEmail, graduationYear, phone, major }) {
  const errors = {};
  const normalizedName = fullName.trim();
  const normalizedUtdEmail = utdEmail.trim().toLowerCase();
  const normalizedYear = graduationYear.trim();
  const normalizedMajor = major.trim();
  const phoneDigits = phone.replace(/\D/g, "");

  if (normalizedName.length < 2 || normalizedName.length > 100) {
    errors.fullName = "Enter a name between 2 and 100 characters.";
  }

  if (!normalizedYear) {
    errors.graduationYear = "Enter your graduation year.";
  } else {
    const year = Number(normalizedYear);
    if (!Number.isInteger(year) || year < 2020 || year > 2100) {
      errors.graduationYear = "Enter a graduation year from 2020 to 2100.";
    }
  }

  if (
    normalizedUtdEmail &&
    !/^[a-z0-9._%+-]+@utdallas\.edu$/i.test(normalizedUtdEmail)
  ) {
    errors.utdEmail = "Use a valid @utdallas.edu email or leave it blank.";
  }

  if (phone.trim() && phoneDigits.length !== 10) {
    errors.phone = "Enter a 10-digit US phone number or leave it blank.";
  }

  if (normalizedMajor.length < 2 || normalizedMajor.length > 100) {
    errors.major = "Enter a major between 2 and 100 characters.";
  }

  return {
    errors,
    values: {
      fullName: normalizedName,
      utdEmail: normalizedUtdEmail,
      graduationYear: normalizedYear ? Number(normalizedYear) : null,
      major: normalizedMajor,
      phone: phoneDigits
        ? `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(
            3,
            6
          )}-${phoneDigits.slice(6)}`
        : null,
    },
  };
}

export default function PortalProfileForm({
  email,
  initialFullName,
  initialUtdEmail,
  initialGraduationYear,
  initialPhone,
  initialMajor,
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialFullName);
  const [utdEmail, setUtdEmail] = useState(initialUtdEmail);
  const [graduationYear, setGraduationYear] = useState(
    initialGraduationYear ? String(initialGraduationYear) : ""
  );
  const [phone, setPhone] = useState(initialPhone);
  const [major, setMajor] = useState(initialMajor);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");

    const result = validateProfile({
      fullName,
      utdEmail,
      graduationYear,
      phone,
      major,
    });
    setErrors(result.errors);

    if (Object.keys(result.errors).length > 0) {
      return;
    }

    setSubmitting(true);
    let response;
    let data;
    try {
      response = await fetch("/api/portal/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.values),
      });
      data = await response.json();
    } catch {
      setSubmitting(false);
      setErrors({ form: "Unable to update your profile right now." });
      return;
    }
    setSubmitting(false);

    if (!response.ok) {
      setErrors({ form: data.error || "Unable to update your profile." });
      return;
    }

    const profile = data.profile;
    setErrors({});
    setFullName(profile.full_name || "");
    setUtdEmail(profile.utd_email || "");
    setGraduationYear(
      profile.graduation_year ? String(profile.graduation_year) : ""
    );
    setPhone(profile.phone || "");
    setMajor(profile.major || "");
    setStatus("Profile updated successfully.");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 max-w-2xl space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-900">
          Account email
        </label>
        <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700">
          {email}
        </div>
        <p className="mt-2 text-xs text-gray-600">
          Contact chapter leadership if this email needs to change.
        </p>
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-semibold text-gray-900"
          htmlFor="profile-full-name"
        >
          Full name
        </label>
        <input
          id="profile-full-name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          disabled={submitting}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {errors.fullName && (
          <p className="mt-2 text-sm text-red-700">{errors.fullName}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-sm font-semibold text-gray-900"
            htmlFor="profile-major"
          >
            Major
          </label>
          <input
            id="profile-major"
            value={major}
            onChange={(event) => setMajor(event.target.value)}
            disabled={submitting}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {errors.major && (
            <p className="mt-2 text-sm text-red-700">{errors.major}</p>
          )}
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-semibold text-gray-900"
            htmlFor="profile-graduation-year"
          >
            Graduation year
          </label>
          <input
            id="profile-graduation-year"
            type="number"
            min="2020"
            max="2100"
            inputMode="numeric"
            value={graduationYear}
            onChange={(event) => setGraduationYear(event.target.value)}
            disabled={submitting}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {errors.graduationYear && (
            <p className="mt-2 text-sm text-red-700">
              {errors.graduationYear}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-sm font-semibold text-gray-900"
            htmlFor="profile-utd-email"
          >
            UTD email
          </label>
          <input
            id="profile-utd-email"
            type="email"
            placeholder="netid@utdallas.edu"
            value={utdEmail}
            onChange={(event) => setUtdEmail(event.target.value)}
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {errors.utdEmail && (
            <p className="mt-2 text-sm text-red-700">{errors.utdEmail}</p>
          )}
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-semibold text-gray-900"
            htmlFor="profile-phone"
          >
            Phone number
          </label>
          <input
            id="profile-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {errors.phone && (
            <p className="mt-2 text-sm text-red-700">{errors.phone}</p>
          )}
        </div>
      </div>

      {errors.form && (
        <p className="text-sm font-medium text-red-700" role="alert">
          {errors.form}
        </p>
      )}
      {status && (
        <p className="text-sm font-medium text-green-800" role="status">
          {status}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-[#003f21] disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {submitting ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
