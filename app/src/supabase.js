import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { supabase } from "./supabase";

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
import { supabase } from "./supabase";

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





