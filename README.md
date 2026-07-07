## Getting Started

First, install all necessary dependencies:

```bash
npm i
# or
npm install
```

Next, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contact form

The contact form (`/contact-us`) sends messages via **EmailJS** (client-side, in `components/SubmitButton.jsx`). If EmailJS fails (for example, its Gmail OAuth grant expires), the form automatically falls back to POSTing to `app/api/contact/route.js`, which sends via **Resend** so submissions aren't lost.

- **EmailJS:** if the form stops working with a "Gmail connection" / 412 error, reconnect the Gmail account in the EmailJS dashboard (Email Services → the Gmail service → Reconnect). Gmail OAuth grants expire periodically.
- **Resend fallback:** set the `RESEND_API_KEY` env var in Vercel to enable it. Create a free key at [resend.com](https://resend.com) using the KTP Gmail as the account email (lets it send to that inbox from `onboarding@resend.dev` without domain verification). Without the key, the fallback simply no-ops.


## Upcoming Events

The Recruitment page shows an "Upcoming Events" section that is managed entirely from Supabase, so no code change or redeploy is needed to add or remove an event.

- **Code:** UI in `components/EventsSection.jsx`; server route in `app/api/events/route.js`. Events live in an `events` table in the **KTP Blog** Supabase project.
- **Add an event:** Supabase dashboard → KTP Blog project → Table Editor → `events` → Insert row. Set `title` and `event_date` (use Central time); `location`, `description`, and `rsvp_url` are optional. It shows on the site immediately.
- **Remove / hide an event:** set the row's `is_active` to `false` to hide it (reversible), or Delete the row to remove it permanently. Past events drop off automatically by date.
- Only active, upcoming events are shown, and the section hides itself when there are none. See [`docs/EVENTS.md`](docs/EVENTS.md) for full details and the one-time setup SQL.


## Chatbot (AI Assistant)

The site has a floating AI chat assistant (bottom-right, on every page) powered by the Google Gemini API.

- **Code:** UI in `components/Chatbot.jsx`; server route in `app/api/chat/route.js`. The API key is read server-side and is **never** exposed to the browser.
- **API key:** stored in Vercel as the `GEMINI_API_KEY` environment variable (Project → Settings → Environment Variables). It is **not** committed to the repo.
- **Cost:** uses the Gemini **free tier**. As long as no billing account is attached to the Google Cloud project, it cannot be charged; at the free limit, requests just return an error.

### When / how to replace the key

Gemini API keys **don't expire**. You only need to replace the key if it is leaked publicly, abused, or you want it on a different (chapter-owned) Google account.

**How you'll know there's a key problem:** the chatbot consistently replies with its fallback line (*"…email kappathetapiutd@gmail.com"*) instead of real answers. The route degrades gracefully, so a bad/missing key never breaks the site.

**To replace it (~2 min):**

1. Create a new key at https://aistudio.google.com/apikey (use a personal 18+ Google account; the chapter Gmail is age-blocked from AI Studio).
2. In Vercel → KTPWebsite → Settings → Environment Variables, edit `GEMINI_API_KEY` with the new value and Save.
3. Redeploy (Deployments → ⋯ → Redeploy).
4. Optionally delete the old key in AI Studio.

Optional env override: `GEMINI_MODEL` (defaults to `gemini-2.5-flash-lite`).

### Knowledge base (Supabase)

Beyond its built-in KTP facts and the live board roster (`lib/roster.js`), the chatbot pulls extra knowledge from a `knowledge` table in the **KTP Blog** Supabase project (`lib/knowledge.js`). Rows are injected into the AI's context using lightweight keyword retrieval with a character budget, so large documents (e.g. the constitution) only load when relevant.

- **Add/edit knowledge:** Supabase dashboard → KTP Blog project → Table Editor → `knowledge` → add a row (`title`, `content`). Set `is_active` to false to hide a row. Changes appear in the bot within ~5 minutes (cache); no redeploy needed.
- **Only store PUBLIC-safe info.** The chatbot speaks it to any visitor and the table is readable via the public anon key. Do not store private member data or anything confidential.
- The current board roster is the sole source of truth for who holds a position; names appearing in stored documents are treated as historical.


## Analytics

Google Analytics 4 is wired in via `components/GoogleAnalytics.jsx`. The Measurement ID (`G-…`, which is public by design) is set as a default in code and can be overridden per-environment with the `NEXT_PUBLIC_GA_ID` env var.

