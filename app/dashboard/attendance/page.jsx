"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Sidebar from "../../../components/Sidebar";

export default function AttendancePage() {
  useEffect(() => {
    document.title = "Attendance - KTP UTD Dashboard";
  }, []);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };

    const fetchAttendance = async () => {
      // Replace with real fetch from Supabase
      setRecords([
        { date: "2025-05-21", event: "Brothers Chapter", status: "Present" },
        { date: "2025-05-14", event: "Pledges Chapter", status: "Absent" },
        { date: "2025-05-07", event: "Social Mixer", status: "Present" },
      ]);
    };

    fetchUser().then(() => setLoading(false));
    fetchAttendance();
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
        <h1 className="text-xl font-bold mb-6 text-[#1E3D2F]">Attendance Records</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase">
                <th className="px-6 py-3 border-b">Date</th>
                <th className="px-6 py-3 border-b">Event</th>
                <th className="px-6 py-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 border-b">{record.date}</td>
                  <td className="px-6 py-4 border-b">{record.event}</td>
                  <td className="px-6 py-4 border-b font-medium">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
