// routes/rsvp.js
import express from "express";
const router = express.Router();
import { submitRSVP } from "../controllers/rsvpController.js";

router.post("/", submitRSVP);

//module.exports = router;
export default router;
