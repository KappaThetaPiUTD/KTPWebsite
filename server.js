// server.js

const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const bodyParser = require("body-parser");
const cors = require("cors"); // add CORS

const app = express();
const port = 3000; 

// Middleware
app.use(bodyParser.json());
// Enable CORS to allow requests from your frontend origin
app.use(
  cors({
    origin: "http://localhost:3000", // adjust if your frontend runs elsewhere
    credentials: true,
  })
);

// Your existing routers
const applicationsRouter = require("./routes/applications");
app.use("/api/applications", applicationsRouter);

const qrCheckinRouter = require("./routes/qrCheckIn");
app.use("/api/qr-checkin", qrCheckinRouter);

const attendanceRouter = require("./routes/attendance");
app.use("/api/attendance", attendanceRouter);

const rsvpRouter = require("./routes/rsvp");
app.use("/api/rsvp", rsvpRouter);

// Your /api/verify-code endpoint
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

    if (data && data.code === code) {
      // Optionally set cookie here or just return success
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "Invalid code" });
    }
  } catch (err) {
    console.error("Error verifying access code:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
