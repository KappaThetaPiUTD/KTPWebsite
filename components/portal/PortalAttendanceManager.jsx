"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["present", "absent", "excused", "unexcused"];
const ROLES = ["admin", "exec", "director", "brother", "pledge"];
const EVENT_TYPES = ["chapter", "professional", "fundraiser", "social", "other"];
const EVENT_TYPE_LABELS = {
  chapter: "Chapter",
  professional: "Professional Development",
  fundraiser: "Fundraiser",
  social: "Social",
  other: "Other",
};

const STATUS_STYLES = {
  present: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-red-800",
  excused: "bg-amber-100 text-amber-800",
  unexcused: "bg-gray-200 text-gray-800",
};

function formatCentralDate(value) {
  return new Date(value).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatCentralDateOnly(value) {
  return new Date(value).toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
  });
}

function StatusBadge({ status }) {
  if (!status) {
    return (
      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
        Not recorded
      </span>
    );
  }
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

export default function PortalAttendanceManager({
  events,
  selectedEventId,
  roster,
  recentLogs,
  error,
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [editingMember, setEditingMember] = useState(null);
  const [newStatus, setNewStatus] = useState("present");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventType, setEventType] = useState("chapter");
  const [addingEvent, setAddingEvent] = useState(false);
  const [addEventError, setAddEventError] = useState("");

  const filteredRoster = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return roster.filter((member) => {
      const matchesQuery =
        !normalized ||
        member.name.toLowerCase().includes(normalized) ||
        member.email.toLowerCase().includes(normalized);
      const matchesRole = roleFilter === "all" || member.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [roster, query, roleFilter]);

  const filteredEvents = useMemo(() => {
    if (eventTypeFilter === "all") return events;
    return events.filter((event) => event.event_type === eventTypeFilter);
  }, [events, eventTypeFilter]);

  const changeEvent = (eventId) => {
    router.push(`/portal/dashboard/admin/attendance?eventId=${eventId}`);
  };

  const changeEventTypeFilter = (type) => {
    setEventTypeFilter(type);
    const nextEvents =
      type === "all" ? events : events.filter((event) => event.event_type === type);
    if (nextEvents.length > 0 && !nextEvents.some((event) => event.id === selectedEventId)) {
      changeEvent(nextEvents[0].id);
    }
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setNewStatus(member.status || "present");
    setReason("");
    setFeedback("");
  };

  const closeEditModal = () => {
    if (submitting) return;
    setEditingMember(null);
    setReason("");
    setFeedback("");
  };

  const submitAttendance = async () => {
    const normalizedReason = reason.trim();
    if (!editingMember || normalizedReason.length < 5) {
      setFeedback("Enter a reason with at least 5 characters.");
      return;
    }

    setSubmitting(true);
    setFeedback("");
    try {
      const response = await fetch("/api/portal/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEventId,
          memberUserId: editingMember.userId,
          status: newStatus,
          reason: normalizedReason,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setFeedback(result.error || "Unable to update attendance.");
        return;
      }

      setEditingMember(null);
      setReason("");
      router.refresh();
    } catch {
      setFeedback("Unable to update attendance right now.");
    } finally {
      setSubmitting(false);
    }
  };

  const openAddEvent = () => {
    setEventTitle("");
    setEventDescription("");
    setEventStart("");
    setEventEnd("");
    setEventLocation("");
    setEventType("chapter");
    setAddEventError("");
    setShowAddEvent(true);
  };

  const closeAddEvent = () => {
    if (addingEvent) return;
    setShowAddEvent(false);
  };

  const submitAddEvent = async () => {
    const title = eventTitle.trim();
    const description = eventDescription.trim();
    const location = eventLocation.trim();
    if (
      title.length < 2 ||
      description.length < 5 ||
      location.length < 2 ||
      !eventStart ||
      !eventEnd
    ) {
      setAddEventError(
        "Fill in a title, description (5+ characters), location, and start/end time."
      );
      return;
    }

    setAddingEvent(true);
    setAddEventError("");
    try {
      const response = await fetch("/api/portal/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          location,
          startTime: eventStart,
          endTime: eventEnd,
          eventType,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setAddEventError(result.error || "Unable to create event.");
        return;
      }

      setShowAddEvent(false);
      router.push(`/portal/dashboard/admin/attendance?eventId=${result.event.id}`);
    } catch {
      setAddEventError("Unable to create event right now.");
    } finally {
      setAddingEvent(false);
    }
  };

  return (
    <div className="mt-7 space-y-8">
      {error && (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
          role="alert"
        >
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex w-full flex-col gap-4 sm:max-w-2xl sm:flex-row">
            <div className="w-full sm:max-w-[10rem]">
              <label
                className="mb-2 block text-sm font-semibold text-gray-900"
                htmlFor="event-type-filter"
              >
                Event type
              </label>
              <select
                id="event-type-filter"
                value={eventTypeFilter}
                onChange={(event) => changeEventTypeFilter(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All types</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {EVENT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:max-w-sm">
              <label
                className="mb-2 block text-sm font-semibold text-gray-900"
                htmlFor="event-select"
              >
                Event
              </label>
              <select
                id="event-select"
                value={selectedEventId}
                onChange={(event) => changeEvent(event.target.value)}
                disabled={filteredEvents.length === 0}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              >
                {filteredEvents.length === 0 && (
                  <option value="">
                    {events.length === 0 ? "No events yet" : "No events of this type"}
                  </option>
                )}
                {filteredEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} — {formatCentralDateOnly(event.start_time)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={openAddEvent}
            className="h-fit rounded-lg bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary/90"
          >
            Add event
          </button>
        </div>
      </section>

      {selectedEventId ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-950">Roster</h2>
              <p className="mt-1 text-sm text-gray-600">
                Editing a status requires a reason and is flagged in the log.
              </p>
            </div>
            <div className="flex w-full flex-col gap-4 sm:max-w-lg sm:flex-row">
              <div className="w-full sm:max-w-[10rem]">
                <label
                  className="mb-2 block text-sm font-semibold text-gray-900"
                  htmlFor="role-filter"
                >
                  Role
                </label>
                <select
                  id="role-filter"
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All roles</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:max-w-sm">
                <label
                  className="mb-2 block text-sm font-semibold text-gray-900"
                  htmlFor="attendance-search"
                >
                  Search members
                </label>
                <input
                  id="attendance-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoster.map((member) => (
                  <tr key={member.userId} className="border-b border-gray-200">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-950">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.email}</p>
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-700">
                      {member.role}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={member.status} />
                        {member.flagged && (
                          <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
                            Flagged
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openEditModal(member)}
                        className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-100"
                      >
                        Edit attendance
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRoster.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-600">
                      No members match that search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm text-gray-600">
            Add an event to start recording attendance.
          </p>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-gray-950">Recent attendance edits</h2>
        <div className="mt-4 space-y-3">
          {recentLogs.map((log) => (
            <article
              key={log.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-gray-950">{log.memberName}</p>
                <time className="text-xs text-gray-600">
                  {formatCentralDate(log.createdAt)}
                </time>
              </div>
              <p className="mt-2 text-sm text-gray-800">
                {log.previousStatus ? (
                  <>
                    Changed from <span className="font-semibold capitalize">{log.previousStatus}</span>{" "}
                    to <span className="font-semibold capitalize">{log.newStatus}</span>
                  </>
                ) : (
                  <>
                    Recorded as <span className="font-semibold capitalize">{log.newStatus}</span>
                  </>
                )}
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-800">{log.reason}</p>
              <p className="mt-2 text-xs text-gray-600">
                Flagged edit by {log.editorName}
              </p>
            </article>
          ))}
          {recentLogs.length === 0 && (
            <p className="text-sm text-gray-600">
              No attendance edits have been logged for this event.
            </p>
          )}
        </div>
      </section>

      {editingMember && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEditModal();
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 text-black shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="attendance-dialog-title"
          >
            <h2
              id="attendance-dialog-title"
              className="text-2xl font-bold text-gray-950"
            >
              Edit attendance for {editingMember.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              This change is flagged as a manual edit and written to the
              audit log with your account and the reason below.
            </p>

            <label
              className="mb-2 mt-5 block text-sm font-semibold text-gray-900"
              htmlFor="attendance-status"
            >
              Status
            </label>
            <select
              id="attendance-status"
              value={newStatus}
              onChange={(event) => setNewStatus(event.target.value)}
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <label
              className="mb-2 mt-4 block text-sm font-semibold text-gray-900"
              htmlFor="attendance-reason"
            >
              Reason
            </label>
            <textarea
              id="attendance-reason"
              rows={4}
              maxLength={500}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={submitting}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-right text-xs text-gray-500">
              {reason.length}/500
            </p>

            {feedback && (
              <p className="mt-3 text-sm font-medium text-red-700" role="alert">
                {feedback}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={submitting}
                className="rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitAttendance}
                disabled={submitting || reason.trim().length < 5}
                className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {submitting ? "Saving..." : "Confirm change"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddEvent && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAddEvent();
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 text-black shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-event-dialog-title"
          >
            <h2 id="add-event-dialog-title" className="text-2xl font-bold text-gray-950">
              Add event
            </h2>

            <label
              className="mb-2 mt-5 block text-sm font-semibold text-gray-900"
              htmlFor="new-event-title"
            >
              Title
            </label>
            <input
              id="new-event-title"
              type="text"
              value={eventTitle}
              onChange={(event) => setEventTitle(event.target.value)}
              disabled={addingEvent}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <label
              className="mb-2 mt-4 block text-sm font-semibold text-gray-900"
              htmlFor="new-event-description"
            >
              Description
            </label>
            <textarea
              id="new-event-description"
              rows={3}
              maxLength={5000}
              value={eventDescription}
              onChange={(event) => setEventDescription(event.target.value)}
              disabled={addingEvent}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <label
              className="mb-2 mt-4 block text-sm font-semibold text-gray-900"
              htmlFor="new-event-location"
            >
              Location
            </label>
            <input
              id="new-event-location"
              type="text"
              value={eventLocation}
              onChange={(event) => setEventLocation(event.target.value)}
              disabled={addingEvent}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <label
              className="mb-2 mt-4 block text-sm font-semibold text-gray-900"
              htmlFor="new-event-type"
            >
              Event type
            </label>
            <select
              id="new-event-type"
              value={eventType}
              onChange={(event) => setEventType(event.target.value)}
              disabled={addingEvent}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {EVENT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>

            <label
              className="mb-2 mt-4 block text-sm font-semibold text-gray-900"
              htmlFor="new-event-start"
            >
              Start time
            </label>
            <input
              id="new-event-start"
              type="datetime-local"
              value={eventStart}
              onChange={(event) => setEventStart(event.target.value)}
              disabled={addingEvent}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <label
              className="mb-2 mt-4 block text-sm font-semibold text-gray-900"
              htmlFor="new-event-end"
            >
              End time
            </label>
            <input
              id="new-event-end"
              type="datetime-local"
              value={eventEnd}
              onChange={(event) => setEventEnd(event.target.value)}
              disabled={addingEvent}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            {addEventError && (
              <p className="mt-3 text-sm font-medium text-red-700" role="alert">
                {addEventError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeAddEvent}
                disabled={addingEvent}
                className="rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitAddEvent}
                disabled={addingEvent}
                className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {addingEvent ? "Adding..." : "Add event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
