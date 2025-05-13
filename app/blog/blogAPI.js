import { ascending } from "d3-array";
import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseURL, supabaseAnonKey);

export const fetchPosts = async () => {
    const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

    console.log("SUPABASE FETCH DATA:", data);
    
    if(error){
        console.error("Error fetching posts:", error);
        return[];
    }

    return data;
};

export const addPost = async(title, content, author) => {
    const { data, error } = await supabase
    .from("blog_posts")
    .insert([{ title, content, author, is_approved: false }]);

    if(error){
        console.error("Error adding post:", error);
        return null;
    }

    return data;
};

export const approvePost = async (postID) => {
    const { data, error } = await supabase
        .from("blog_posts")
        .update({is_approved: true })
        .eq("id", postID);

        if(error){
            console.error("Error approving post: ", error);
            return null;
        }

        return data;
}