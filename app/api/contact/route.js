import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const body = await req.json().catch(()=>({}));
    const { firstName, lastName, email, phoneNumber, message } = body;

    const missing = [];
    if (!firstName) missing.push('firstName');
    if (!lastName) missing.push('lastName');
    if (!email) missing.push('email');
    if (!message) missing.push('message');
    if (missing.length) {
      return new Response(JSON.stringify({ ok:false, error:'missing_fields', fields: missing }), { status:400 });
    }

    if (!process.env.KTP_EMAIL || !process.env.KTP_EMAIL_PASSWORD) {
      console.error('[contact] Missing email creds');
      return new Response(JSON.stringify({ ok:false, error:'server_email_not_configured' }), { status:500 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: process.env.KTP_EMAIL, pass: process.env.KTP_EMAIL_PASSWORD }
    });

    try {
      await transporter.verify();
    } catch (vErr) {
      console.error('[contact] SMTP verify failed', vErr);
      return new Response(JSON.stringify({ ok:false, error:'smtp_verify_failed', details:vErr.message }), { status:500 });
    }

    const html = `
      <h2>Contact Form Submission</h2>
      <ul>
        <li><strong>Name:</strong> ${firstName} ${lastName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phoneNumber || 'N/A'}</li>
        <li><strong>Time (UTC):</strong> ${new Date().toISOString()}</li>
      </ul>
      <h3>Message</h3>
      <p style="white-space:pre-line">${(message || '').replace(/</g,'&lt;')}</p>
    `;

    const info = await transporter.sendMail({
      from: process.env.KTP_EMAIL,
      to: process.env.KTP_EMAIL,
      subject: `Contact Form: ${firstName} ${lastName}`,
      replyTo: email,
      html,
    });
    console.log('[contact] Sent contact email id=', info.messageId);
    return new Response(JSON.stringify({ ok:true, messageId: info.messageId }), { status:200 });
  } catch (err) {
    console.error('[contact] Unhandled', err);
    return new Response(JSON.stringify({ ok:false, error:'server_error', details: err.message }), { status:500 });
  }
}
