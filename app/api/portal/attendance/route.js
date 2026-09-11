import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../lib/portal/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request) {
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

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const eventId =
    typeof body.eventId === "string"
      ? body.eventId.trim()
      : "";

  if (!UUID_PATTERN.test(eventId)) {
    return NextResponse.json(
      { error: "Invalid event." },
      { status: 400 }
    );
  }

  const supabase = getPortalServerClient();

  const { data: event, error: eventError } = await supabase
    .from("portal_events")
    .select(
      "id, title, start_time, end_time, late_threshold_minutes, is_check_in_open"
    )
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    return NextResponse.json(
      { error: "Event not found." },
      { status: 404 }
    );
  }

  if (!event.is_check_in_open) {
    return NextResponse.json(
      { error: "Check-in is not currently open." },
      { status: 400 }
    );
  }

  const checkedInAt = new Date();

  const lateThresholdMs =
    event.late_threshold_minutes * 60 * 1000;

  const lateAt =
    new Date(event.start_time).getTime() + lateThresholdMs;

  const status =
    checkedInAt.getTime() > lateAt
      ? "late"
      : "present";

  const { data: attendance, error: attendanceError } = await supabase
    .from("portal_attendance")
    .insert({
      event_id: event.id,
      user_id: context.user.id,
      checked_in_at: checkedInAt.toISOString(),
      status,
      method: "qr",
      checked_in_by: context.user.id,
    })
    .select(
      "id, event_id, user_id, checked_in_at, status, method, checked_in_by, verified_by, updated_at"
    )
    .single();

  if (attendanceError) {
    if (attendanceError.code === "23505") {
      return NextResponse.json(
        { error: "You are already checked in to this event." },
        { status: 409 }
      );
    }

    console.error(
      "Portal attendance check-in failed:",
      attendanceError
    );

    return NextResponse.json(
      { error: "Unable to record attendance." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { attendance },
    { status: 201 }
  );
}