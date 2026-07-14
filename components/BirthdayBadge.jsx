"use client";

import React, { useEffect, useState } from "react";

// Shows a small "Happy Birthday" ribbon on a member's card when today is their
// birthday. Drop <BirthdayBadge name={member.name} /> inside a card's image
// container (which is `position: relative`); it renders nothing on other days.
//
// Birthdays come from the same /api/birthdays endpoint the home page banner
// uses, so the person just needs a row in the Supabase "birthdays" table
// (see docs/BIRTHDAYS.md). Works for both the Brothers and Alumni pages.

// Compare names loosely so "Sam Paudel" matches regardless of case/spacing.
const normalize = (s) => String(s).toLowerCase().replace(/[^a-z]/g, "");

// Fetch today's birthdays only ONCE per page and share the result with every
// badge, so a roster of 40 cards makes a single request instead of 40.
let sharedBirthdayNames = null;
function getTodaysBirthdayNames() {
  if (!sharedBirthdayNames) {
    sharedBirthdayNames = fetch("/api/birthdays")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) =>
        new Set((Array.isArray(data) ? data : []).map((b) => normalize(b.name)))
      )
      .catch(() => new Set());
  }
  return sharedBirthdayNames;
}

export default function BirthdayBadge({ name }) {
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    let active = true;
    getTodaysBirthdayNames().then((names) => {
      if (active) setIsBirthday(names.has(normalize(name)));
    });
    return () => {
      active = false;
    };
  }, [name]);

  if (!isBirthday) return null;

  return (
    <>
      {/* Highlight ring around the whole card (never blocks the LinkedIn link). */}
      <div className="pointer-events-none absolute inset-0 z-10 rounded-lg ring-2 ring-primary" />
      {/* Ribbon across the top of the photo. */}
      <div className="absolute inset-x-0 top-0 z-10 bg-primary py-0.5 text-center text-[10px] font-semibold text-white sm:text-xs">
        🎂 Happy Birthday!
      </div>
    </>
  );
}
