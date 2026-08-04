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
      .order("id", { ascending: true })
      .abortSignal(AbortSignal.timeout(2500));

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
  const title = String(row.title || "").toLowerCase();
  const content = String(row.content || "").toLowerCase();
  const phrase = kws.join(" ");
  let score = 0;

  for (const kw of kws) {
    if (title.includes(kw)) score += 4;
    if (content.includes(kw)) score += 1;
  }

  if (phrase.length >= 3) {
    if (title.includes(phrase)) score += 8;
    if (content.includes(phrase)) score += 4;
  }

  if (kws.length > 1 && kws.every((kw) => title.includes(kw))) score += 4;
  if (kws.length > 1 && kws.every((kw) => content.includes(kw))) score += 2;

  return score;
}

export function rankKnowledgeRows(rows, query = "") {
  const kws = keywords(query);
  return rows
    .map((row, index) => ({
      row,
      index,
      score: scoreRow(row, kws),
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        String(a.row.content || "").length -
          String(b.row.content || "").length ||
        a.index - b.index
    );
}

function formatRow(row) {
  return `- ${row.title}: ${String(row.content || "")}`;
}

function findExcerptStart(content, query, windowLength) {
  const lowered = content.toLowerCase();
  const kws = keywords(query);
  const phrase = kws.join(" ");
  const phraseIndex = phrase.length >= 3 ? lowered.indexOf(phrase) : -1;
  if (phraseIndex >= 0) {
    return Math.max(0, phraseIndex - Math.floor(windowLength / 3));
  }

  const positions = [];
  for (const kw of kws) {
    let index = lowered.indexOf(kw);
    while (index >= 0 && positions.length < 200) {
      positions.push(index);
      index = lowered.indexOf(kw, index + kw.length);
    }
  }
  if (positions.length === 0) return 0;

  let bestStart = 0;
  let bestCoverage = -1;
  let bestPosition = Number.POSITIVE_INFINITY;

  for (const position of positions) {
    const start = Math.max(0, position - Math.floor(windowLength / 3));
    const window = lowered.slice(start, start + windowLength);
    const coverage = kws.filter((kw) => window.includes(kw)).length;

    if (
      coverage > bestCoverage ||
      (coverage === bestCoverage && position < bestPosition)
    ) {
      bestStart = start;
      bestCoverage = coverage;
      bestPosition = position;
    }
  }

  return bestStart;
}

function excerptContent(content, query, maxLength) {
  if (content.length <= maxLength) return content;
  if (maxLength <= 6) return content.slice(0, maxLength);

  const bodyLength = maxLength - 6;
  let start = findExcerptStart(content, query, bodyLength);
  start = Math.min(start, Math.max(0, content.length - bodyLength));
  const end = Math.min(content.length, start + bodyLength);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < content.length ? "..." : "";
  const available = maxLength - prefix.length - suffix.length;

  return `${prefix}${content
    .slice(start, start + available)
    .trim()}${suffix}`;
}

function fitLine(row, query, remaining) {
  const line = formatRow(row);
  if (line.length <= remaining) return line;

  const prefix = `- ${row.title}: `;
  const available = remaining - prefix.length;
  if (available <= 0) return "";
  return `${prefix}${excerptContent(
    String(row.content || ""),
    query,
    available
  )}`;
}

function lineMatchesQuery(line, query) {
  const lowered = line.toLowerCase();
  return keywords(query).some((kw) => lowered.includes(kw));
}

export function buildKnowledgeContext(rows, query = "", budget = BUDGET) {
  if (!Array.isArray(rows) || rows.length === 0 || budget <= 0) {
    return { context: "", sources: [] };
  }

  const ranked = rankKnowledgeRows(rows, query);
  const all = rows.map(formatRow).join("\n");
  const orderedRows =
    all.length <= budget ? rows : ranked.map(({ row }) => row);

  const lines = [];
  const selectedLines = new Map();
  let used = 0;

  for (const row of orderedRows) {
    const separatorLength = lines.length > 0 ? 1 : 0;
    const remaining = budget - used - separatorLength;
    if (remaining <= 0) break;

    const line = fitLine(row, query, remaining);
    if (!line) break;

    lines.push(line);
    selectedLines.set(row, line);
    used += separatorLength + line.length;

    if (line.length < formatRow(row).length) break;
  }

  const seenTitles = new Set();
  const sources = ranked
    .filter(
      ({ row, score }) =>
        score > 0 &&
        selectedLines.has(row) &&
        lineMatchesQuery(selectedLines.get(row), query)
    )
    .map(({ row }) => row.title)
    .filter((title) => {
      const key = title.toLowerCase();
      if (seenTitles.has(key)) return false;
      seenTitles.add(key);
      return true;
    })
    .slice(0, 5);

  return {
    context: lines.length > 0 ? HEADER + lines.join("\n") : "",
    sources,
  };
}

export async function getKnowledgeWithSources(query = "") {
  const rows = await fetchRows();
  return buildKnowledgeContext(rows, query);
}

export async function getKnowledge(query = "") {
  const { context } = await getKnowledgeWithSources(query);
  return context;
}
