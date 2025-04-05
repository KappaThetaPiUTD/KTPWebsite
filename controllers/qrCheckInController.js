// controllers/qrCheckinController.js
const jwt = require("jsonwebtoken");
const supabase = require("../supabaseClient"); // Import your Supabase client instance

async function handleQrCheckin(req, res) {
  const { qrToken } = req.body;
  if (!qrToken) {
    return res.status(400).json({ error: "Missing QR token" });
  }

  let payload;
  try {
    payload = jwt.verify(qrToken, "your-secret-key");
  } catch (err) {
    return res.status(400).json({ error: "Invalid or expired QR token" });
  }

  const { user_id, event_id } = payload;
  if (!user_id || !event_id) {
    return res.status(400).json({ error: "Invalid token data" });
  }

  // Determine status based on additional logic if needed
  const status = "present"; // Or determine if late, etc.

  const { data, error } = await supabase
    .from("attendance")
    .insert([{ user_id, event_id, status }]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "QR Code Check-In successful", data });
}

module.exports = { handleQrCheckin };
