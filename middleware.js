import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect the /sign-in route
  if (pathname === "/sign-in") {
    const accessVerified = request.cookies.get("access_verified");

    // If cookie missing or not "true", redirect to /signin-access
    if (accessVerified !== "true") {
      const url = request.nextUrl.clone();
      url.pathname = "/signin-access";
      return NextResponse.redirect(url);
    }
  }

  // Allow all other requests
  return NextResponse.next();
}

// Apply middleware only to /sign-in
export const config = {
  matcher: ["/sign-in"],
};
