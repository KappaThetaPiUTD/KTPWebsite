import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../../../lib/portal/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(request, { params }) {
  const context = await loadPortalMemberContext();
  if (!context.user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  if (context.error || context.memberError) {
    return NextResponse.json({ error: "Unable to verify admin access." }, { status: 503 });
  }
  if (!context.isAdmin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { eventId } = await params;
  if (!UUID_PATTERN.test(eventId || "")) {
    return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (typeof body.isCheckInOpen !== "boolean") {
    return NextResponse.json({ error: "Specify the check-in window state." }, { status: 400 });
  }

  const supabase = await getPortalServerClient();
  const { data: event, error } = await supabase
    .from("portal_events")
    .update({ is_check_in_open: body.isCheckInOpen })
    .eq("id", eventId)
    .select("id, is_check_in_open")
    .single();

  if (error || !event) {
    return NextResponse.json({ error: "Unable to update check-in window." }, { status: 500 });
  }

  return NextResponse.json({ event });
}
