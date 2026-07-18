import { getSupabaseClient } from "../../../lib/supabase";

function unavailableResponse() {
  return Response.json(
    { error: "Blog database is not configured." },
    { status: 503 }
  );
}

// GET: fetch approved blog posts
export async function GET() {
  const supabase = getSupabaseClient();
  if (!supabase) return unavailableResponse();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  return Response.json(error ? { error: error.message } : data, {
    status: error ? 500 : 200,
  });
}

// POST: add blog post
export async function POST(request) {
  const supabase = getSupabaseClient();
  if (!supabase) return unavailableResponse();

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

  return Response.json(error ? { error: error.message } : data, {
    status: error ? 500 : 201,
  });
}


// PUT: approve a blog post
export async function PUT(request) {
  const supabase = getSupabaseClient();
  if (!supabase) return unavailableResponse();

  const body = await request.json();
  const { postID } = body;

  const { data, error } = await supabase
    .from("blog_posts")
    .update({ is_approved: true })
    .eq("id", postID);

  return Response.json(error ? { error: error.message } : data, {
    status: error ? 500 : 200,
  });
}
