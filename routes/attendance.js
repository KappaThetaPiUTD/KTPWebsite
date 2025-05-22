import express from "express";
const router = express.Router();
import {
  updateAttendanceStatus,
  getAttendanceByEvent,
} from "../controllers/attendanceController.js";

router.get("/", getAttendanceByEvent); // GET /api/attendance?event_id=...
router.patch("/:id", updateAttendanceStatus); // PATCH /api/attendance/:id

//module.exports = router;
export default router;
