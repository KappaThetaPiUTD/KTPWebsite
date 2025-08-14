import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

export async function POST(request) {
  const { code, type } = await request.json();

  if (!code) {
    return NextResponse.json({ success: false, code: 'missing_code', message: "Code is required" }, { status: 400 });
  }

  const raw = String(code);
  const normalized = raw.trim(); // customize if uppercase needed: raw.trim().toUpperCase()

  console.log('[verify-code] Incoming code raw="' + raw + '" normalized="' + normalized + '" type=' + type);

  // Optional bypass for local dev
  if (process.env.ACCESS_CODE_BYPASS && normalized === process.env.ACCESS_CODE_BYPASS) {
    console.log('[verify-code] Using bypass code');
    return issueCookies(type);
  }

  try {
    const { data, error } = await supabaseServer
      .from('access_code')
      .select('code')
      .eq('code', normalized)
      .single();

    if (error) {
      console.warn('[verify-code] Supabase error', error.message);
    }
    if (!data) {
      return NextResponse.json({ success: false, code: 'not_found', message: 'Invalid code' }, { status: 401 });
    }
    if (data.code !== normalized) {
      return NextResponse.json({ success: false, code: 'mismatch', message: 'Invalid code' }, { status: 401 });
    }

    return issueCookies(type);
  } catch (err) {
    console.error('[verify-code] Exception', err);
    return NextResponse.json({ success: false, code: 'server_error', message: 'Server error' }, { status: 500 });
  }
}

function issueCookies(type) {
  const response = NextResponse.json({ success: true });
  if (type === 'login') {
    response.cookies.set('login_access_verified', 'true', {
      path: '/',
      maxAge: 3600,
      sameSite: 'lax',
      httpOnly: false,
    });
  } else {
    response.cookies.set('access_verified', 'true', {
      path: '/',
      maxAge: 3600,
      sameSite: 'lax',
      httpOnly: false,
    });
  }
  return response;
}