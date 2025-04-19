// controllers/applicationsController.js
const supabase = require("../supabaseClient");

async function submitApplication(req, res) {
  const { name, email, phone, major, graduation_year } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const { data, error } = await supabase
    .from("applications")
    .insert([{ name, email, phone, major, graduation_year }]);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Application submitted successfully", data });
}

module.exports = { submitApplication };
