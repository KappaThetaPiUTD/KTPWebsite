// controllers/qrCheckinController.js
import pkg from "jsonwebtoken";
const { jwt } = pkg;
import { supabase } from "../supabaseClient.js"; // Your Supabase client

async function handleQrCheckin(req, res) {
  const { qrToken } = req.body;
  if (!qrToken) {
    return res.status(400).json({ error: "Missing QR token" });
  }

  // 1. Verify QR token
  let payload;
  try {
    payload = jwt.verify(qrToken, "your-secret-key"); // Replace with env variable in production
  } catch (err) {
    return res.status(400).json({ error: "Invalid or expired QR token" });
  }

  const { user_id, event_id } = payload;
  if (!user_id || !event_id) {
    return res.status(400).json({ error: "Invalid token data" });
  }

  // 2. Get event start time + type
  const { data: event, error: eventErr } = await supabase
    .from("events")
    .select("event_date, event_type")
    .eq("id", event_id)
    .single();

  if (eventErr) {
    return res.status(400).json({ error: eventErr.message });
  }

  // ✅ Only allow check-in for "chapter" events
  if (event.event_type !== "chapter") {
    return res
      .status(403)
      .json({ error: "Only chapter events allow QR check-in." });
  }

  // 3. Determine status (late or present)
  const now = new Date();
  const status = now > new Date(event.event_date) ? "late" : "present";

  // 4. Insert attendance
  const {
    data: [attendance],
    error: insertErr,
  } = await supabase
    .from("attendance")
    .insert([{ user_id, event_id, status }])
    .select("id")
    .single();
  if (insertErr) return res.status(400).json({ error: insertErr.message });

  // 5. Log it in attendance_logs
  await supabase.from("attendance_logs").insert([
    {
      attendance_id: attendance.id,
      action: "checkin",
      old_status: null,
      new_status: status,
      changed_by: user_id,
    },
  ]);

  res.json({
    message: `QR Code Check-In successful (${status})`,
    data: attendance,
  });
}

//module.exports = { handleQrCheckin };
export { handleQrCheckin };
