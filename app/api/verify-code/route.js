import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

export async function POST(request) {
  const { code, type } = await request.json(); // Add 'type' parameter

  if (!code) {
    return NextResponse.json({ success: false, message: "Code is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseServer
      .from("access_code")
      .select("code")
      .eq("code", code)
      .single();

    if (error || !data || data.code !== code) {
      return NextResponse.json({ success: false, message: "Invalid code" }, { status: 401 });
    }

    // Set different cookies based on type
    const response = NextResponse.json({ success: true });
    
    if (type === "login") {
      // For login access
      response.headers.set(
        "Set-Cookie",
        `login_access_verified=true; Path=/; Max-Age=3600; SameSite=Lax`
      );
    } else {
      // For signup access (default)
      response.headers.set(
        "Set-Cookie",
        `access_verified=true; Path=/; Max-Age=3600; SameSite=Lax`
      );
    }
    
    return response;
  } catch (err) {
    console.error("Error verifying access code:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}