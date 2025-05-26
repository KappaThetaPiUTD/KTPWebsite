// Other imports
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

// Supabase setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const app = express();
const port = 5001;

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000", // or whatever your frontend port is
    credentials: true,
  })
);

// ✅ Import and use all routes
import applicationsRouter from "./routes/applications.js";
import qrCheckinRouter from "./routes/qrCheckIn.js";
import attendanceRouter from "./routes/attendance.js";
import rsvpRouter from "./routes/rsvp.js";
import eventsRouter from "./routes/event.js";

app.use("/api/applications", applicationsRouter);
app.use("/api/qr-checkin", qrCheckinRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/rsvp", rsvpRouter);
app.use("/api/events", eventsRouter); // ✅ AND THIS LINE

// Health check
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
