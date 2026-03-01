"use client";

import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

const PASSWORD_REQUIREMENTS_BASE = [
  { id: "maxLength", label: "Maximum 64 characters", test: (p) => p.length <= 64 },
  { id: "upper", label: "At least one uppercase letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
  { id: "lower", label: "At least one lowercase letter (a–z)", test: (p) => /[a-z]/.test(p) },
  { id: "number", label: "At least one number (0–9)", test: (p) => /\d/.test(p) },
  { id: "special", label: "At least one special character (e.g. ! @ # $ % ^ & *)", test: (p) => /[!@#$%^&*()\-_=+[\]{}|;:',.<>?/"\\`~]/.test(p) },
];

function getPasswordStrength(p) {
  if (!p.length) return { level: 0, label: "Weak" };
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[a-z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[!@#$%^&*()\-_=+[\]{}|;:',.<>?/"\\`~]/.test(p)) score++;
  const level = score <= 1 ? 1 : score <= 2 ? 2 : score <= 3 ? 3 : 4;
  const labels = ["Weak", "Weak", "Fair", "Good", "Strong"];
  return { level, label: labels[level] };
}

export default function SignUp() {
  const router = useRouter();
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status

  const [signUpSent, setSignUpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    const emailLower = email.trim().toLowerCase();
    const requirements = [
      ...PASSWORD_REQUIREMENTS_BASE,
      {
        id: "notMatch",
        label: "Must not match email",
        test: (p) =>
          p.toLowerCase() !== emailLower,
      },
    ];
    if (!requirements.every((r) => r.test(password))) {
      setError("Please meet all password requirements below.");
      setLoading(false);
      return;
    }

    const displayName = email.trim();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
        data: {
          full_name: displayName,
          display_name: displayName,
        },
      },
    });

    if (error) {
      console.error("Email sign up failed:", error.message);
      setError(error.message);
      setLoading(false);
    } else if (data?.user?.identities?.length === 0) {
      setError("This email is already in use. Please sign in instead.");
      setLoading(false);
    } else {
      console.log("Sign up successful:", data);

      setSignUpSent(true);
      try {
        const res = await fetch("/api/notify/new-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name: displayName }),
        });
        const j = await res.json().catch(() => ({}));
        console.log("Notify new-user result", res.status, j);
      } catch (notifyErr) {
        console.warn("Notify new-user failed", notifyErr);
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/onboarding` },
    });
    if (error) console.error("Google login failed:", error.message);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) router.push("/dashboard");
    };
    checkUser();
  }, []);

  if (signUpSent) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Solid green panel */}
        <div className="w-2/3 bg-[#1E3D2F] flex items-center justify-start px-16">
        <h1
  className="text-white text-5xl font-bold -mt-20 typing-animation"
  style={{ fontFamily: "Poppins, sans-serif" }}
>
  Welcome to the KTP Portal!
</h1>

<style jsx>{`
  .typing-animation {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    border-right: 3px solid white;

    max-width: 0;
    animation: typing 3s steps(26, end) forwards,
      blink-cursor 0.75s step-end infinite;
  }

  @keyframes typing {
    from { max-width: 0; }
    to { max-width: 100%; }
  }

  @keyframes blink-cursor {
    from, to { border-color: transparent; }
    50% { border-color: white; }
  }
`}</style>


        </div>
        
        {/* Right side - Check email message */}
        <div className="w-1/3 flex items-center justify-center bg-white px-8">
          <div className="max-w-md w-full bg-white p-8">
            <h2 className="text-2xl font-bold mb-6 text-[#1E3D2F]">
              Check Your Email!
            </h2>
            <p className="text-black mb-4 text-center">
              We've sent you a confirmation email at{" "}
              <strong className="text-black">{email}</strong>
            </p>
            <p className="text-black text-center">
              Click the link in the email to complete your sign up.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Solid green panel */}
      <div className="w-2/3 bg-[#1E3D2F] flex items-center justify-start px-16">
<h1
  className="text-white text-5xl font-bold -mt-20 typing-animation"
  style={{ fontFamily: "Poppins, sans-serif" }}
>
  Welcome to the KTP Portal!
</h1>

<style jsx>{`
  .typing-animation {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    border-right: 3px solid white;

    max-width: 0;
    animation: typing 3s steps(26, end) forwards,
      blink-cursor 0.75s step-end infinite;
  }

  @keyframes typing {
    from { max-width: 0; }
    to { max-width: 100%; }
  }

  @keyframes blink-cursor {
    from, to { border-color: transparent; }
    50% { border-color: white; }
  }
`}</style>


      </div>
      
      {/* Right side - Sign up form */}
      <div className="w-1/3 flex justify-center bg-white px-8 pt-32 pb-16">
      <div className="max-w-md w-full bg-white p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">
            Sign Up
          </h2>

          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="mt-1 w-full px-4 py-2 pr-10 border border-black rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  maxLength={64}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4 text-black hover:text-gray-700" />
                  ) : (
                    <FaEye className="h-4 w-4 text-black hover:text-gray-700" />
                  )}
                </button>
              </div>
              {password.length > 0 && (() => {
                const { level, label } = getPasswordStrength(password);
                const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
                return (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex gap-0.5 flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 transition-colors ${i < level ? colors[level - 1] : "bg-gray-200"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-black capitalize">{label}</span>
                    </div>
                  </div>
                );
              })()}
              {password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <p className="text-xs font-medium text-black mb-1.5">Password requirements:</p>
                  {[
                    ...PASSWORD_REQUIREMENTS_BASE,
                    {
                      id: "notMatch",
                      label: "Must not match email",
                      test: (p) =>
                        p.toLowerCase() !== email.trim().toLowerCase(),
                    },
                  ].map((req) => {
                    const met = req.test(password);
                    return (
                      <div key={req.id} className="flex items-center gap-2 text-sm">
                        {met ? (
                          <FaCheck className="h-4 w-4 text-green-600 shrink-0" aria-hidden />
                        ) : (
                          <FaTimes className="h-4 w-4 text-red-500 shrink-0" aria-hidden />
                        )}
                        <span className="text-black">{req.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-black"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="mt-1 w-full px-4 py-2 pr-10 border border-black rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  maxLength={64}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-4 w-4 text-black hover:text-gray-700" />
                  ) : (
                    <FaEye className="h-4 w-4 text-black hover:text-gray-700" />
                  )}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <div className="flex items-center gap-2 text-sm mt-1.5">
                  {password === confirmPassword ? (
                    <>
                      <FaCheck className="h-4 w-4 text-green-600 shrink-0" />
                      <span className="text-gray-700">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <FaTimes className="h-4 w-4 text-red-500 shrink-0" />
                      <span className="text-black">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E3D2F] text-white py-2 rounded-lg hover:bg-[#162E24] transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-3 text-gray-500 text-sm">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="space-y-3">
  <button
    onClick={handleGoogleLogin}
    className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg text-black hover:bg-gray-100 transition"
  >
    <img 
      src="https://developers.google.com/identity/images/g-logo.png" 
      alt="Google logo" 
      className="mr-2 w-5 h-5"
    /> 
    Sign up with Google
  </button>
</div>
          <div className="text-center mt-6">
            <p className="text-sm text-black">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}