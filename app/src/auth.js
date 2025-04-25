// server/middleware/auth.js

const jwt = require('jsonwebtoken');

// Supabase JWT Secret (You will get this from Supabase)
const SUPABASE_JWT_SECRET = "your-supabase-jwt-secret"; // You will find this in Supabase settings.

// This middleware will verify the JWT token and attach the decoded data to `req.user`
const authMiddleware = (req, res, next) => {
    // Extract JWT token from Authorization header
    const token = req.headers['authorization'];

    // If no token is provided, return a 401 Unauthorized error
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Remove the 'Bearer ' part of the token (if it exists)
    const jwtToken = token.split(' ')[1];

    // Verify the token with Supabase's secret key
    jwt.verify(jwtToken, SUPABASE_JWT_SECRET, (err, decoded) => {
        if (err) {
            // If verification fails, send an error
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Attach the decoded user information to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    });
};

module.exports = authMiddleware;

// server/routes/user.js

const express = require("express");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Example secured API endpoint
router.get("/user-profile", authMiddleware, (req, res) => {
    // Only accessible by authenticated users
    const user = req.user;  // This is the decoded JWT payload (user info)

    res.json({ message: "User profile data", user });
});

module.exports = router;

const express = require("express");
const app = express();
const userRoutes = require("./routes/user");

app.use("/api", userRoutes);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
