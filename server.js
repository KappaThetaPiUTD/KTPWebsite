// server.js

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

//applications
const applicationsRouter = require("./routes/applications");
app.use("/api/applications", applicationsRouter);

//QR
const qrCheckinRouter = require("./routes/qrCheckIn");
app.use("/api/qr-checkin", qrCheckinRouter);

//attendance
const attendanceRouter = require("./routes/attendance");
app.use("/api/attendance", attendanceRouter);

//rsvp
const rsvpRouter = require("./routes/rsvp");
app.use("/api/rsvp", rsvpRouter);
=======
// --- API Endpoints ---

// 1. QR Code Check-In Endpoint (Insert into attendance)
app.post("/api/checkin", async (req, res) => {
  const { user_id, event_id, status } = req.body;

  // For basic functionality, we assume status is provided (e.g., "present")
  const { data, error } = await supabase
    .from("attendance")
    .insert([{ user_id, event_id, status }]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Checked in successfully.", data });
});

// 2. Attendance Tracking Endpoint (Retrieve attendance records)
app.get("/api/attendance", async (req, res) => {
  const { event_id } = req.query;
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("event_id", event_id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ data });
});

// 3. RSVP Endpoint (Insert RSVP record)
app.post("/api/rsvp", async (req, res) => {
  const { user_id, event_id, response } = req.body;
  const { data, error } = await supabase
    .from("rsvps")
    .insert([{ user_id, event_id, response }]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "RSVP submitted successfully.", data });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
