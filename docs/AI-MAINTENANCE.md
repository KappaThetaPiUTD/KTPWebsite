# KTP Website AI Maintenance and Prompt Library

Use this guide when working with GitHub Copilot, Claude, ChatGPT, Gemini, or
another coding assistant. It tells you which files matter, what context to
provide, and how to ask for implementation rather than generic advice.

## Non-negotiable safety rules

Never paste or upload:

- `.env` contents
- API secrets, service-role keys, passwords, tokens, or cookies
- private member phone numbers or email addresses
- emergency contacts
- medication or allergy information
- schedules, resumes, transcripts, or birth years
- Supabase exports containing private portal data

Public browser configuration such as a Supabase anon key is technically visible
to site visitors, but still avoid copying values when file names and variable
names are sufficient.

Tell the assistant:

- Preserve unrelated uncommitted changes.
- Do not use destructive Git commands.
- Do not rewrite Git history.
- Do not commit or expose secrets.
- Follow existing file patterns and naming.
- Implement and validate the change, not only describe it.
- Run the smallest existing build/lint command that covers the change.
- Use no em dashes in written site content.

## Standard context packet

Paste this before an issue-specific prompt:

```text
Repository: KappaThetaPiUTD/KTPWebsite
Stack: Next.js 14 App Router, React 18, Tailwind CSS, Vercel, Supabase,
Cloudinary, EmailJS/Resend, Gemini, and GA4.

Important rules:
- Preserve unrelated working-tree changes.
- Do not commit secrets or private member data.
- Do not use destructive Git commands or rewrite history.
- Reuse existing helpers and patterns.
- Make the code readable for rotating student maintainers.
- Implement the change, run the relevant build/lint, and summarize the result.
- Do not use em dashes in copy.

Task:
[Describe the exact desired behavior.]

Acceptance criteria:
1. [Visible outcome]
2. [Edge case]
3. [What should remain unchanged]

Relevant files:
[Paste file paths and contents or attach the files.]

Evidence:
[Screenshot, error log, data row, or reproduction steps.]
```

## What to attach in a Claude or ChatGPT UI

Attach only the smallest useful set:

1. Screenshot or error output
2. Main page/component
3. Shared helper/data source
4. API route if data is dynamic
5. Relevant config if the error is build/deployment related

Do not upload the whole repository unless the tool has trusted repository
access. Never attach `.env`.

## Page and feature map

### Home page

Use:

- `app/page.jsx`
- `components/home/hero.jsx`
- `components/home/who-we-is.jsx`
- `components/home/pillars.jsx`
- `components/CompanyCollage.js`
- `components/BirthdayBanner.jsx`
- `app/globals.css`

Dynamic birthday data:

- `app/api/birthdays/route.js`
- Supabase `birthdays` table

### About page

Use:

- `app/about-us/page.jsx`
- `components/image.jsx`
- `components/paragraphs.jsx`
- `components/slogan.jsx`

### Brothers and boards

Use:

- `app/brothers/page.jsx`
- `lib/roster.js`
- `components/MemberCard.jsx`

Important coupling: `lib/roster.js` also feeds the chatbot. Update it for
current executive/director roles. Active member cards and class-history arrays
live in `app/brothers/page.jsx`.

### Alumni

Use:

- `app/alumni/page.jsx`
- `components/MemberCard.jsx`

### Recruitment

Use:

- `app/recruitment/page.jsx`
- `app/recruitment/form.jsx`
- `components/EventsSection.jsx`
- `components/FAQ.jsx`
- `app/api/events/route.js`
- `lib/events.js`
- `docs/EVENTS.md`

### Blog

Use:

- `app/blog/page.jsx`
- `app/blog/[slug]/page.jsx`
- `app/blog/blogAPI.js`
- `app/api/blog/route.js`
- `app/api/blog/likes/route.js`
- `lib/supabase.js`

Data lives in the KTP Blog Supabase `blog_posts` table.

### Gallery

Use:

- `app/gallery/page.jsx`
- Cloudinary image URLs/dimensions

The gallery uses `react-photo-album` and `yet-another-react-lightbox`. Every
photo needs real width, height, and useful alt text.

### Contact form

Use:

- `app/contact-us/page.jsx`
- `components/Inputs.jsx`
- `components/SubmitButton.jsx`
- `app/functions/validations.js`
- `app/api/contact/route.js`

EmailJS is primary. Resend is the fallback.

### Chatbot

Use:

- `components/Chatbot.jsx`
- `app/api/chat/route.js`
- `lib/knowledge.js`
- `lib/events.js`
- `lib/roster.js`
- `docs/CHATBOT.md`

Do not put private chapter information into chatbot knowledge.

### Member portal

Use:

- `app/portal/**`
- `components/portal/**`
- `lib/portal/**`
- `app/api/portal/**`
- `middleware.js`
- `supabase/portal-schema.sql`
- `docs/PORTAL.md`

Never authorize from client state or user-editable Auth metadata. Roles belong
in `portal_members`; database RLS is mandatory.

### Navigation, footer, SEO, and analytics

Use:

