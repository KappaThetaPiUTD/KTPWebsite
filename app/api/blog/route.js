import { createClient } from "@supabase/supabase-js";

// Use the blog-specific Supabase instance (kgjdzczdrzyweemvcsqq) for blog posts
const BLOG_SUPABASE_URL = process.env.BLOG_SUPABASE_URL || "https://kgjdzczdrzyweemvcsqq.supabase.co";
const BLOG_SUPABASE_ANON_KEY = process.env.BLOG_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnamR6Y3pkcnp5d2VlbXZjc3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1OTA1MjgsImV4cCI6MjA1ODE2NjUyOH0.v3F7dWCM8bWY58jyJWy6mthsHNSQy1oN1Y2KuYWiPLs";

const supabase = createClient(
  BLOG_SUPABASE_URL,
  BLOG_SUPABASE_ANON_KEY
);

// GET: fetch approved blog posts
export async function GET() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
    console.log("Fetched from Supabase:", data, error);


  return new Response(
    JSON.stringify(error ? { error: error.message } : data),
    { status: error ? 500 : 200 }
  );
}

// POST: add blog post
export async function POST(request) {
  const body = await request.json();
  const { title, content, author, tags, slug, category, readTime } = body;

  const { data, error } = await supabase
    .from("blog_posts")
    .insert([{
      title,
      content,
      author,
      tags,
      slug,
      category: category?.toLowerCase().trim(), // normalize here
      readTime,
      is_approved: false,
    }]);

  return new Response(
    JSON.stringify(error ? { error: error.message } : data),
    { status: error ? 500 : 201 }
  );
}


// PUT: approve a blog post
export async function PUT(request) {
  const body = await request.json();
  const { postID } = body;

  const { data, error } = await supabase
    .from("blog_posts")
    .update({ is_approved: true })
    .eq("id", postID);

  return new Response(
    JSON.stringify(error ? { error: error.message } : data),
    { status: error ? 500 : 200 }
  );
  
}


