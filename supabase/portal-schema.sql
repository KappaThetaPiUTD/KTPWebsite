-- KTP Portal schema
-- Run in the separate "KTP Portal" Supabase project, never KTP Blog.
-- Open Auth signups should remain disabled. Add a portal_members row, then
-- invite the matching email through Supabase Auth.

create extension if not exists pgcrypto;

create table if not exists public.portal_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  email text not null check (email = lower(email)),
  role text not null default 'brother'
    check (role in ('admin', 'exec', 'director', 'brother', 'pledge')),
  status text not null default 'active'
    check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create unique index if not exists portal_members_email_lower_key
  on public.portal_members (lower(email));

create table if not exists public.portal_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 100),
  utd_email text check (
    utd_email is null or lower(utd_email) like '%@utdallas.edu'
  ),
  phone text,
  graduation_year integer not null
    check (graduation_year between 2020 and 2100),
  major text not null check (char_length(major) between 2 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_strikes (
  id bigint generated always as identity primary key,
  member_user_id uuid not null references auth.users(id) on delete restrict,
  reason text not null check (char_length(reason) between 5 and 500),
  issued_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create or replace function public.is_active_portal_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.portal_members
    where user_id = auth.uid()
      and status = 'active'
  );
$$;

create or replace function public.is_portal_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.portal_members
    where user_id = auth.uid()
      and status = 'active'
      and role in ('admin', 'exec')
  );
$$;

create or replace function public.claim_portal_membership()
returns setof public.portal_members
language plpgsql
security definer
set search_path = public
as $$
declare
  claim_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  if auth.uid() is null or claim_email = '' then
    return;
  end if;

  update public.portal_members
  set user_id = auth.uid()
  where lower(email) = claim_email
    and status = 'active'
    and (user_id is null or user_id = auth.uid());

  return query
  select *
  from public.portal_members
  where user_id = auth.uid()
    and status = 'active';
end;
$$;

create or replace function public.portal_strike_counts()
returns table (member_user_id uuid, total bigint)
language sql
stable
security definer
set search_path = public
as $$
  select strikes.member_user_id, count(*)::bigint as total
  from public.portal_strikes as strikes
  where public.is_portal_admin()
  group by strikes.member_user_id;
$$;

create or replace function public.bind_invited_portal_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.portal_members
  set user_id = new.id
  where lower(email) = lower(new.email)
    and status = 'active'
    and user_id is null;
  return new;
end;
$$;

drop trigger if exists bind_invited_portal_member on auth.users;
create trigger bind_invited_portal_member
  after insert on auth.users
  for each row execute function public.bind_invited_portal_member();

alter table public.portal_members enable row level security;
alter table public.portal_profiles enable row level security;
alter table public.portal_strikes enable row level security;

drop policy if exists "Members can read own membership" on public.portal_members;
create policy "Members can read own membership"
  on public.portal_members
  for select
  to authenticated
  using (
    user_id = auth.uid()
    or (
      user_id is null
      and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
    or public.is_portal_admin()
  );

drop policy if exists "Admins can insert memberships" on public.portal_members;
create policy "Admins can insert memberships"
  on public.portal_members
  for insert
  to authenticated
  with check (
    public.is_portal_admin()
    and created_by = auth.uid()
  );

drop policy if exists "Admins can update memberships" on public.portal_members;
create policy "Admins can update memberships"
  on public.portal_members
  for update
  to authenticated
  using (public.is_portal_admin())
  with check (public.is_portal_admin());

drop policy if exists "Members can read own profile" on public.portal_profiles;
create policy "Members can read own profile"
  on public.portal_profiles
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_portal_admin());

drop policy if exists "Members can create own profile" on public.portal_profiles;
create policy "Members can create own profile"
  on public.portal_profiles
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and public.is_active_portal_member()
  );

drop policy if exists "Members can update own profile" on public.portal_profiles;
create policy "Members can update own profile"
  on public.portal_profiles
  for update
  to authenticated
  using (user_id = auth.uid() or public.is_portal_admin())
  with check (user_id = auth.uid() or public.is_portal_admin());

drop policy if exists "Members can read authorized strikes" on public.portal_strikes;
create policy "Members can read authorized strikes"
  on public.portal_strikes
  for select
  to authenticated
  using (
    member_user_id = auth.uid()
    or public.is_portal_admin()
  );

drop policy if exists "Admins can log strikes" on public.portal_strikes;
create policy "Admins can log strikes"
  on public.portal_strikes
  for insert
  to authenticated
  with check (
    public.is_portal_admin()
    and issued_by = auth.uid()
    and exists (
      select 1
      from public.portal_members
      where user_id = member_user_id
        and status = 'active'
    )
  );

create table if not exists public.portal_events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 200),
  description text not null check (char_length(description) between 5 and 5000),
  location text check (location is null or char_length(location) between 2 and 200),
  start_time timestamptz not null,
  end_time timestamptz not null,
  -- scheduling & visibility: event_type drives filters; target_roles null = all members
  event_type text not null default 'chapter'
    check (event_type in ('chapter', 'social', 'professional', 'workshop', 'other')),
  target_roles text[],
  -- rsvp rules: capacity null = unlimited; rsvp_deadline null = open until event start
  capacity integer check (capacity is null or capacity > 0),
  rsvp_deadline timestamptz,
  -- check-in config: passcode is the typeable fallback; qr_code_secret drives the QR image
  late_threshold_minutes integer not null default 15
    check (late_threshold_minutes between 0 and 120),
  check_in_passcode char(6) not null
    default lpad((floor(random() * 1000000))::int::text, 6, '0'),
  qr_code_secret text not null default encode(gen_random_bytes(32), 'base64'),
  is_check_in_open boolean not null default false,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

