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
        // Initialize RSVP status
        const status = {};
        data.forEach(event => {
          status[event.event_name] = null;
        });
        setRsvpStatus(status);
      }
    };
    fetchEvents();
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
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2 text-primary">RSVP Events</h2>
          <p className="text-sm text-gray-700 mb-6">
            Let us know your attendance for upcoming events:
          </p>

          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id}>
                <p className="font-medium text-sm mb-2">{event.event_name}</p>
                <div className="flex flex-wrap gap-3">
                  {["going", "maybe", "not going"].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        setRsvpStatus((prev) => ({
                          ...prev,
                          [event.event_name]: status,
                        }))
                      }
                      className={`px-4 py-1 text-white rounded-full text-xs font-semibold transition
                        ${
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
