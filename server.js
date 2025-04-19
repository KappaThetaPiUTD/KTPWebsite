// server.js
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Supabase client setup
const supabaseUrl = "https://bagvfgqosklxljktkwpd.supabase.co";
const supabaseKey = "YOUR_SUPABASE_KEY_HERE";
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
