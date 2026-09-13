"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export default function AdminEventsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [qrEvent, setQrEvent] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventType, setEventType] = useState("chapter");
  const [eventCapacity, setEventCapacity] = useState("");
  const [eventCheckInOpen, setEventCheckInOpen] = useState(false);
  const [eventCheckInPasscodeEnabled, setEventCheckInPasscodeEnabled] = useState(false);
  const [eventCheckInPasscode, setEventCheckInPasscode] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventRecurrence, setEventRecurrence] = useState("none");
  const [eventRecurrenceEnd, setEventRecurrenceEnd] = useState("");
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editError, setEditError] = useState("");
  const [deletingEventId, setDeletingEventId] = useState("");
  const [createEventError, setCreateEventError] = useState("");
  const [cardWindowStart] = useState(() => new Date());

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

  async function exportAttendance(eventId, eventTitle) {
    try {
      const response = await fetch(
        `/api/portal/admin/attendance?eventId=${eventId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to export attendance.");
      }

      const attendance = data.attendance || [];

      const escapeCsvValue = (value) => {
        const stringValue = String(value);
        const safeValue = /^[=+\-@]/.test(stringValue)
          ? `'${stringValue}`
          : stringValue;

        return `"${safeValue.replace(/"/g, '""')}"`;
      };

      const headers = ["Name", "User ID", "Status", "Checked In At"];

      const rows = attendance.map((record) => [
        record.full_name || "",
        record.user_id || "",
        record.status || "",
        record.checked_in_at
          ? new Date(record.checked_in_at).toLocaleString()
          : "",
      ]);

      const csv = [headers, ...rows]
        .map((row) => row.map(escapeCsvValue).join(","))
        .join("\n");

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);

      const safeTitle = eventTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const link = document.createElement("a");

      link.href = url;
      link.download = `${safeTitle || "event"}-attendance.csv`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      setEventsError(error.message || "Unable to export attendance.");
    }
  }

  async function updateAttendanceStatus(attendanceId, status) {
    const reason = window.prompt(
      "Why are you changing this attendance status? (5–500 characters)"
    );

    if (reason === null) {
      return;
    }

    try {
      const response = await fetch("/api/portal/admin/attendance", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attendanceId,
          status,
          reason,
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

  async function deleteEvent(event) {
    if (!window.confirm(`Delete “${event.title}”? This permanently removes the event and its RSVP and attendance records.`)) {
      return;
    }

    setDeletingEventId(event.id);
    setEventsError(null);
    try {
      const response = await fetch("/api/portal/admin/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete event.");
      setEvents((current) => current.filter((currentEvent) => currentEvent.id !== event.id));
    } catch (error) {
      setEventsError(error.message || "Unable to delete event.");
    } finally {
      setDeletingEventId("");
    }
  }

  function openEditEvent(event) {
    setEditingEvent(event);
    setEditTitle(event.title || "");
    setEditDescription(event.description || "");
    setEditLocation(event.location || "");
    setEditError("");
  }

  async function editEvent(event) {
    event.preventDefault();
    if (!editingEvent) return;
    const title = editTitle.trim();
    const description = editDescription.trim();
    const location = editLocation.trim();

    setEditingEventId(editingEvent.id);
    setEditError("");
    try {
      const response = await fetch("/api/portal/admin/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: editingEvent.id, title, description, location }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update event.");
      setEvents((current) => current.map((currentEvent) =>
        currentEvent.id === editingEvent.id ? { ...currentEvent, ...data.event } : currentEvent
      ));
      setEditingEvent(null);
    } catch (error) {
      setEditError(error.message || "Unable to update event.");
    } finally {
      setEditingEventId("");
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
  const cardWindowEnd = new Date(cardWindowStart.getTime() + 14 * 24 * 60 * 60 * 1000);
  const cardEvents = events.filter((event) => new Date(event.start_time) < cardWindowEnd);

  const closeCreateForm = () => {
    if (creatingEvent) return;

    setShowCreateForm(false);
    setCreateEventError("");
  };

  const createEvent = async (event) => {
    event.preventDefault();

    const title = eventTitle.trim();
    const description = eventDescription.trim();
    const location = eventLocation.trim();
    const capacity = eventCapacity === "" ? null : Number(eventCapacity);
    const checkInPasscode = eventCheckInPasscode.trim();

    if (
      title.length < 2 ||
      description.length < 5 ||
      location.length < 2 ||
      !eventStart ||
      !eventEnd
    ) {
      setCreateEventError(
        "Fill in a title, description (5+ characters), location, and start/end time."
      );
      return;
    }

    if (
      capacity !== null &&
      (!Number.isInteger(capacity) || capacity <= 0)
    ) {
      setCreateEventError(
        "Capacity must be a positive whole number."
      );
      return;
    }

    if (eventCheckInPasscodeEnabled && !/^\d{6}$/.test(checkInPasscode)) {
      setCreateEventError(
        "Check-in passcode must be exactly 6 digits."
      );
      return;
    }

    setCreatingEvent(true);
    setCreateEventError("");

    try {
      const response = await fetch("/api/portal/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          location,
          startTime: eventStart,
          endTime: eventEnd,
          eventType,
          capacity,
          recurrence: eventRecurrence,
          recurrenceEnd: eventRecurrenceEnd,
          checkInOpen: eventCheckInOpen,
          checkInPasscodeEnabled: eventCheckInPasscodeEnabled,
          checkInPasscode,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to create event.");
      }

      setEvents((current) => [
        ...(result.events || [result.event]).map((createdEvent) => ({
          ...createdEvent,
          goingCount: 0,
          notGoingCount: 0,
          checkedInCount: 0,
        })),
        ...current,
      ]);

      setShowCreateForm(false);
      setEventTitle("");
      setEventDescription("");
      setEventLocation("");
      setEventType("chapter");
      setEventCapacity("");
      setEventCheckInOpen(false);
      setEventCheckInPasscodeEnabled(false);
      setEventCheckInPasscode("");
      setEventStart("");
      setEventEnd("");
      setEventRecurrence("none");
      setEventRecurrenceEnd("");
    } catch (error) {
      setCreateEventError(
        error.message || "Unable to create event right now."
      );
    } finally {
      setCreatingEvent(false);
    }
  };

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

          <form className="mt-6 space-y-5" onSubmit={createEvent}>
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
                value={eventTitle}
                onChange={(event) => setEventTitle(event.target.value)}
                disabled={creatingEvent}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="event-start"
                  className="text-sm font-semibold text-gray-800"
                >
                  Start time
                </label>

                <input
                  id="event-start"
                  type="datetime-local"
                  value={eventStart}
                  onChange={(event) => setEventStart(event.target.value)}
                  disabled={creatingEvent}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="event-end"
                  className="text-sm font-semibold text-gray-800"
                >
                  End time
                </label>

                <input
                  id="event-end"
                  type="datetime-local"
                  value={eventEnd}
                  onChange={(event) => setEventEnd(event.target.value)}
                  disabled={creatingEvent}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="event-recurrence" className="text-sm font-semibold text-gray-800">Repeat</label>
                <select id="event-recurrence" value={eventRecurrence} onChange={(event) => setEventRecurrence(event.target.value)} disabled={creatingEvent} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary">
                  <option value="none">Does not repeat</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              {eventRecurrence !== "none" && <div>
                <label htmlFor="event-recurrence-end" className="text-sm font-semibold text-gray-800">Repeat through</label>
                <input id="event-recurrence-end" type="date" value={eventRecurrenceEnd} onChange={(event) => setEventRecurrenceEnd(event.target.value)} disabled={creatingEvent} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>}
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
                value={eventLocation}
                onChange={(event) => setEventLocation(event.target.value)}
                disabled={creatingEvent}
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
                value={eventDescription}
                onChange={(event) => setEventDescription(event.target.value)}
                disabled={creatingEvent}
                className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="event-type"
                className="text-sm font-semibold text-gray-800"
              >
                Event type
              </label>

              <select
                id="event-type"
                value={eventType}
                onChange={(event) => setEventType(event.target.value)}
                disabled={creatingEvent}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="chapter">Chapter</option>
                <option value="professional">
                  Professional Development
                </option>
                <option value="fundraiser">Fundraiser</option>
                <option value="social">Social</option>
                <option value="workshop">Workshop</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="event-capacity"
                  className="text-sm font-semibold text-gray-800"
                >
                  Capacity Limit
                </label>

                <input
                  id="event-capacity"
                  type="number"
                  min="1"
                  placeholder="Unlimited"
                  value={eventCapacity}
                  onChange={(event) => setEventCapacity(event.target.value)}
                  disabled={creatingEvent}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Leave blank for unlimited capacity.
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-800" htmlFor="event-passcode-enabled">
                  <input
                    id="event-passcode-enabled"
                    type="checkbox"
                    checked={eventCheckInPasscodeEnabled}
                    onChange={(event) => setEventCheckInPasscodeEnabled(event.target.checked)}
                    disabled={creatingEvent}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  Enable 6-digit passcode check-in
                </label>

                <label
                  htmlFor="event-passcode"
                  className="mt-3 block text-sm font-semibold text-gray-800"
                >
                  Passcode
                </label>

                <input
                  id="event-passcode"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={eventCheckInPasscode}
                  onChange={(event) =>
                    setEventCheckInPasscode(
                      event.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  disabled={creatingEvent || !eventCheckInPasscodeEnabled}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
                <p className="mt-1 text-xs text-gray-500">
                  QR check-in is always enabled. Turn this on to also allow passcode check-in.
                </p>
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 text-sm text-gray-800" htmlFor="event-check-in-open">
              <input
                id="event-check-in-open"
                type="checkbox"
                checked={eventCheckInOpen}
                onChange={(event) => setEventCheckInOpen(event.target.checked)}
                disabled={creatingEvent}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span><span className="block font-semibold">Open check-in immediately</span><span className="mt-1 block text-xs text-gray-500">Enable only when members are ready to check in. QR and any enabled passcode are rejected while check-in is closed.</span></span>
            </label>

            {createEventError && (
              <p className="text-sm font-medium text-red-700" role="alert">
                {createEventError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeCreateForm}
                disabled={creatingEvent}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creatingEvent}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                {creatingEvent ? "Creating..." : "Create Event"}
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

        {!eventsLoading && !eventsError && cardEvents.length === 0 && (
          <p className="mt-4 text-sm text-gray-600">
            No events in the next two weeks.
          </p>
        )}

        {!eventsLoading && !eventsError && cardEvents.length > 0 && (
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {cardEvents.map((event) => (
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
                    <div className="rounded-xl bg-gray-50 p-4 text-center">
                      <p className="flex min-h-[48px] items-center justify-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Going
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-950">
                        {event.goingCount}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4 text-center">
                      <p className="flex min-h-[48px] items-center justify-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Not Going
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-950">
                        {event.notGoingCount}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4 text-center">
                      <p className="flex min-h-[48px] items-center justify-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Checked In
                      </p>

                      <p className="mt-2 text-2xl font-bold text-gray-950">
                        {event.checkedInCount}
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
                        onClick={async () => {
                          setEventsError(null);
                          try {
                            const response = await fetch(
                              `/api/portal/admin/events/${event.id}/qr`,
                              { cache: "no-store" }
                            );
                            const data = await response.json();
                            if (!response.ok) {
                              throw new Error(data.error || "Unable to generate QR code.");
                            }
                            setQrEvent({ ...event, qrPayload: data.payload });
                          } catch (error) {
                            setEventsError(error.message || "Unable to generate QR code.");
                          }
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-xs font-semibold text-gray-800 hover:border-primary hover:text-primary"
                      >
                        Generate QR
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          exportAttendance(event.id, event.title)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-xs font-semibold text-gray-800 hover:border-primary hover:text-primary"
                      >
                        Export Attendance
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteEvent(event)}
                        disabled={deletingEventId === event.id}
                        className="rounded-lg border border-red-300 px-3 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingEventId === event.id ? "Deleting…" : "Delete Event"}
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditEvent(event)}
                        disabled={editingEventId === event.id}
                        className="rounded-lg border border-gray-300 px-3 py-2.5 text-xs font-semibold text-gray-800 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {editingEventId === event.id ? "Saving…" : "Edit Event"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-event-title">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Event management</p>
                <h2 id="edit-event-title" className="mt-1 text-xl font-bold text-gray-950">Edit event</h2>
              </div>
              <button type="button" onClick={() => setEditingEvent(null)} disabled={Boolean(editingEventId)} aria-label="Close edit event" className="text-xl font-semibold text-gray-400 hover:text-gray-950 disabled:opacity-50">×</button>
            </div>
            <form className="mt-6 space-y-5" onSubmit={editEvent}>
              <div>
                <label htmlFor="edit-event-title-input" className="text-sm font-semibold text-gray-800">Event name</label>
                <input id="edit-event-title-input" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} disabled={Boolean(editingEventId)} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label htmlFor="edit-event-location" className="text-sm font-semibold text-gray-800">Location</label>
                <input id="edit-event-location" value={editLocation} onChange={(event) => setEditLocation(event.target.value)} disabled={Boolean(editingEventId)} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label htmlFor="edit-event-description" className="text-sm font-semibold text-gray-800">Description</label>
                <textarea id="edit-event-description" rows={5} value={editDescription} onChange={(event) => setEditDescription(event.target.value)} disabled={Boolean(editingEventId)} className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              {editError && <p className="text-sm font-medium text-red-700" role="alert">{editError}</p>}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setEditingEvent(null)} disabled={Boolean(editingEventId)} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={Boolean(editingEventId)} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">{editingEventId ? "Saving…" : "Save changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                        {record.full_name || record.user_id}
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
                      <option value="absent">Absent</option>
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

      {qrEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <h2 className="text-xl font-bold text-gray-950">
              {qrEvent.title}
            </h2>

            <QRCodeSVG
              value={qrEvent.qrPayload}
              title={`QR code for ${qrEvent.title}`}
              className="mx-auto mt-6 h-60 w-60"
              size={240}
            />

            <button
              type="button"
              onClick={() => setQrEvent(null)}
              className="mt-6 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
