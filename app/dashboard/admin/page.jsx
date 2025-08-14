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
  const [repeat, setRepeat] = useState("None");
  const [allUsers, setAllUsers] = useState([]);

  // NEW: tab state
  const [activeTab, setActiveTab] = useState("Attendance"); // "Attendance" | "RSVPs" | "Create Event" | "Strikes"

  useEffect(() => {
    const checkAuthAndRole = async () => {
      try {
        // ✅ Check user authentication
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);

          // ✅ Check role
          const { role, error: roleError } = await getUserRole();
          if (roleError) {
            setAccessDenied(true);
            setLoading(false);
            return;
          }

          setUserRole(role);

          // ✅ Restrict to executive
          if (role?.toLowerCase() !== "executive") {
            setAccessDenied(true);
            setLoading(false);
            return;
          }

          // ✅ Fetch all required admin data
          await fetchAttendance();
          await fetchRSVPs();
          await fetchAllUsers();
        }

        setLoading(false);
      } catch (error) {
        console.error("Admin check error:", error);
        setAccessDenied(true);
        setLoading(false);
      }
    };

    const fetchAttendance = async () => {
      const { data, error } = await supabase.from("attendance").select("*");
      if (error) console.error("Attendance fetch error:", error);
      setAttendanceData(data || []);
    };

    const fetchRSVPs = async () => {
      const { data, error } = await supabase
        .from("rsvps")
        .select(
          "id, event_id, response, response_updated_at, user_id, event_title, profiles (full_name, email)"
        );
      if (error) console.error("RSVP fetch error:", error);
      setRsvpData(data || []);
    };

    const fetchAllUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email");
      if (error) console.error("User fetch error:", error);
      setAllUsers(data || []);
    };

    checkAuthAndRole();
  }, []);

  // --- Small tab bar component (inside same file) ---
  const TabBar = () => {
    const tabs = ["Attendance", "RSVPs", "Create Event", "Strikes"];
    return (
      <div
        role="tablist"
        aria-label="Admin sections"
        className="flex gap-2 border-b border-gray-200"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-black"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>
    );
  };

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
            <h2 className="text-2xl font-bold text-red-700 mb-4">
              Access Restricted
            </h2>
            <p className="text-red-600 mb-4">
              You need executive privileges to access the admin panel.
            </p>
            <p className="text-sm text-gray-600">
              Current role:{" "}
              <span className="font-semibold capitalize">
                {userRole || "Unknown"}
              </span>
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ✅ UI with tabs
  return (
    <div className="min-h-screen bg-white pt-24 text-sm text-black font-['Public_Sans'] grid grid-cols-[220px_1fr]">
      <aside className="bg-white px-6 py-10 font-['Inter'] border-r border-black shadow-sm space-y-6">
        <Sidebar />
      </aside>

      <main className="px-8 py-6 w-full space-y-8">
        <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>

        <TabBar />

        {/* Attendance Tab */}
        {activeTab === "Attendance" && (
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
                  {attendanceData.map((entry, index) => (
                    <tr
                      key={index}
                      className="border-t bg-white hover:bg-gray-50 text-black"
                    >
                      <td className="px-4 py-2">{entry.name || "N/A"}</td>
                      <td className="px-4 py-2">{entry.email}</td>
                      <td className="px-4 py-2">
                        {entry.checked_in_time || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* RSVPs Tab */}
        {activeTab === "RSVPs" && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-primary">
              RSVP Submissions
            </h2>
            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Event</th>
                    <th className="px-4 py-2 text-left">Response</th>
                    <th className="px-4 py-2 text-left">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvpData.map((entry, index) => (
                    <tr
                      key={index}
                      className="border-t bg-white hover:bg-gray-50 text-black"
                    >
                      <td className="px-4 py-2">
                        {entry.profiles?.full_name || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        {entry.profiles?.email || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        {entry.event_title || "N/A"}
                      </td>
                      <td className="px-4 py-2 capitalize">
                        {entry.response || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        {entry.response_updated_at
                          ? new Date(entry.response_updated_at).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Create Event Tab */}
        {activeTab === "Create Event" && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-primary">
              Create Event
            </h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const title = e.target.title.value.trim();
                const description = e.target.description.value.trim();
                const date = e.target.date.value;
                const time = e.target.time.value;
                const repeatOption = e.target.repeat.value;
                const repeatStart = e.target.repeatStart?.value;
                const repeatEnd = e.target.repeatEnd?.value;
                const visibility = e.target.visibility.value;

                if (
                  !title ||
                  !description ||
                  !date ||
                  !time ||
                  !repeatOption ||
                  !visibility
                ) {
                  alert("Please fill out all fields.");
                  return;
                }

                if (repeatOption !== "None" && (!repeatStart || !repeatEnd)) {
                  alert("Please provide both repeat start and end dates.");
                  return;
                }

                const eventDate = new Date(`${date}T${time}`);

                const { error } = await supabase.from("events").insert([
                  {
                    event_name: title,
                    description,
                    event_date: eventDate,
                    repeat: repeatOption,
                    repeat_start: repeatOption !== "None" ? repeatStart : null,
                    repeat_end: repeatOption !== "None" ? repeatEnd : null,
                    visibility,
                    created_by: user?.id,
                    created_by_email: user?.email || null,
                  },
                ]);

                if (error) {
                  alert("Error creating event: " + error.message);
                } else {
                  alert("Event created successfully!");
                  e.target.reset();
                  setRepeat("None");
                }
              }}
              className="max-w-xl bg-gray-50 border border-gray-300 rounded-xl p-6 mx-auto"
            >
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Time <span className="text-red-600">*</span>
                </label>
                <input
                  type="time"
                  name="time"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              {/* Visibility */}
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Who can see this event?{" "}
                  <span className="text-red-600">*</span>
                </label>
                <select
                  name="visibility"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Select visibility...</option>
                  <option value="brothers_and_pledges">
                    Brothers and Pledges
                  </option>
                  <option value="brothers_only">Brothers Only</option>
                  <option value="pledges_only">Pledges Only</option>
                </select>
                <p className="text-xs text-gray-600 mt-1">
                  Executive members can always see all events.
                </p>
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Repeat <span className="text-red-600">*</span>
                </label>
                <select
                  name="repeat"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value)}
                >
                  <option value="None">None</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              {repeat !== "None" && (
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">
                      Repeat Start Date
                    </label>
                    <input
                      type="date"
                      name="repeatStart"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Repeat End Date
                    </label>
                    <input
                      type="date"
                      name="repeatEnd"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
              >
                Add Event
              </button>
            </form>
          </section>
        )}

        {/* Strikes Tab */}
        {activeTab === "Strikes" && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-primary">
              Log Strikes for Users
            </h2>
            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((userEntry) => (
                    <tr
                      key={userEntry.id}
                      className="border-t bg-white hover:bg-gray-50 text-black"
                    >
                      <td className="px-4 py-2">
                        {userEntry.full_name || "N/A"}
                      </td>
                      <td className="px-4 py-2">{userEntry.email || "N/A"}</td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                          onClick={async () => {
                            const reason = prompt("Enter reason for strike:");
                            if (!reason) return;

                            const { error } = await supabase
                              .from("strikes_log")
                              .insert([{ user_id: userEntry.id, reason }]);

                            if (error) {
                              alert("Error logging strike: " + error.message);
                            } else {
                              alert("Strike logged successfully!");
                            }
                          }}
                        >
                          Log Strike
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