create table if not exists public.portal_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.portal_events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'maybe'
    check (status in ('going', 'maybe', 'not_going')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table if not exists public.portal_attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.portal_events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  -- server auto-sets present/late; admin can override to excused/unexcused
  status text not null default 'present'
    check (status in ('present', 'late', 'excused', 'unexcused')),
  method text not null default 'qr'
    check (method in ('qr', 'manual')),
  checked_in_by uuid not null references auth.users(id) on delete restrict,
  -- audit fields: verified_by is set on any admin override, null = machine-determined
  verified_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create or replace function public.is_event_creator(event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.portal_events
    where id = $1
      and created_by = auth.uid()
  );
$$;

alter table public.portal_events enable row level security;
alter table public.portal_rsvps enable row level security;
alter table public.portal_attendance enable row level security;

drop policy if exists "Members can read events" on public.portal_events;
create policy "Members can read events"
  on public.portal_events
  for select
  to authenticated
  using (public.is_active_portal_member());

drop policy if exists "Admins can create events" on public.portal_events;
create policy "Admins can create events"
  on public.portal_events
  for insert
  to authenticated
  with check (
    public.is_portal_admin()
    and created_by = auth.uid()
  );

drop policy if exists "Admins can update events" on public.portal_events;
create policy "Admins can update events"
  on public.portal_events
  for update
  to authenticated
  using (public.is_portal_admin() or public.is_event_creator(id))
  with check (public.is_portal_admin() or public.is_event_creator(id));

drop policy if exists "Admins can delete events" on public.portal_events;
create policy "Admins can delete events"
  on public.portal_events
  for delete
  to authenticated
  using (public.is_portal_admin() or public.is_event_creator(id));

drop policy if exists "Members can read RSVPs" on public.portal_rsvps;
create policy "Members can read RSVPs"
  on public.portal_rsvps
  for select
  to authenticated
  using (
    user_id = auth.uid()
    or public.is_portal_admin()
  );

drop policy if exists "Members can create RSVP" on public.portal_rsvps;
create policy "Members can create RSVP"
  on public.portal_rsvps
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and public.is_active_portal_member()
  );

drop policy if exists "Members can update own RSVP" on public.portal_rsvps;
create policy "Members can update own RSVP"
  on public.portal_rsvps
  for update
  to authenticated
  using (user_id = auth.uid() or public.is_portal_admin())
  with check (user_id = auth.uid() or public.is_portal_admin());

drop policy if exists "Members can delete own RSVP" on public.portal_rsvps;
create policy "Members can delete own RSVP"
  on public.portal_rsvps
  for delete
  to authenticated
  using (user_id = auth.uid() or public.is_portal_admin());

drop policy if exists "Members can read attendance" on public.portal_attendance;
create policy "Members can read attendance"
  on public.portal_attendance
  for select
  to authenticated
  using (
    user_id = auth.uid()
    or public.is_portal_admin()
  );

drop policy if exists "Members can check in" on public.portal_attendance;
create policy "Members can check in"
  on public.portal_attendance
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and public.is_active_portal_member()
  );

drop policy if exists "Admins can manual check in" on public.portal_attendance;
create policy "Admins can manual check in"
  on public.portal_attendance
  for insert
  to authenticated
  with check (
    public.is_portal_admin()
    and method = 'manual'
    and checked_in_by = auth.uid()
  );

drop policy if exists "Admins can update attendance" on public.portal_attendance;
create policy "Admins can update attendance"
  on public.portal_attendance
  for update
  to authenticated
  using (public.is_portal_admin())
  with check (public.is_portal_admin());

drop policy if exists "Admins can delete attendance" on public.portal_attendance;
create policy "Admins can delete attendance"
  on public.portal_attendance
  for delete
  to authenticated
  using (public.is_portal_admin());

revoke all on function public.is_event_creator(uuid) from public;
revoke all on function public.claim_portal_membership() from public;
revoke all on function public.is_active_portal_member() from public;
revoke all on function public.is_portal_admin() from public;
revoke all on function public.portal_strike_counts() from public;
grant execute on function public.is_event_creator(uuid) to authenticated;
grant execute on function public.claim_portal_membership() to authenticated;
grant execute on function public.is_active_portal_member() to authenticated;
grant execute on function public.is_portal_admin() to authenticated;
grant execute on function public.portal_strike_counts() to authenticated;

-- MIGRATION: patch the already-deployed tables. Fresh installs get these from CREATE TABLE above.

alter table public.portal_events
  add column if not exists event_type text not null default 'chapter'
    check (event_type in ('chapter', 'social', 'professional', 'workshop', 'other')),
  add column if not exists target_roles text[],
  add column if not exists capacity integer check (capacity is null or capacity > 0),
  add column if not exists rsvp_deadline timestamptz,
  add column if not exists late_threshold_minutes integer not null default 15
    check (late_threshold_minutes between 0 and 120),
  add column if not exists check_in_passcode char(6) not null
    default lpad((floor(random() * 1000000))::int::text, 6, '0'),
  add column if not exists is_check_in_open boolean not null default false;

alter table public.portal_attendance
  add column if not exists status text not null default 'present'
    check (status in ('present', 'late', 'excused', 'unexcused')),
  add column if not exists verified_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

-- Bootstrap the first admin in the SQL Editor before sending the Auth invite.
-- Replace the email, then run:
--
-- insert into public.portal_members (email, role, status)
-- values ('officer@example.com', 'admin', 'active');
