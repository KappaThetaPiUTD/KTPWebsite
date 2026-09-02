import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../lib/portal/server";

const STATUSES = ["present", "absent", "excused", "unexcused"];
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

// Every admin write here is a manual correction (there is no automated
// check-in source yet), so both new records and edits are flagged and
// logged with the previous/new status, the reason, and the editing admin.
export async function POST(request) {
  const { context, error } = await requireAdmin();
  if (error) return error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const eventId = typeof body.eventId === "string" ? body.eventId.trim() : "";
  const memberUserId =
    typeof body.memberUserId === "string" ? body.memberUserId.trim() : "";
  const status = typeof body.status === "string" ? body.status : "";
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";

  if (!UUID_PATTERN.test(eventId)) {
    return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  }
  if (!UUID_PATTERN.test(memberUserId)) {
    return NextResponse.json({ error: "Invalid member." }, { status: 400 });
  }
  if (!STATUSES.includes(status)) {
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

  const supabase = getPortalServerClient();

  const { data: event, error: eventError } = await supabase
    .from("portal_events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();
  if (eventError) {
    return NextResponse.json(
      { error: "Unable to verify the event." },
      { status: 500 }
    );
  }
  if (!event) {
    return NextResponse.json(
      { error: "The selected event was not found." },
      { status: 404 }
    );
  }

  const { data: member, error: memberError } = await supabase
    .from("portal_members")
    .select("user_id")
    .eq("user_id", memberUserId)
    .eq("status", "active")
    .maybeSingle();
  if (memberError) {
    return NextResponse.json(
      { error: "Unable to verify the selected member." },
      { status: 500 }
    );
  }
  if (!member) {
    return NextResponse.json(
      { error: "The selected active member was not found." },
      { status: 404 }
    );
  }

  const { data: existing, error: existingError } = await supabase
    .from("portal_attendance")
    .select("id, status")
    .eq("event_id", eventId)
    .eq("member_user_id", memberUserId)
    .maybeSingle();
  if (existingError) {
    return NextResponse.json(
      { error: "Unable to load the current attendance record." },
      { status: 500 }
    );
  }
  if (existing && existing.status === status) {
    return NextResponse.json(
      { error: "That member already has this attendance status." },
      { status: 400 }
    );
  }

  const previousStatus = existing ? existing.status : null;
  let attendance;

  if (existing) {
    const { data, error: updateError } = await supabase
      .from("portal_attendance")
      .update({ status, flagged: true, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select("id, event_id, member_user_id, status, flagged, updated_at")
      .single();
    if (updateError) {
      console.error("Portal attendance update failed:", updateError);
      return NextResponse.json(
        { error: "Unable to update attendance." },
        { status: 500 }
      );
    }
    attendance = data;
  } else {
    const { data, error: insertError } = await supabase
      .from("portal_attendance")
      .insert({
        event_id: eventId,
        member_user_id: memberUserId,
        status,
        flagged: true,
      })
      .select("id, event_id, member_user_id, status, flagged, updated_at")
      .single();
    if (insertError) {
      console.error("Portal attendance insert failed:", insertError);
      return NextResponse.json(
        { error: "Unable to record attendance." },
        { status: 500 }
      );
    }
    attendance = data;
  }

  const { data: log, error: logError } = await supabase
    .from("portal_attendance_logs")
    .insert({
      attendance_id: attendance.id,
      event_id: eventId,
      member_user_id: memberUserId,
      previous_status: previousStatus,
      new_status: status,
      reason,
      flagged: true,
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
