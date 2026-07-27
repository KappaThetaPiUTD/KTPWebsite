# Aashay, Mansi, and Mekha Branch Integration Report

## Why these branches were not directly merged

The three remote branches shared a legacy portal history that was approximately
140 commits behind current `main` and contained about 190 commits not on
`main`. A normal merge would have reintroduced old public-site pages,
client-side authorization, a localhost Express API, outdated dependencies, and
thousands of lines already replaced by the current site.

The safe integration strategy was:

1. Identify each branch's unique tip commit.
2. Review that unique work.
3. Port the intended behavior into the current `/portal` architecture.
4. Add server authorization and Supabase RLS.
5. Apply dependency fixes to the current dependency tree.
6. Build, lint, audit, and smoke-test.
7. Record the old branches as merged/superseded, then delete them.

## Aashay branch: `aashay-auth`

Unique commit:

```text
5922aa9 Created whitelist table, added onboarding script
```

### Useful intent

- Only approved member emails should enter the portal.
- First-login onboarding should collect member profile details.
- Returning members should skip onboarding after completion.

### Problems in the original implementation

- Whitelist enforcement happened only in client-side React code.
- Profile writes went directly from the browser to Supabase.
- Public self-signup could create unauthorized Auth accounts.
- Users could edit `rush_class`, even though it was labeled exec-assigned.
- Returning Google users were sent through onboarding again.
- The branch middleware became a global no-op.

### Secure replacement on `main`

- `portal_members` is the invite/whitelist and official role source.
- Open signup remains disabled; leadership inserts an email and sends an Auth
  invite.
- Database trigger/RPC binds the invited Auth user to the approved membership.
- Dashboard routes verify the session and active membership on the server.
- `/portal/onboarding` is required until an RLS-protected profile is complete.
- Members can edit personal profile fields only; official role/status remains
  admin-controlled.
- Unauthorized signed-in users are routed to `/portal/access-denied`.

Relevant files:

- `lib/portal/member.js`
- `app/portal/onboarding/page.jsx`
- `components/portal/PortalOnboardingForm.jsx`
- `app/api/portal/profile/route.js`
- `components/portal/PortalProfileForm.jsx`
- `supabase/portal-schema.sql`

## Mansi branch: `mansi-login-update`

Unique commit:

```text
67cad30 improve logging strike ui
```

### Useful intent

- Admins need a searchable member table.
- Strike logging should use a clear modal with status feedback.
- Admins should see recent strike history and member strike totals.

### Problems in the original implementation

- Admin authorization existed only in a client component.
- Any authenticated user could attempt the direct Supabase insert.
- Strike rows did not record which admin issued them.
- The success delay re-enabled the submit button and allowed duplicate strikes.
- The branch changed unrelated dependency scripts without complete setup.

### Secure replacement on `main`

- `/portal/dashboard/admin/strikes` is shown only to `admin`/`exec` roles.
- The server page and API independently verify the authenticated role.
- The client posts only target member and reason to a same-origin route.
- `issued_by` is taken from the server-verified session, never the browser.
- RLS independently rejects non-admin inserts.
- Strike rows are append-only in the initial schema.
- Member totals come from an admin-only aggregate RPC, not a capped recent list.
- Recent history shows target member, reason, timestamp, and issuing officer.

Relevant files:

- `app/portal/dashboard/admin/strikes/page.jsx`
- `components/portal/PortalStrikesManager.jsx`
- `app/api/portal/admin/strikes/route.js`
- `supabase/portal-schema.sql`

## Mekha branch: `mekha-new-new-branch`

Unique commit:

```text
879321d Fix vulnerabilities: axios, react-router, jws, preact, qs, next,
next-auth, etc.
```

The unique tip changed only the old branch's lock file. Its wider branch
dependency tree included packages and architecture that current `main` no
longer uses, so the lock file could not be safely merged.

### Current-tree equivalent applied

- Ran non-breaking `npm audit fix`.
- Updated Cloudinary from `2.2.0` to `2.10.0`.
- Removed unused vulnerable `react-router-dom`.
- Updated Next within the compatible 14.x line to `14.2.35`.
- Retained Node 24 and the current Supabase SSR portal packages.
- Did not run `npm audit fix --force`.

### Deferred major migration

Remaining full-audit findings are in Next/ESLint tooling and require a breaking
Next 16, React 19, and ESLint flat-config migration. That migration should be a
separate reviewed sprint, not a lock-file-only branch merge.

## Portal setup still required

The code can be merged while the portal remains hidden. To enable it:

1. Resume the separate KTP Portal Supabase project.
2. Run `supabase/portal-schema.sql` in that project.
3. Disable open Auth signups.
4. Add the allowed callback URL.
5. Bootstrap an admin membership and send an Auth invite.
6. Add the two `NEXT_PUBLIC_PORTAL_SUPABASE_*` values in Vercel.
7. Redeploy and run authorized/unauthorized tests.

See `docs/PORTAL.md`.

## Verification performed

- `npm run lint`
- `npm run build`
- Portal signed-out redirect tests
- Missing-configuration behavior
- Hostile `?reason=__proto__` login query test
- Unauthorized profile/strike API tests
- Cloudinary uploader dry run
- Production and full npm audits

## Final branch status

Completed July 26, 2026:

| Branch | Secure replacement | Merge record |
| --- | --- | --- |
| `mekha-new-new-branch` | Current-tree dependency refresh | `535cfb5` |
| `aashay-auth` | Invited membership and RLS onboarding | `f8c0312` |
| `mansi-login-update` | Server/RLS strike management | `29683eb` |

All three branch tips are ancestors of `main`. Production deployment for
`29683eb` completed successfully, then all three remote branches were deleted.

Primary implementation commits:

- `0d8a370` - portal auth, onboarding, profile, strikes, schema, and dependency
  refresh
- `fe05d02` - AI maintenance prompt library and this integration report
