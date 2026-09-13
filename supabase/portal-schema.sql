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

create table if not exists public.portal_events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 200),
  description text not null check (char_length(description) between 5 and 5000),
  location text check (location is null or char_length(location) between 2 and 200),
  start_time timestamptz not null,
  end_time timestamptz not null,
  -- scheduling & visibility: event_type drives filters; target_roles null = all members
  event_type text not null default 'chapter'
    check (event_type in ('chapter', 'professional', 'fundraiser', 'social', 'workshop', 'other')),
  target_roles text[],
  -- rsvp rules: capacity null = unlimited; rsvp_deadline null = open until event start
  capacity integer check (capacity is null or capacity > 0),
  rsvp_deadline timestamptz,
  -- check-in config: QR is always available; an admin may opt into a passcode fallback.
  late_threshold_minutes integer not null default 15
    check (late_threshold_minutes between 0 and 120),
  check_in_passcode_enabled boolean not null default false,
  check_in_passcode char(6),
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

-- portal_attendance rows are created by check-in (QR scan or an admin manual
-- check-in), then an admin can correct the status afterward. Every
-- correction is flagged here and appended to portal_attendance_logs below.
create table if not exists public.portal_attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.portal_events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  status text not null default 'present'
    check (status in ('present', 'absent', 'excused', 'unexcused', 'late')),
  method text not null default 'qr'
    check (method in ('qr', 'manual')),
  checked_in_by uuid not null references auth.users(id) on delete restrict,
  -- verified_by is set on any admin override, null = machine-determined
  verified_by uuid references auth.users(id) on delete set null,
  flagged boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table if not exists public.portal_attendance_logs (
  id bigint generated always as identity primary key,
  attendance_id uuid not null references public.portal_attendance(id) on delete cascade,
  previous_status text
    check (previous_status in ('present', 'absent', 'excused', 'unexcused', 'late')),
  new_status text not null
    check (new_status in ('present', 'absent', 'excused', 'unexcused', 'late')),
  reason text not null check (char_length(reason) between 5 and 500),
  edited_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

-- Make the field available before the security-definer check-in functions are
-- replaced below; this also supports databases created by an older schema.
alter table public.portal_events
  add column if not exists check_in_passcode_enabled boolean not null default false,
  add column if not exists qr_code_secret text not null
    default encode(gen_random_bytes(32), 'base64');

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
alter table public.portal_events enable row level security;
alter table public.portal_rsvps enable row level security;
alter table public.portal_attendance enable row level security;
alter table public.portal_attendance_logs enable row level security;

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

create or replace function public.can_rsvp_to_portal_event(event_target_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_active_portal_member()
    and (
      event_target_roles is null
      or exists (
        select 1
        from public.portal_members
        where user_id = auth.uid()
          and status = 'active'
          and role = any(event_target_roles)
      )
    );
$$;

-- All RSVP validation is performed in one database transaction. This prevents
-- a capacity race and ensures direct PostgREST/RPC callers cannot RSVP to an
-- event that has changed audience since it was displayed.
create or replace function public.submit_portal_rsvp(
  requested_event_id uuid,
  requested_status text
)
returns public.portal_rsvps
language plpgsql
security definer
set search_path = public
as $$
declare
  current_event public.portal_events%rowtype;
  existing_status text;
  going_count integer;
  saved_rsvp public.portal_rsvps%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Sign in required.' using errcode = '28000';
  end if;
  if requested_status not in ('going', 'maybe', 'not_going') then
    raise exception 'Invalid RSVP status.' using errcode = '22023';
  end if;

  -- Serialize attendance-changing requests for this event.
  perform pg_advisory_xact_lock(hashtextextended(requested_event_id::text, 0));

  select * into current_event
  from public.portal_events
  where id = requested_event_id;

  if not found then
    raise exception 'Event not found.' using errcode = 'P0002';
  end if;
  if not public.can_rsvp_to_portal_event(current_event.target_roles) then
    raise exception 'You are not eligible to RSVP to this event.' using errcode = '42501';
  end if;
  if now() > coalesce(current_event.rsvp_deadline, current_event.start_time) then
    raise exception 'RSVP deadline has passed.' using errcode = '22023';
  end if;

  select status into existing_status
  from public.portal_rsvps
  where event_id = requested_event_id and user_id = auth.uid();

  if requested_status = 'going' and coalesce(existing_status, '') <> 'going'
    and current_event.capacity is not null then
    select count(*)::integer into going_count
    from public.portal_rsvps
    where event_id = requested_event_id and status = 'going';

    if going_count >= current_event.capacity then
      raise exception 'Event is at maximum capacity.' using errcode = '22023';
    end if;
  end if;

  insert into public.portal_rsvps (event_id, user_id, status, updated_at)
  values (requested_event_id, auth.uid(), requested_status, now())
  on conflict (event_id, user_id) do update
    set status = excluded.status, updated_at = now()
  returning * into saved_rsvp;

  return saved_rsvp;
end;
$$;

-- Check-in is also performed in one transaction so the open state, audience,
-- passcode, duplicate check, and attendance write cannot be separated by a
-- crafted client request or a concurrent submission.
create or replace function public.check_in_to_portal_event(
  requested_event_id uuid,
  requested_passcode text
)
returns table (
  checked_in_at timestamptz,
  status text,
  already_checked_in boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_event public.portal_events%rowtype;
  saved_attendance public.portal_attendance%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Sign in required.' using errcode = '28000';
  end if;
  if requested_passcode is null or requested_passcode !~ '^[0-9]{6}$' then
    raise exception 'Invalid check-in code.' using errcode = '22023';
  end if;

  -- Prevent an event's check-in settings changing while they are validated.
  select * into current_event
  from public.portal_events
  where id = requested_event_id
  for update;

  if not found then
    raise exception 'Event not found.' using errcode = 'P0002';
  end if;
  if not public.can_rsvp_to_portal_event(current_event.target_roles) then
    raise exception 'You are not eligible to check in to this event.' using errcode = '42501';
  end if;

  select * into saved_attendance
  from public.portal_attendance
  where event_id = requested_event_id and user_id = auth.uid();

  if found then
    return query select saved_attendance.checked_in_at, saved_attendance.status, true;
    return;
  end if;
  if not current_event.is_check_in_open then
    raise exception 'Check-in is not open for this event.' using errcode = '22023';
  end if;
  if not current_event.check_in_passcode_enabled
    or requested_passcode <> current_event.check_in_passcode then
    raise exception 'Invalid check-in code.' using errcode = '22023';
  end if;

  insert into public.portal_attendance (
    event_id, user_id, checked_in_at, status, method, checked_in_by
  )
  values (
    requested_event_id,
    auth.uid(),
    now(),
    case
      when now() > current_event.start_time
        + make_interval(mins => current_event.late_threshold_minutes) then 'late'
      else 'present'
    end,
    'qr',
    auth.uid()
  )
  returning * into saved_attendance;

  return query select saved_attendance.checked_in_at, saved_attendance.status, false;
end;
$$;

-- QR tokens are deliberately separate from the optional passcode. The token
-- is only returned by an admin-only QR endpoint and is validated with the
-- same event state, audience, duplicate, and late-arrival checks as passcodes.
create or replace function public.check_in_to_portal_event_by_qr(
  requested_event_id uuid,
  requested_qr_token text
)
returns table (
  checked_in_at timestamptz,
  status text,
  already_checked_in boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_event public.portal_events%rowtype;
  saved_attendance public.portal_attendance%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Sign in required.' using errcode = '28000';
  end if;
  if requested_qr_token is null or char_length(requested_qr_token) < 32 then
    raise exception 'Invalid QR code.' using errcode = '22023';
  end if;

  select * into current_event
  from public.portal_events
  where id = requested_event_id
  for update;

  if not found then
    raise exception 'Event not found.' using errcode = 'P0002';
  end if;
  if not public.can_rsvp_to_portal_event(current_event.target_roles) then
    raise exception 'You are not eligible to check in to this event.' using errcode = '42501';
  end if;

  select * into saved_attendance
  from public.portal_attendance
  where event_id = requested_event_id and user_id = auth.uid();

  if found then
    return query select saved_attendance.checked_in_at, saved_attendance.status, true;
    return;
  end if;
  if not current_event.is_check_in_open then
    raise exception 'Check-in is not open for this event.' using errcode = '22023';
  end if;
  if requested_qr_token <> current_event.qr_code_secret then
    raise exception 'Invalid QR code.' using errcode = '22023';
  end if;

  insert into public.portal_attendance (
    event_id, user_id, checked_in_at, status, method, checked_in_by
  )
  values (
    requested_event_id,
    auth.uid(),
    now(),
    case
      when now() > current_event.start_time
        + make_interval(mins => current_event.late_threshold_minutes) then 'late'
      else 'present'
    end,
    'qr',
    auth.uid()
  )
  returning * into saved_attendance;

  return query select saved_attendance.checked_in_at, saved_attendance.status, false;
end;
$$;

drop policy if exists "Members can read events" on public.portal_events;
create policy "Members can read events"
  on public.portal_events
  for select
  to authenticated
  using (public.is_portal_admin() or public.can_rsvp_to_portal_event(target_roles));

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
    and exists (
      select 1
      from public.portal_events
      where id = event_id
        and public.can_rsvp_to_portal_event(target_roles)
    )
  );

drop policy if exists "Members can update own RSVP" on public.portal_rsvps;
create policy "Members can update own RSVP"
  on public.portal_rsvps
  for update
  to authenticated
  using (user_id = auth.uid() or public.is_portal_admin())
  with check (
    (user_id = auth.uid() or public.is_portal_admin())
    and exists (
      select 1
      from public.portal_events
      where id = event_id
        and public.can_rsvp_to_portal_event(target_roles)
    )
  );

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
  with check (false);

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

drop policy if exists "Members can read authorized attendance logs" on public.portal_attendance_logs;
create policy "Members can read authorized attendance logs"
  on public.portal_attendance_logs
  for select
  to authenticated
  using (
    public.is_portal_admin()
    or exists (
      select 1
      from public.portal_attendance
      where portal_attendance.id = portal_attendance_logs.attendance_id
        and portal_attendance.user_id = auth.uid()
    )
  );

drop policy if exists "Admins can log attendance edits" on public.portal_attendance_logs;
create policy "Admins can log attendance edits"
  on public.portal_attendance_logs
  for insert
  to authenticated
  with check (
    public.is_portal_admin()
    and edited_by = auth.uid()
  );

revoke all on function public.is_event_creator(uuid) from public;
revoke all on function public.can_rsvp_to_portal_event(text[]) from public;
revoke all on function public.submit_portal_rsvp(uuid, text) from public;
revoke all on function public.check_in_to_portal_event(uuid, text) from public;
revoke all on function public.check_in_to_portal_event_by_qr(uuid, text) from public;
revoke all on function public.claim_portal_membership() from public;
revoke all on function public.is_active_portal_member() from public;
revoke all on function public.is_portal_admin() from public;
revoke all on function public.portal_strike_counts() from public;
grant execute on function public.is_event_creator(uuid) to authenticated;
grant execute on function public.can_rsvp_to_portal_event(text[]) to authenticated;
grant execute on function public.submit_portal_rsvp(uuid, text) to authenticated;
grant execute on function public.check_in_to_portal_event(uuid, text) to authenticated;
grant execute on function public.check_in_to_portal_event_by_qr(uuid, text) to authenticated;
grant execute on function public.claim_portal_membership() to authenticated;
grant execute on function public.is_active_portal_member() to authenticated;
grant execute on function public.is_portal_admin() to authenticated;
grant execute on function public.portal_strike_counts() to authenticated;

-- Supabase Realtime publishes INSERTs only; the admin dashboard uses these
-- records for its live check-in ticker under the existing admin RLS policy.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'portal_attendance'
    ) then
    alter publication supabase_realtime add table public.portal_attendance;
  end if;
end;
$$;

-- MIGRATION: patch already-deployed tables that predate the columns/enum
-- values above. Fresh installs get everything from CREATE TABLE above and
-- these statements are no-ops.

alter table public.portal_events
  add column if not exists event_type text not null default 'chapter'
    check (event_type in ('chapter', 'professional', 'fundraiser', 'social', 'workshop', 'other')),
  add column if not exists target_roles text[],
  add column if not exists capacity integer check (capacity is null or capacity > 0),
  add column if not exists rsvp_deadline timestamptz,
  add column if not exists late_threshold_minutes integer not null default 15
    check (late_threshold_minutes between 0 and 120),
  add column if not exists check_in_passcode_enabled boolean not null default false,
  add column if not exists check_in_passcode char(6),
  add column if not exists qr_code_secret text not null
    default encode(gen_random_bytes(32), 'base64'),
  add column if not exists is_check_in_open boolean not null default false;

-- `ADD COLUMN IF NOT EXISTS` does not add the inline constraint when
-- `event_type` already exists with a narrower enum, so make sure deployed
-- databases pick up the full list.
do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conrelid = 'public.portal_events'::regclass
      and contype = 'c'
      and conname = 'portal_events_event_type_check'
  ) then
    alter table public.portal_events
      drop constraint portal_events_event_type_check;
  end if;

  alter table public.portal_events
    add constraint portal_events_event_type_check
    check (event_type in ('chapter', 'professional', 'fundraiser', 'social', 'workshop', 'other'));
end;
$$;

-- Earlier versions required these fields; the event model now permits an
-- unlimited capacity and RSVP availability through the event start time.
alter table public.portal_events
  alter column capacity drop not null,
  alter column rsvp_deadline drop not null,
  alter column check_in_passcode drop not null;

-- Preserve the behavior of events created before passcodes became optional.
update public.portal_events
set check_in_passcode_enabled = true
where check_in_passcode is not null
  and check_in_passcode_enabled = false;

alter table public.portal_attendance
  add column if not exists status text not null default 'present'
    check (status in ('present', 'absent', 'excused', 'unexcused', 'late')),
  add column if not exists verified_by uuid references auth.users(id) on delete set null,
  add column if not exists flagged boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

-- `ADD COLUMN IF NOT EXISTS` does not add the inline constraint when `status`
-- already exists, so ensure deployed databases receive the same enum guard.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.portal_attendance'::regclass
      and contype = 'c'
      and conname = 'portal_attendance_status_check'
  ) then
    alter table public.portal_attendance
      add constraint portal_attendance_status_check
      check (status in ('present', 'absent', 'excused', 'unexcused', 'late'));
  end if;
