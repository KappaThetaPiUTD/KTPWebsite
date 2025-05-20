"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CodeLogin() {
  const router = useRouter();
  const [code, setCode] = useState(Array(8).fill(""));
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // only digits
    if (!value) return;
    const newCode = [...code];
    newCode[index] = value[0];
    setCode(newCode);
    if (index < 7) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 8) {
      setError("Please enter all 8 digits.");
      return;
    }
    // TODO: Replace this with your Supabase verification logic
    console.log("Submitted code:", fullCode);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 font-['Public_Sans']">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-black uppercase">Enter Access Code</h2>

        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
          <div className="flex justify-center space-x-2">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleBackspace(e, i)}
                className="w-10 h-12 text-center border border-gray-300 rounded-lg text-xl font-semibold text-black focus:ring-2 focus:ring-[#1E3D2F]"
              />
            ))}
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#1E3D2F] text-white py-2 rounded-lg hover:bg-[#163226] transition uppercase font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
