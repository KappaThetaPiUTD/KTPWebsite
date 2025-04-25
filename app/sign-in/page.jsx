// pages/signin.tsx or components/SignIn.tsx
"use client";

import React from "react";
import { FaGoogle, FaDiscord } from "react-icons/fa";
import { supabase } from "../../lib/supabase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) console.error("Google login failed:", error.message);
  };

  const handleDiscordLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
    });

    if (error) console.error("Discord login failed:", error.message);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        navigate("/dashboard");
      }
    };

    checkUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-4 text-black">Sign in</h2>

        <form className="space-y-4 mt-4">
          {/* ... your email/password fields (optional) */}
          <button
            type="submit"
            className="w-full bg-[#1E3D2F] text-white py-2 rounded-lg hover:bg-[#162E24] transition"
          >
            Sign in
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

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
