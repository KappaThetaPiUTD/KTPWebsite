"use client";

import { useState, useEffect } from "react";
import EventCalendar from "../../../../components/portal/events/EventCalendar";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [rsvps, setRsvps] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRsvp = async (eventId, status) => {
    try {
      const res = await fetch("/api/portal/events/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId, status }),
      });
      const data = await res.json();
      if (res.ok) {
        setRsvps((current) => ({
          ...current,
          [eventId]: status,
        }));
      }
    } catch (error) {
      console.error("RSVP error:", error);
    }
  };

  if (loading) {
    return <p>Loading events...</p>;
  }

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Events
      </p>

      <h1 className="mt-2 text-3xl font-bold text-gray-950">
        Upcoming Events
      </h1>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
        View upcoming chapter events and let us know whether you&apos;ll be
        attending.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
        {/* Calendar */}
        <EventCalendar events={events} rsvps={rsvps} />

        {/* Event cards */}
        <div className="max-h-[650px] space-y-5 overflow-y-auto pr-2">
          {events.map((event) => {
            const rsvp = rsvps[event.id];

            return (
              <article
                key={event.id}
                className="min-h-[390px] rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
              >
                <div className="flex min-h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-950">
                        {event.title}
                      </h2>

                      <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-semibold text-gray-800">
                            Date:
                          </span>{" "}
                          {event.date}
                        </p>

                        <p>
                          <span className="font-semibold text-gray-800">
                            Time:
                          </span>{" "}
                          {event.time}
                        </p>

                        <p>
                          <span className="font-semibold text-gray-800">
                            Location:
                          </span>{" "}
                          {event.location}
                        </p>
                      </div>

                      <p className="mt-5 text-sm leading-6 text-gray-700">
                        {event.description}
                      </p>
                    </div>

                    {rsvp && (
                      <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-primary">
                        {rsvp === "yes" ? "Going" : rsvp === "no" ? "Not Going" : "Maybe"}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto border-t border-gray-100 pt-6">
                    <p className="text-sm font-semibold text-gray-800">
                      Will you be attending?
                    </p>

                    {/* RSVP counts */}
                    <div className="mt-2 text-xs text-gray-500">
                      {event.rsvpCount &&
                        `
                        <span>${event.rsvpCount.yes} going</span>
                        <span>${event.rsvpCount.maybe} maybe</span>
                        <span>${event.rsvpCount.no} not going</span>
                        `}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleRsvp(event.id, "yes")}
                        className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                          rsvp === "yes"
                            ? "bg-primary text-white"
                            : "border border-gray-300 text-gray-800 hover:border-primary hover:text-primary"
                        }`}
                        disabled={event.rsvp_deadline && new Date() > new Date(event.rsvp_deadline)}
                      >
                        Going
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRsvp(event.id, "maybe")}
                        className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                          rsvp === "maybe"
                            ? "bg-primary text-white"
                            : "border border-gray-300 text-gray-800 hover:border-primary hover:text-primary"
                        }`}
                        disabled={event.rsvp_deadline && new Date() > new Date(event.rsvp_deadline)}
                      >
                        Maybe
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRsvp(event.id, "no")}
                        className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                          rsvp === "no"
                            ? "bg-primary text-white"
                            : "border border-gray-300 text-gray-800 hover:border-primary hover:text-primary"
                        }`}
                        disabled={event.rsvp_deadline && new Date() > new Date(event.rsvp_deadline)}
                      >
                        Not Going
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}