import { createClient } from "@supabase/supabase-js";

// Fetches the KTP knowledge base from Supabase (the "knowledge" table in the
// KTP Blog project) and formats it for injection into the chatbot's context.
//
// Uses lightweight, dependency-free retrieval: if the whole knowledge base is
// small it is all included; once it grows large (e.g. after adding the
// constitution) only the rows most relevant to the user's question are
// included, bounded by a character budget so requests stay lean.
//
// Degrades gracefully: if the env vars, project, or table are unavailable it
// returns an empty string (and serves a stale cache if one exists) so the chat
// route never breaks. Rows are cached briefly to limit DB calls.

let cache = { at: 0, rows: null };
const TTL_MS = 5 * 60 * 1000; // 5 minutes
const BUDGET = 6000; // max characters of knowledge injected per request
const HEADER =
  "KTP knowledge base (use this to answer relevant questions; do not invent beyond it):\n";

const STOPWORDS = new Set([
  "the", "and", "for", "are", "was", "with", "that", "this", "what", "who",
  "how", "why", "when", "where", "does", "did", "can", "you", "your", "our",
  "his", "her", "she", "him", "they", "them", "about", "into", "from", "have",
  "has", "had", "will", "would", "should", "could", "there", "their", "which",
  "ktp", "kappa", "theta", "pi",
]);

async function fetchRows() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  if (cache.rows && Date.now() - cache.at < TTL_MS) {
    return cache.rows;
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("knowledge")
      .select("title, content")
      .eq("is_active", true)
      .order("id", { ascending: true });

    if (error || !Array.isArray(data)) {
      return cache.rows || [];
    }
    cache = { at: Date.now(), rows: data };
    return data;
  } catch {
    return cache.rows || [];
  }
}

function keywords(query) {
  return (
    (query || "")
      .toLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter((w) => w.length >= 3 && !STOPWORDS.has(w)) || []
  );
}

function scoreRow(row, kws) {
  if (kws.length === 0) return 0;
  const title = (row.title || "").toLowerCase();
  const content = (row.content || "").toLowerCase();
  let score = 0;
  for (const kw of kws) {
    if (title.includes(kw)) score += 3;
    if (content.includes(kw)) score += 1;
  }
  return score;
}

export async function getKnowledge(query = "") {
  const rows = await fetchRows();
  if (!rows || rows.length === 0) return "";

  const format = (r) => `- ${r.title}: ${r.content}`;

  const all = rows.map(format).join("\n");
  if (all.length <= BUDGET) {
    return HEADER + all;
  }

  // Too large to include everything: rank by relevance to the question.
  const kws = keywords(query);
  const scored = rows
    .map((r) => ({ r, score: scoreRow(r, kws) }))
    .sort(
      (a, b) => b.score - a.score || a.r.content.length - b.r.content.length
    );

  const picked = [];
  let used = 0;
  for (const { r } of scored) {
    const line = format(r);
    if (used + line.length > BUDGET && picked.length > 0) break;
    picked.push(line);
    used += line.length;
  }

  return HEADER + picked.join("\n");
}
