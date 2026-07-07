# KTP Chatbot: How it works and how to maintain it

The site has a floating AI assistant (bottom-right on every page) that answers
questions about KTP from prospective members and visitors. This doc explains the
architecture and the common maintenance flows.

## Architecture

| Piece | File | Role |
| --- | --- | --- |
| Chat widget (UI) | `components/Chatbot.jsx` | Floating button + chat panel. Client component. Lifts above the footer so it never covers the social icons. |
| Chat API route | `app/api/chat/route.js` | Server-side proxy to the Google Gemini API. Holds the API key (never exposed to the browser), builds the system prompt, and returns the reply. |
| Leadership roster | `lib/roster.js` | Shared source of truth for the exec + director boards. Imported by both the Brothers page and the chat route. |
| Knowledge base | `lib/knowledge.js` | Fetches extra knowledge rows from Supabase and injects the most relevant ones into the AI's context. |

**Request flow:** user types -> `POST /api/chat` -> route builds context
(`system prompt` + `live roster` + `retrieved knowledge`) -> calls Gemini -> returns reply.

## The Gemini API key

- Model: `gemini-2.5-flash-lite` (free tier: 15 req/min, 1000 req/day). Thinking is disabled so replies aren't truncated. Overridable via the `GEMINI_MODEL` env var.
- Stored as the **`GEMINI_API_KEY`** environment variable in Vercel (Settings -> Environment Variables). **Never** committed to the repo, and **not** prefixed `NEXT_PUBLIC_` (must stay server-only).
- **Cost:** free tier only. As long as no billing account is attached to the Google Cloud project, it can't be charged; at the limit, requests just return an error.

### When / how to replace the key

Gemini keys don't expire. Only replace it if it leaks, is abused, or you want it on a different (chapter-owned) Google account.

**Symptom of a key problem:** the bot consistently replies with its fallback line
(*"...email kappathetapiutd@gmail.com"*). The route degrades gracefully, so a bad/missing key never breaks the site.

1. Create a new key at https://aistudio.google.com/apikey (use a personal 18+ Google account; the chapter Gmail is age-blocked from AI Studio).
2. Vercel -> KTPWebsite -> Settings -> Environment Variables -> edit `GEMINI_API_KEY` -> Save.
3. Redeploy (Deployments -> ... -> Redeploy). Optionally delete the old key in AI Studio.

## Knowledge base (Supabase)

Extra knowledge lives in a `knowledge` table in the **KTP Blog** Supabase project
(the same project the blog uses; free tier allows 2 projects, so we reuse it rather than creating a 3rd).

Table schema:

```sql
create table if not exists knowledge (
  id bigint generated always as identity primary key,
  title text not null,
  content text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table knowledge enable row level security;

create policy "Public can read active knowledge"
  on knowledge for select
  using (is_active = true);
```

### Adding / editing knowledge

- Supabase dashboard -> **KTP Blog** project -> **Table Editor** -> `knowledge` -> add a row (`title`, `content`).
- Set `is_active` to `false` to hide a row without deleting it.
- Changes appear in the bot within ~5 minutes (server-side cache); no redeploy needed.

> **Only store PUBLIC-safe info.** The chatbot speaks these rows to any visitor and
> the table is readable via the public anon key. Do **not** store private member
> data, financials, or anything confidential.

### Adding a Google Doc (e.g. the constitution)

Because knowledge content should **not** be committed to GitHub, the flow is:

1. Make the doc link-shareable ("anyone with the link can view").
2. Export it as text: `https://docs.google.com/document/d/<DOC_ID>/export?format=txt`.
3. Split it into sensible rows (e.g. one per article/section) and insert each into the `knowledge` table via the Supabase SQL Editor. Use Postgres dollar-quoting (`$kb$ ... $kb$`) to avoid escaping issues.
4. **Strip anything with outdated names** (e.g. signature blocks). Current officers must come from `lib/roster.js`, never from a document; the system prompt enforces this, and historical/founding names in docs should be labeled as such.

### How retrieval works

`lib/knowledge.js` injects knowledge into the AI's context with a character budget
(~6000 chars). If the whole base is small, it includes everything; once it's large
(e.g. after adding the constitution), it keyword-ranks rows against the user's
question and includes only the most relevant ones. This keeps requests fast and
within free-tier limits while supporting large documents.

## Analytics

Google Analytics 4 is wired in via `components/GoogleAnalytics.jsx`. The Measurement
ID (`G-...`, public by design) is a default in code and can be overridden with the
`NEXT_PUBLIC_GA_ID` env var.
