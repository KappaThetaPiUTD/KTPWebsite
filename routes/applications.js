// routes/applications.js
import express from "express";
import {
  submitApplication,
  getAllApplications,
  updateApplication,
} from "../controllers/applicationsController.js";

const router = express.Router();

router.post("/", submitApplication);
router.get("/", getAllApplications);
router.patch("/:id", updateApplication);

export default router;
