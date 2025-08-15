export async function GET() {
  const redact = (v) => (v ? '[set]' : '[missing]');
  return new Response(JSON.stringify({
    KTP_EMAIL: redact(process.env.KTP_EMAIL),
    KTP_EMAIL_PASSWORD: redact(process.env.KTP_EMAIL_PASSWORD),
    NOTIFY_SECRET: redact(process.env.NOTIFY_SECRET),
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
