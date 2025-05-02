// routes/applications.js
const express = require("express");
const router = express.Router();
const { submitApplication } = require("../controllers/applicationsController");

router.post("/", submitApplication);

module.exports = router;
