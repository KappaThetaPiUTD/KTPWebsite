import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../lib/portal/server";

const EVENT_TYPES = ["chapter", "professional", "fundraiser", "social", "workshop", "study_hours", "other"];
const TARGET_ROLES = ["brother", "pledge"];
const RECURRENCE_TYPES = ["none", "weekly", "monthly"];
const DELETE_SCOPES = ["occurrence", "series"];
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function nextMonthlyOccurrence(value) {
  const next = new Date(value);
  const day = next.getUTCDate();
  next.setUTCDate(1);
  next.setUTCMonth(next.getUTCMonth() + 1);
  const lastDay = new Date(
    Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)
  ).getUTCDate();
  next.setUTCDate(Math.min(day, lastDay));
  return next;
}

async function requireAdmin() {
  const context = await loadPortalMemberContext();

  if (!context.user) {
    return {
      error: NextResponse.json({ error: "Sign in required." }, { status: 401 }),
    };
  }
  if (context.error || context.memberError) {
    return {
      error: NextResponse.json(
        { error: "Unable to verify admin access." },
        { status: 503 }
      ),
    };
  }
  if (!context.isAdmin) {
    return {
      error: NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      ),
    };
  }

  return { context };
}

export async function POST(request) {
  const { context, error } = await requireAdmin();
  if (error) return error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const location =
    typeof body.location === "string" ? body.location.trim() : "";
  const startTime =
    typeof body.startTime === "string" ? body.startTime.trim() : "";
  const endTime = typeof body.endTime === "string" ? body.endTime.trim() : "";
  const capacity =
    body.capacity === null || body.capacity === undefined || body.capacity === ""
    ? null
    : Number(body.capacity);

  const checkInPasscode =
    typeof body.checkInPasscode === "string"
    ? body.checkInPasscode.trim()
    : "";
  const checkInPasscodeEnabled = body.checkInPasscodeEnabled === true;
  const checkInOpen = body.checkInOpen === true;
  const recurrence = typeof body.recurrence === "string" ? body.recurrence : "none";
  const recurrenceEnd = typeof body.recurrenceEnd === "string" ? body.recurrenceEnd : "";
  const eventType =
    typeof body.eventType === "string" && body.eventType.trim()
      ? body.eventType.trim()
      : "chapter";
  const targetRoles = Array.isArray(body.targetRoles)
    ? [...new Set(body.targetRoles.filter((role) => typeof role === "string"))]
    : null;

  if (!EVENT_TYPES.includes(eventType)) {
    return NextResponse.json({ error: "Invalid event type." }, { status: 400 });
  }
  if (targetRoles && (!targetRoles.length || targetRoles.some((role) => !TARGET_ROLES.includes(role)))) {
    return NextResponse.json({ error: "Choose at least one valid event audience." }, { status: 400 });
  }
  if (!RECURRENCE_TYPES.includes(recurrence)) {
    return NextResponse.json({ error: "Invalid recurrence setting." }, { status: 400 });
  }
  if (
    capacity !== null &&
    (!Number.isInteger(capacity) || capacity <= 0)
  ) {
    return NextResponse.json(
      { error: "Capacity must be a positive whole number." },
      { status: 400 }
    );
  }

  if (checkInPasscodeEnabled && !/^\d{6}$/.test(checkInPasscode)) {
    return NextResponse.json(
      { error: "Check-in passcode must be exactly 6 digits." },
      { status: 400 }
    );
  }
  if (title.length < 2 || title.length > 200) {
    return NextResponse.json(
      { error: "Use a title between 2 and 200 characters." },
      { status: 400 }
    );
  }
  if (description.length < 5 || description.length > 5000) {
    return NextResponse.json(
      { error: "Use a description between 5 and 5000 characters." },
      { status: 400 }
    );
  }
  if (location.length < 2 || location.length > 200) {
    return NextResponse.json(
      { error: "Use a location between 2 and 200 characters." },
      { status: 400 }
    );
  }
  const parsedStart = new Date(startTime);
  const parsedEnd = new Date(endTime);
  if (!startTime || Number.isNaN(parsedStart.getTime())) {
    return NextResponse.json(
      { error: "Enter a valid start time." },
      { status: 400 }
    );
  }
  if (!endTime || Number.isNaN(parsedEnd.getTime())) {
    return NextResponse.json(
      { error: "Enter a valid end time." },
      { status: 400 }
    );
  }
  if (parsedEnd.getTime() <= parsedStart.getTime()) {
    return NextResponse.json(
      { error: "End time must be after start time." },
      { status: 400 }
    );
  }

  const occurrenceStarts = [parsedStart];
  if (recurrence !== "none") {
    const parsedRecurrenceEnd = new Date(`${recurrenceEnd}T23:59:59`);
    if (!recurrenceEnd || Number.isNaN(parsedRecurrenceEnd.getTime()) || parsedRecurrenceEnd < parsedStart) {
      return NextResponse.json({ error: "Choose a recurrence end date after the first event." }, { status: 400 });
    }
    let nextStart = new Date(parsedStart);
    while (true) {
      if (recurrence === "weekly") nextStart.setUTCDate(nextStart.getUTCDate() + 7);
      else nextStart = nextMonthlyOccurrence(nextStart);
      if (nextStart > parsedRecurrenceEnd) break;
      occurrenceStarts.push(new Date(nextStart));
      if (occurrenceStarts.length > 104) {
        return NextResponse.json({ error: "A recurring event may have at most 104 occurrences." }, { status: 400 });
      }
    }
  }

  const supabase = await getPortalServerClient();
  const duration = parsedEnd.getTime() - parsedStart.getTime();
  const recurrenceSeriesId =
    recurrence === "none" ? null : crypto.randomUUID();
  const { data, error: insertError } = await supabase
    .from("portal_events")
    .insert(occurrenceStarts.map((occurrenceStart) => ({
      title,
      description,
      location,
      start_time: occurrenceStart.toISOString(),
      end_time: new Date(occurrenceStart.getTime() + duration).toISOString(),
      event_type: eventType,
      target_roles: targetRoles,
      capacity,
      recurrence_series_id: recurrenceSeriesId,
      check_in_passcode_enabled: checkInPasscodeEnabled,
      check_in_passcode: checkInPasscodeEnabled ? checkInPasscode : null,
      is_check_in_open: checkInOpen,
      created_by: context.user.id,
    })))
    .select(
      "id, title, description, location, start_time, end_time, event_type, target_roles, capacity, recurrence_series_id, is_check_in_open, created_at"
    )

    ;

  if (insertError) {
    console.error("Portal event insert failed:", insertError);
    return NextResponse.json(
      { error: "Unable to create event." },
      { status: 500 }
    );
  }

  return NextResponse.json({ event: data?.[0], events: data || [] }, { status: 201 });
}

