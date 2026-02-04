"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";

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

export default function ResetPassword() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const exchangeToken = async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        await supabase.auth.signOut();

        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          setErrorMessage("Invalid or expired reset link.");
        } else {
          document.cookie = "fromResetFlow=true; path=/";
          setIsReady(true);
          const email = data?.user?.email ?? "";
          setUserEmail(email);
        }
      } else {
        setErrorMessage("Reset link is missing tokens.");
      }
    };

    exchangeToken();
  }, [supabase]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const requirements = [
      ...PASSWORD_REQUIREMENTS_BASE,
      {
        id: "notMatch",
        label: "Must not match username or email",
        test: (p) => p.toLowerCase() !== (userEmail || "").toLowerCase(),
      },
    ];
    if (!requirements.every((r) => r.test(newPassword))) {
      setErrorMessage("Please meet all password requirements below.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        setErrorMessage(error.message || "Password reset failed.");
      } else {
        // ✅ Clear the reset flow cookie
        document.cookie = "fromResetFlow=false; path=/; max-age=0;";
        
        // ✅ Sign out the user completely to clear the session
        await supabase.auth.signOut();
        
        // ✅ Clear any other auth-related cookies
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });

        setSuccessMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          // Force a full page reload to ensure clean state
          window.location.href = "/login";
        }, 2500);
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isReady && !successMessage && !errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-black">Validating reset link...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-4 text-black">Reset Password</h2>

        {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

        <form onSubmit={handlePasswordReset} className="space-y-6 mt-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-black">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                className="mt-1 w-full px-4 py-2 pr-10 text-black bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                maxLength={64}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <FaEyeSlash className="h-4 w-4 text-black hover:text-gray-700" />
                ) : (
                  <FaEye className="h-4 w-4 text-black hover:text-gray-700" />
                )}
              </button>
            </div>
            {newPassword.length > 0 && (() => {
              const { level, label } = getPasswordStrength(newPassword);
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
            {newPassword.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <p className="text-xs font-medium text-black mb-1.5">Password requirements:</p>
                {[
                  ...PASSWORD_REQUIREMENTS_BASE,
                  {
                    id: "notMatch",
                    label: "Must not match username or email",
                    test: (p) => p.toLowerCase() !== (userEmail || "").toLowerCase(),
                  },
                ].map((req) => {
                  const met = req.test(newPassword);
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
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="mt-1 w-full px-4 py-2 pr-10 text-black bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
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
                {newPassword === confirmPassword ? (
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

          <button
            type="submit"
            className="w-full bg-[#1E3D2F] text-white py-2 rounded-lg hover:bg-[#162E24] transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}