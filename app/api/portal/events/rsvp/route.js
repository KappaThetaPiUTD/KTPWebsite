import { NextResponse } from 'next/server';
import { loadPortalMemberContext } from '../../../../../lib/portal/member';
import { getPortalConfig } from '../../../../../lib/portal/config';
import { getPortalServerClient } from '../../../../../lib/portal/server';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request) {
  const context = await loadPortalMemberContext();

  if (!context.configured) {
    return NextResponse.json(
      { error: "Portal configuration is unavailable." },
      { status: 503 }
    );
  }
  if (!context.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (context.error || context.memberError) {
    return NextResponse.json(
      { error: "Unable to verify portal access." },
      { status: 503 }
    );
  }
  if (!context.authorized) {
    return NextResponse.json({ error: "Portal access denied." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { eventId, status } = body;

    if (!UUID_PATTERN.test(eventId) || !status) {
      return NextResponse.json(
        { error: 'A valid eventId and RSVP status are required.' },
        { status: 400 }
      );
    }

    if (!['going', 'maybe', 'not_going'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: going, maybe, not_going.' },
        { status: 400 }
      );
    }

    if (!getPortalConfig()) {
      return NextResponse.json(
        { error: 'Portal configuration is unavailable.' },
        { status: 503 }
      );
    }

    const supabase = await getPortalServerClient();

    // RLS hides events outside the member's audience. The RPC below repeats
    // that check inside the write transaction, so a crafted request cannot
    // bypass it.
    const { data: event, error: eventError } = await supabase
      .from('portal_events')
      .select('id, title, start_time, rsvp_deadline, target_roles')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found.' },
        { status: 404 }
      );
    }

    const { data: rsvpData, error: rsvpError } = await supabase
      .rpc('submit_portal_rsvp', {
        requested_event_id: eventId,
        requested_status: status,
      })
      .single();

    if (rsvpError) {
      const knownError = [
        'RSVP deadline has passed.',
        'You are not eligible to RSVP to this event.',
        'Event is at maximum capacity.',
      ].includes(rsvpError.message);
      return NextResponse.json(
        { error: knownError ? rsvpError.message : 'Unable to save RSVP.' },
        { status: knownError ? 400 : 500 }
      );
    }

    // Send confirmation email
    const userEmail = context.user.email || context.profile?.utd_email;
    if (userEmail) {
      const dateStr = new Date(event.start_time).toLocaleDateString('en-US', {
        timeZone: 'America/Chicago',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'KTP Website <onboarding@resend.dev>',
            to: [userEmail],
            subject: `RSVP Confirmation: ${event.title}`,
            text: `Hello ${context.profile?.full_name || ''},\n\nYour RSVP for the event "${event.title}" on ${dateStr} has been confirmed.\n\nStatus: ${status}.\n\nWe look forward to seeing you there!\n\n-Kappa Theta Pi`,
          }),
        });
      }
    }

    return NextResponse.json({ rsvp: rsvpData, success: true });
  } catch (error) {
    console.error('RSVP API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
