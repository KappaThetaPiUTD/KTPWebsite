const express = require("express");
const router = express.Router();
const {
  updateAttendanceStatus,
  getAttendanceByEvent,
} = require("../controllers/attendanceController");

router.get("/", getAttendanceByEvent); // GET /api/attendance?event_id=...
router.patch("/:id", updateAttendanceStatus); // PATCH /api/attendance/:id

module.exports = router;
