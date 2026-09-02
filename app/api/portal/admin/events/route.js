import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../lib/portal/server";

const EVENT_TYPES = ["chapter", "professional", "fundraiser", "social", "other"];

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
  const eventType =
    typeof body.eventType === "string" && body.eventType.trim()
      ? body.eventType.trim()
      : "chapter";

  if (!EVENT_TYPES.includes(eventType)) {
    return NextResponse.json({ error: "Invalid event type." }, { status: 400 });
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

  const supabase = getPortalServerClient();
  const { data, error: insertError } = await supabase
    .from("portal_events")
    .insert({
      title,
      description,
      location,
      start_time: parsedStart.toISOString(),
      end_time: parsedEnd.toISOString(),
      event_type: eventType,
      created_by: context.user.id,
    })
    .select("id, title, location, start_time, end_time, event_type, created_at")
    .single();

  if (insertError) {
    console.error("Portal event insert failed:", insertError);
    return NextResponse.json(
      { error: "Unable to create event." },
      { status: 500 }
    );
  }

  return NextResponse.json({ event: data }, { status: 201 });
}
