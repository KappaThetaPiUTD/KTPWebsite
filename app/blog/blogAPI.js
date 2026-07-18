import React, { useState, useEffect } from "react";
import { getSupabaseClient } from "../../lib/supabase";

export const fetchPosts = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
    if(error){
        console.error("Error fetching posts:", error);
        return[];
    }

    return data;
};

export const addPost = async(title, content, author) => {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

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
    const supabase = getSupabaseClient();
    if (!supabase) return null;

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

    useEffect(() => {
        let active = true;

        const fetchLikes = async () => {
            try {
                const res = await fetch(`/api/blog/likes?postID=${encodeURIComponent(postID)}`);
                if (!res.ok) return;
                const data = await res.json();
                if (active && typeof data.likes === 'number') {
                    setLikes(data.likes);
                }
            } catch (error) {
                console.error('Fetching likes failed', error);
            }
        };

        fetchLikes();
        return () => {
            active = false;
        };
    }, [postID]);

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