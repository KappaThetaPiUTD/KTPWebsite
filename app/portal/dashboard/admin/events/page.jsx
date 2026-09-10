"use client";

import { useEffect, useState } from "react";

export default function AdminEventsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      try {
        setEventsLoading(true);
        setEventsError(null);

        const response = await fetch("/api/portal/events", {
          cache: "no-store",
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load events.");
        }

        if (!cancelled) {
          setEvents(payload.events || []);
        }
      } catch (error) {
        if (!cancelled) {
          setEventsError(error.message);
          setEvents([]);
        }
      } finally {
        if (!cancelled) {
          setEventsLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadAttendance(eventId) {
    setAttendanceLoading(true);
    setAttendanceError(null);

    try {
      const response = await fetch(
        `/api/portal/admin/attendance?eventId=${eventId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load attendance.");
      }

      setAttendanceRecords(data.attendance || []);
    } catch (error) {
      setAttendanceError(error.message);
      setAttendanceRecords([]);
    } finally {
      setAttendanceLoading(false);
    }
  }

  async function updateAttendanceStatus(attendanceId, status) {
    try {
      const response = await fetch("/api/portal/admin/attendance", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attendanceId,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update attendance.");
      }

      setAttendanceRecords((current) =>
        current.map((record) =>
          record.id === attendanceId ? data.attendance : record
        )
      );
    } catch (error) {
      setAttendanceError(error.message);
    }
  }

  const formatDate = (value) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-950">
            Event Management
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
            Create and manage chapter events, RSVPs, and attendance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          + Create Event
        </button>
      </div>

      {showCreateForm && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-950">
              Create Event
            </h2>
          </div>

          <form className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="event-title"
                className="text-sm font-semibold text-gray-800"
              >
                Event Name
              </label>

              <input
                id="event-title"
                type="text"
                placeholder="Chapter Meeting"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="event-date"
                  className="text-sm font-semibold text-gray-800"
                >
                  Date
                </label>

                <input
                  id="event-date"
                  type="date"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="event-time"
                  className="text-sm font-semibold text-gray-800"
                >
                  Time
                </label>

                <input
                  id="event-time"
                  type="time"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="event-location"
                className="text-sm font-semibold text-gray-800"
              >
                Location
              </label>

              <input
                id="event-location"
                type="text"
                placeholder="KTP Chapter Room"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="event-description"
                className="text-sm font-semibold text-gray-800"
              >
                Description
              </label>

              <textarea
                id="event-description"
                rows={4}
                placeholder="Describe the event..."
                className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-950">
          Upcoming Events
        </h2>

        {eventsLoading && (
          <p className="mt-4 text-sm text-gray-600">
            Loading events...
          </p>
        )}

        {eventsError && (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {eventsError}
          </div>
        )}

        {!eventsLoading && !eventsError && events.length === 0 && (
          <p className="mt-4 text-sm text-gray-600">
            No upcoming events found.
          </p>
        )}

        {!eventsLoading && !eventsError && events.length > 0 && (
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <article
                key={event.id}
                className="min-h-[390px] rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
              >
                <div className="flex min-h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-950">
                        {event.title}
                      </h3>

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
                    </div>

                    <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-primary">
                      Upcoming
                    </span>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Going
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-950">
                        -
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Not Going
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-950">
                        -
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Checked In
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-950">
                        -
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-gray-100 pt-6">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEvent(event);
                          loadAttendance(event.id);
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-xs font-semibold text-gray-800 hover:border-primary hover:text-primary"
                      >
                        View Attendance
                      </button>

                      <button
                        type="button"
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-xs font-semibold text-gray-800 hover:border-primary hover:text-primary"
                      >
                        Generate QR
                      </button>

                      <button
                        type="button"
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-xs font-semibold text-gray-800 hover:border-primary hover:text-primary"
                      >
                        Export Attendance
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-950">
                  {selectedEvent.title}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  {formatDate(selectedEvent.start_time)} •{" "}
                  {formatTime(selectedEvent.start_time)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="text-xl font-semibold text-gray-400 hover:text-gray-950"
                aria-label="Close attendance"
              >
                ×
              </button>
            </div>

            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-700">
                Attendance
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-950">
                {attendanceRecords.length} checked in
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {attendanceLoading && (
                <p className="py-6 text-center text-sm text-gray-500">
                  Loading attendance...
                </p>
              )}

              {attendanceError && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  {attendanceError}
                </div>
              )}

              {!attendanceLoading &&
                !attendanceError &&
                attendanceRecords.length === 0 && (
                  <p className="py-6 text-center text-sm text-gray-500">
                    No attendance records yet.
                  </p>
                )}

              {!attendanceLoading &&
                attendanceRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {record.user_id}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Checked in at{" "}
                        {new Date(record.checked_in_at).toLocaleString()}
                      </p>
                    </div>

                    <select
                      value={record.status}
                      onChange={(event) =>
                        updateAttendanceStatus(
                          record.id,
                          event.target.value
                        )
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold outline-none focus:border-primary"
                    >
                      <option value="present">Present</option>
                      <option value="late">Late</option>
                      <option value="excused">Excused</option>
                      <option value="unexcused">Unexcused</option>
                    </select>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}