- `app/layout.js`
- `components/Navbar.jsx`
- `components/footer.jsx`
- `components/GoogleAnalytics.jsx`
- `lib/analytics.js`
- `app/manifest.js`
- `app/robots.js`
- `app/sitemap.js`

### Deployment and dependencies

Use:

- `package.json`
- `package-lock.json`
- `next.config.js`
- `next.config.mjs`
- `.env.example`
- `.env.production`
- `docs/DEPLOYMENT.md`
- `docs/SECURITY.md`

## Copy-ready prompts

### General issue implementation

```text
Use the standard KTP context above. Investigate and implement this issue:
[issue].

First trace the current data and component flow. Reuse existing helpers. Make
the smallest complete change. Preserve unrelated edits. Add clear error/empty
states consistent with the repository. Run npm run build and npm run lint.

Acceptance criteria:
[criteria].
```

### Update a current officer

```text
Update the current KTP board member:
Name: [name]
Position: [position]
Headshot URL: [Cloudinary URL]
LinkedIn: [URL or blank]

Relevant files: lib/roster.js and app/api/chat/route.js.
lib/roster.js is the authoritative source for both the Brothers page and
chatbot. Confirm the chatbot semester label is current. Do not change pledge
class history or unrelated members. Build after editing.
```

### Add or update an active member card

```text
Add/update this active-member card:
Name: [name]
Image: [Cloudinary URL or attached photo]
LinkedIn: [URL or blank]
Pledge class: [class]

Inspect app/brothers/page.jsx and components/MemberCard.jsx. Use the existing
object shape. Keep the card alphabetical through the existing sort. Ensure the
name also appears exactly once in the correct class-history list. Use explicit
Next Image sizes/quality through MemberCard. Build and verify.
```

### Remove an inactive member card

```text
The following member is inactive this semester: [name].

Remove only their photo card from activeMembers in app/brothers/page.jsx.
Preserve their pledge-class history unless I explicitly say they left KTP
entirely. Search the repository for other public-card references. Check whether
an active birthday row also needs to be disabled, but do not delete history.
Build and show the exact diff.
```

### Remove someone who left KTP entirely

```text
[name] has left KTP and should be removed from the public website entirely.

Search all code-managed public pages for the exact name. Remove the active card
and pledge-class list entry. Do not remove unrelated historical blog content
without asking. Check active birthday data and flag any row that must be
disabled. Build and verify no public roster reference remains.
```

### Headshot upload

```text
Use [attached image/path] as the new headshot for [exact site name].

Inspect upload-headshots.js and the member's current entry. Copy/rename the
image in a temporary isolated folder, run the uploader with --dry-run, then do
the real upload only after it matches one expected entry. Verify the Cloudinary
URL and review the source diff. Clean up temporary files. Never print
Cloudinary secret values.
```

### Blog listing or filter bug

```text
Fix this blog behavior:
[reproduction + expected behavior].

Attach app/blog/page.jsx, app/api/blog/route.js, and a sanitized sample response.
Also inspect app/blog/[slug]/page.jsx if navigation/detail rendering is
affected. Preserve loading, error, and empty states. Treat data as nullable and
untrusted. Do not add a second Supabase client pattern if lib/supabase.js already
covers it. Build and test the relevant API response.
```

### Add a blog post through Supabase

```text
I need a new blog post. Produce a Supabase-safe row/SQL statement using:
Title: [title]
Author: [author]
Category: brothers/alumni
Tags: [tags]
Body: [body]
Image: [public URL]

Create a URL-safe slug, estimate read time, set is_approved false by default,
and do not invent facts. Explain how to preview and publish by changing
is_approved. Do not include private member data.
```

### Blog likes issue

```text
Investigate the blog like issue:
[symptom].

Attach app/api/blog/likes/route.js, app/blog/blogAPI.js, and the relevant slug
page. Keep Supabase client creation build-safe. Ensure optimistic updates roll
back on failure. Do not trust a client-supplied admin/user identity. Run build
and test GET/PATCH error cases.
```

### Recruitment events

```text
Update the Supabase-managed upcoming-events feature:
[desired change].

Use components/EventsSection.jsx, app/api/events/route.js, lib/events.js, and
docs/EVENTS.md. Preserve the rule that the entire section, including heading,
hides when there are no active upcoming events. Display Central time. Keep
chatbot events and page events consistent. Add/update documentation if the table
shape changes.
```

### Birthday banner

```text
Update the birthday feature:
[desired change].

Use components/BirthdayBanner.jsx, app/api/birthdays/route.js, and
docs/BIRTHDAYS.md. Store only month/day, never birth year. Hide the complete
banner when no birthday exists. Check Central-time date handling and
session-based dismissal.
```

### Recruitment FAQ

```text
Add or revise this recruitment FAQ:
Question: [question]
Answer: [answer]

Use components/FAQ.jsx. Keep the accordion accessible, concise, and accurate.
Do not promise dates or policies that are not confirmed. Preserve analytics
tracking and hide no unrelated content.
```

### Gallery photo update

```text
Add these approved photos to the KTP gallery:
[Cloudinary URLs or attached files].

Use app/gallery/page.jsx. For every image determine actual pixel width/height
and write useful alt text. Preserve justified rows, lightbox, zoom, counter, and
download behavior. Avoid duplicates. Build and inspect desktop/mobile layout.
```

