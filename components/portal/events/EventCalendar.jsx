"use client";

import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function EventCalendar({ events, rsvps }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");

  const calendarEvents = events.map((event) => {
    const start = parse(
      `${event.date} ${event.time}`,
      "MMMM d, yyyy h:mm a",
      new Date(),
    );
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    return {
      id: event.id,
      title:
        rsvps[event.id] === "going"
          ? `✓ ${event.title}`
          : event.title,
      start,
      end,
      isGoing: rsvps[event.id] === "going",
    };
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-950">
          Event Calendar
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          View upcoming chapter events and your RSVPs.
        </p>
      </div>

      <div className="h-[570px]">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day"]}
          view={currentView}
          onView={(view) => setCurrentView(view)}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          popup
          eventPropGetter={(event) => ({
            className: event.isGoing ? "ktp-calendar-going" : "",
          })}
        />
      </div>
    </div>
  );
}