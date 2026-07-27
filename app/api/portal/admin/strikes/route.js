import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../lib/portal/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request) {
  const context = await loadPortalMemberContext();

  if (!context.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (context.error || context.memberError) {
    return NextResponse.json(
      { error: "Unable to verify admin access." },
      { status: 503 }
    );
  }
  if (!context.isAdmin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const memberUserId =
    typeof body.memberUserId === "string" ? body.memberUserId.trim() : "";
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";

  if (!UUID_PATTERN.test(memberUserId)) {
    return NextResponse.json({ error: "Invalid member." }, { status: 400 });
  }
  if (reason.length < 5 || reason.length > 500) {
    return NextResponse.json(
      { error: "Use a reason between 5 and 500 characters." },
      { status: 400 }
    );
  }

  const supabase = getPortalServerClient();
  const { data: target, error: targetError } = await supabase
    .from("portal_members")
    .select("user_id")
    .eq("user_id", memberUserId)
    .eq("status", "active")
    .maybeSingle();

  if (targetError) {
    return NextResponse.json(
      { error: "Unable to verify the selected member." },
      { status: 500 }
    );
  }
  if (!target) {
    return NextResponse.json(
      { error: "The selected active member was not found." },
      { status: 404 }
    );
  }

  const { data, error } = await supabase
    .from("portal_strikes")
    .insert({
      member_user_id: memberUserId,
      reason,
      issued_by: context.user.id,
    })
    .select("id, member_user_id, reason, issued_by, created_at")
    .single();

  if (error) {
    console.error("Portal strike insert failed:", error);
    return NextResponse.json(
      { error: "Unable to log the strike." },
      { status: 500 }
    );
  }

  return NextResponse.json({ strike: data }, { status: 201 });
}
