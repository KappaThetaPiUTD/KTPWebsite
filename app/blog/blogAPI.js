import { ascending } from "d3-array";
import { createClient } from "@supabase/supabase-js";
import React, { useState, useEffect } from "react";

// Use the blog-specific Supabase instance for blog posts
const BLOG_SUPABASE_URL = "https://kgjdzczdrzyweemvcsqq.supabase.co";
const BLOG_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnamR6Y3pkcnp5d2VlbXZjc3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1OTA1MjgsImV4cCI6MjA1ODE2NjUyOH0.v3F7dWCM8bWY58jyJWy6mthsHNSQy1oN1Y2KuYWiPLs";

export const supabase = createClient(BLOG_SUPABASE_URL, BLOG_SUPABASE_ANON_KEY);

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

export default function LikeButton({ postID }) {
    const [likes, setLikes] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchLikes = async () => {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('likes')
            .eq('id', postID)
            .single();
        if (!error && data) setLikes(data.likes || 0);
    };

    useEffect(() => { fetchLikes(); }, [postID]);

    const handleLike = async () => {
        if (isUpdating) return;
        setIsUpdating(true);
        const prev = likes;
        const optimistic = prev + 1;
        setLikes(optimistic);
        try {
            const res = await fetch('/api/blog/likes', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postID, increment: 1 })
            });
            if (res.ok) {
                const data = await res.json();
                if (typeof data.likes === 'number') setLikes(data.likes);
            } else {
                setLikes(prev); // revert on failure
            }
        } catch (e) {
            console.error('Like failed', e);
            setLikes(prev);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <button onClick={handleLike} className="like-button">
            {isUpdating ? 'Liking...' : `Like ${likes}`}
        </button>
    );
}