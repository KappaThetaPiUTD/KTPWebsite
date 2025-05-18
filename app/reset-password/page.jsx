"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("user_id");

    if (!token || !userId) {
      setErrorMessage("Invalid or expired reset link.");
    } else {
      setIsValid(true); // Only render form if valid link
    }
  }, [searchParams]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.post("/api/auth/reset-password", {
        token: searchParams.get("token"),
        user_id: searchParams.get("user_id"),
        newPassword,
      });

      setSuccessMessage("Password reset successful! You can now log in.");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Password reset failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-4 text-black">
          Reset Password
        </h2>
        {errorMessage && (
          <p className="text-red-600 mb-4">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-600 mb-4">{successMessage}</p>
        )}

        {isValid ? (
          <form onSubmit={handlePasswordReset} className="space-y-4 mt-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-black">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
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
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
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
        ) : (
          <p className="text-red-600 mt-4 text-center">Invalid or expired link.</p>
        )}
      </div>
    </div>
  );
}
