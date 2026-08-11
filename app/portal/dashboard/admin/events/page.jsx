"use client";

import { useState } from "react";

const events = [
  {
    id: 1,
    title: "Brother Chapter",
    date: "August 26, 2026",
    time: "7:00 PM",
    location: "ECSW 1.315",
    going: 24,
    notGoing: 3,
    checkedIn: 18,
  },
  {
    id: 2,
    title: "Game Night Social",
    date: "September 2, 2026",
    time: "7:00 PM",
    location: "ECSW 2.315",
    going: 31,
    notGoing: 2,
    checkedIn: 0,
  },
];

const attendance = {
  1: [
    {
      id: 1,
      name: "Jiya Khurana",
      status: "Checked In",
    },
    {
      id: 2,
      name: "Pranay Chintakunta",
      status: "Checked In",
    },
    {
      id: 3,
      name: "Siri Kishore-Dola",
      status: "Not Checked In",
    },
  ],
  2: [
    {
      id: 1,
      name: "Jiya Khurana",
      status: "Not Checked In",
    },
    {
      id: 2,
      name: "Pranay Chintakunta",
      status: "Not Checked In",
    },
    {
      id: 3,
      name: "Siri Kishore-Dola",
      status: "Not Checked In",
    },
  ],
};

export default function AdminEventsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="text-sm font-semibold text-gray-500 hover:text-gray-950"
            >
              Cancel
            </button>
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
                      {event.going}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Not Going
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-950">
                      {event.notGoing}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Checked In
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-950">
                      {event.checkedIn}
                    </p>
                  </div>
                </div>

                <div className="mt-auto border-t border-gray-100 pt-6">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(event)}
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
                  {selectedEvent.date} • {selectedEvent.time}
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
                {selectedEvent.checkedIn} checked in
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {attendance[selectedEvent.id].map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                        member.status === "Checked In"
                          ? "bg-green-50 text-primary"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {member.status === "Checked In" ? "✓" : "○"}
                    </div>

                    <p className="text-sm font-semibold text-gray-900">
                      {member.name}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold ${
                      member.status === "Checked In"
                        ? "text-primary"
                        : "text-gray-500"
                    }`}
                  >
                    {member.status}
                  </span>
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