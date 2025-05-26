"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Sidebar from "../../../components/Sidebar";
import { useRouter } from "next/navigation";

export default function RSVPPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [rsvpStatus, setRsvpStatus] = useState({});

  // Check for user authentication
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

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("events").select("*");
      if (!error && data) {
        setEvents(data);
        const status = {};
        data.forEach((event) => {
          status[event.event_name] = null;
        });
        setRsvpStatus(status);
      }
    };
    fetchEvents();
  }, []);

  const handleRSVP = async (event, response) => {
    if (!user) return alert("Please log in first.");

    const { error } = await supabase.from("rsvps").insert([
      {
        event_id: event.id,
        event_title: event.event_name,
        user_id: user.id,
        response,
      },
    ]);

    if (error) {
      console.error("RSVP failed:", error.message);
      alert("RSVP failed.");
    } else {
      setRsvpStatus((prev) => ({
        ...prev,
        [event.event_name]: response,
      }));
      alert(`RSVPed as "${response}" to ${event.event_name}!`);
    }
  };

  if (loading) return <div className="text-center mt-20 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-white pt-24 text-sm text-black font-['Public_Sans'] grid grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <aside className="bg-white px-6 py-10 font-['Inter'] border-r border-black shadow-sm space-y-6">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="px-8 py-6 w-full">
        <h2 className="text-lg font-semibold mb-6 text-primary">RSVP Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {["going", "maybe", "not going", "unanswered"].map((category) => {
            const labelMap = {
              going: "Going",
              maybe: "Maybe",
              "not going": "No",
              unanswered: "Haven't Responded",
            };
            const filtered = Object.entries(rsvpStatus).filter(
              ([_, status]) => (status || "unanswered") === category
            );

            return (
              <div key={category} className="border rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-bold mb-2">{labelMap[category]}</h3>
                {filtered.length > 0 ? (
                  <ul className="text-xs space-y-1">
                    {filtered.map(([eventName]) => (
                      <li key={eventName}>{eventName}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">No events</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-primary">Update Your RSVP</h2>
          <div className="space-y-6">
            {events.map((event, idx) => (
              <div key={idx}>
                <p className="font-medium text-sm mb-2">{event.event_name}</p>
                <div className="flex flex-wrap gap-3">
                  {["going", "maybe", "not going"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleRSVP(event, status)}
                      className={`px-4 py-1 text-white rounded-full text-xs font-semibold transition ${
                        rsvpStatus[event.event_name] === status
                          ? "bg-primary/80 text-white"
                          : "bg-primary text-white hover:bg-primary/90"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
