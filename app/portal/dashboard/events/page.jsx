"use client";

import { useState } from "react";

const events = [
  {
    id: 1,
    title: "Brother Chapter",
    date: "August 26, 2026",
    time: "7:00 PM",
    location: "ECSW 1.315",
    description:
      "Join us for our chapter meeting, announcements, and upcoming plans.",
  },
  {
    id: 2,
    title: "Game Night Social",
    date: "September 2, 2026",
    time: "7:00 PM",
    location: "ECSW 2.315",
    description:
      "Come hang out with the brothers for a casual evening of food and games.",
  },
];

export default function EventsPage() {
  const [rsvps, setRsvps] = useState({});

  const handleRsvp = (eventId, status) => {
    setRsvps((current) => ({
      ...current,
      [eventId]: status,
    }));
  };

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

      <div className="mt-8 grid gap-6 md:grid-cols-2">
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
                      onClick={() => handleRsvp(event.id, "not-going")}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        rsvp === "not-going"
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
  );
}