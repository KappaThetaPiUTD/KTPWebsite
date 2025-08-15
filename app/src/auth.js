// server/routes/auth.js

const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { supabase } = require("../lib/supabase");
const router = express.Router();

const sendRegistrationNotification = async (userData) => {
  try {
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.KTP_EMAIL,
        pass: process.env.KTP_EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.KTP_EMAIL,
      to: process.env.KTP_ORG_EMAIL, // Add this to your .env file
      subject: "New User Registration - KTP Portal",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #2c3e50;">🎉 New User Registration</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>Name:</strong> ${userData.name || 'Not provided'}</p>
            <p><strong>Provider:</strong> ${userData.provider}</p>
            <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>User ID:</strong> ${userData.id}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated notification from your KTP Portal registration system.
          </p>
        </div>
      `,
    });

    console.log('Registration notification sent successfully');
  } catch (error) {
    console.error('Failed to send registration notification:', error);
    // Don't throw error - we don't want email failures to break registration
  }
};

// Google OAuth Success Handler
router.get("/google/success", async (req, res) => {
  try {
    // Get user info from session or however you're storing it
    const userInfo = req.session?.user || req.user; // Adjust based on your setup
    
    if (!userInfo) {
      return res.status(401).json({ message: "No user information found" });
    }

    // Check if this is a new user by looking for recent registration
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("id, email, name, created_at")
      .eq("email", userInfo.email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error("Error checking user:", error);
    }

    // If user was just created (within last 5 minutes), send notification
    const isNewUser = existingUser && 
      new Date() - new Date(existingUser.created_at) < 5 * 60 * 1000;

    if (isNewUser) {
      // Send registration notification
      await sendRegistrationNotification({
        email: userInfo.email,
        name: userInfo.name,
        provider: 'Google OAuth',
        id: existingUser.id
      });
    }

    res.status(200).json({ 
      message: "Google OAuth successful", 
      user: userInfo 
    });
  } catch (error) {
    console.error("Google OAuth success error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Discord OAuth Success Handler
router.get("/discord/success", async (req, res) => {
  try {
    // Get user info from session or however you're storing it
    const userInfo = req.session?.user || req.user;
    
    if (!userInfo) {
      return res.status(401).json({ message: "No user information found" });
    }

    // Check if this is a new user
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("id, email, name, created_at")
      .eq("email", userInfo.email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error checking user:", error);
    }

    // If user was just created (within last 5 minutes), send notification
    const isNewUser = existingUser && 
      new Date() - new Date(existingUser.created_at) < 5 * 60 * 1000;

    if (isNewUser) {
      // Send registration notification
      await sendRegistrationNotification({
        email: userInfo.email,
        name: userInfo.name,
        provider: 'Discord OAuth',
        id: existingUser.id
      });
    }

    res.status(200).json({ 
      message: "Discord OAuth successful", 
      user: userInfo 
    });
  } catch (error) {
    console.error("Discord OAuth success error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


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
      const transporter = nodemailer.createTransport({
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
  