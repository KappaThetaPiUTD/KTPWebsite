import { NextResponse } from 'next/server';
import { loadPortalMemberContext } from '../../../../lib/portal/member';
import { getPortalConfig } from '../../../../lib/portal/config';

const TO_EMAIL = 'kappathetapiutd@gmail.com';

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

    if (!eventId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId and status.' },
        { status: 400 }
      );
    }

    if (!['going', 'maybe', 'not_going'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: going, maybe, not_going.' },
        { status: 400 }
      );
    }

    const config = getPortalConfig();
    if (!config) {
      return NextResponse.json(
        { error: 'Portal configuration is unavailable.' },
        { status: 503 }
      );
    }

    const { url, anonKey } = config;
    const cookieStore = new (await import('next/headers')).cookies();
    const createServerClient = (await import('@supabase/ssr')).createServerClient;
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Server Components cannot write cookies. Portal middleware refreshes
          // the session before rendering, while Route Handlers can persist them.
        },
      },
    });

    // Check if event exists and get event details
    const { data: event, error: eventError } = await supabase
      .from('portal_events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found.' },
        { status: 404 }
      );
    }

    // Check RSVP deadline
    const now = new Date();
    const rsvpDeadline = new Date(event.rsvp_deadline);
    if (now > rsvpDeadline) {
      return NextResponse.json(
        { error: 'RSVP deadline has passed for this event.' },
        { status: 400 }
      );
    }

    // Check event capacity
    const { count, error: countError } = await supabase
      .from('portal_rsvps')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('status', 'going');

    if (countError) {
      return NextResponse.json(
        { error: 'Unable to check RSVP count.' },
        { status: 500 }
      );
    }

    if (event.capacity && (count || 0) >= event.capacity) {
      return NextResponse.json(
        { error: 'Event at maximum capacity. RSVP unavailable.' },
        { status: 400 }
      );
    }

    // Insert or update the RSVP
    const { data: existingRSVP, error: findError } = await supabase
      .from('portal_rsvps')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', context.user.id)
      .maybeSingle();

    let rsvpData;

    if (existingRSVP) {
      // Update existing RSVP
      const { data, error: updateError } = await supabase
        .from('portal_rsvps')
        .update({ status })
        .eq('event_id', eventId)
        .eq('user_id', context.user.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: 'Unable to update RSVP.' },
          { status: 500 }
        );
      }
      rsvpData = data;
    } else {
      // Create new RSVP
      const { data, error: insertError } = await supabase
        .from('portal_rsvps')
        .insert({
          event_id: eventId,
          status,
          user_id: context.user.id,
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json(
          { error: 'Unable to save RSVP.' },
          { status: 500 }
        );
      }
      rsvpData = data;
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

    return NextResponse.json({ rsvp: rsvpData, success: true }, { status: 201 });
  } catch (error) {
    console.error('RSVP API error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}