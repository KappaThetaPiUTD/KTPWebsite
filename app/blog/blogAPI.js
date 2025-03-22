import { ascending } from "d3-array";
import { supabase } from "./blogSupabaseClient";

export const fetchPosts = async () => {
    const { data, error } = await supabase
    .from("blog-posts")
    .select("*")
    .order("created_at", { ascending: false });

    if(error){
        console.error("Error fetching posts:", error);
        return[];
    }

    return data;
};

export const addPost = async(title, content, author) => {
    const { data, error } = await supabase
    .from("blog_posts")
    .insert([{ title, content, author }]);

    if(error){
        console.error("Error adding post:", error);
        return null;
    }

    return data;
};