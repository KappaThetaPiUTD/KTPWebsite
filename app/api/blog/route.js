import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET: fetch approved blog posts
export async function GET() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

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
      category,
      readTime,
      approved: false,
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
    .update({ approved: true })
    .eq("id", postID);

  return new Response(
    JSON.stringify(error ? { error: error.message } : data),
    { status: error ? 500 : 200 }
  );
}
