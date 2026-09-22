# Vercel Deployment and Environment Configuration

## Normal deployment

Every push to `main` triggers a production deployment in Vercel. Pull requests
receive preview deployments. GitHub Actions also runs tests, lint, and a
production build on every pull request and every push to `main`.

The standard path is:

1. Start from current `main`.
2. Create one feature or fix branch.
3. Open a pull request into `main`.
4. Review the Vercel preview.
5. Wait for the `validate` and `Vercel` checks.
6. Resolve review conversations and obtain one approval.
7. Squash merge and delete the branch.
8. Verify the production deployment.

`main` is protected. Direct pushes, force pushes, deletion, and merging without
the required checks and review are blocked.

Before opening the pull request:

```powershell
npm ci
npm test
npm run lint
npm run build
```

## Stage branch and stage -> main merges

A protected `stage` branch exists. All portal work lands there first (as PRs
into `stage`, since stage itself rejects direct pushes), and then stage is
merged to `main` through a `stage -> main` pull request.

The `validate` workflow runs on every pull request and on every push to `main`
or `stage`, so a `stage -> main` PR always has the required `validate` check.

### Avoiding `stage -> main` conflicts

A `stage -> main` PR conflicts when the same portal files were changed on both
branches since they diverged. The merge pattern in that case is the PR 211 /
PR 222 playbook:

1. Get the required check green on the `stage -> main` PR by closing and
   reopening it if `validate` shows as expected but never runs.
2. On a branch from `main`, check out the conflicted files from `stage`:
   `git checkout stage -- <conflicted paths>`.
3. Open that as its own PR into `main` (e.g. "Align N portal files with stage
   to unblock PR #NNN"), with the same squash-merge flow as any other PR.
4. After it merges, the `stage -> main` PR becomes conflict-free.

Before opening the pull request:

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
