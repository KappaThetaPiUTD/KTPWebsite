import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../lib/portal/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PASSCODE_PATTERN = /^\d{6}$/;

const EXPECTED_ERRORS = new Set([
  "Event not found.",
  "You are not eligible to check in to this event.",
  "Check-in is not open for this event.",
  "Invalid check-in code.",
]);

export async function POST(request) {
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

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const eventId = typeof body.eventId === "string" ? body.eventId.trim() : "";
  const passcode =
    typeof body.passcode === "string" ? body.passcode.trim() : "";

  if (!UUID_PATTERN.test(eventId) || !PASSCODE_PATTERN.test(passcode)) {
    return NextResponse.json(
      { error: "Enter the six-digit check-in code." },
      { status: 400 }
    );
  }

  const supabase = await getPortalServerClient();
  const { data, error } = await supabase
    .rpc("check_in_to_portal_event", {
      requested_event_id: eventId,
      requested_passcode: passcode,
    })
    .single();

  if (error || !data) {
    const message = error?.message;
    const knownError = EXPECTED_ERRORS.has(message);
    if (error && !knownError) {
      console.error("Portal check-in failed:", error);
    }
    return NextResponse.json(
      { error: knownError ? message : "Unable to complete check-in." },
      { status: knownError ? 400 : 500 }
    );
  }

  return NextResponse.json({
    attendance: {
      eventId,
      checkedInAt: data.checked_in_at,
      status: data.status,
    },
    alreadyCheckedIn: data.already_checked_in,
  });
}
