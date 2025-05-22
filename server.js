// server.js

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";

// Supabase setup (replace with your actual env vars or hardcoded values if testing)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000", // adjust if needed
    credentials: true,
  })
);

// Routers
import applicationsRouter from "./routes/applications.js";
app.use("/api/applications", applicationsRouter);

import qrCheckinRouter from "./routes/qrCheckIn.js";
app.use("/api/qr-checkin", qrCheckinRouter);

import attendanceRouter from "./routes/attendance.js";
app.use("/api/attendance", attendanceRouter);

import rsvpRouter from "./routes/rsvp.js";
app.use("/api/rsvp", rsvpRouter);

// QR Code Check-In Endpoint (manual insert, example)
app.post("/api/checkin", async (req, res) => {
  const { user_id, event_id, status } = req.body;
  // Implement your logic here (e.g., insert into attendance table)
  res.json({ success: true }); // placeholder
});

// Verify Access Code Endpoint
app.post("/api/verify-code", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: "Code is required" });
  }

  try {
    const { data, error } = await supabase
      .from("access_code")
      .select("code")
      .eq("code", code)
      .single();

    if (error) throw error;

    if (data?.code === code) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "Invalid code" });
    }
  } catch (err) {
    console.error("Error verifying access code:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});