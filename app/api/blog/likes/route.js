import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Fetch current likes for a post: /api/blog/likes?postID=123
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const postID = searchParams.get('postID');
  if (!postID) return new Response(JSON.stringify({ error: 'postID required'}), { status: 400 });
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, likes')
    .eq('id', postID)
    .single();
  if (error || !data) return new Response(JSON.stringify({ error: error?.message || 'Not found'}), { status: 404 });
  return new Response(JSON.stringify({ likes: typeof data.likes === 'number' ? data.likes : 0, postID: data.id }), { status: 200 });
}

export async function PATCH(req) {
  try {
    const { postID, increment = 1 } = await req.json();
    if (!postID) {
      console.warn('[likes API] Missing postID');
      return new Response(JSON.stringify({ error: 'postID required'}), { status: 400 });
    }

    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, likes')
      .eq('id', postID)
      .single();

    if (fetchError || !post) {
      console.error('[likes API] Fetch error', fetchError);
      return new Response(JSON.stringify({ error: fetchError?.message || 'Post not found'}), { status: 404 });
    }

    const currentLikes = typeof post.likes === 'number' ? post.likes : 0;
    const newLikes = currentLikes + increment;

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ likes: newLikes })
      .eq('id', postID);

    if (updateError) {
      console.error('[likes API] Update error', updateError);
      return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
    }

    console.log('[likes API] Updated likes (no select)', { postID, newLikes });
    return new Response(JSON.stringify({ likes: newLikes, postID }), { status: 200 });
  } catch (e) {
    console.error('[likes API] Exception', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
