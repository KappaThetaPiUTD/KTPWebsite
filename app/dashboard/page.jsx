"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Sidebar from "../../components/Sidebar";
import HoverCard from "../../components/HoverCard"; // Import the HoverCard component

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [events, setEvents] = useState({});
  const [eventList, setEventList] = useState([]);
  const [strikeLogs, setStrikeLogs] = useState([]);
  const [rsvpStatus, setRsvpStatus] = useState({}); // ← you used this later
  const [hoveredEvent, setHoveredEvent] = useState(null); // State for hovered event
  const [calendarHoveredEvent, setCalendarHoveredEvent] = useState(null);
  const [upcomingHoveredEvent, setUpcomingHoveredEvent] = useState(null);

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session || !session.user) {
          router.push("/login");
          return;
        }

        setUser(session.user);
      } catch (err) {
        console.error("Error checking auth:", err);
        router.push("/login");
        return;
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch strike logs when user is known
  useEffect(() => {
    if (!user) return;

    (async () => {
      const { data, error } = await supabase
        .from("strikes_log") // make sure table name matches exactly
        .select("created_at, reason")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching strike logs:", error);
        setStrikeLogs([]);
      } else {
        setStrikeLogs(data || []);
      }
    })();
  }, [user]);

  // Fetch events for calendar/list
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;

      try {
        // Fetch events with the creator's name
        const { data: eventsData, error } = await supabase
          .from("events")
          .select(
            "id, event_name, event_date, visibility, description, created_by, users(name)"
          )
          .order("event_date", { ascending: true });

        if (error) {
          console.error("Error fetching events:", error);
          return;
        }

        const formatted = {};
        const formattedEventList = eventsData.map((event) => {
          const eventDate = new Date(event.event_date); // Parse UTC date
          const key = eventDate
            .toLocaleString("en-US", {
              timeZone: "America/Chicago", // Convert to CST
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .split(",")[0]; // Format as YYYY-MM-DD

          if (!formatted[key]) formatted[key] = [];
          formatted[key].push({
            id: event.id,
            title: event.event_name,
            time: eventDate.toLocaleTimeString("en-US", {
              timeZone: "America/Chicago", // Convert to CST
              hour: "2-digit",
              minute: "2-digit",
            }),
            visibility: event.visibility,
            description: event.description,
            created_by: event.created_by,
            creator_name: event.users?.name || "Unknown", // Include creator's name
          });

          // Return the event with creator_name for the eventList
          return {
            ...event,
            creator_name: event.users?.name || "Unknown", // Include creator's name
          };
        });

        setEvents(formatted);
        setEventList(formattedEventList); // Use the updated event list
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    fetchEvents();
  }, [user]); // Add user as dependency

  // Fetch current user's RSVP status map
  useEffect(() => {
    if (!user) return;

    (async () => {
      const { data, error } = await supabase
        .from("rsvps")
        .select("event_id, response")
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to fetch RSVPs:", error);
        setRsvpStatus({});
        return;
      }

      const statusMap = {};
      (data || []).forEach(({ event_id, response }) => {
        statusMap[event_id] = response;
      });
      setRsvpStatus(statusMap);
    })();
  }, [user]);

  const handleCheckIn = async () => {
    const event = eventList[0];
    if (!event) return alert("No upcoming event found.");

    const payload = { user_id: user.id, event_id: event.id };
    const base64Payload = btoa(JSON.stringify(payload));
    const fakeToken = `header.${base64Payload}.signature`;

    try {
      const res = await fetch("http://localhost:5001/api/qr-checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrToken: fakeToken }),
      });

      const json = await res.json();
      if (res.ok) setCheckedIn(true);
      else {
        console.error(json.error);
        alert("Check-in failed: " + json.error);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during check-in.");
    }
  };

  const handleRSVP = async (event, response) => {
    if (!user) return alert("Please log in first.");

    const { error } = await supabase.from("rsvps").upsert(
      [
        {
          event_id: event.id,
          event_title: event.event_name,
          user_id: user.id,
          response,
        },
      ],
      { onConflict: ["event_id", "user_id"] }
    );

    if (error) {
      console.error("RSVP failed:", error);
      alert(`RSVP failed: ${error.message}`);
    } else {
      setRsvpStatus((prev) => ({ ...prev, [event.id]: response }));
      alert(`RSVPed as "${response}" to ${event.event_name}!`);
    }
  };

  // Calendar helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getCalendarGrid = () => {
    const grid = [];
    const offset = (firstDay + 6) % 7; // Make Monday the first day of the week
    for (let i = 0; i < offset; i++) {
      grid.push(null); // Empty cells for days before the first of the month
    }
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(day);
    }
    return grid;
  };

  const formatDateKey = (y, m, d) => {
    const date = new Date(y, m, d);
    return date
      .toLocaleString("en-US", {
        timeZone: "America/Chicago",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split(",")[0]; // Format as YYYY-MM-DD
  };

  const handleDayClick = (day) => {
    const key = formatDateKey(year, month, day);
    setSelectedDate(key);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-black">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 text-sm text-black font-['Public_Sans'] grid grid-cols-[220px_1fr]">
      <aside className="bg-white px-6 py-10 font-['Inter'] border-r border-black shadow-sm space-y-6">
        <Sidebar />
      </aside>

      <main className="px-8 py-6 w-full">
        <h1 className="text-xl font-bold mb-6">
          Welcome, {user?.user_metadata?.full_name || "Member"}
        </h1>

        <div className="grid grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold">
                {monthName} {year}
              </h3>
              <div className="flex space-x-2">
                <button aria-label="Previous Month" onClick={handlePrevMonth}>
                  <IoChevronBack />
                </button>
                <button aria-label="Next Month" onClick={handleNextMonth}>
                  <IoChevronForward />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center text-xs mb-2">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                <div key={d} className="font-medium">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 text-xs">
              {getCalendarGrid().map((day, i) => {
                const dateKey = day ? formatDateKey(year, month, day) : null;
                const hasEvent = dateKey ? events[dateKey]?.length : 0;

                return (
                  <div key={i} className="py-2 text-center">
                    {day && (
                      <button
                        onClick={() => handleDayClick(day)}
                        className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center relative transition ${
                          today.getDate() === day &&
                          today.getMonth() === month &&
                          today.getFullYear() === year
                            ? "bg-primary text-white"
                            : "hover:bg-gray-200 text-black"
                        }`}
                      >
                        {day}
                        {hasEvent ? (
                          <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full" />
                        ) : null}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedDate && events[selectedDate]?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2 text-primary">
                  Events on {selectedDate}:
                </h4>
                {/* Calendar events list */}
                <ul className="list-disc list-inside text-xs space-y-1">
                  {events[selectedDate]?.map((evt, idx) => (
                    <li
                      key={idx}
                      className="relative"
                      onMouseEnter={() => setCalendarHoveredEvent(evt)}
                      onMouseLeave={() => setCalendarHoveredEvent(null)}
                    >
                      {evt.time} - <strong>{evt.title}</strong>
                      {calendarHoveredEvent?.id === evt.id && (
                        <HoverCard
                          description={calendarHoveredEvent.description}
                          createdBy={calendarHoveredEvent.creator_name} // Pass creator_name
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedDate && !events[selectedDate] && (
              <p className="text-xs mt-4 text-gray-500">
                No events scheduled for {selectedDate}.
              </p>
            )}
          </div>

          {/* Check-in card */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h3 className="text-base font-semibold mb-3">
              Check-In for Chapter
            </h3>
            <div className="flex justify-between items-center bg-white p-4 border rounded-lg mb-4">
              <div className="rounded-full bg-primary text-white px-4 py-2 text-xs font-semibold truncate max-w-[10rem] text-center">
                {user?.user_metadata?.full_name || "N/A"}
              </div>
              <img
                src="https://via.placeholder.com/80"
                alt="QR Code"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
            <div className="text-center">
              <button
                onClick={handleCheckIn}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
              >
                Check In
              </button>
              {checkedIn && (
                <p className="text-green-700 font-medium mt-2">
                  Checked in successfully!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Three cards row */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm text-center font-semibold">
            Attendance Record
          </div>

          {/* Strikes card */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h4 className="text-sm font-semibold mb-2 text-center">Strikes</h4>
            {Array.isArray(strikeLogs) && strikeLogs.length > 0 ? (
              <ul className="text-xs text-left space-y-1">
                {strikeLogs.map((log, i) => (
                  <li key={i} className="flex flex-col border-b pb-1">
                    <span className="font-medium">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                    <span>{log.reason}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-500 text-center">
                No strikes recorded.
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm text-center font-semibold">
            Social Quota
          </div>
        </div>

        {/* Upcoming events list */}
        <div className="mt-10 bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <h3 className="text-base font-semibold mb-4">Upcoming Events</h3>
          <ul className="text-sm space-y-2">
            {eventList.length > 0 ? (
              [...eventList]
                .filter((event) => new Date(event.event_date) >= new Date()) // Exclude past events
                .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
                .slice(0, 5)
                .map((event, idx) => {
                  const response = rsvpStatus[event.id]; // Get user's RSVP for this event
                  return (
                    <li
                      key={idx}
                      className="relative flex items-center justify-between"
                      onMouseEnter={() => setUpcomingHoveredEvent(event)}
                      onMouseLeave={() => setUpcomingHoveredEvent(null)}
                    >
                      <span>
                        <span className="font-medium">
                          {new Date(event.event_date).toLocaleString("en-US", {
                            timeZone: "America/Chicago",
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>{" "}
                        — {event.event_name}
                      </span>
                      {upcomingHoveredEvent?.id === event.id && (
                        <HoverCard
                          description={upcomingHoveredEvent.description}
                          createdBy={upcomingHoveredEvent.creator_name} // Pass creator_name
                        />
                      )}
                    </li>
                  );
                })
            ) : (
              <p className="text-xs text-gray-500">No events available.</p>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
