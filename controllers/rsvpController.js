const supabase = require("../supabaseClient");
const nodemailer = require("nodemailer");

async function submitRSVP(req, res) {
  const { user_id, event_id, response } = req.body;

  // 1. Insert RSVP record
  const { data: rsvp, error: insertErr } = await supabase
    .from("rsvps")
    .insert([{ user_id, event_id, response }])
    .select()
    .single();
  if (insertErr) return res.status(400).json({ error: insertErr.message });

  // 2. Fetch user email and event details
  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("email")
    .eq("id", user_id)
    .single();
  const { data: event, error: eventErr } = await supabase
    .from("events")
    .select("event_name, event_date")
    .eq("id", event_id)
    .single();

  if (userErr || eventErr) {
    return res
      .status(500)
      .json({ error: "Failed to fetch email or event info." });
  }

  // 3. Send email confirmation
  try {
    await sendConfirmationEmail(user.email, event.event_name, event.event_date);
    await supabase
      .from("rsvps")
      .update({ email_confirm: true })
      .eq("id", rsvp.id);
  } catch (emailErr) {
    console.error("Email failed:", emailErr);
    // Not failing the RSVP just because email didn't go through
  }

  res.json({
    message: "RSVP submitted and confirmation email sent.",
    data: rsvp,
  });
}

async function sendConfirmationEmail(to, eventName, eventDate) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com", // use your real email
      pass: "your-app-password", // use app password
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to,
    subject: "RSVP Confirmation",
    text: `Thanks for RSVPing to ${eventName} on ${eventDate}!`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { submitRSVP };
