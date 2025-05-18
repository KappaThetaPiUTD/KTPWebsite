const express = require("express");
const router = express.Router();
const { supabase } = require("../lib/supabase");  // adjust path to supabase client

router.post("/", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: "Code is required" });
  }

  try {
    const { data, error } = await supabase
      .from("access_code")
      .select("code")
      .eq("code", code)
      .single();

    if (error) {
      throw error;
    }

    if (data && data.code === code) {
      // We can't set httpOnly cookie from frontend API, 
      // but you can send success and set cookie on frontend using js-cookie or other means

      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "Invalid code" });
    }
  } catch (err) {
    console.error("Error verifying access code:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
