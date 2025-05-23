"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccessCodePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleCodeSubmit = async () => {
    setError("");
  
    if (!code.trim()) {
      setError("Please enter the access code.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        // Set cookie so middleware allows /sign-in
        router.replace("/sign-in");
      } else {
        setError(result.message || "Invalid code");
      }
    } catch (err) {
      console.error("Error submitting code:", err);
      setError("Something went wrong. Please try again later.");
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
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <button
          className="w-full bg-[#1E3D2F] text-white py-2 mt-4 rounded-lg hover:bg-[#162E24] transition"
          onClick={handleCodeSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
