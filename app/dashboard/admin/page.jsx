"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { getUserRole } from "../../src/rbac";
import Sidebar from "../../../components/Sidebar";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [rsvpData, setRsvpData] = useState([]);

  useEffect(() => {
    const checkAuthAndRole = async () => {
      try {
        // Check user authentication
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
          
          // Check user role
          const { role, error: roleError } = await getUserRole();
          
          console.log('Role check result:', { role, roleError });
          console.log('Auth User ID:', data.user.id);
          console.log('Auth User Email:', data.user.email);

          
          if (roleError) {
            console.error('Error getting user role:', roleError);
            setAccessDenied(true);
            setLoading(false);
            return;
          }

          setUserRole(role);

          // Check if user has executive access
          if (role?.toLowerCase() !== 'executive') {
            setAccessDenied(true);
            setLoading(false);
            return;
          }

          // User has access, fetch admin data
          fetchAttendance();
          fetchRSVPs();
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in admin access check:', error);
        setAccessDenied(true);
        setLoading(false);
      }
    };

    const fetchAttendance = async () => {
      const { data } = await supabase.from("attendance").select("*");
      setAttendanceData(data || []);
    };

    const fetchRSVPs = async () => {
      const { data } = await supabase.from("rsvps").select("*");
      setRsvpData(data || []);
    };

    checkAuthAndRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 text-sm text-black font-['Public_Sans'] grid grid-cols-[220px_1fr]">
        <aside className="bg-white px-6 py-10 font-['Inter'] border-r border-black shadow-sm space-y-6">
          <Sidebar />
        </aside>
        <main className="px-8 py-6 w-full flex items-center justify-center">
          <div className="text-center text-sm text-gray-500">Loading...</div>
        </main>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-white pt-24 text-sm text-black font-['Public_Sans'] grid grid-cols-[220px_1fr]">
        <aside className="bg-white px-6 py-10 font-['Inter'] border-r border-black shadow-sm space-y-6">
          <Sidebar />
        </aside>
        <main className="px-8 py-6 w-full flex items-center justify-center">
          <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200 max-w-md">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Access Restricted</h2>
            <p className="text-red-600 mb-4">
              You need executive privileges to access the admin panel.
            </p>
            <p className="text-sm text-gray-600">
              Current role: <span className="font-semibold capitalize">{userRole || 'Unknown'}</span>
            </p>
          </div>
        </main>
      </div>
    );
  }

  // User has executive access - show full admin page
  return (
    <div className="min-h-screen bg-white pt-24 text-sm text-black font-['Public_Sans'] grid grid-cols-[220px_1fr]">

      {/* Sidebar */}
      <aside className="bg-white px-6 py-10 font-['Inter'] border-r border-black shadow-sm space-y-6">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="px-8 py-6 w-full space-y-12">
        <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>

        {/* Attendance Table */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-primary">Attendance Records</h2>
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
                {attendanceData.map((entry, index) => (
                  <tr key={index} className="border-t bg-primary hover:bg-primary/90 text-white">
                    <td className="px-4 py-2">{entry.name || "N/A"}</td>
                    <td className="px-4 py-2">{entry.email}</td>
                    <td className="px-4 py-2">{entry.checked_in_time || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* RSVP Table */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-primary">RSVP Submissions</h2>
          <div className="overflow-x-auto border border-gray-300 rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Event</th>
                  <th className="px-4 py-2 text-left">RSVP Time</th>
                </tr>
              </thead>
              <tbody>
                {rsvpData.map((entry, index) => (
                  <tr key={index} className="border-t bg-primary hover:bg-primary/90 text-white">
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

        {/* Create Event */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-primary">Create Event</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const title = e.target.title.value;
              const date = e.target.date.value;
              const time = e.target.time.value;

              const { error } = await supabase.from("events").insert([
                { title, date, time },
              ]);

              if (error) {
                alert("Error creating event: " + error.message);
              } else {
                alert("Event created successfully!");
                e.target.reset();
              }
            }}
            className="max-w-xl bg-gray-50 border border-gray-300 rounded-xl p-6 mx-auto"
          >
            <div className="mb-4">
              <label className="block font-medium mb-1">Title</label>
              <input
                name="title"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Date</label>
              <input
                name="date"
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Time</label>
              <input
                name="time"
                type="time"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
            >
              Add Event
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}