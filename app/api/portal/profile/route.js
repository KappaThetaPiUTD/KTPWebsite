import { NextResponse } from "next/server";
import { loadPortalMemberContext } from "../../../../lib/portal/member";
import { getPortalServerClient } from "../../../../lib/portal/server";

function validateProfile(body) {
  const fullName =
    typeof body.fullName === "string" ? body.fullName.trim() : "";
  const major = typeof body.major === "string" ? body.major.trim() : "";
  const utdEmail =
    typeof body.utdEmail === "string" ? body.utdEmail.trim().toLowerCase() : "";
  const phoneDigits =
    typeof body.phone === "string" ? body.phone.replace(/\D/g, "") : "";
  const graduationYear = Number(body.graduationYear);

  if (fullName.length < 2 || fullName.length > 100) {
    return { error: "Enter a full name between 2 and 100 characters." };
  }
  if (major.length < 2 || major.length > 100) {
    return { error: "Enter a major between 2 and 100 characters." };
  }
  if (
    !Number.isInteger(graduationYear) ||
    graduationYear < 2020 ||
    graduationYear > 2100
  ) {
    return { error: "Enter a valid graduation year." };
  }
  if (utdEmail && !/^[a-z0-9._%+-]+@utdallas\.edu$/i.test(utdEmail)) {
    return { error: "Use a valid @utdallas.edu email or leave it blank." };
  }
  if (phoneDigits && phoneDigits.length !== 10) {
    return { error: "Enter a 10-digit US phone number or leave it blank." };
  }

  return {
    values: {
      full_name: fullName,
      major,
      graduation_year: graduationYear,
      utd_email: utdEmail || null,
      phone: phoneDigits
        ? `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(
            3,
            6
          )}-${phoneDigits.slice(6)}`
        : null,
    },
  };
}

export async function POST(request) {
  const context = await loadPortalMemberContext();

  if (!context.configured) {
    return NextResponse.json(
      { error: "Portal configuration is unavailable." },
      { status: 503 }
    );
  }
  if (!context.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (context.error || context.memberError) {
    return NextResponse.json(
      { error: "Unable to verify portal access." },
      { status: 503 }
    );
  }
  if (!context.authorized) {
    return NextResponse.json({ error: "Portal access denied." }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validated = validateProfile(body);
  if (validated.error) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const supabase = getPortalServerClient();
  const { data, error } = await supabase
    .from("portal_profiles")
    .upsert(
      {
        user_id: context.user.id,
        ...validated.values,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select(
      "user_id, full_name, utd_email, phone, graduation_year, major, updated_at"
    )
    .single();

  if (error) {
    console.error("Portal profile update failed:", error);
    return NextResponse.json(
      { error: "Unable to save the member profile." },
      { status: 500 }
    );
  }

  await supabase.auth.updateUser({
    data: {
      full_name: validated.values.full_name,
      graduation_year: validated.values.graduation_year,
      phone: validated.values.phone,
    },
  });

  return NextResponse.json({ profile: data });
}
