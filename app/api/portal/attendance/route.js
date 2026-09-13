import { NextResponse } from "next/server";

// This legacy endpoint previously recorded attendance from an event ID alone.
// Keep it unavailable so all check-ins go through the credential-verifying
// /api/portal/events/check-in endpoint.
export async function POST() {
  return NextResponse.json(
    { error: "Use the secure event check-in endpoint." },
    { status: 410 }
  );
}
