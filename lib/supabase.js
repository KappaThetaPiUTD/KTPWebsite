"use client";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


const handleLogin = async () => {
    const { user, error } = await supabase.auth.signInWithPassword({
        email: "user@example.com",
        password: "password123",
    });

    if (error) {
        console.error("Error logging in:", error.message);
    } else {
        console.log("User logged in:", user);
    }
};

import { useState, useEffect } from "react";

const useUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const session = supabase.auth.session();
        setUser(session?.user ?? null);

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            authListener?.unsubscribe();
        };
    }, []);

    return user;
};

export default useUser;





