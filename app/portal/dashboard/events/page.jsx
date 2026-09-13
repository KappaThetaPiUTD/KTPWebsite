"use client";

import { useEffect, useState } from "react";
import EventCalendar from "../../../../components/portal/events/EventCalendar";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [rsvps, setRsvps] = useState({});
  const [attendance, setAttendance] = useState({});
  const [checkInCodes, setCheckInCodes] = useState({});
  const [checkInFeedback, setCheckInFeedback] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingEventId, setSubmittingEventId] = useState(null);
  const [cardWindowStart] = useState(() => new Date());

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
        setAttendance(
          Object.fromEntries(
            payload.attendance.map((record) => [record.event_id, record])
          )
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

  const handleCheckIn = async (eventId) => {
    const passcode = (checkInCodes[eventId] || "").trim();

    if (!/^\d{6}$/.test(passcode)) {
      setCheckInFeedback((current) => ({
        ...current,
        [eventId]: { type: "error", message: "Enter the six-digit check-in code." },
      }));
      return;
    }

    setSubmittingEventId(eventId);
    setCheckInFeedback((current) => {
      const next = { ...current };
      delete next[eventId];
      return next;
    });

    try {
      const response = await fetch("/api/portal/events/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, passcode }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Unable to complete check-in.");
      }

      setAttendance((current) => ({
        ...current,
        [eventId]: {
          event_id: eventId,
          checked_in_at: payload.attendance.checkedInAt,
          status: payload.attendance.status,
        },
      }));
      setCheckInCodes((current) => ({ ...current, [eventId]: "" }));
      setCheckInFeedback((current) => ({
        ...current,
        [eventId]: {
          type: "success",
          message: payload.alreadyCheckedIn
            ? "You are already checked in."
            : "You are checked in.",
        },
      }));
    } catch (checkInError) {
      setCheckInFeedback((current) => ({
        ...current,
        [eventId]: { type: "error", message: checkInError.message },
      }));
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
  const cardWindowEnd = new Date(cardWindowStart.getTime() + 14 * 24 * 60 * 60 * 1000);
  const cardEvents = events.filter((event) => new Date(event.start_time) < cardWindowEnd);

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
          {cardEvents.map((event) => {
            const rsvp = rsvps[event.id];
            const attendanceRecord = attendance[event.id];
            const feedback = checkInFeedback[event.id];
            const isSubmitting = submittingEventId === event.id;
            const rsvpClosed = Boolean(
              event.rsvp_deadline && new Date() > new Date(event.rsvp_deadline)
            );
            const hasStats = typeof event.goingCount === "number";

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
                        {rsvp === "going" ? "Going" : rsvp === "not_going" ? "Not Going" : "Maybe"}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto border-t border-gray-100 pt-6">
                    <p className="text-sm font-semibold text-gray-800">
                      Will you be attending?
                    </p>

                    {/* RSVP counts (admins only; other members get zeros from the API) */}
                    {hasStats && (
                      <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-gray-500">
                        <span>{event.goingCount} going</span>
                        <span>{event.maybeCount} maybe</span>
                        <span>{event.notGoingCount} not going</span>
                        <span>{event.checkedInCount} checked in</span>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleRsvp(event.id, "going")}
                        disabled={isSubmitting || rsvpClosed}
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
                        disabled={isSubmitting || rsvpClosed}
                        className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                          rsvp === "not_going"
                            ? "bg-primary text-white"
                            : "border border-gray-300 text-gray-800 hover:border-primary hover:text-primary"
                        }`}
                      >
                        Not Going
                      </button>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-6">
                      <p className="text-sm font-semibold text-gray-800">Check-in</p>

                      {attendanceRecord ? (
                        <p className="mt-3 text-sm font-medium text-green-700" role="status">
                          {feedback?.type === "success"
                            ? feedback.message
                            : "You are already checked in."}
                        </p>
                      ) : event.is_check_in_open ? (
                        <div className="mt-3 flex flex-wrap items-start gap-3">
                          <label className="sr-only" htmlFor={`check-in-code-${event.id}`}>
                            Six-digit check-in code for {event.title}
                          </label>
                          <input
                            id={`check-in-code-${event.id}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            value={checkInCodes[event.id] || ""}
                            onChange={(inputEvent) =>
                              setCheckInCodes((current) => ({
                                ...current,
                                [event.id]: inputEvent.target.value.replace(/\D/g, ""),
                              }))
                            }
                            disabled={isSubmitting}
                            placeholder="6-digit code"
                            className="w-32 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100"
                          />
                          <button
                            type="button"
                            onClick={() => handleCheckIn(event.id)}
                            disabled={isSubmitting}
                            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isSubmitting ? "Checking in…" : "Check in"}
                          </button>
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-gray-600" role="status">
                          Check-in is not open yet.
                        </p>
                      )}

                      {feedback?.type === "error" && !attendanceRecord && (
                        <p className="mt-3 text-sm text-red-700" role="alert">
                          {feedback.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
          {cardEvents.length === 0 && (
            <p className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
              No events in the next two weeks. View the calendar for later events.
            </p>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
