"use client";

import React, { useState, useEffect } from "react";
import { FaGoogle, FaDiscord, FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      setError(error.message);
      setLoading(false);
    } else {
      console.log("Login successful:", data);
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) {
      console.error("Google login failed:", error.message);
    } else {
      // Try to get user email after OAuth
      setTimeout(async () => {
        const { data } = await supabase.auth.getUser();
        const userEmail = data?.user?.email;
        if (userEmail) {
          try {
            await fetch('/api/notify/new-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: userEmail })
            });
          } catch (notifyErr) {
            console.warn('Notify new-user failed', notifyErr);
          }
        }
      }, 1000); // Wait for OAuth session
    }
  };

  const handleDiscordLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) {
      console.error("Discord login failed:", error.message);
    } else {
      // Try to get user email after OAuth
      setTimeout(async () => {
        const { data } = await supabase.auth.getUser();
        const userEmail = data?.user?.email;
        if (userEmail) {
          try {
            await fetch('/api/notify/new-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: userEmail })
            });
          } catch (notifyErr) {
            console.warn('Notify new-user failed', notifyErr);
          }
        }
      }, 1000); // Wait for OAuth session
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset password.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });

    if (error) {
      setError("Failed to send reset email: " + error.message);
    } else {
      setResetSent(true);
      setError("");
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) router.push("/dashboard");
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-4 text-black">Login</h2>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4 mt-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
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
            <label htmlFor="password" className="block text-sm font-medium text-black">
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
            <div className="text-right mt-1">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
              {resetSent && (
                <p className="text-xs text-green-600 mt-1">Reset email sent!</p>
              )}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E3D2F] text-white py-2 rounded-lg hover:bg-[#162E24] transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg text-black hover:bg-gray-100 transition"
          >
            <FaGoogle className="mr-2 text-lg" /> Continue with Google
          </button>
          <button
            onClick={handleDiscordLogin}
            className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg text-black hover:bg-gray-100 transition"
          >
            <FaDiscord className="mr-2 text-lg text-[#5865F2]" /> Continue with Discord
          </button>
        </div>

        {/* Link to sign up */}
        <div className="text-center mt-4">
          <p className="text-sm text-black">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/sign-in")}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}