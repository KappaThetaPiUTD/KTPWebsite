import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../../../lib/portal/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(_request, { params }) {
  const context = await loadPortalMemberContext();

  if (!context.configured) {
    return NextResponse.json({ error: "Portal configuration is unavailable." }, { status: 503 });
  }
  if (!context.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
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

  const supabase = await getPortalServerClient();
  const { data: event, error } = await supabase
    .from("portal_events")
    .select("id, qr_code_secret")
    .eq("id", eventId)
    .single();

  if (error || !event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  return NextResponse.json({
    payload: JSON.stringify({ eventId: event.id, qrToken: event.qr_code_secret }),
  });
}