end;
$$;

-- Activity hours: semesters and photo-backed submissions.
create table if not exists public.portal_semesters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date not null,
  required_hours numeric not null default 10,
  is_active boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists public.portal_hour_submissions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.portal_events(id),
  -- Match portal_attendance.user_id: this is the authenticated user's UUID.
  user_id uuid not null references auth.users(id),
  semester_id uuid not null references public.portal_semesters(id),
  start_photo_url text not null,
  end_photo_url text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  -- Set by an admin/exec reviewer after checking the photo timestamps.
  hours_awarded numeric,
  reviewed_by uuid references public.portal_members(id),
  reviewed_at timestamptz,
  rejection_reason text,
  submitted_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (event_id, user_id)
);

-- An hours submission is valid only after the event has ended and the member
-- RSVP'd "going" (the attending status used by portal_rsvps).
create or replace function public.validate_portal_hour_submission()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  submission_event_end_time timestamptz;
begin
  select end_time
  into submission_event_end_time
  from public.portal_events
  where id = new.event_id;

  if submission_event_end_time is null then
    raise exception 'Event % does not exist', new.event_id;
  end if;

  if submission_event_end_time > now() then
    raise exception 'Hours cannot be submitted until the event has ended';
  end if;

  if not exists (
    select 1
    from public.portal_rsvps
    where event_id = new.event_id
      and user_id = new.user_id
      and status = 'going'
  ) then
    raise exception 'A going RSVP is required before submitting activity hours';
  end if;

  return new;
