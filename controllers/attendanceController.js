// controllers/applicationsController.js
import { supabase } from "../supabaseClient.js";

// POST: Submit a new application
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

// GET: Retrieve all applications
async function getAllApplications(req, res) {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.json({ data });
}

// PATCH: Update application (status, notes)
async function updateApplication(req, res) {
  const { id } = req.params;
  const { status, notes } = req.body;

  const updates = {};
  if (status !== undefined) updates.status = status;
  if (notes !== undefined) updates.notes = notes;

  const { data, error } = await supabase
    .from("applications")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Application updated successfully", data });
}

export { submitApplication, getAllApplications, updateApplication };
