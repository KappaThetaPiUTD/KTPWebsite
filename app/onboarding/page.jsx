"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [eligible, setEligible] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [utdEmail, setUtdEmail] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [expectedGraduation, setExpectedGraduation] = useState("");
  const [currentStanding, setCurrentStanding] = useState("");
  const [major, setMajor] = useState("");
  const [rushClass, setRushClass] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Failed to get user for onboarding:", error.message);
        setError("Unable to load your account. Please try signing in again.");
        setLoading(false);
        return;
      }

      if (!user) {
        router.replace("/sign-in");
        return;
      }

      setUser(user);
      setPersonalEmail(user.email ?? "");

      try {
        // Check whitelist table for this email
        const { data: eligibility, error: eligibilityError } = await supabase
          .from("whitelist")
          .select("*")
          .eq("signup_email", (user.email ?? "").toLowerCase())
          .maybeSingle();

        if (eligibilityError) {
          console.error("Error checking eligibility:", eligibilityError.message);
          setError("Unable to verify eligibility right now. Please try again later.");
          setLoading(false);
          setCheckingEligibility(false);
          return;
        }

        if (!eligibility) {
          setError(
            "Your email is not on the eligibility list for this portal. Please contact an executive if you believe this is a mistake."
          );
          setEligible(false);
          setLoading(false);
          setCheckingEligibility(false);
          return;
        }

        setEligible(true);
        setCheckingEligibility(false);
        setLoading(false);
      } catch (err) {
        console.error("Unexpected error during eligibility check:", err);
        setError("Something went wrong while verifying eligibility.");
        setLoading(false);
        setCheckingEligibility(false);
      }
    };

    init();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const { error } = await supabase.from("profiles").upsert(
        {
          user_id: user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          utd_email: utdEmail.trim(),
          personal_email: personalEmail.trim(),
          phone_number: phoneNumber.trim(),
          expected_graduation_date: expectedGraduation || null,
          current_standing: currentStanding.trim(),
          major: major.trim(),
          rush_class: rushClass.trim(),
        },
        { onConflict: "user_id" }
      );

      if (error) {
        console.error("Error saving onboarding profile:", error.message);
        setError("Unable to save your information. Please try again.");
        setSubmitting(false);
        return;
      }

      router.replace("/dashboard");
    } catch (err) {
      console.error("Unexpected error during onboarding submit:", err);
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/sign-in");
  };

  if (loading || checkingEligibility) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E3D2F]">
        <p className="text-white text-lg">Loading your onboarding...</p>
      </div>
    );
  }

  if (!eligible) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E3D2F] px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
          <h2 className="text-2xl font-bold mb-4 text-black">Access Restricted</h2>
          <p className="text-black mb-4">
            {error ||
              "Your account is not authorized to access this portal. Please contact an executive if you believe this is in error."}
          </p>
          <button
            onClick={handleSignOut}
            className="mt-4 px-4 py-2 rounded-lg bg-[#1E3D2F] text-white hover:bg-[#162E24] transition"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E3D2F] px-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-black">
          Tell Us About You
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Please complete this short survey so we can set up your account in the KTP
          portal.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-black"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-black"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="utdEmail"
                className="block text-sm font-medium text-black"
              >
                UTD Email
              </label>
              <input
                id="utdEmail"
                type="email"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
                placeholder="netid@utdallas.edu"
                value={utdEmail}
                onChange={(e) => setUtdEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="personalEmail"
                className="block text-sm font-medium text-black"
              >
                Personal Email
              </label>
              <input
                id="personalEmail"
                type="email"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
                value={personalEmail}
                onChange={(e) => setPersonalEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-black"
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expectedGraduation"
                className="block text-sm font-medium text-black"
              >
                Expected Graduation Date
              </label>
              <input
                id="expectedGraduation"
                type="date"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
                value={expectedGraduation}
                onChange={(e) => setExpectedGraduation(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="currentStanding"
                className="block text-sm font-medium text-black"
              >
                Current Standing (e.g. Fall 2025)
              </label>
              <input
                id="currentStanding"
                type="text"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
                placeholder="e.g. Fall 2025"
                value={currentStanding}
                onChange={(e) => setCurrentStanding(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="major"
                className="block text-sm font-medium text-black"
              >
                Major
              </label>
              <input
                id="major"
                type="text"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="rushClass"
                className="block text-sm font-medium text-black"
              >
                Rush Class
              </label>
              <input
                id="rushClass"
                type="text"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
                placeholder="Assigned by exec"
                value={rushClass}
                onChange={(e) => setRushClass(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1E3D2F] text-white py-2 rounded-lg hover:bg-[#162E24] transition disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Finish Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}

