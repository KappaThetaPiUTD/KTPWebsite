'use client';

import React, { useEffect, useState } from 'react';
import { trackEvent } from '../lib/analytics';

// Show times in Central so an event entered as "7 PM" reads the same for
// everyone, regardless of the visitor's own timezone.
const TZ = 'America/Chicago';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      timeZone: TZ,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      timeZone: TZ,
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

// Read-only list of upcoming events, managed entirely from the Supabase
// "events" table (no code changes or redeploy needed to add one). The whole
// section hides itself while loading or when there are no upcoming events.
export default function EventsSection() {
  const [events, setEvents] = useState(null); // null = loading, [] = none

  useEffect(() => {
    let active = true;
    fetch('/api/events')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (active) setEvents(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setEvents([]);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!events || events.length === 0) return null;

  const handleRSVP = (e) => {
    if (!e.rsvp_url) return;
    trackEvent('event_rsvp', { event_title: e.title });
    window.open(e.rsvp_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="w-full max-w-5xl mb-12">
      <h2 className="text-primary text-[24px] sm:text-[28px] md:text-header2 font-bold font-poppins text-center mb-6">
        Upcoming Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((e) => {
          const time = formatTime(e.event_date);
          return (
            <div
              key={e.id}
              className="rounded-lg border border-gray-200 p-5 bg-white shadow-sm flex flex-col"
            >
              <div className="text-sm font-semibold text-primary">
                {formatDate(e.event_date)}
                {time ? ` \u00b7 ${time}` : ''}
              </div>
              <div className="text-lg font-bold text-black mt-1">{e.title}</div>
              {e.location ? (
                <div className="text-sm text-gray-700 mt-1">{e.location}</div>
              ) : null}
              {e.description ? (
                <p className="text-sm text-gray-600 mt-2 flex-1">
                  {e.description}
                </p>
              ) : null}
              {e.rsvp_url ? (
                <button
                  onClick={() => handleRSVP(e)}
                  className="mt-4 inline-flex items-center justify-center rounded-md bg-primary text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  RSVP
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
