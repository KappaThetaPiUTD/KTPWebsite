import { redirect } from "next/navigation";
import LiveAttendanceMonitor from "../../../../../components/portal/LiveAttendanceMonitor";
import { getPortalMemberContext } from "../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../lib/portal/server";

export default async function PortalAdminAttendancePage({ searchParams }) {
  const context = await getPortalMemberContext();
  if (!context.isAdmin) redirect("/portal/dashboard");

  const { eventId } = await searchParams;
  const supabase = await getPortalServerClient();
  const { data, error } = await supabase
    .from("portal_events")
    .select("id, title, start_time, is_check_in_open")
    .order("start_time", { ascending: false });
  const events = data || [];
  const initialEventId = events.some((event) => event.id === eventId)
    ? eventId
    : events.find((event) => event.is_check_in_open)?.id || events[0]?.id || "";

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Admin tools</p>
      <h1 className="mt-2 text-3xl font-bold text-gray-950">Live attendance</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
        Monitor incoming check-ins, project the event QR code, and control the check-in window.
      </p>
      {error ? <p className="mt-6 text-sm text-red-700" role="alert">Unable to load events.</p> : <LiveAttendanceMonitor events={events} initialEventId={initialEventId} />}
    </div>
  );
}
