"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Sidebar from "../../../components/Sidebar";
import { useRouter } from "next/navigation";
import HoverCard from "../../../components/HoverCard"; // Adjust the import based on your file structure

export default function RSVPPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [rsvpStatus, setRsvpStatus] = useState({});
  const [hoveredEvent, setHoveredEvent] = useState(null); // State to manage hovered event

  // Auth check
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        setLoading(false);
      }
    };
    getUser();
  }, [router]);

  // Fetch events + my RSVPs
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Get user role first
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        const userRole = userData?.role;

        // Fetch all events with visibility and creator's name
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

        // Filter events based on user role
        const filteredEvents =
          eventsData?.filter((event) => {
            // Executive members can see everything
            if (userRole?.toLowerCase() === "executive") {
              return true;
            }

            // If event has no visibility set, show it (backward compatibility)
            if (!event.visibility) {
              return true;
            }

            // Check visibility rules
            switch (event.visibility) {
              case "brothers_only":
                return userRole?.toLowerCase() === "brother";
              case "pledges_only":
                return userRole?.toLowerCase() === "pledge";
              case "brothers_and_pledges":
                return ["brother", "pledge"].includes(userRole?.toLowerCase());
              default:
                return true;
            }
          }) || [];

        // Fetch RSVPs for filtered events
        const { data: rsvpsData } = await supabase
          .from("rsvps")
          .select("event_id, response")
          .eq("user_id", user.id);

        // Add creator's name to each event
        const eventsWithCreatorName = filteredEvents.map((event) => ({
          ...event,
          creator_name: event.users?.name || "Unknown", // Include creator's name
        }));

        setEvents(eventsWithCreatorName);

        const statusMap = {};
        eventsWithCreatorName.forEach((e) => {
          const myRSVP = rsvpsData?.find((r) => r.event_id === e.id);
          statusMap[e.id] = myRSVP ? myRSVP.response : "unanswered";
        });

        setRsvpStatus(statusMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  // Handle RSVP action
  const handleRSVP = async (event, response) => {
    if (!user) return alert("Please log in first.");

    console.log("RSVP Attempt:", {
      userId: user.id,
      eventId: event.id,
      response,
    });

    const { error } = await supabase.from("rsvps").upsert(
      [
        {
          event_id: event.id,
          event_title: event.event_name,
          user_id: user.id,
          response,
          response_updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: ["event_id", "user_id"] }
    );

    if (error) {
      console.error("RSVP failed:", error.message);
      alert("RSVP failed.");
    } else {
      setRsvpStatus((prev) => ({ ...prev, [event.id]: response }));
      alert(`RSVPed as "${response}" to ${event.event_name}!`);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-sm text-gray-500">Loading...</div>
    );

  return (
    <div className="min-h-screen bg-white pt-24 text-sm text-black font-['Public_Sans'] grid grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <aside className="bg-white px-6 py-10 font-['Inter'] border-r border-black shadow-sm space-y-6">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="px-8 py-6 w-full">
        <h1 className="text-2xl font-bold text-primary">EVENTS AND RSVP</h1>
        <h2 className="text-lg font-semibold mb-6 text-primary">
          RSVP Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {["going", "maybe", "not going", "unanswered"].map((category) => {
            const labelMap = {
              going: "Going",
              maybe: "Maybe",
              "not going": "No",
              unanswered: "Haven't Responded",
            };
            const filtered = Object.entries(rsvpStatus).filter(
              ([, status]) => (status || "unanswered") === category
            );

            return (
              <div key={category} className="border rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-bold mb-2">{labelMap[category]}</h3>
                {filtered.length > 0 ? (
                  <ul className="text-xs space-y-1">
                    {filtered.map(([eventId]) => {
                      const event = events.find(
                        (e) => e.id === parseInt(eventId)
                      );
                      return (
                        <li key={eventId}>{event?.event_name || eventId}</li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">No events</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-primary">
            Update Your RSVP
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="relative border rounded-lg p-4 shadow-sm flex flex-col justify-between h-full"
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                {/* Top Section: Name and Date on the left, Repeating Info on the right */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium text-sm mb-1">
                      {event.event_name}
                    </p>
                    <p className="text-s text-stone-400">
                      {new Intl.DateTimeFormat("en-US", {
                        timeZone: "America/Chicago",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(event.event_date))}
                    </p>
                    <p className="text-xs text-stone-400">
                      {new Intl.DateTimeFormat("en-US", {
                        timeZone: "America/Chicago",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }).format(new Date(event.event_date))}
                    </p>
                  </div>
                  {event.repeat !== "none" &&
                    event.repeat_start &&
                    event.repeat_end && (
                      <div className="text-xs text-blue-500 text-right">
                        <p>
                          Repeats:{" "}
                          {event.repeat.charAt(0).toUpperCase() +
                            event.repeat.slice(1)}
                        </p>
                        <p>
                          From:{" "}
                          {new Intl.DateTimeFormat("en-US", {
                            timeZone: "America/Chicago",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(new Date(event.repeat_start))}
                        </p>
                        <p>
                          To:{" "}
                          {new Intl.DateTimeFormat("en-US", {
                            timeZone: "America/Chicago",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(new Date(event.repeat_end))}
                        </p>
                      </div>
                    )}
                </div>

                {/* Center Section: RSVP Buttons */}
                <div className="flex justify-center items-center mt-auto">
                  {["going", "maybe", "not going"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleRSVP(event, status)}
                      className={`px-4 py-1.5 text-white rounded-full text-xs font-semibold transition mx-1 ${
                        rsvpStatus[event.id] === status
                          ? "bg-primary/80"
                          : "bg-primary hover:bg-primary/90"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Hover Card for Description and Creator Info */}
                {hoveredEvent?.id === event.id && (
                  <div
                    className="absolute z-10 p-2 text-xs"
                    style={{
                      top: "100%", // Position below the card
                      left: "50%",
                      transform: "translateX(-50%)", // Center horizontally
                      whiteSpace: "normal", // Prevent text cutoff
                      maxWidth: "300px", // Limit width
                    }}
                  >
                    <HoverCard
                      description={event.description}
                      createdBy={event.creator_name} // Use the creator_name field
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
