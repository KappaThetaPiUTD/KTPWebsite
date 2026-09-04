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
  qr_code_secret text not null default encode(gen_random_bytes(32), 'base64'),
  capacity integer not null default null check (capacity > 0),
  rsvp_deadline timestamptz not null,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

alter table public.portal_events enable row level security;

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
  with check (public.is_portal_admin());

drop policy if exists "Admins can update events" on public.portal_events;
create policy "Admins can update events"
  on public.portal_events
  for update
  to authenticated
  using (public.is_portal_admin())
  with check (public.is_portal_admin());

drop policy if exists "Admins can delete events" on public.portal_events;
create policy "Admins can delete events"
  on public.portal_events
  for delete
  to authenticated
  using (public.is_portal_admin());

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

revoke all on function public.claim_portal_membership() from public;
revoke all on function public.is_active_portal_member() from public;
revoke all on function public.is_portal_admin() from public;
revoke all on function public.portal_strike_counts() from public;
grant execute on function public.claim_portal_membership() to authenticated;
grant execute on function public.is_active_portal_member() to authenticated;
grant execute on function public.is_portal_admin() to authenticated;
grant execute on function public.is_event_creator(uuid) to authenticated;

-- Bootstrap the first admin in the SQL Editor before sending the Auth invite.
-- Replace the email, then run:
--
-- insert into public.portal_members (email, role, status)
-- values ('officer@example.com', 'admin', 'active');
