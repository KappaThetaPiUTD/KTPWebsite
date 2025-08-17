"use client";

import React, { useState, useEffect } from "react";
import { FaGoogle, FaDiscord } from "react-icons/fa";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() { // Changed from SignUp to Login
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Changed from handleEmailSignUp to handleEmailLogin
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    // Changed from signUp to signInWithPassword
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message); // Changed message
    } else {
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
      alert("Please enter your email to reset password.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });

    if (error) {
      alert("Failed to send reset email: " + error.message);
    } else {
      setResetSent(true);
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

        {/* ✅ Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4 mt-4">
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
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
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 pr-16"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ color: 'black' }}
              />
              {password && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-black bg-gray-200 "
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={0}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              )}
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

          <button type="submit" 
          className="w-full bg-[#1E3D2F] text-white py-2 rounded-lg hover:bg-[#162E24] transition">
          Log In
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
      </div>
    </div>
  );
}