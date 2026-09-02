import { redirect } from "next/navigation";
import PortalAttendanceManager from "../../../../../components/portal/PortalAttendanceManager";
import { getPortalMemberContext } from "../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../lib/portal/server";

export default async function PortalAdminAttendancePage({ searchParams }) {
  const context = await getPortalMemberContext();
  if (!context.isAdmin) {
    redirect("/portal/dashboard");
  }

  const supabase = getPortalServerClient();

  const eventsResult = await supabase
    .from("portal_events")
    .select("id, title, location, start_time, event_type")
    .order("start_time", { ascending: false });

  const events = eventsResult.data || [];
  const requestedEventId =
    typeof searchParams?.eventId === "string" ? searchParams.eventId : "";
  const selectedEventId =
    events.find((event) => event.id === requestedEventId)?.id ||
    events[0]?.id ||
    "";

  const [membersResult, profilesResult, attendanceResult, logsResult] =
    await Promise.all([
      supabase
        .from("portal_members")
        .select("user_id, email, role, status")
        .eq("status", "active")
        .not("user_id", "is", null)
        .order("email"),
      supabase.from("portal_profiles").select("user_id, full_name"),
      selectedEventId
        ? supabase
            .from("portal_attendance")
            .select("id, event_id, member_user_id, status, flagged, updated_at")
            .eq("event_id", selectedEventId)
        : Promise.resolve({ data: [], error: null }),
      selectedEventId
        ? supabase
            .from("portal_attendance_logs")
            .select(
              "id, member_user_id, previous_status, new_status, reason, edited_by, created_at"
            )
            .eq("event_id", selectedEventId)
            .order("created_at", { ascending: false })
            .limit(20)
        : Promise.resolve({ data: [], error: null }),
    ]);

  const error =
    eventsResult.error ||
    membersResult.error ||
    profilesResult.error ||
    attendanceResult.error ||
    logsResult.error;

  const profiles = new Map(
    (profilesResult.data || []).map((profile) => [profile.user_id, profile])
  );
  const membersById = new Map(
    (membersResult.data || []).map((member) => [member.user_id, member])
  );
  const attendanceByMember = new Map(
    (attendanceResult.data || []).map((row) => [row.member_user_id, row])
  );

  const roster = (membersResult.data || []).map((member) => {
    const attendance = attendanceByMember.get(member.user_id);
    return {
      userId: member.user_id,
      email: member.email,
      role: member.role,
      name: profiles.get(member.user_id)?.full_name || member.email,
      status: attendance?.status || null,
      flagged: attendance?.flagged || false,
    };
  });

  const recentLogs = (logsResult.data || []).map((log) => {
    const member = membersById.get(log.member_user_id);
    const editor = membersById.get(log.edited_by);
    return {
      id: log.id,
      memberName:
        profiles.get(log.member_user_id)?.full_name ||
        member?.email ||
        "Unknown member",
      editorName:
        profiles.get(log.edited_by)?.full_name || editor?.email || "Unknown admin",
      previousStatus: log.previous_status,
      newStatus: log.new_status,
      reason: log.reason,
      createdAt: log.created_at,
    };
  });

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Admin tools
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-950">Attendance</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
        Record and correct member attendance per event. Every change is
        flagged as a manual edit and written to an audit log with the
        editing officer and reason.
      </p>
      <PortalAttendanceManager
        events={events}
        selectedEventId={selectedEventId}
        roster={roster}
        recentLogs={recentLogs}
        error={error ? "Unable to load complete attendance data." : ""}
      />
    </div>
  );
}
