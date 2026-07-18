# Vercel Deployment and Environment Configuration

## Normal deployment

Every push to `main` triggers a production deployment in Vercel. Pull requests
receive preview deployments.

Before pushing:

```powershell
npm install
npm run lint
npm run build
```

The project pins Node.js `24.x` in `package.json`. Vercel announced that Node 20
deployments created on or after October 1, 2026 will fail, so do not remove the
Node 24 setting without replacing it with a supported version.

## Environment files

- `.env`: private local values, ignored by Git
- `.env.example`: names and safe defaults, tracked
- `.env.production`: only the browser-public Supabase URL and anon key, tracked
- Vercel Environment Variables: private production values such as Gemini and
  Resend keys

Never add a private value to `.env.production`. Values beginning with
`NEXT_PUBLIC_` are included in the browser bundle and visible to every visitor.

## July 2026 deployment incident

After the old committed `.env` file was removed, Vercel revealed that the
Supabase URL and anon key had never been configured independently. The build
failed with:

```text
Error: supabaseUrl is required
Failed to collect page data for /api/blog/likes
```

The permanent fix:

1. Added `.env.production` with only the two public Supabase values.
2. Added `lib/supabase.js`, which returns `null` when configuration is missing
   instead of constructing an invalid client.
3. Updated blog routes to create Supabase clients inside request handling.
4. Updated the client like button to read likes through the API route.
5. Pinned Node.js 24.

## Troubleshooting a failed deployment

1. Open Vercel, KTPWebsite, Deployments, failed deployment, Build Logs.
2. Find the first real error, not the final `npm run build exited with 1`.
3. Reproduce locally with `npm run build`.
4. If it may be environment-related, temporarily test without local `.env` and
   confirm `.env.production` contains only the public Supabase variables.
5. Fix, commit, push, and wait for the new deployment. Do not click Redeploy on
   the old failed commit after a new fix has already been pushed.
6. Verify the homepage and relevant API routes live.

## Live smoke test

```powershell
Invoke-WebRequest https://ktp-website.vercel.app/ -SkipHttpErrorCheck
Invoke-WebRequest https://ktp-website.vercel.app/api/blog -SkipHttpErrorCheck
Invoke-WebRequest https://ktp-website.vercel.app/api/events -SkipHttpErrorCheck
Invoke-WebRequest https://ktp-website.vercel.app/api/birthdays -SkipHttpErrorCheck
```
