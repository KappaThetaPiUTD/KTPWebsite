# KTP Member Portal Operations

The portal is a separate authenticated application under `/portal`. It uses the
paused **KTP Portal** Supabase project, not the public **KTP Blog** project.

## Recovered branch work

- Aashay's whitelist/onboarding idea is implemented as server-verified invited
  membership plus a required onboarding profile.
- Mansi's strike-management UI is implemented under
  `/portal/dashboard/admin/strikes`, with server-attributed inserts and RLS.
- Mekha's dependency-security intent is handled against the current dependency
  tree rather than merging an obsolete package lock.

The old branch code is not copied directly because it relied on client-side
authorization and direct browser admin writes.

## One-time setup

1. Resume the **KTP Portal** Supabase project.
2. Open its SQL Editor and run `supabase/portal-schema.sql`.
3. In Auth settings:
   - Disable open user signups.
   - Add
     `https://ktp-website.vercel.app/portal/auth/callback`
     as an allowed redirect URL.
4. Bootstrap the first admin in SQL:

```sql
insert into public.portal_members (email, role, status)
values ('officer@example.com', 'admin', 'active');
```

5. Invite that same email through Supabase Auth.
6. Set these Vercel environment variables:

```text
NEXT_PUBLIC_PORTAL_SUPABASE_URL=
NEXT_PUBLIC_PORTAL_SUPABASE_ANON_KEY=
```

7. Redeploy after adding the variables.

## Adding a member

Add the lower-case email to `portal_members` before inviting:

```sql
insert into public.portal_members (email, role, status)
values ('member@example.com', 'brother', 'active');
```

Then invite the email from Supabase Auth. On first login, the database trigger
binds the Auth user ID to the approved membership. The member must complete
onboarding before dashboard access.

Valid roles are:

- `admin`
- `exec`
- `director`
- `brother`
- `pledge`

Only `admin` and `exec` can access the strike manager.

## Removing access

Do not delete audit history. Set the membership inactive:

```sql
update public.portal_members
set status = 'inactive'
where email = 'member@example.com';
```

The server-side dashboard guard denies inactive accounts.

## Strike log

Admin/exec users can:

1. Open `/portal/dashboard/admin/strikes`.
2. Search for an active member.
3. Enter a factual reason between 5 and 500 characters.
4. Confirm the strike.

The server uses the authenticated admin ID as `issued_by`; the client cannot
choose or forge it. RLS independently rejects non-admin inserts. Strike rows are
append-only in the initial schema to preserve audit history.

## Security boundaries

- Public self-signup remains disabled.
- Membership and role come from `portal_members`, not editable Auth metadata.
- Profile updates can change personal contact/academic fields only.
- Official role and status require an admin-controlled membership update.
- No service-role key is exposed to the browser.
- Portal routes verify the Supabase session on the server.
- Database policies are required even when the UI hides admin controls.

## Before adding more features

Events, RSVP, attendance, QR check-in, and admin filters need their own schema
and RLS review. Do not restore the archived direct browser writes or the
localhost Express API.
