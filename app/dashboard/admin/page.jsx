"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Sidebar from "../../../components/Sidebar";

export default function AdminPage() {
  useEffect(() => {
    document.title = "Admin Panel - KTP UTD Dashboard";
  }, []);

  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  const [attendanceData, setAttendanceData] = useState([]);
  const [rsvpData, setRsvpData] = useState([]);
  const [repeat, setRepeat] = useState("None");
  const [allUsers, setAllUsers] = useState([]);

  // Filters
  const [events, setEvents] = useState([]); // [{id, event_name}]
  const [selectedEventId, setSelectedEventId] = useState("all");
  const [selectedResponse, setSelectedResponse] = useState("all");

  // Tabs
  const [activeTab, setActiveTab] = useState("Attendance");

  useEffect(() => {
    const boot = async () => {
      try {
        // 1) auth
        const { data: auth } = await supabase.auth.getUser();
        if (!auth?.user) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }
        setUser(auth.user);

        // 2) exec gate (server-side)
        const { data: isExec, error: execErr } = await supabase.rpc(
          "is_executive",
          { uid: auth.user.id }
        );
        if (execErr || !isExec) {
          setUserRole(isExec ? "executive" : "member");
          setAccessDenied(true);
          setLoading(false);
          return;
        }
        setUserRole("executive");

        // 3) preload data
        await Promise.all([fetchAttendance(), fetchRSVPs(), fetchAllUsers(), fetchEvents()]);
        setLoading(false);
      } catch (e) {
        console.error("Admin boot error:", e);
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
      // RPC should return: id, event_id, event_title, response, response_updated_at, user_name, user_email
      // (If your RPC doesn't include event_id yet, add it server-side; we handle missing with a fallback.)
      const { data, error } = await supabase.rpc("rsvps_admin_list");
      if (error) {
        console.error("RSVP admin list error:", error);
        setRsvpData([]);
        return;
      }
      setRsvpData(
        (data || []).map((r) => ({
          id: r.id,
          event_id: r.event_id ?? null,
          event_title: r.event_title ?? null,
          response: r.response ?? null,
          response_updated_at: r.response_updated_at ?? null,
          user_name: r.user_name ?? null,
          user_email: r.user_email ?? null,
        }))
      );
    };

    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, event_name")
        .order("event_name", { ascending: true });
      if (error) console.error("Events fetch error:", error);
      setEvents(data || []);
    };

    const fetchAllUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email");
      if (error) console.error("Users fetch error:", error);
      setAllUsers(data || []);
    };

    boot();
  }, []);

  // synthesize event options from events + any RSVP rows missing from events
  const synthesizedEventOptions = useMemo(() => {
    const base = events?.length ? events : [];
    const have = new Set(base.map((e) => String(e.id)));
    const extras = [];
    for (const r of rsvpData) {
      if (r.event_id && !have.has(String(r.event_id))) {
        extras.push({
          id: r.event_id,
          event_name: r.event_title || `Event ${r.event_id}`,
        });
        have.add(String(r.event_id));
      }
    }
    return [...base, ...extras].sort((a, b) =>
      (a.event_name || "").localeCompare(b.event_name || "")
    );
  }, [events, rsvpData]);

  // apply filters
  const filteredRsvps = useMemo(() => {
    return rsvpData.filter((r) => {
      // event filter
      const eventOk =
        selectedEventId === "all" ||
        (r.event_id != null &&
          String(r.event_id) === String(selectedEventId));

      // response filter (normalize various spellings)
      const normalized = (r.response || "").toLowerCase().trim();
      let cat = "unanswered";
      if (normalized === "yes" || normalized === "going") cat = "going";
      else if (normalized === "maybe") cat = "maybe";
      else if (normalized === "no" || normalized === "not going") cat = "not going";

      const responseOk = selectedResponse === "all" || selectedResponse === cat;
      return eventOk && responseOk;
    });
  }, [rsvpData, selectedEventId, selectedResponse]);

  const rsvpCount = filteredRsvps.length;

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
                      <td className="px-4 py-2">{entry.email || "N/A"}</td>
                      <td className="px-4 py-2">
                        {entry.checked_in_time || "N/A"}
                      </td>
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
        )}

        {/* RSVPs Tab */}
        {activeTab === "RSVPs" && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-primary">
              RSVP Submissions
            </h2>

            {/* Filters + Count */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <label className="text-sm font-medium">Filter by event:</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm"
                aria-label="Filter RSVPs by event"
              >
                <option value="all">All events</option>
                {synthesizedEventOptions.map((ev) => (
                  <option key={String(ev.id)} value={String(ev.id)}>
                    {ev.event_name || `Event ${ev.id}`}
                  </option>
                ))}
              </select>
              {selectedEventId !== "all" && (
                <button
                  className="text-xs underline text-gray-600 hover:text-black"
                  onClick={() => setSelectedEventId("all")}
                >
                  Clear
                </button>
              )}

              <span className="mx-2 h-5 w-px bg-gray-300" aria-hidden="true" />

              <label className="text-sm font-medium">Response:</label>
              <select
                value={selectedResponse}
                onChange={(e) => setSelectedResponse(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm"
                aria-label="Filter RSVPs by response"
              >
                <option value="all">All</option>
                <option value="going">Going</option>
                <option value="maybe">Maybe</option>
                <option value="not going">No</option>
                <option value="unanswered">Haven't Responded</option>
              </select>
              {selectedResponse !== "all" && (
                <button
                  className="text-xs underline text-gray-600 hover:text-black"
                  onClick={() => setSelectedResponse("all")}
                >
                  Clear
                </button>
              )}

              <span className="ml-auto text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                Showing {rsvpCount} RSVP{rsvpCount === 1 ? "" : "s"}
              </span>
            </div>

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
                  {filteredRsvps.length ? (
                    filteredRsvps.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-t bg-white hover:bg-gray-50 text-black"
                      >
                        <td className="px-4 py-2">{entry.user_name || "N/A"}</td>
                        <td className="px-4 py-2">{entry.user_email || "N/A"}</td>
                        <td className="px-4 py-2">{entry.event_title || "N/A"}</td>
                        <td className="px-4 py-2 capitalize">{entry.response || "N/A"}</td>
                        <td className="px-4 py-2">
                          {entry.response_updated_at
                            ? new Date(entry.response_updated_at).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                        No RSVPs for the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Create Event Tab */}
        {activeTab === "Create Event" && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-primary">Create Event</h2>
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

                if (!title || !description || !date || !time || !repeatOption || !visibility) {
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
                  // refresh event options
                  const { data: refetch } = await supabase
                    .from("events")
                    .select("id, event_name")
                    .order("event_name", { ascending: true });
                  setEvents(refetch || []);
                }
              }}
              className="max-w-xl bg-gray-50 border border-gray-300 rounded-xl p-6 mx-auto"
            >
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Title <span className="text-red-600">*</span>
                </label>
                <input name="title" required className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea name="description" required rows="3" className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Date <span className="text-red-600">*</span>
                </label>
                <input type="date" name="date" required className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Time <span className="text-red-600">*</span>
                </label>
                <input type="time" name="time" required className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Who can see this event? <span className="text-red-600">*</span>
                </label>
                <select name="visibility" required className="w-full px-3 py-2 border border-gray-300 rounded">
                  <option value="">Select visibility...</option>
                  <option value="brothers_and_pledges">Brothers and Pledges</option>
                  <option value="brothers_only">Brothers Only</option>
                  <option value="pledges_only">Pledges Only</option>
                </select>
                <p className="text-xs text-gray-600 mt-1">Executive members can always see all events.</p>
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
                    <label className="block font-medium mb-1">Repeat Start Date</label>
                    <input type="date" name="repeatStart" className="w-full px-3 py-2 border border-gray-300 rounded" required />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Repeat End Date</label>
                    <input type="date" name="repeatEnd" className="w-full px-3 py-2 border border-gray-300 rounded" required />
                  </div>
                </div>
              )}

              <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition">
                Add Event
              </button>
            </form>
          </section>
        )}

        {/* Strikes Tab */}
        {activeTab === "Strikes" && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-primary">Log Strikes for Users</h2>
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
                  {allUsers.map((u) => (
                    <tr key={u.id} className="border-t bg-white hover:bg-gray-50 text-black">
                      <td className="px-4 py-2">{u.name || "N/A"}</td>
                      <td className="px-4 py-2">{u.email || "N/A"}</td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                          onClick={async () => {
                            const reason = prompt("Enter reason for strike:");
                            if (!reason) return;
                            const { error } = await supabase
                              .from("strikes_log")
                              .insert([{ user_id: u.id, reason }]);
                            if (error) alert("Error logging strike: " + error.message);
                            else alert("Strike logged successfully!");
                          }}
                        >
                          Log Strike
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!allUsers.length && (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
