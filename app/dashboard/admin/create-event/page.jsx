"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function AdminCreateEventPage() {
  const [repeat, setRepeat] = useState("None");
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      setUser(auth?.user ?? null);
      const { data } = await supabase
        .from("events")
        .select("id, event_name")
        .order("event_name");
      setEvents(data || []);
    })();
  }, []);

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3 text-primary">Create Event</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const title = e.target.title.value.trim();
          const description = e.target.description.value.trim();
          const date = e.target.date.value;
          const time = e.target.time.value;
          const repeatOption = e.target.repeat.value;
          const repeatStart = e.target.repeatStart?.value;
          const repeatEnd = e.target.repeatEnd?.value;
          const visibility = e.target.visibility.value;

          if (
            !title ||
            !description ||
            !date ||
            !time ||
            !repeatOption ||
            !visibility
          ) {
            alert("Please fill out all fields.");
            return;
          }

          const eventDate = new Date(`${date}T${time}`);
          if (repeatOption !== "None") {
            if (!repeatStart || !repeatEnd) {
              alert("Please provide both repeat start and end dates.");
              return;
            }

            const repeatStartDate = new Date(repeatStart);
            const repeatEndDate = new Date(repeatEnd);

            const normalizeDate = (date) => {
              const normalized = new Date(date);
              normalized.setHours(0, 0, 0, 0);
              return normalized;
            };

            const normalizedEventDate = normalizeDate(eventDate);
            const normalizedRepeatStartDate = normalizeDate(repeatStartDate);
            const normalizedRepeatEndDate = normalizeDate(repeatEndDate);

            if (
              normalizedRepeatStartDate < normalizedEventDate ||
              normalizedRepeatEndDate < normalizedEventDate
            ) {
              alert(
                "Repeat start and end dates cannot be before the initial event date."
              );
              return;
            }
          }

          const { error: createError, data: createdEvent } = await supabase
            .from("events")
            .insert([
              {
                event_name: title,
                description,
                event_date: eventDate,
                repeat: repeatOption,
                repeat_start: repeatOption !== "None" ? repeatStart : null,
                repeat_end: repeatOption !== "None" ? repeatEnd : null,
                visibility,
                created_by: user?.id,
                created_by_email: user?.email || null,
              },
            ])
            .select();

          if (createError) {
            alert("Error creating event: " + createError.message);
            return;
          }

          // Automatically RSVP the creator for the main event
          const { data: existingRSVP, error: fetchRSVPError } = await supabase
            .from("rsvps")
            .select("*")
            .eq("event_id", createdEvent[0].id)
            .eq("user_id", user?.id)
            .single();

          if (fetchRSVPError && fetchRSVPError.code !== "PGRST116") {
            // Handle unexpected errors (PGRST116 means no rows found, which is fine)
            alert("Error checking existing RSVP: " + fetchRSVPError.message);
            return;
          }

          if (!existingRSVP) {
            const { error: rsvpError } = await supabase.from("rsvps").insert([
              {
                event_id: createdEvent[0].id,
                user_id: user?.id,
                response: "going",
              },
            ]);

            if (rsvpError) {
              alert("Error RSVPing for the main event: " + rsvpError.message);
              return;
            }
          }

          if (repeatOption !== "None") {
            const repeatStartDate = new Date(repeatStart);
            const repeatEndDate = new Date(repeatEnd);
            const clonedEvents = [];
            const repeatInterval =
              repeatOption === "Daily" ? 1 : repeatOption === "Weekly" ? 7 : 30; // Approximation for monthly

            let currentDate = new Date(repeatStartDate);
            while (currentDate <= repeatEndDate) {
              if (currentDate > eventDate) {
                const repeatDescription = `${description} (Repeats every ${
                  repeatOption === "Daily"
                    ? "day"
                    : repeatOption === "Weekly"
                    ? eventDate.toLocaleString("en-US", {
                        weekday: "long",
                      })
                    : `${eventDate.getDate()}th of the month`
                } at ${eventDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })})`;

                clonedEvents.push({
                  event_name: title,
                  description: repeatDescription,
                  event_date: new Date(currentDate),
                  repeat: repeatOption,
                  repeat_start: repeatOption !== "None" ? repeatStart : null,
                  repeat_end: repeatOption !== "None" ? repeatEnd : null,
                  visibility,
                  created_by: user?.id,
                  created_by_email: user?.email || null,
                });
              }

              currentDate.setDate(currentDate.getDate() + repeatInterval);
            }

            const { error: cloneError, data: clonedEventData } = await supabase
              .from("events")
              .insert(clonedEvents)
              .select();

            if (cloneError) {
              alert("Error creating repeating events: " + cloneError.message);
              return;
            }

            // Automatically RSVP the creator for all repeating events
            const rsvpEntries = clonedEventData.map((event) => ({
              event_id: event.id,
              user_id: user?.id,
              response: "going",
            }));

            const { error: rsvpRepeatsError } = await supabase
              .from("rsvps")
              .insert(rsvpEntries);

            if (rsvpRepeatsError) {
              alert(
                "Error RSVPing for repeating events: " +
                  rsvpRepeatsError.message
              );
              return;
            }
          }

          alert("Event created successfully!");
          e.target.reset();
          setRepeat("None");
        }}
        className="max-w-xl bg-gray-50 border border-gray-300 rounded-xl p-6 mx-auto"
      >
        <div className="mb-4">
          <label className="block font-medium mb-1">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            name="title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            name="description"
            required
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">
            Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            name="date"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">
            Time <span className="text-red-600">*</span>
          </label>
          <input
            type="time"
            name="time"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        {/* Visibility */}
        <div className="mb-4">
          <label className="block font-medium mb-1">
            Who can see this event? <span className="text-red-600">*</span>
          </label>
          <select
            name="visibility"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">Select visibility...</option>
            <option value="brothers_and_pledges">Brothers and Pledges</option>
            <option value="brothers_only">Brothers Only</option>
            <option value="pledges_only">Pledges Only</option>
          </select>
          <p className="text-xs text-gray-600 mt-1">
            Executive members can always see all events.
          </p>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">
            Repeat <span className="text-red-600">*</span>
          </label>
          <select
            name="repeat"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
          >
            <option value="None">None</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        {repeat !== "None" && (
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Repeat Start Date
              </label>
              <input
                type="date"
                name="repeatStart"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Repeat End Date</label>
              <input
                type="date"
                name="repeatEnd"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
        >
          Add Event
        </button>
      </form>
    </section>
  );
}
