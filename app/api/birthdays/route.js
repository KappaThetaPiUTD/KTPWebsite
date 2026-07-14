import { createClient } from "@supabase/supabase-js";

// This route returns the brothers whose birthday is TODAY, so the home page can
// show a celebratory banner. Birthdays are managed in a Supabase "birthdays"
// table (see docs/BIRTHDAYS.md) and we only store month + day, never the year,
// so nobody's age is published.
//
// We never cache this route, otherwise a birthday added today might not appear
// until tomorrow.
export const dynamic = "force-dynamic";

// Returns today's date in U.S. Central time as { month, day } (1-based month).
// The server clock runs in UTC, so we must convert to Central before comparing,
// otherwise late-evening visitors could see the wrong day's birthdays.
function getTodayInCentral() {
  // For en-US with only month/day, this formats as "M/D" (e.g. "7/13").
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    month: "numeric",
    day: "numeric",
  }).format(new Date());

  const [month, day] = formatted.split("/").map(Number);
  return { month, day };
}

// GET: the list of active birthdays that fall on today's date.
// Always responds 200 with an array (empty on any problem) so the banner simply
// stays hidden instead of ever breaking the home page.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return Response.json([], { status: 200 });
  }

  try {
    const { month, day } = getTodayInCentral();
    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from("birthdays")
      .select("id, name")
      .eq("is_active", true)
      .eq("birth_month", month)
      .eq("birth_day", day)
      .abortSignal(AbortSignal.timeout(2500));

    if (error || !Array.isArray(data)) {
      return Response.json([], { status: 200 });
    }
    return Response.json(data, { status: 200 });
  } catch {
    return Response.json([], { status: 200 });
  }
}
