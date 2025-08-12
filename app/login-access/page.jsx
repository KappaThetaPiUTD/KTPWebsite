"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginAccessPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeSubmit = async () => {
    if (isLoading) {
      console.log("⏸️ Already processing, ignoring click");
      return;
    }

    console.log("🚀 Submit clicked at:", new Date().toISOString());
    setIsLoading(true);
    setError("");
  
    if (!code.trim()) {
      setError("Please enter the access code.");
      setIsLoading(false);
      return;
    }
  
    try {
      console.log("📡 Making API request...");
      const requestStart = Date.now();
      
      const response = await fetch("http://localhost:3000/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, type: "login" }),
      });

      const requestTime = Date.now() - requestStart;
      console.log(`⏱️ API request took: ${requestTime}ms`);
      console.log("📊 Response status:", response.status);
      console.log("📊 Response headers:", Object.fromEntries(response.headers.entries()));
  
      const result = await response.json();
      console.log("📋 API result:", result);
  
      if (result.success) {
        console.log("✅ API success, redirecting...");
        
        // Use window.location for more reliable navigation
        window.location.href = "/login";
        
        // Alternative: Use router.push with a small delay
        // setTimeout(() => {
        //   router.push("/login");
        // }, 50);
        
      } else {
        console.log("❌ API failed:", result.message);
        setError(result.message || "Invalid code");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("💥 Error submitting code:", err);
      setError("Something went wrong. Please try again later.");
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-4 text-black">
          Enter Access Code
        </h2>

        <input
          type="text"
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 text-black"
          placeholder="Enter 8-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isLoading}
          onKeyDown={(e) => e.key === "Enter" && handleCodeSubmit()}
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <button
          className={`w-full py-2 mt-4 rounded-lg transition ${
            isLoading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-[#1E3D2F] hover:bg-[#162E24] text-white"
          }`}
          onClick={handleCodeSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Submit"}
        </button>
      </div>
    </div>
  );
}