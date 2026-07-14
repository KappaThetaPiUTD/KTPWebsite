"use client";

import React, { useEffect, useState } from "react";

// A small celebratory banner that appears on the home page only when it is a
// brother's birthday today. Birthdays are managed in Supabase (see
// docs/BIRTHDAYS.md); this component just asks /api/birthdays who to celebrate.
//
// If nobody has a birthday today, the component renders nothing at all (no empty
// bar), and a visitor can dismiss it for the rest of their browser session.

// Turns a list of names into friendly text:
//   ["Alex"]                -> "Alex"
//   ["Alex", "Sam"]         -> "Alex and Sam"
//   ["Alex", "Sam", "Jyo"]  -> "Alex, Sam, and Jyo"
function formatNames(names) {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  const allButLast = names.slice(0, -1).join(", ");
  const last = names[names.length - 1];
  return `${allButLast}, and ${last}`;
}

// We remember a dismissal per calendar day, so closing it hides it for the rest
// of the session but it can still celebrate the next birthday another day.
const DISMISS_KEY = "ktpBirthdayBannerDismissedOn";
const todayKey = () => new Date().toDateString();

export default function BirthdayBanner() {
  const [names, setNames] = useState([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Respect a dismissal made earlier today.
    if (sessionStorage.getItem(DISMISS_KEY) === todayKey()) {
      setDismissed(true);
    }

    let isMounted = true;
    fetch("/api/birthdays")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data.map((b) => b.name) : [];
        setNames(list);
      })
      .catch(() => {
        // Ignore errors: the banner simply stays hidden.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, todayKey());
    setDismissed(true);
  };

  // Nothing to celebrate (or already dismissed): render nothing.
  if (dismissed || names.length === 0) return null;

  return (
    <div
      role="status"
      className="absolute top-28 left-1/2 z-40 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2"
    >
      <div className="flex items-center gap-3 rounded-full bg-primary px-5 py-3 text-white shadow-lg">
        <span className="text-xl" aria-hidden="true">
          🎉
        </span>
        <p className="flex-1 text-center text-sm font-medium sm:text-base">
          Happy Birthday, {formatNames(names)}! Wishing you a great day from all
          of KTP.
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss birthday announcement"
          className="text-lg leading-none text-white/80 transition-colors hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}
