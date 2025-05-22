"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Sidebar from "../../../components/Sidebar";

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

  if (loading) return <div className="text-center mt-10 text-primary">Loading...</div>;

  return (
    <div className="flex min-h-screen font-['Inter'] bg-white text-primary px-4 py-20 sm:px-6 md:px-10 gap-10">
      <Sidebar />

      <main className="flex-1 px-6 py-10 md:px-12 lg:px-20">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Profile Box */}
        <div className="bg-gray-100 rounded-xl shadow-lg max-w-xl mx-auto p-8 space-y-5 text-center border border-black mb-10">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
            alt="Profile"
            className="w-24 h-24 mx-auto rounded-full border border-primary"
          />
          <h2 className="text-xl font-semibold">
            {user.user_metadata?.full_name || "No Name Provided"}
          </h2>
          <p>Email: {user.email}</p>
          <p>Graduation Year: {user.user_metadata?.grad_year || "Not set"}</p>
          <p>Role: {user.role || "User"}</p>
        </div>

        {/* Attendance Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Attendance Records</h2>
          <div className="overflow-x-auto border border-gray-300 rounded-lg">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Time Checked In</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((entry, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{entry.name}</td>
                    <td className="px-4 py-2">{entry.email}</td>
                    <td className="px-4 py-2">{entry.checked_in_time || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* RSVP Section */}
        <section className="mt-12">
  <h2 className="text-2xl font-bold mb-4">RSVP Submissions</h2>
  <div className="overflow-x-auto border border-gray-300 rounded-lg">
    <table className="min-w-full text-left text-sm">
      <thead className="bg-primary text-white">
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Event</th>
          <th className="px-4 py-2">RSVP Time</th>
        </tr>
      </thead>
      <tbody>
        {rsvpData.map((entry, index) => (
          <tr key={index} className="border-t hover:bg-gray-50">
            <td className="px-4 py-2">{entry.name || "N/A"}</td>
            <td className="px-4 py-2">{entry.email}</td>
            <td className="px-4 py-2">{entry.event || "General"}</td>
            <td className="px-4 py-2">
              {entry.rsvp_time
                ? new Date(entry.rsvp_time).toLocaleString()
                : "Not recorded"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
      </main>
    </div>
  );
}
