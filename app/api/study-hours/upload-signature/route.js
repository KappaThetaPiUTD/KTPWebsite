import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../lib/portal/server";
import cloudinary from "../../../../utils/cloudinary";

export const runtime = "nodejs";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request) {
  const context = await loadPortalMemberContext();

  if (!context.configured) {
    return NextResponse.json(
      { error: "Portal configuration is unavailable." },
      { status: 503 }
    );
  }

  if (!context.user) {
    return NextResponse.json(
      { error: "Sign in required." },
      { status: 401 }
    );
  }

  if (context.error || context.memberError) {
    return NextResponse.json(
      { error: "Unable to verify portal access." },
      { status: 503 }
    );
  }

  if (!context.authorized) {
    return NextResponse.json(
      { error: "Portal access denied." },
      { status: 403 }
    );
  }

  // Study Hours submission eligibility:
  // - All active pledges are eligible.
  // - Brothers are eligible only if an admin assigned them Study Hours.
  // - Admins, execs, directors, and unassigned brothers are not eligible.

  const member = context.member;

  let studyHoursEligible = false;

  if (member?.role === "pledge") {
    studyHoursEligible = true;
  } else if (member?.role === "brother") {
    const supabase = await getPortalServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Portal configuration is unavailable." },
        { status: 503 }
      );
    }

    const { data: assignment, error: assignmentError } = await supabase
      .from("portal_study_hour_assignments")
      .select("id")
      .eq("user_id", context.user.id)
      .maybeSingle();

    if (assignmentError) {
      console.error(
        "Unable to verify Study Hours assignment:",
        assignmentError
      );

      return NextResponse.json(
        { error: "Unable to verify Study Hours eligibility." },
        { status: 503 }
      );
    }

    studyHoursEligible = Boolean(assignment);
  }

  if (!studyHoursEligible) {
    return NextResponse.json(
      { error: "You are not eligible to submit Study Hours." },
      { status: 403 }
    );
  }


  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const eventId =
    typeof body.eventId === "string" ? body.eventId.trim() : "";

  if (!UUID_PATTERN.test(eventId)) {
    return NextResponse.json(
      { error: "Invalid event." },
      { status: 400 }
    );
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error(
      "Cloudinary study-hours upload credentials are missing."
    );

    return NextResponse.json(
      { error: "Photo uploads are temporarily unavailable." },
      { status: 503 }
    );
  }

  // The authenticated user ID comes from Supabase, never from the request body.
  // The signature binds the browser upload to this isolated study-hours folder.
  const folder = `ktp/study-hours/${context.user.id}/${eventId}`;
  const timestamp = Math.floor(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { folder, timestamp },
    apiSecret
  );

  return NextResponse.json({
    signature,
    timestamp,
    api_key: apiKey,
    cloud_name: cloudName,
    folder,
  });
}