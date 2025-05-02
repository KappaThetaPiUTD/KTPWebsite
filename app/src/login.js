import { supabase } from "../../lib/supabase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = async (provider) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
        });

        if (error) {
            console.error(`Login with ${provider} failed:`, error.message);
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) navigate("/dashboard");
        };

        checkUser();
    }, [navigate]);

    return (
        <div>
            <button onClick={() => handleLogin("google")}>Login with Google</button>
            <button onClick={() => handleLogin("discord")}>Login with Discord</button>
        </div>
    );
};

export default Login;
