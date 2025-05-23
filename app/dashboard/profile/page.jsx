"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Sidebar from "../../../components/Sidebar";
import { FiEdit2 } from "react-icons/fi";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [rsvpData, setRsvpData] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
      setLoading(false);
    };

    const fetchAttendance = async () => {
      const { data } = await supabase.from("attendance").select("*");
      setAttendanceData(data || []);
    };

    const fetchRSVPs = async () => {
      const { data } = await supabase.from("rsvps").select("*");
      setRsvpData(data || []);
    };

    fetchUser();
    fetchAttendance();
    fetchRSVPs();
  }, []);

  if (loading) return <div className="text-center mt-20 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-white pt-24 text-sm text-black font-['Public_Sans'] grid grid-cols-[220px_1fr]">

      {/* Sidebar */}
      <aside className="bg-white px-6 py-10 font-['Inter'] border-r border-black shadow-sm space-y-6">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="px-8 py-6 w-full">
      <div className="flex items-center justify-between mb-6">
  <h1 className="text-xl font-bold text-[#1E3D2F]">Profile</h1>
  <button
    className="p-2 rounded-full hover:bg-gray-100 transition"
    title="Edit Profile"
    onClick={() => alert("Edit profile clicked!")} // Replace this with your actual handler
  >
    <FiEdit2 className="text-xl text-[#1E3D2F]" />
  </button>
</div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-xl mx-auto p-6 text-center">
          <div className="flex flex-col items-center">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`}
              alt="Profile"
              className="w-20 h-20 rounded-full border border-gray-300 mb-4"
            />
            <h2 className="text-lg font-semibold text-[#1E3D2F]">
              {user?.user_metadata?.full_name || "No Name Provided"}
            </h2>
            <p className="text-sm text-gray-700 mt-2">Email: {user?.email}</p>
            <p className="text-sm text-gray-700">Graduation Year: {user?.user_metadata?.grad_year || "Not set"}</p>
            <p className="text-sm text-gray-700">Role: {user?.role || "authenticated"}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
