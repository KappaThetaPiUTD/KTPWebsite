// server/routes/user.js

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { supabase } = require("../lib/supabase");

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
 // Replace with your secret
const JWT_EXPIRATION = "1h"; // Token expires in 1 hour

// Register Route (Sign Up)
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in Supabase with hashed password
        const { error } = await supabase.auth.signUp({
            email: email,
            password: hashedPassword,
        });

        if (error) {
            return res.status(400).json({ message: "Error creating user.", error: error.message });
        }

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Fetch user from Supabase
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error || !user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Generate JWT for user
        const token = jwt.sign(
            { id: user.id, email: user.email },
            SUPABASE_JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        res.status(200).json({ message: "Login successful.", token });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports = router;
