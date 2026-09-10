"use client";

import { useEffect, useState } from "react";
import EventCalendar from "../../../../components/portal/events/EventCalendar";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [rsvps, setRsvps] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingEventId, setSubmittingEventId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      try {
        const response = await fetch("/api/portal/events", { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Unable to load events.");
        if (cancelled) return;

        setEvents(payload.events);
        setRsvps(
          Object.fromEntries(payload.rsvps.map((rsvp) => [rsvp.event_id, rsvp.status]))
        );
      } catch (loadError) {
        if (!cancelled) setError(loadError.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRsvp = async (eventId, status) => {
    setSubmittingEventId(eventId);
    setError("");
    try {
      const response = await fetch("/api/portal/events/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, status }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to save RSVP.");
      setRsvps((current) => ({ ...current, [eventId]: payload.rsvp.status }));
    } catch (rsvpError) {
      setError(rsvpError.message);
    } finally {
      setSubmittingEventId(null);
    }
  };

  const formatDate = (value) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  const formatTime = (value) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));

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

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="mt-8 text-sm text-gray-600">Loading events…</p>
      ) : (

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
                          {formatDate(event.start_time)}
                        </p>

                        <p>
                          <span className="font-semibold text-gray-800">
                            Time:
                          </span>{" "}
                          {formatTime(event.start_time)}
                        </p>

                        <p>
                          <span className="font-semibold text-gray-800">
                            Location:
                          </span>{" "}
                          {event.location || "TBD"}
                        </p>
                      </div>

                      <p className="mt-5 text-sm leading-6 text-gray-700">
                        {event.description}
                      </p>
                    </div>

                    {rsvp && (
                      <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-primary">
                        {rsvp === "going" ? "Going" : "Not Going"}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto border-t border-gray-100 pt-6">
                    <p className="text-sm font-semibold text-gray-800">
                      Will you be attending?
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleRsvp(event.id, "going")}
                        disabled={submittingEventId === event.id}
                        className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                          rsvp === "going"
                            ? "bg-primary text-white"
                            : "border border-gray-300 text-gray-800 hover:border-primary hover:text-primary"
                        }`}
                      >
                        Going
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRsvp(event.id, "not_going")}
                        disabled={submittingEventId === event.id}
                        className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                          rsvp === "not_going"
                            ? "bg-primary text-white"
                            : "border border-gray-300 text-gray-800 hover:border-primary hover:text-primary"
                        }`}
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
      )}
    </div>
  );
}
