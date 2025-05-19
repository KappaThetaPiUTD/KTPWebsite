// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/sign-in") {
    const accessVerified = request.cookies.get("access_verified");
    if (accessVerified !== "true") {
      const url = request.nextUrl.clone();
      url.pathname = "/signin-access";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in"],
};
