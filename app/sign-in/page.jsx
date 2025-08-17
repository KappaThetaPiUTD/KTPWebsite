"use client";

import React, { useState, useEffect } from "react";
import { FaGoogle, FaDiscord } from "react-icons/fa";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpSent, setSignUpSent] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      console.error("Email sign up failed:", error.message);
      setError(error.message);
    } else {
      console.log("Sign up successful:", data);
      setSignUpSent(true);
      // Fire and forget notification
      try {
        const res = await fetch('/api/notify/new-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const j = await res.json().catch(()=>({}));
        console.log('Notify new-user result', res.status, j);
      } catch (notifyErr) {
        console.warn('Notify new-user failed', notifyErr);
      }
      // Note: User won't be logged in until they confirm their email
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) console.error("Google login failed:", error.message);
  };

  const handleDiscordLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) console.error("Discord login failed:", error.message);
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
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Check Your Email!</h2>
          <p className="text-gray-600 mb-4">
            We've sent you a confirmation email at <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Click the link in the email to complete your sign up.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-4 text-black">Sign Up</h2>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSignUp} className="space-y-4 mt-4">
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
                className="mt-1 w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 pr-16"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ color: 'black' }}
              />
              {password && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-black bg-gray-200 border border-gray-400 rounded px-2 py-1 cursor-pointer shadow"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={0}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 pr-16"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ color: 'black' }}
              />
              {confirmPassword && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-black bg-gray-200 "
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  tabIndex={0}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              )}
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-[#1E3D2F] text-white py-2 rounded-lg hover:bg-[#162E24] transition"
          >
            Sign Up
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

        {/* Link to sign in */}
        <div className="text-center mt-4">
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
  );
}