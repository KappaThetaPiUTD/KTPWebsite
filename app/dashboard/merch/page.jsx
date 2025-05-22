"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Sidebar from "../../../components/Sidebar";

export default function MerchPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const dropDate = new Date("2025-06-01T00:00:00");
    const interval = setInterval(() => {
      const now = new Date();
      const diff = dropDate - now;
      if (diff <= 0) {
        setCountdown("Drop is live!");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would send to Supabase or another backend
      setSubmitted(true);
    }
  };

  if (loading) return <div className="text-center mt-20 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-white pt-24 text-sm text-black font-['Public_Sans'] grid grid-cols-[220px_1fr]">

      {/* Sidebar */}
      <aside className="bg-white px-6 py-10 font-['Inter'] border-r border-black shadow-sm space-y-6">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="px-8 py-6 w-full">
        <h1 className="text-xl font-bold mb-6 text-[#1E3D2F]">Merch Page</h1>

        {/* Countdown */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm text-center font-semibold text-gray-800 mb-6">
          🎉 MERCH DROP COMING IN: 
        </div>

        {/* Merch Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="border border-gray-200 rounded-xl shadow-sm p-4 text-center"
            >
              <div className="bg-gray-100 h-40 mb-4 rounded-md flex items-center justify-center text-gray-400">
                Image Coming Soon
              </div>
              <h2 className="font-semibold text-base">Product Name</h2>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>
          ))}
        </div>

        {/* Notify Me */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm text-center">
          <h3 className="text-base font-semibold mb-2 text-[#1E3D2F]">
            Want early access?
          </h3>
          {submitted ? (
            <p className="text-green-700 font-medium">
              You’ll be notified at {email}!
            </p>
          ) : (
            <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="border border-gray-300 rounded px-4 py-2 w-full sm:w-64"
              />
              <button
                type="submit"
                className="bg-[#136B48] text-white px-4 py-2 rounded hover:bg-[#0f5a3a] transition"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
