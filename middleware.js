import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Existing logic for verifying access to /sign-in
  if (pathname === "/sign-in") {
    const accessVerified = request.cookies.get("access_verified");

    if (accessVerified?.value !== "true") {
      const url = request.nextUrl.clone();
      url.pathname = "/signin-access";
      return NextResponse.redirect(url);
    }
  }

  // New logic for verifying access to /login
  if (pathname === "/login") {
    const loginAccessVerified = request.cookies.get("login_access_verified");

    if (loginAccessVerified?.value !== "true") {
      const url = request.nextUrl.clone();
      url.pathname = "/login-access";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/login"], // Match both sign-in and login pages
};