import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();


const router = express.Router();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  

router.get("/", async (req, res) => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
  
    console.log("EVENT DATA:", data);
    console.log("EVENT ERROR:", error);
  
    if (error) return res.status(500).json({ error: error.message });
    res.json({ data });
  });
  

export default router;
