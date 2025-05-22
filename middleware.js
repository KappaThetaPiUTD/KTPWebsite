import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Existing logic for verifying access to /sign-in (keep this if you need it)
  if (pathname === "/sign-in") {
    const accessVerified = request.cookies.get("access_verified");

    if (accessVerified?.value !== "true") {
      const url = request.nextUrl.clone();
      url.pathname = "/signin-access";
      return NextResponse.redirect(url);
    }
  }

  // Remove all the dashboard protection logic - we're handling that in the components now

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in"], // Only match sign-in page now
};