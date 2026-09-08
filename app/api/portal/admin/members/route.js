import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../../lib/portal/server";

const VALID_ROLES = ["admin", "exec", "director", "brother", "pledge"];
const VALID_STATUSES = ["active", "inactive"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

export async function POST(request) {
  const { context, error } = await requireAdmin();
  if (error) return error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = typeof body.role === "string" ? body.role : "brother";

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }
  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  const supabase = getPortalServerClient();
  const { data, error: insertError } = await supabase
    .from("portal_members")
    .insert({ email, role, created_by: context.user.id })
    .select("id, email, role, status, user_id, created_at")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "That email is already on the whitelist." },
        { status: 409 }
      );
    }
    console.error("Portal member insert failed:", insertError);
    return NextResponse.json({ error: "Unable to add member." }, { status: 500 });
  }

  return NextResponse.json({ member: data }, { status: 201 });
}

export async function PATCH(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const memberId = typeof body.memberId === "string" ? body.memberId.trim() : "";
  if (!UUID_PATTERN.test(memberId)) {
    return NextResponse.json({ error: "Invalid member." }, { status: 400 });
  }

  const updates = {};
  if (body.role !== undefined) {
    if (!VALID_ROLES.includes(body.role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }
    updates.role = body.role;
  }
  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    updates.status = body.status;
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const supabase = getPortalServerClient();
  const { data, error: updateError } = await supabase
    .from("portal_members")
    .update(updates)
    .eq("id", memberId)
    .select("id, email, role, status, user_id, created_at")
    .single();

  if (updateError) {
    console.error("Portal member update failed:", updateError);
    return NextResponse.json(
      { error: "Unable to update member." },
      { status: 500 }
    );
  }

  return NextResponse.json({ member: data }, { status: 200 });
}
