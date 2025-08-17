// server/routes/auth.js

const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { supabase } = require("../lib/supabase");
const router = express.Router();

/*
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
const JWT_EXPIRATION = "1h";

// Register Route (Sign Up)
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: data.user.id, email: data.user.email }, SUPABASE_JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

*/
// Forgot Password - Generate Reset Link
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (userError || !user) {
        return res.status(404).json({ message: "User not found." });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

      console.log("Reset Token:", resetToken);
      console.log("Reset Token Hash:", resetTokenHash);

      // Save the token hash in the password_resets table
      const { error: insertError } = await supabase.from("password_resets").upsert({
        user_id: user.id,
        reset_token: resetTokenHash,
        expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      });

      if (insertError) {
        console.error("Error inserting reset token:", insertError);
        return res.status(500).json({ message: "Failed to save reset token." });
      }

      const resetLink = `https://ktputd.org/reset-password?token=${resetToken}&user_id=${user.id}`;

      // Send email with reset link
      const transporter = nodemailer.createTransporter({
        service: "gmail",
        auth: {
          user: process.env.KTP_EMAIL,
          pass: process.env.KTP_EMAIL_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.KTP_EMAIL,
        to: email,
        subject: "Password Reset for KTP Portal",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 15 minutes.</p>`,
      });

      res.status(200).json({ message: "Password reset email sent." });
    } catch (error) {
      console.error("Error during forgot-password:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });

module.exports = router;