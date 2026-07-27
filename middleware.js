import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { getPortalConfig } from "./lib/portal/config";
import { isPortalSessionMissingError } from "./lib/portal/errors";

function applyAuthUpdates(response, cookiesToSet, headersToSet) {
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  Object.entries(headersToSet).forEach(([name, value]) => {
    response.headers.set(name, value);
  });
  return response;
}

function redirectToLogin(request, reason) {
  const url = request.nextUrl.clone();
  const requestedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.pathname = "/portal/login";
  url.search = "";
  url.searchParams.set("reason", reason);

  if (requestedPath.startsWith("/portal/dashboard")) {
    url.searchParams.set("next", requestedPath);
  }

  return NextResponse.redirect(url);
}

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const protectedRoute =
    pathname === "/portal" ||
    pathname.startsWith("/portal/dashboard") ||
    pathname.startsWith("/portal/onboarding");
  const config = getPortalConfig();

  if (!config) {
    return protectedRoute
      ? redirectToLogin(request, "not-configured")
      : NextResponse.next();
  }

  const cookiesToSet = [];
  const headersToSet = {};
  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(updatedCookies, updatedHeaders = {}) {
        cookiesToSet.push(...updatedCookies);
        Object.assign(headersToSet, updatedHeaders);
        updatedCookies.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const authUnavailable = error && !isPortalSessionMissingError(error);

  let response;
  if (protectedRoute && (authUnavailable || !user)) {
    response = redirectToLogin(
      request,
      authUnavailable ? "unavailable" : "signed-out"
    );
  } else {
    response = NextResponse.next({ request });
  }

  return applyAuthUpdates(response, cookiesToSet, headersToSet);
}

export const config = {
  matcher: ["/portal", "/portal/:path*"],
};
