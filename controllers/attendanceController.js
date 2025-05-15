// controllers/attendanceController.js
import { supabase } from "../supabaseClient.js";

const VALID_STATUSES = ["present", "late", "excused", "unexcused"];

// PATCH /api/attendance/:id
async function updateAttendanceStatus(req, res) {
  const { id } = req.params;
  const { status, admin_flag, changed_by } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  // Fetch current status for logging
  const { data: current, error: fetchErr } = await supabase
    .from("attendance")
    .select("status")
    .eq("id", id)
    .single();
  if (fetchErr) return res.status(400).json({ error: fetchErr.message });

  // Prepare updates
  const updates = {};
  if (status !== undefined) updates.status = status;
  if (admin_flag !== undefined) updates.admin_flag = admin_flag;

  // Apply updates
  const { data: updated, error: updateErr } = await supabase
    .from("attendance")
    .update(updates)
    .eq("id", id);
  if (updateErr) return res.status(400).json({ error: updateErr.message });

  // Log the change
  await supabase.from("attendance_logs").insert([
    {
      attendance_id: id,
      action: "status_update",
      old_status: current.status,
      new_status: status || current.status,
      changed_by: changed_by || null,
    },
  ]);

  res.json({ message: "Attendance updated and logged.", data: updated });
}

// GET /api/attendance?event_id=...
async function getAttendanceByEvent(req, res) {
  const { event_id } = req.query;

  if (!event_id) {
    return res.status(400).json({ error: "Missing event_id query parameter." });
  }

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("event_id", event_id);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ data });
}

export { updateAttendanceStatus, getAttendanceByEvent };
