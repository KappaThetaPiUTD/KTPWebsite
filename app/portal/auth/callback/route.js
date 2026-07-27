import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getPortalConfig } from "../../../../lib/portal/config";

function getSafeNextPath(value) {
  if (
    typeof value === "string" &&
    value.startsWith("/portal/") &&
    !value.startsWith("//")
  ) {
    return value;
  }

  return "/portal/dashboard";
}

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const config = getPortalConfig();

  if (!config) {
    return NextResponse.redirect(
      new URL("/portal/login?reason=not-configured", requestUrl.origin)
    );
  }

  const code = requestUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(
      new URL("/portal/login?reason=callback-error", requestUrl.origin)
    );
  }

  const destination = getSafeNextPath(requestUrl.searchParams.get("next"));
  const response = NextResponse.redirect(
    new URL(destination, requestUrl.origin)
  );
  const cookieStore = cookies();
  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet, headers = {}) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([name, value]) => {
          response.headers.set(name, value);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/portal/login?reason=callback-error", requestUrl.origin)
    );
  }

  return response;
}
