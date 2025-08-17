"use client";

import React, { useState, useEffect } from "react";
import { FaGoogle, FaDiscord, FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpSent, setSignUpSent] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Check password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Check if first and last name are provided
    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required");
      setLoading(false);
      return;
    }

    const displayName = `${firstName.trim()} ${lastName.trim()}`;

    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          display_name: displayName,
          first_name: firstName.trim(),
          last_name: lastName.trim()
        }
      }
    });

    if (error) {
      console.error("Email sign up failed:", error.message);
      setError(error.message);
      setLoading(false);
    } else {
      console.log("Sign up successful:", data);
      
      // Insert into custom users table
      if (data.user) {
        try {
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                name: displayName
              }
            ]);
          
          if (insertError) {
            console.error("Error inserting into users table:", insertError);
          } else {
            console.log("Successfully inserted into custom users table");
          }
        } catch (insertErr) {
          console.error("Error with custom users table insert:", insertErr);
        }
      }
      
      setSignUpSent(true);
      // Fire and forget notification
      try {
        const res = await fetch('/api/notify/new-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name: displayName })
        });
        const j = await res.json().catch(()=>({}));
        console.log('Notify new-user result', res.status, j);
      } catch (notifyErr) {
        console.warn('Notify new-user failed', notifyErr);
      }
      setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8 pt-24">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
          <h2 className="text-2xl font-bold mb-6 text-[#1E3D2F]">Check Your Email!</h2>
          <p className="text-black mb-4 text-center">
            We've sent you a confirmation email at <strong className="text-black">{email}</strong>
          </p>
          <p className="text-black text-center">
            Click the link in the email to complete your sign up.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 pt-24">
      <div className="flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">Sign Up</h2>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-black">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-black">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            
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
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
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
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E3D2F] text-white py-2 rounded-lg hover:bg-[#162E24] transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Separator */}
          <div className="flex items-center my-6">
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