### Company logo carousel

```text
Add/update this company logo:
Company: [name]
Logo: [public URL or attached image]

Use components/CompanyCollage.js. Upload to the existing Cloudinary Companies
folder if needed. Use accurate alt text and transparent/cropped media when
possible. Check that the three-row loop remains seamless and no company is
duplicated.
```

### Chatbot answer or knowledge issue

```text
The KTP chatbot should answer this question:
[question]
Expected factual answer:
[answer/source]

Inspect app/api/chat/route.js, lib/knowledge.js, lib/events.js, and
lib/roster.js. Current officer names must come only from lib/roster.js. Public
policies/FAQ content may go in Supabase knowledge. Never invent facts or expose
private information. Keep errors friendly and preserve rate-limit/timeout
handling. Provide any SQL separately for me to run.
```

### Contact form not delivering

```text
Diagnose this contact-form failure:
[browser error, EmailJS status, Resend log, or screenshot].

Use components/SubmitButton.jsx and app/api/contact/route.js. EmailJS remains
primary; Resend remains fallback. Do not expose keys. Validate required fields,
surface both failure paths honestly, and do not show success unless one sender
actually succeeds. Build and test a sanitized request.
```

### Vercel build failure

```text
Fix this Vercel deployment failure:
[paste build log beginning at the first real error].

Inspect package.json, package-lock.json, docs/DEPLOYMENT.md, and only files in
the stack trace. Reproduce with npm run build locally. Check whether Vercel is
missing an environment variable, but never ask me to paste secret values.
Preserve the Node 24 setting. Push the fix only after a deployment-style local
build succeeds.
```

### Dependency/security update

```text
Review and safely reduce current npm vulnerabilities.

Run npm audit and npm outdated. Separate production from development findings.
Remove direct dependencies only after confirming they are unused. Apply
non-breaking fixes first. Do not run npm audit fix --force or jump Next/React
major versions without a migration plan. Run lint/build and summarize remaining
risks and why they are deferred.
```

### Portal authentication or onboarding

```text
Implement/fix this KTP Portal behavior:
[behavior].

Use app/portal/**, components/portal/**, lib/portal/**, middleware.js,
app/api/portal/**, supabase/portal-schema.sql, and docs/PORTAL.md.

Security requirements:
- Server-verify the session.
- Official role/status comes from portal_members, never user-editable metadata.
- Enforce access with RLS even when UI is hidden.
- No public self-signup.
- No service-role key in browser code.
- User can update only their own personal profile.
- Add SQL policies/functions when data access changes.

Build and test signed-out, unauthorized, missing-schema, and authorized paths.
```

### Portal admin feature

```text
Add this portal admin feature:
[feature].

Require admin/exec on the server and in RLS. The client must not choose the
acting admin identity. Record actor and timestamp server-side. Use append-only
audit records or an explicit void/correction flow instead of silent deletion.
Return 401/403/400/500 accurately. Add schema migration and operating docs.
```

### Pull request review

```text
Review this branch/PR against main:
[branch or PR].

Report only high-confidence bugs, security issues, data loss, regressions, or
missing requirements. Ignore style. Trace affected call paths and compare with
current main so stale branch history is not reintroduced. State whether to
merge, fix first, cherry-pick specific commits, manually port behavior, or mark
the branch superseded.
```

### Merge stale branches safely

```text
These branches are far behind main:
[branches].

Do not merge them directly. Identify each branch's unique commits after the
shared merge base. Review those changes. Port the intended behavior into current
architecture, test it, commit it, then record merge ancestry with an ours merge
only after equivalent behavior is present. Delete remote branches only after
main is pushed and green.
```

## Prompt for asking an AI to fix its own incomplete answer

```text
You gave me an outline, not a completed implementation. Redo it with:
- actual file edits
- complete definitions and examples
- full code context, not fragments
- exercise answer/solution
- explicit error and empty states
- exact validation commands and results

Do not tell me what I should do manually if you can perform it. Do not leave
TBD, placeholders, pseudocode where runnable code is required, or unverified
claims.
```

## Verification checklist after AI work

1. Read `git diff`; confirm only intended files changed.
2. Search for secrets and private data.
3. Run `npm run lint`.
4. Run `npm run build`.
5. Test the affected route/API locally.
6. Check mobile layout for UI work.
7. Confirm database policy changes exist for new portal data.
8. Commit only related files.
9. Push and wait for Vercel success.
10. Test the live page/API.

## Useful Windows commands

```powershell
git --no-pager status --short
git --no-pager diff -- path\to\file
npm run lint
npm run build
Invoke-WebRequest "http://localhost:3000/path" -SkipHttpErrorCheck
Invoke-RestMethod "https://api.github.com/repos/KappaThetaPiUTD/KTPWebsite/commits/<sha>/status"
```

## If the AI says it needs every file

Start with the page, its imported custom components, its shared data/helper, and
its API route. Let the assistant request another specific file after explaining
why it is needed. This keeps private and irrelevant data out of the prompt.
