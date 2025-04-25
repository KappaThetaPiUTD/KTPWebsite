import { supabase } from "../../lib/supabase";

const Login = () => {
    const handleGoogleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        });

        if (error) {
            console.error("Login failed:", error.message);
        }
    };

    return <button onClick={handleGoogleLogin}>Login with Google</button>;
};

export default Login;

import { supabase } from "../../lib/supabase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        });

        if (error) console.error("Login failed:", error.message);
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data: user } = await supabase.auth.getUser();
            if (user) navigate("/dashboard");
        };

        checkUser();
    }, []);

    return <button onClick={handleGoogleLogin}>Login with Google</button>;
};

export default Login;
