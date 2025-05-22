"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Sidebar from "../../../components/Sidebar";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <div className="text-center mt-10 text-[#1E3D2F]">Loading...</div>;

  return (
<div className="flex min-h-screen font-['Inter'] bg-white text-[#1E3D2F] px-4 py-20 sm:px-6 md:px-10 gap-10">
{/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 px-6 py-10 md:px-12 lg:px-20">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="bg-gray-100 rounded-xl shadow-lg max-w-xl mx-auto p-8 space-y-5 text-center">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
            alt="Profile"
            className="w-24 h-24 mx-auto rounded-full border-2 border-[#1E3D2F]"
          />
          <h2 className="text-xl font-semibold">
            {user.user_metadata?.full_name || "No Name Provided"}
          </h2>
          <p className="text-sm">Email: {user.email}</p>
          <p className="text-sm">Graduation Year: {user.user_metadata?.grad_year || "Not set"}</p>
          <p className="text-sm">Role: {user.role || "User"}</p>
        </div>
      </main>
    </div>
  );
}
