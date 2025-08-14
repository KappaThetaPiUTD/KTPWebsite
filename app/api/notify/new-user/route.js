import nodemailer from 'nodemailer';

// Expect env vars: KTP_EMAIL, KTP_EMAIL_PASSWORD, NOTIFY_SECRET (server-only)
export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body || {};
    if (!email) {
      return new Response(JSON.stringify({ error: 'email required' }), { status: 400 });
    }

    if (!process.env.KTP_EMAIL || !process.env.KTP_EMAIL_PASSWORD) {
      console.error('[notify/new-user] Missing KTP_EMAIL or KTP_EMAIL_PASSWORD env vars');
      return new Response(JSON.stringify({ error: 'missing_email_credentials' }), { status: 500 });
    }

    // Basic validation
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'invalid email' }), { status: 400 });
    }

    // Optional shared secret header for basic protection
    const secretHeader = req.headers.get('x-notify-secret');
    const expectedSecret = process.env.NOTIFY_SECRET;
    if (expectedSecret && secretHeader !== expectedSecret) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.KTP_EMAIL,
        pass: process.env.KTP_EMAIL_PASSWORD,
      },
      logger: true,
      debug: true,
    });

    // Verify SMTP connection (dev aid)
    try {
      await transporter.verify();
      console.log('[notify/new-user] SMTP verify ok for', process.env.KTP_EMAIL);
    } catch (verErr) {
      console.error('[notify/new-user] SMTP verify failed', verErr);
      return new Response(JSON.stringify({ error: 'smtp_verify_failed', details: verErr.message }), { status: 500 });
    }

    const html = `
      <h2>New User Registration</h2>
      <p>A new user just registered on the KTP portal.</p>
      <ul>
        <li>Email: <strong>${email}</strong></li>
        <li>Time (UTC): ${new Date().toISOString()}</li>
      </ul>
    `;

    console.log('[notify/new-user] Preparing to send registration email for', email);
    let info;
    try {
      info = await transporter.sendMail({
      from: process.env.KTP_EMAIL,
      to: process.env.KTP_EMAIL, // send to central inbox
      subject: 'KTP Portal: New User Registration',
      html,
    });
    } catch (sendErr) {
      console.error('[notify/new-user] sendMail failed', sendErr);
      return new Response(JSON.stringify({ error: 'send_failed', details: sendErr.message }), { status: 500 });
    }
    console.log('[notify/new-user] Email sent messageId=', info?.messageId, 'response=', info?.response);

    return new Response(JSON.stringify({ ok: true, messageId: info?.messageId || null }), { status: 200 });
  } catch (e) {
    console.error('notify/new-user error', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
