-- EMERGENCY KTP PORTAL LOCKDOWN
--
-- Run this immediately in the KTP Portal Supabase SQL Editor.
-- Project ref: bagvfgqosklxljktkwpd
--
-- The legacy service_role key was committed to Git history and is still active.
-- RLS alone cannot protect data from service_role, so this script also revokes
-- table/sequence privileges from service_role. Rotate the legacy JWT/API keys
-- immediately after running this script.

begin;

-- Lock every legacy table exposed by the current Portal PostgREST schema.
alter table if exists public.access_code enable row level security;
alter table if exists public.access_code force row level security;

alter table if exists public.applications enable row level security;
alter table if exists public.applications force row level security;

alter table if exists public.attendance enable row level security;
alter table if exists public.attendance force row level security;

alter table if exists public.attendance_logs enable row level security;
alter table if exists public.attendance_logs force row level security;

alter table if exists public.events enable row level security;
alter table if exists public.events force row level security;

alter table if exists public.password_resets enable row level security;
alter table if exists public.password_resets force row level security;

alter table if exists public.profiles enable row level security;
alter table if exists public.profiles force row level security;

alter table if exists public.rsvps enable row level security;
alter table if exists public.rsvps force row level security;

alter table if exists public.rsvps_admin enable row level security;
alter table if exists public.rsvps_admin force row level security;

alter table if exists public.strikes_log enable row level security;
alter table if exists public.strikes_log force row level security;

alter table if exists public.users enable row level security;
alter table if exists public.users force row level security;

alter table if exists public.whitelist enable row level security;
alter table if exists public.whitelist force row level security;

-- No legacy Portal feature is currently enabled on the website. Revoke all API
-- access until each feature is rebuilt with reviewed policies.
revoke all on table public.access_code
  from public, anon, authenticated, service_role;
revoke all on table public.applications
  from public, anon, authenticated, service_role;
revoke all on table public.attendance
  from public, anon, authenticated, service_role;
revoke all on table public.attendance_logs
  from public, anon, authenticated, service_role;
revoke all on table public.events
  from public, anon, authenticated, service_role;
revoke all on table public.password_resets
  from public, anon, authenticated, service_role;
revoke all on table public.profiles
  from public, anon, authenticated, service_role;
revoke all on table public.rsvps
  from public, anon, authenticated, service_role;
revoke all on table public.rsvps_admin
  from public, anon, authenticated, service_role;
revoke all on table public.strikes_log
  from public, anon, authenticated, service_role;
revoke all on table public.users
  from public, anon, authenticated, service_role;
revoke all on table public.whitelist
  from public, anon, authenticated, service_role;

revoke all on all sequences in schema public
  from public, anon, authenticated, service_role;

-- Legacy SECURITY DEFINER functions could bypass table policies, so remove
-- API execution rights until their implementations and authorization are
-- reviewed.
do $$
declare
  legacy_function record;
begin
  for legacy_function in
    select procedure.oid::regprocedure as signature
    from pg_proc as procedure
    join pg_namespace as namespace
      on namespace.oid = procedure.pronamespace
    where namespace.nspname = 'public'
      and procedure.proname in (
        'create_event_with_repeats',
        'current_user_email',
        'get_my_role',
        'is_executive',
        'rsvps_admin_list'
      )
  loop
    execute format(
      'revoke all on function %s from public, anon, authenticated, service_role',
      legacy_function.signature
    );
  end loop;
end
$$;

commit;

-- Verification: every legacy table must show RLS enabled and forced.
select
  namespace.nspname as schema_name,
  table_class.relname as table_name,
  table_class.relrowsecurity as rls_enabled,
  table_class.relforcerowsecurity as rls_forced
from pg_class as table_class
join pg_namespace as namespace
  on namespace.oid = table_class.relnamespace
where namespace.nspname = 'public'
  and table_class.relkind = 'r'
order by table_class.relname;

-- Verification: no policy is intentionally created for legacy tables, so they
-- remain closed. The replacement portal uses new portal_* tables and the
-- reviewed policies in supabase/portal-schema.sql.
select
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
