// routes/qrCheckin.js
const express = require("express");
const { handleQrCheckin } = require("../controllers/qrCheckInController");
const router = express.Router();

router.post("/", handleQrCheckin);

module.exports = router;
