import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../../lib/portal/member";
import {
  getPortalServerClient,
  getPortalServiceRoleClient,
} from "../../../../../lib/portal/server";

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

function getPasswordSetupRedirectUrl(request) {
  const redirectUrl = new URL("/portal/auth/confirm", request.url);
  redirectUrl.searchParams.set("next", "/portal/reset-password");
  return redirectUrl.toString();
}

async function resendMemberAccessEmail({ memberId, email, request }) {
  if (!UUID_PATTERN.test(memberId) && !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Enter a valid member email." }, { status: 400 });
  }

  const invitationClient = getPortalServiceRoleClient();
  if (!invitationClient) {
    return NextResponse.json(
      { error: "Member invitations are not configured." },
      { status: 503 }
    );
  }

  const supabase = await getPortalServerClient();
  let memberQuery = supabase
    .from("portal_members")
    .select("id, email, status, user_id");
  memberQuery = UUID_PATTERN.test(memberId)
    ? memberQuery.eq("id", memberId)
    : memberQuery.eq("email", email);
  const { data: member, error: memberError } = await memberQuery.maybeSingle();

  if (memberError) {
    console.error("Portal member lookup failed:", memberError);
    return NextResponse.json({ error: "Unable to find member." }, { status: 500 });
  }
  if (!member) {
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  }
  if (member.status !== "active") {
    return NextResponse.json(
      { error: "Reactivate this member before sending account access emails." },
      { status: 400 }
    );
  }

  const redirectTo = getPasswordSetupRedirectUrl(request);
  let acceptedInvite = false;

  if (member.user_id) {
    const { data: userData, error: userError } =
      await invitationClient.auth.admin.getUserById(member.user_id);

    if (userError || !userData.user) {
      console.error("Portal Auth user lookup failed:", userError);
      return NextResponse.json(
        { error: "Unable to verify the member's invitation status." },
        { status: 500 }
      );
    }

    acceptedInvite = Boolean(
      userData.user.email_confirmed_at || userData.user.confirmed_at
    );
  }

  const { error: emailError } = acceptedInvite
    ? await invitationClient.auth.resetPasswordForEmail(member.email, { redirectTo })
    : await invitationClient.auth.admin.inviteUserByEmail(member.email, {
        redirectTo,
      });

  if (emailError) {
    console.error("Portal member access email failed:", emailError);
    return NextResponse.json(
      {
        error: acceptedInvite
          ? "Unable to send password reset email. Try again later."
          : "Unable to resend invitation. Try again later.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    emailSent: true,
    emailType: acceptedInvite ? "password_reset" : "invitation",
  });
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

  if (body.action === "resend_access") {
    const memberId = typeof body.memberId === "string" ? body.memberId.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    return resendMemberAccessEmail({ memberId, email, request });
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

  const invitationClient = getPortalServiceRoleClient();
  if (!invitationClient) {
    return NextResponse.json(
      { error: "Member invitations are not configured." },
      { status: 503 }
    );
  }

  const supabase = await getPortalServerClient();
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

  const { error: invitationError } =
    await invitationClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: getPasswordSetupRedirectUrl(request),
    });

  if (invitationError) {
    console.error("Portal member invitation failed:", invitationError);
    return NextResponse.json(
      {
        member: data,
        inviteSent: false,
        warning:
          "The member was added, but the invitation could not be sent. Configure SMTP or try again later.",
      },
      { status: 201 }
    );
  }

  return NextResponse.json({ member: data, inviteSent: true }, { status: 201 });
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

  const supabase = await getPortalServerClient();
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
