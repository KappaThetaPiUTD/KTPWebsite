// routes/applications.js
const express = require("express");
const router = express.Router();
const { submitApplication } = require("../controllers/applicationsController");

router.post("/", submitApplication);

module.exports = router;


// server.js or app.js

const express = require("express");
const app = express();
const authRouter = require("./routes/auth");

app.use(express.json()); // Make sure this is here for JSON parsing
app.use("/api/auth", authRouter);

// Your other configurations and routes
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
