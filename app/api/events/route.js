import { createClient } from "@supabase/supabase-js";

// Always fetch fresh so newly added events show up without a redeploy.
export const dynamic = "force-dynamic";

// GET: upcoming, active events (managed via the Supabase "events" table).
// Degrades gracefully: on any error it returns an empty list with status 200
// so the recruitment page simply hides the events section instead of breaking.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return Response.json([], { status: 200 });
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("events")
      .select("id, title, description, location, event_date, rsvp_url")
      .eq("is_active", true)
      .gte("event_date", new Date().toISOString())
      .order("event_date", { ascending: true })
      .abortSignal(AbortSignal.timeout(2500));

    if (error || !Array.isArray(data)) {
      return Response.json([], { status: 200 });
    }
    return Response.json(data, { status: 200 });
  } catch {
    return Response.json([], { status: 200 });
  }
}
