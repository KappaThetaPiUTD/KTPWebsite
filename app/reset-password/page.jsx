"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ResetPassword() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const exchangeToken = async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        await supabase.auth.signOut();

        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          setErrorMessage("Invalid or expired reset link.");
        } else {
          // ✅ Set the fromResetFlow flag for middleware to check
          document.cookie = "fromResetFlow=true; path=/";
          setIsReady(true);
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

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        setErrorMessage(error.message || "Password reset failed.");
      } else {
        // ✅ Clear the cookie now that reset is done
        document.cookie = "fromResetFlow=false; path=/; max-age=0;";

        setSuccessMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2500);
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
            <input
              type="password"
              id="newPassword"
              className="mt-1 w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1E3D2F] text-white py-2 rounded-lg hover:bg-[#162E24] transition"
            disabled={loading}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
