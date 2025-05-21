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
    <div className="flex min-h-screen font-['Inter'] bg-white text-[#1E3D2F]">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-gray-100 shadow-md rounded-xl p-6 max-w-xl mx-auto space-y-4 text-center">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
            alt="Profile"
            className="w-24 h-24 mx-auto rounded-full border border-[#1E3D2F]"
          />
          <h2 className="text-xl font-semibold">{user.user_metadata?.full_name || "No Name Provided"}</h2>
          <p>Email: {user.email}</p>
          <p>Graduation Year: {user.user_metadata?.grad_year || "Not set"}</p>
          <p>Role: {user.role || "User"}</p>
        </div>
      </main>
    </div>
  );
}
