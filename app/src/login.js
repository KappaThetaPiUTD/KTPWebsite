"use client";

import React, { useState, useEffect } from "react";
import { FaGoogle, FaDiscord } from "react-icons/fa";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      alert("Login failed: " + error.message);
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
    if (error) console.error("Google login failed:", error.message);
  };

  const handleDiscordLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) console.error("Discord login failed:", error.message);
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

}