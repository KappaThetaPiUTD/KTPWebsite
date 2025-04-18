import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {

  const { searchParams } = new URL(req.url)
  const tag = searchParams.get("tag");
  const category = searchParams.get("category");

  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

    if(tag){
      query = query.ilike("tags", '%${tag}%');
    }

    if(category){
      query = query.eq("category", category);
    }

  const {data, error } = await query;
  
  const cleanedData = (data || []).map(post => ({
    ...post,
    slug: post.slug || post.id,
    tags: post.tags ? post.tags.split(",") : [],
    readTime: post.readTime || "5 min read",
    category: post.category || "brothers",
  }));

  return new Response(
    JSON.stringify(error ? { error: error.message } : cleanedData),
    { status: error ? 500 : 200 }
  );
}

export async function POST(req) {
  const body = await req.json();
  const { title, content, author } = body;

  const { data, error } = await supabase
    .from("blog_posts")
    .insert([{
      title,
      content,
      author,
      approved: false,
      tags: "General",
      readTime: "5 min read",
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      category: "brothers"
    }]);

  return new Response(
    JSON.stringify(error ? { error: error.message } : data),
    { status: error ? 500 : 201 }
  );
}
export async function PUT(req) {
  const { postID, userID } = await req.json();

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", userID)
    .single();

  if (userError || !userData || userData.role !== "exec"){
    return new Response(
      JSON.stringify({ error: "Unauthorized: Execs only"}),
      { status: 403 }
    );
  }

  const {data, error} = await supabase
    .from("blog_posts")
    .update({approved: true, approved_by: userID})
    .eq("id", postID);

  return new Response(
    JSON.stringify(error ? { error: error.message } : data),
    { status: error ? 500 : 200 }
  );
}

export async function PATCH(req) {
  const { postID } = await req.json();

  const { data, error } = await supabase.rpc("increment_likes", { postid: postID });

  return new Response(
    JSON.stringify(error ? { error: error.message } : data),
    { status: error ? 500 : 200 }
  );
}

