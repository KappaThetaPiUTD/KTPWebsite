import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../lib/portal/server";

const VALID_STATUSES = [
  "present",
  "absent",
  "excused",
  "unexcused",
  "late",
];

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

// Attendance rows are created by check-in (QR or manual).
// This endpoint allows an admin to view attendance and correct
// an attendance status afterward.
async function attachProfileNames(supabase, attendance) {
  if (!attendance || attendance.length === 0) {
    return attendance || [];
  }

  const userIds = [...new Set(attendance.map((record) => record.user_id))];

  const { data: profiles, error: profilesError } = await supabase
    .from("portal_profiles")
    .select("user_id, full_name")
    .in("user_id", userIds);

  if (profilesError) {
    throw profilesError;
  }

  const profileMap = Object.fromEntries(
    (profiles || []).map((profile) => [
      profile.user_id,
      profile.full_name,
    ])
  );

  return attendance.map((record) => ({
    ...record,
    full_name: profileMap[record.user_id] || null,
  }));
}

export async function GET(request) {
  const { error } = await requireAdmin();

  if (error) return error;

  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId")?.trim() || "";

  if (!UUID_PATTERN.test(eventId)) {
    return NextResponse.json(
      { error: "Invalid event." },
      { status: 400 }
    );
  }

  const supabase = await getPortalServerClient();

  const { data, error: attendanceError } = await supabase
    .from("portal_attendance")
    .select(
      "id, event_id, user_id, checked_in_at, method, status, checked_in_by, verified_by, flagged, updated_at"
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

  try {
    const attendance = await attachProfileNames(supabase, data);

    return NextResponse.json(
      { attendance },
      { status: 200 }
    );
  } catch (profilesError) {
    console.error(
      "Portal profile fetch failed:",
      profilesError
    );

    return NextResponse.json(
      { error: "Unable to fetch member names." },
      { status: 500 }
    );
  }
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

  const reason =
    typeof body.reason === "string"
      ? body.reason.trim()
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

  if (reason.length < 5 || reason.length > 500) {
    return NextResponse.json(
      { error: "Use a reason between 5 and 500 characters." },
      { status: 400 }
    );
  }

  const supabase = await getPortalServerClient();

  const { data: existing, error: existingError } = await supabase
    .from("portal_attendance")
    .select("id, status")
    .eq("id", attendanceId)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json(
      { error: "Unable to load the current attendance record." },
      { status: 500 }
    );
  }

  if (!existing) {
    return NextResponse.json(
      { error: "The selected attendance record was not found." },
      { status: 404 }
    );
  }

  if (existing.status === status) {
    return NextResponse.json(
      { error: "That member already has this attendance status." },
      { status: 400 }
    );
  }

  const { data: attendance, error: updateError } = await supabase
    .from("portal_attendance")
    .update({
      status,
      flagged: true,
      verified_by: context.user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", attendanceId)
    .select(
      "id, event_id, user_id, checked_in_at, method, status, checked_in_by, verified_by, flagged, updated_at"
    )
    .single();

  if (updateError) {
    console.error(
      "Portal attendance update failed:",
      updateError
    );

    return NextResponse.json(
      { error: "Unable to update attendance." },
      { status: 500 }
    );
  }

  const { error: logError } = await supabase
    .from("portal_attendance_logs")
    .insert({
      attendance_id: attendance.id,
      previous_status: existing.status,
      new_status: status,
      reason,
      edited_by: context.user.id,
    });

  if (logError) {
    console.error("Portal attendance log insert failed:", logError);

    return NextResponse.json(
      { error: "Attendance saved, but the audit log entry failed." },
      { status: 500 }
    );
  }

  try {
    const [attendanceWithProfile] = await attachProfileNames(
      supabase,
      [attendance]
    );

    return NextResponse.json(
      { attendance: attendanceWithProfile },
      { status: 200 }
    );
  } catch (profilesError) {
    console.error(
      "Portal profile fetch failed:",
      profilesError
    );
  }

  return NextResponse.json(
    { attendance },
    { status: 200 }
  );
}