export async function PATCH(request) {
  const { error } = await requireAdmin();
  if (error) return error;
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const eventId = typeof body.eventId === "string" ? body.eventId.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  if (!UUID_PATTERN.test(eventId)) return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  if (title.length < 2 || title.length > 200 || description.length < 5 || description.length > 5000 || location.length < 2 || location.length > 200) {
    return NextResponse.json({ error: "Use a valid title, description, and location." }, { status: 400 });
  }
  const supabase = await getPortalServerClient();
  const { data, error: updateError } = await supabase.from("portal_events").update({ title, description, location }).eq("id", eventId).select("id, title, description, location, start_time, end_time, event_type, capacity, is_check_in_open").single();
  if (updateError || !data) return NextResponse.json({ error: "Unable to update event." }, { status: 500 });
  return NextResponse.json({ event: data });
}

export async function DELETE(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const eventId = typeof body.eventId === "string" ? body.eventId.trim() : "";
  const scope = typeof body.scope === "string" ? body.scope : "occurrence";
  if (!UUID_PATTERN.test(eventId)) {
    return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  }
  if (!DELETE_SCOPES.includes(scope)) {
    return NextResponse.json({ error: "Invalid deletion scope." }, { status: 400 });
  }

  const supabase = await getPortalServerClient();
  const { data: event, error: eventError } = await supabase
    .from("portal_events")
    .select("id, recurrence_series_id")
    .eq("id", eventId)
    .maybeSingle();

  if (eventError) {
    console.error("Portal event lookup failed:", eventError);
    return NextResponse.json({ error: "Unable to delete event." }, { status: 500 });
  }
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }
  if (scope === "series" && !event.recurrence_series_id) {
    return NextResponse.json(
      { error: "This event is not part of a recurring series." },
      { status: 400 }
    );
  }

  let deleteQuery = supabase.from("portal_events").delete();
  deleteQuery = scope === "series"
    ? deleteQuery.eq("recurrence_series_id", event.recurrence_series_id)
    : deleteQuery.eq("id", eventId);
  const { data: deletedEvents, error: deleteError } = await deleteQuery.select("id");

  if (deleteError) {
    if (deleteError.code === "23503") {
      return NextResponse.json(
        { error: "This event has activity-hour submissions and cannot be deleted." },
        { status: 409 }
      );
    }
    console.error("Portal event deletion failed:", deleteError);
    return NextResponse.json({ error: "Unable to delete event." }, { status: 500 });
  }
  if (!deletedEvents?.length) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  return NextResponse.json({
    deletedEventId: eventId,
    deletedEventIds: deletedEvents.map((deletedEvent) => deletedEvent.id),
  });
}
