import { NextResponse } from "next/server";

export async function middleware() {
  // No access-code gating; allow requests to continue normally.
  return NextResponse.next();
}