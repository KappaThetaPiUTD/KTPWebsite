import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../lib/portal/server";

export async function GET() {
  const context = await loadPortalMemberContext();

  if (!context.configured) {
    return NextResponse.json(
      { error: "Portal configuration is unavailable." },
      { status: 503 }
    );
  }
  if (!context.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (context.error || context.memberError) {
    return NextResponse.json(
      { error: "Unable to verify portal access." },
      { status: 503 }
    );
  }
  if (!context.authorized) {
    return NextResponse.json({ error: "Portal access denied." }, { status: 403 });
  }

  const supabase = getPortalServerClient();
  const { data: events, error: eventsError } = await supabase
    .from("portal_events")
    .select(
      "id, title, description, location, start_time, end_time, event_type, capacity, rsvp_deadline, is_check_in_open"
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
    .select("event_id, status")
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

  return NextResponse.json({
    events: events ?? [],
    rsvps: rsvps ?? [],
    attendance: attendance ?? [],
  });
}
