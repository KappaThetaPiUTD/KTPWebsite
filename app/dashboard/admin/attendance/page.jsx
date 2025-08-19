"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function AdminAttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("attendance").select("*");
      if (error) console.error("Attendance fetch error:", error);
      setAttendanceData(data || []);
    })();
  }, []);

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3 text-primary">
        Attendance Records
      </h2>
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Time Checked In</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((entry, i) => (
              <tr
                key={i}
                className="border-t bg-white hover:bg-gray-50 text-black"
              >
                <td className="px-4 py-2">{entry.name || "N/A"}</td>
                <td className="px-4 py-2">{entry.email || "N/A"}</td>
                <td className="px-4 py-2">{entry.checked_in_time || "N/A"}</td>
              </tr>
            ))}
            {!attendanceData.length && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No attendance records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
