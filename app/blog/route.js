import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseURL, supabaseAnonKey);

export const fetchPosts = async (req, res) => {
    if (req.method === "GET"){
        try {
            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                return res.status(500).json({error: error.message});
            }
            
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
};

export const addPost = async (req, res) => {
    if (req.method === "POST") {
        const {title, content, author} = req.body;

        try{
            const { data, error } = await supabase
                .from("blog_posts")
                .insert([{ title, content, author, approved: false }]);

            if (error){
                return res.status(500).json({error: error.message });
            }

            return res.status(201).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
};

export const approvePost = async (req, res) => {
    if (req.method === "PUT") {
      const { postID } = req.body;
  
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .update({ approved: true })
          .eq("id", postID);
  
        if (error) {
          return res.status(500).json({ error: error.message });
        }
  
        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  };

  export default async function handler(req, res) {
    if (req.method === "GET") {
      return fetchPosts(req, res);
    } else if (req.method === "POST") {
      return addPost(req, res);
    } else if (req.method === "PUT") {
      return approvePost(req, res);
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  }
  