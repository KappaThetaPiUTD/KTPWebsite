import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Helper function to get user role
const getUserRole = async (userId) => {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();
  
  return error ? null : data?.role;
};

// Helper function to filter events based on user role
const filterEventsByRole = (events, userRole) => {
  if (!userRole) return events; // If no role, show all (fallback)
  
  return events.filter(event => {
    // Executive members can see everything
    if (userRole.toLowerCase() === 'executive') {
      return true;
    }
    
    // If event has no visibility set, show it (backward compatibility)
    if (!event.visibility) {
      return true;
    }
    
    // Check visibility rules
    switch (event.visibility) {
      case 'brothers_only':
        return userRole.toLowerCase() === 'brother';
      case 'pledges_only':
        return userRole.toLowerCase() === 'pledge';
      case 'brothers_and_pledges':
        return ['brother', 'pledge'].includes(userRole.toLowerCase());
      default:
        return true;
    }
  });
};

router.get("/", async (req, res) => {
  try {
    // Get user ID from request (you may need to implement auth middleware)
    const userId = req.query.user_id || req.headers['x-user-id']; // Adjust based on your auth setup
    
    // Fetch all events with visibility
    const { data: events, error } = await supabase
      .from("events")
      .select("*, visibility")
      .order("event_date", { ascending: true });

    if (error) {
      console.error("EVENT ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

    // Get user role if userId provided
    let userRole = null;
    if (userId) {
      userRole = await getUserRole(userId);
    }

    // Filter events based on user role
    const filteredEvents = filterEventsByRole(events || [], userRole);

    console.log("EVENT DATA:", filteredEvents);
    console.log("USER ROLE:", userRole);

    res.json({ data: filteredEvents });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;