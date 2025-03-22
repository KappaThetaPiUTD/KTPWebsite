import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kgjdzczdrzyweemvcsqq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnamR6Y3pkcnp5d2VlbXZjc3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1OTA1MjgsImV4cCI6MjA1ODE2NjUyOH0.v3F7dWCM8bWY58jyJWy6mthsHNSQy1oN1Y2KuYWiPLs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);