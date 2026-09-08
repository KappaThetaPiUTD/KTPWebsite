import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../lib/portal/server";

const VALID_STATUSES = ["present", "absent", "excused", "unexcused", "late"];
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

// Attendance rows are created by check-in (QR or manual, see portal_events /
// portal_attendance). This endpoint only handles an admin correcting the
// status afterward. Every correction is flagged on the row and appended to
// portal_attendance_logs with the previous/new status, the reason, and the
// editing admin.
export async function PATCH(request) {
  const { context, error } = await requireAdmin();
  if (error) return error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const attendanceId =
    typeof body.attendanceId === "string" ? body.attendanceId.trim() : "";
  const status = typeof body.status === "string" ? body.status.trim() : "";
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";

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
      "id, event_id, user_id, checked_in_at, method, status, checked_in_by, verified_by, flagged"
    )
    .single();

  if (updateError) {
    console.error("Portal attendance update failed:", updateError);
    return NextResponse.json(
      { error: "Unable to update attendance." },
      { status: 500 }
    );
  }

  const { data: log, error: logError } = await supabase
    .from("portal_attendance_logs")
    .insert({
      attendance_id: attendance.id,
      previous_status: existing.status,
      new_status: status,
      reason,
      edited_by: context.user.id,
    })
    .select("id, previous_status, new_status, reason, edited_by, created_at")
    .single();

  if (logError) {
    console.error("Portal attendance log insert failed:", logError);
    return NextResponse.json(
      { error: "Attendance saved, but the audit log entry failed." },
      { status: 500 }
    );
  }

  return NextResponse.json({ attendance, log }, { status: 200 });
}
