import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../lib/portal/server";

const VALID_STATUSES = ["present", "excused", "unexcused", "late"];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function requireAdmin() {
  const context = await loadPortalMemberContext();

  if (!context.user) {
    return {
      error: NextResponse.json(
        { error: "Sign in required." },
        { status: 401 }
      ),
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

export async function GET(request) {
  const { context, error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId")?.trim() || "";

  if (!UUID_PATTERN.test(eventId)) {
    return NextResponse.json(
      { error: "Invalid event." },
      { status: 400 }
    );
  }

  const supabase = getPortalServerClient();

  const { data, error: attendanceError } = await supabase
    .from("portal_attendance")
    .select(
      "id, event_id, user_id, checked_in_at, method, status, checked_in_by, verified_by, updated_at"
    )
    .eq("event_id", eventId)
    .order("checked_in_at", { ascending: true });

  if (attendanceError) {
    console.error(
      "Portal attendance fetch failed:",
      attendanceError
    );

    return NextResponse.json(
      { error: "Unable to fetch attendance." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { attendance: data },
    { status: 200 }
  );
}

export async function PATCH(request) {
  const { context, error } = await requireAdmin();
  if (error) return error;

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const attendanceId =
    typeof body.attendanceId === "string"
      ? body.attendanceId.trim()
      : "";

  const status =
    typeof body.status === "string"
      ? body.status.trim()
      : "";

  if (!UUID_PATTERN.test(attendanceId)) {
    return NextResponse.json(
      { error: "Invalid attendance record." },
      { status: 400 }
    );
  }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "Invalid attendance status." },
      { status: 400 }
    );
  }

  const supabase = getPortalServerClient();

  const { data, error: updateError } = await supabase
    .from("portal_attendance")
    .update({
      status,
      verified_by: context.user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", attendanceId)
    .select(
      "id, event_id, user_id, checked_in_at, method, status, checked_in_by, verified_by, updated_at"
    )
    .single();

  if (updateError) {
    console.error("Portal attendance update failed:", updateError);

    return NextResponse.json(
      { error: "Unable to update attendance." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { attendance: data },
    { status: 200 }
  );
}
