const express = require("express");
const router = express.Router();
const { submitRSVP } = require("../controllers/rsvpController");

router.post("/", submitRSVP);

module.exports = router;