end;
$$;

-- Photo evidence remains immutable once a submission has been approved.
-- Only active admin/exec reviewers may assign or change awarded hours.
create or replace function public.enforce_portal_hour_submission_review_rules()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'UPDATE'
    and old.status = 'approved'
    and (
      new.start_photo_url is distinct from old.start_photo_url
      or new.end_photo_url is distinct from old.end_photo_url
    ) then
    raise exception 'Photo URLs cannot be changed after approval';
  end if;

  if not public.is_portal_admin()
    and (
      (tg_op = 'INSERT' and new.hours_awarded is not null)
      or (tg_op = 'UPDATE' and new.hours_awarded is distinct from old.hours_awarded)
    ) then
    raise exception 'Only admin or exec reviewers may set hours_awarded';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_portal_hour_submission on public.portal_hour_submissions;
create trigger validate_portal_hour_submission
  before insert on public.portal_hour_submissions
  for each row execute function public.validate_portal_hour_submission();

drop trigger if exists enforce_portal_hour_submission_review_rules on public.portal_hour_submissions;
create trigger enforce_portal_hour_submission_review_rules
  before insert or update on public.portal_hour_submissions
  for each row execute function public.enforce_portal_hour_submission_review_rules();

alter table public.portal_semesters enable row level security;
alter table public.portal_hour_submissions enable row level security;

