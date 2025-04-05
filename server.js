const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Replace with your Supabase project details
const supabaseUrl = "https://bagvfgqosklxljktkwpd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhZ3ZmZ3Fvc2tseGxqa3Rrd3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1OTA1NjQsImV4cCI6MjA1ODE2NjU2NH0.TcukwWDnKGnah5nJ3K_Nh-baRW7Kkmw8PDBzm6s_ZFw";
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(bodyParser.json());

// New Member Application Submission Endpoint
app.post("/api/applications", async (req, res) => {
  const { name, email, phone, major, graduation_year } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  // Insert the application data into the 'applications' table
  const { data, error } = await supabase
    .from("applications")
    .insert([{ name, email, phone, major, graduation_year }]);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: "Application submitted successfully", data });
});

// QR Code Check-In Endpoint (Insert into attendance)
app.post("/api/checkin", async (req, res) => {
  const { user_id, event_id, status } = req.body;

  // For basic functionality, we assume status is provided (e.g., "present")
  const { data, error } = await supabase
    .from("attendance")
    .insert([{ user_id, event_id, status }]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Checked in successfully.", data });
});

// Attendance Tracking Endpoint (Retrieve attendance records)
app.get("/api/attendance", async (req, res) => {
  const { event_id } = req.query;
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("event_id", event_id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ data });
});
// Attendance Update Endpoint (Update a specific attendance record)
app.patch("/api/attendance/:id", async (req, res) => {
  const { id } = req.params;
  const { status, excused, admin_flag } = req.body;

  // Update the attendance record with new status, excused flag, and admin flag
  const { data, error } = await supabase
    .from("attendance")
    .update({ status, excused, admin_flag })
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Attendance record updated.", data });
});

// RSVP Endpoint (Insert RSVP record)
app.post("/api/rsvp", async (req, res) => {
  const { user_id, event_id, response } = req.body;
  const { data, error } = await supabase
    .from("rsvps")
    .insert([{ user_id, event_id, response }]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "RSVP submitted successfully.", data });
});
//QR CODE Update
const qrCheckinRouter = require("./routes/qrCheckIn");
app.use("/api/qr-checkin", qrCheckinRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
