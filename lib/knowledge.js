import { createClient } from "@supabase/supabase-js";

// Fetches the KTP knowledge base from Supabase (the "knowledge" table in the
// KTP Blog project) and formats it for injection into the chatbot's context.
//
// Degrades gracefully: if the env vars, project, or table are unavailable, it
// returns an empty string (and serves a stale cache if one exists) so the chat
// route never breaks. Results are cached briefly to limit DB calls.

let cache = { at: 0, text: "" };
const TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function getKnowledge() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return "";

  if (cache.text && Date.now() - cache.at < TTL_MS) {
    return cache.text;
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("knowledge")
      .select("title, content")
      .eq("is_active", true)
      .order("id", { ascending: true });

    if (error || !Array.isArray(data) || data.length === 0) {
      return cache.text || "";
    }

    const text =
      "Additional KTP knowledge base (use this to answer relevant questions):\n" +
      data.map((r) => `- ${r.title}: ${r.content}`).join("\n");

    cache = { at: Date.now(), text };
    return text;
  } catch {
    return cache.text || "";
  }
}