drop policy if exists "Members can read semesters" on public.portal_semesters;
create policy "Members can read semesters"
  on public.portal_semesters
  for select
  to authenticated
  using (public.is_active_portal_member());

drop policy if exists "Admins can create semesters" on public.portal_semesters;
create policy "Admins can create semesters"
  on public.portal_semesters
  for insert
  to authenticated
  with check (public.is_portal_admin());

drop policy if exists "Admins can update semesters" on public.portal_semesters;
create policy "Admins can update semesters"
  on public.portal_semesters
  for update
  to authenticated
  using (public.is_portal_admin())
  with check (public.is_portal_admin());

drop policy if exists "Admins can delete semesters" on public.portal_semesters;
create policy "Admins can delete semesters"
  on public.portal_semesters
  for delete
  to authenticated
  using (public.is_portal_admin());

drop policy if exists "Members can read own hour submissions" on public.portal_hour_submissions;
create policy "Members can read own hour submissions"
  on public.portal_hour_submissions
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_portal_admin());

drop policy if exists "Members can submit own activity hours" on public.portal_hour_submissions;
create policy "Members can submit own activity hours"
  on public.portal_hour_submissions
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and public.is_active_portal_member()
    and status = 'pending'
    and hours_awarded is null
    and reviewed_by is null
    and reviewed_at is null
    and rejection_reason is null
  );

drop policy if exists "Admins can update hour submissions" on public.portal_hour_submissions;
create policy "Admins can update hour submissions"
  on public.portal_hour_submissions
  for update
  to authenticated
  using (public.is_portal_admin())
  with check (public.is_portal_admin());

revoke all on function public.validate_portal_hour_submission() from public;
revoke all on function public.enforce_portal_hour_submission_review_rules() from public;

-- Bootstrap the first admin in the SQL Editor before sending the Auth invite.
-- Replace the email, then run:
--
-- insert into public.portal_members (email, role, status)
-- values ('officer@example.com', 'admin', 'active');
