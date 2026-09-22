import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../lib/portal/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  const context = await loadPortalMemberContext();

  if (!context.configured) {
    return NextResponse.json(
      { error: "Portal configuration is unavailable." },
      { status: 503 }
    );
  }

  if (!context.user) {
    return NextResponse.json(
      { error: "Sign in required." },
      { status: 401 }
    );
  }

  if (context.error || context.memberError) {
    return NextResponse.json(
      { error: "Unable to verify portal access." },
      { status: 503 }
    );
  }

  if (!context.authorized) {
    return NextResponse.json(
      { error: "Portal access denied." },
      { status: 403 }
    );
  }

  const supabase = await getPortalServerClient();

  const { data: events, error: eventsError } = await supabase
    .from("portal_events")
    .select(
      "id, title, description, location, start_time, end_time, event_type, capacity, rsvp_deadline, recurrence_series_id, is_check_in_open"
    )
    .order("start_time", { ascending: true });

  if (eventsError) {
    console.error("Portal events fetch failed:", eventsError);

    return NextResponse.json(
      { error: "Unable to load events." },
      { status: 500 }
    );
  }

  const { data: rsvps, error: rsvpsError } = await supabase
    .from("portal_rsvps")
    .select("event_id, user_id, status")
    .eq("user_id", context.user.id);

  if (rsvpsError) {
    console.error("Portal RSVP fetch failed:", rsvpsError);

    return NextResponse.json(
      { error: "Unable to load RSVP status." },
      { status: 500 }
    );
  }

  const { data: attendance, error: attendanceError } = await supabase
    .from("portal_attendance")
    .select("event_id, checked_in_at, status")
    .eq("user_id", context.user.id);

  if (attendanceError) {
    console.error("Portal attendance fetch failed:", attendanceError);

    return NextResponse.json(
      { error: "Unable to load check-in status." },
      { status: 500 }
    );
  }

  // Admins also receive aggregate counts for each event.
  let eventStats = {};

  if (context.isAdmin) {
    const { data: allRsvps, error: allRsvpsError } = await supabase
      .from("portal_rsvps")
      .select("event_id, status");

    if (allRsvpsError) {
      console.error("Portal admin RSVP fetch failed:", allRsvpsError);

      return NextResponse.json(
        { error: "Unable to load event RSVP counts." },
        { status: 500 }
      );
    }

    const { data: allAttendance, error: allAttendanceError } = await supabase
      .from("portal_attendance")
      .select("event_id");

    if (allAttendanceError) {
      console.error(
        "Portal admin attendance fetch failed:",
        allAttendanceError
      );

      return NextResponse.json(
        { error: "Unable to load event attendance counts." },
        { status: 500 }
      );
    }

    for (const event of events ?? []) {
      eventStats[event.id] = {
        goingCount: 0,
        maybeCount: 0,
        notGoingCount: 0,
        checkedInCount: 0,
      };
    }

    for (const rsvp of allRsvps ?? []) {
      if (!eventStats[rsvp.event_id]) continue;

      if (rsvp.status === "going") {
        eventStats[rsvp.event_id].goingCount += 1;
      }

      if (rsvp.status === "maybe") {
        eventStats[rsvp.event_id].maybeCount += 1;
      }

      if (rsvp.status === "not_going") {
        eventStats[rsvp.event_id].notGoingCount += 1;
      }
    }

    for (const record of allAttendance ?? []) {
      if (!eventStats[record.event_id]) continue;

      eventStats[record.event_id].checkedInCount += 1;
    }
  }

  const eventsWithStats = (events ?? []).map((event) => ({
    ...event,
    ...(eventStats[event.id] || {
      goingCount: 0,
      maybeCount: 0,
      notGoingCount: 0,
      checkedInCount: 0,
    }),
  }));

  // The calendar deliberately receives every event. Keep the cards' eligibility
  // decision on the server so it agrees with RSVP enforcement and does not
  // depend on a member's device clock or local timezone.
  const now = Date.now();
  const activeEventIds = eventsWithStats
    .filter((event) => {
      const startTime = new Date(event.start_time).getTime();
      const endTime = new Date(event.end_time).getTime();
      const deadline = new Date(event.rsvp_deadline || event.start_time).getTime();

      return startTime > now && endTime > now && deadline > now;
    })
    .map((event) => event.id);

  return NextResponse.json(
    {
      events: eventsWithStats,
      activeEventIds,
      rsvps: rsvps ?? [],
      attendance: attendance ?? [],
    },
    { headers: NO_STORE_HEADERS }
  );
}
