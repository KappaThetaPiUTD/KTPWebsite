import { createClient } from "@supabase/supabase-js";

// Fetches upcoming, active events from the Supabase "events" table and formats
// them for injection into the chatbot's context, so the assistant can answer
// questions like "what events are coming up?" with the real, current schedule.
//
// Degrades gracefully: if the env vars, project, or table are unavailable it
// returns an empty string (serving a stale cache if one exists) so the chat
// route never breaks. Results are cached briefly to limit DB calls.

let cache = { at: 0, text: null };
const TTL_MS = 5 * 60 * 1000; // 5 minutes
const TZ = "America/Chicago";
const HEADER =
  "Upcoming KTP events (use these to answer questions about events; if the list says none are scheduled, tell the user there are no events on the calendar right now and point them to @utdktp on Instagram):\n";

function formatWhen(iso) {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString("en-US", {
      timeZone: TZ,
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const time = d.toLocaleTimeString("en-US", {
      timeZone: TZ,
      hour: "numeric",
      minute: "2-digit",
    });
    return `${date} at ${time}`;
  } catch {
    return "";
  }
}

function formatEvent(e) {
  let line = `- ${e.title}`;
  const when = formatWhen(e.event_date);
  if (when) line += ` (${when})`;
  if (e.location) line += `, ${e.location}`;
  if (e.description) line += `. ${e.description}`;
  if (e.rsvp_url) line += ` RSVP: ${e.rsvp_url}`;
  return line;
}

export async function getEvents() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return "";

  if (cache.text !== null && Date.now() - cache.at < TTL_MS) {
    return cache.text;
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("events")
      .select("title, description, location, event_date, rsvp_url")
      .eq("is_active", true)
      .gte("event_date", new Date().toISOString())
      .order("event_date", { ascending: true })
      .limit(20)
      .abortSignal(AbortSignal.timeout(2500));

    if (error || !Array.isArray(data)) {
      return cache.text || "";
    }

    const text =
      data.length === 0
        ? HEADER + "- (No events are currently scheduled.)"
        : HEADER + data.map(formatEvent).join("\n");

    cache = { at: Date.now(), text };
    return text;
  } catch {
    return cache.text || "";
  }
}
