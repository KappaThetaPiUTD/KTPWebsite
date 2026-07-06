// Server-side contact fallback. The contact form sends via EmailJS (client-side)
// first; if that fails (e.g. the Gmail OAuth grant expires), the form falls back
// to POSTing here, and this route sends the message via Resend so submissions
// aren't silently lost. Requires the RESEND_API_KEY env var to be set in Vercel.
import { NextResponse } from 'next/server';

const TO_EMAIL = 'kappathetapiutd@gmail.com';

export async function POST(request) {
  try {
    const body = await request.json();

    const fullName =
      body.full_name || `${body.firstName || ''} ${body.lastName || ''}`.trim();
    const email = body.email || '';
    const phone = body.phone_number || body.phoneNumber || '';
    const message = body.message || '';

    if (!email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('Contact fallback: RESEND_API_KEY is not set.');
      return NextResponse.json(
        { error: 'Email service not configured.' },
        { status: 500 }
      );
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'KTP Website <onboarding@resend.dev>',
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New contact form message from ${fullName || 'a visitor'}`,
        text: `Name: ${fullName}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('Resend error:', res.status, detail);
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}