# KTP Website Security Operations

This document covers the minimum security practices for maintaining the KTP
website. Never place passwords, API secrets, private keys, personal member data,
or service-account credentials in GitHub.

## Immediate action required: rotate Cloudinary credentials

The Cloudinary API secret was previously committed to Git history. Removing it
from the current file does not invalidate the exposed credential.

1. Sign in to the KTP Cloudinary account.
2. Rotate or regenerate the API secret.
3. Put the new values in the local `.env` file:

```text
CLOUDINARY_CLOUD_NAME=dha44tosd
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

4. Do not put these values in Vercel unless a deployed server route actually
   needs Cloudinary write access. The public site currently only reads image
   URLs.
5. Test the headshot uploader with `--dry-run` before performing a real upload.

## Environment files

- `.env` and `.env.*` are ignored by Git.
- `.env.example` contains variable names and safe defaults only.
- `.env.production` is the one exception. It may contain only browser-public
  `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` values as a
  deployment fallback. Never add a private value to it.
- Production variables belong in Vercel: Project Settings > Environment
  Variables.
- Public browser-safe values may start with `NEXT_PUBLIC_`.
- Secrets must never start with `NEXT_PUBLIC_`.

## Credential ownership

Use chapter-owned accounts whenever possible. At least two current officers
should have recovery access to GitHub, Vercel, Supabase, Cloudinary, EmailJS,
Resend, Google Analytics, the chapter Gmail, and the domain registrar.

At every officer transition:

1. Remove former officers who no longer need access.
2. Add the incoming VP of Technology and Director of Web Systems.
3. Confirm recovery email and multifactor authentication.
4. Review billing pages and payment methods.
5. Rotate any credential that was shared in chat, email, screenshots, or code.

## Member data

Only publish information members knowingly provided for the public website.
Do not upload phone numbers, personal email addresses, emergency contacts,
medication details, allergies, resumes, transcripts, schedules, or birth years.
The birthday feature stores month and day only.

## Incident response

If a credential is exposed:

1. Rotate or revoke it immediately.
2. Remove it from the current branch.
3. Check service logs for unexpected use.
4. Update Vercel/local environment values.
5. Redeploy and test affected features.
6. Notify the President and relevant account owners.
7. Consider Git history rewriting only with organization-owner approval because
   it disrupts every clone and open branch.

If the site is broken:

1. Check the latest Vercel deployment and build logs.
2. Revert the failing pull request through a new pull request or Vercel rollback.
3. Test the live routes and dynamic APIs.
4. Record the cause, resolution, and prevention step in the transition log.
