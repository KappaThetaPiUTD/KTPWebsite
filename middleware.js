import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request) {
  const res = NextResponse.next();
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

  // ✅ NEW: Protect dashboard-style routes from reset flow access
  const protectedRoutes = ["/dashboard", "/profile", "/admin"]; // Customize as needed
  const fromResetFlow = request.cookies.get("fromResetFlow");

  const supabase = createMiddlewareClient({ req: request, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (protectedRoutes.includes(pathname)) {
    // If coming from reset flow, block access and redirect to login
    if (fromResetFlow?.value === "true") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";

      const response = NextResponse.redirect(url);
      response.cookies.delete("fromResetFlow"); // Clear flag
      return response;
    }

    // Block unauthenticated users
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ["/sign-in", "/dashboard", "/profile", "/admin"], // Add protected routes here
};
