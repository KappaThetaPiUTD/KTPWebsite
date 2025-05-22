// routes/qrCheckin.js
import express from "express";
import { handleQrCheckin } from "../controllers/qrCheckInController.js";
//const { handleQrCheckin } = qrCheckInController;
const router = express.Router();

router.post("/", handleQrCheckin);

//module.exports = router;
export default router;
