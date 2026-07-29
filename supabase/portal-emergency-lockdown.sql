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

-- Lock every legacy relation exposed by the current Portal PostgREST schema.
-- Base/partitioned tables receive RLS. Views cannot have RLS, so their API
-- privileges are revoked instead.
do $$
declare
  legacy_relation record;
begin
  for legacy_relation in
    select
      relation.oid::regclass as qualified_name,
      relation.relkind
    from pg_class as relation
    join pg_namespace as namespace
      on namespace.oid = relation.relnamespace
    where namespace.nspname = 'public'
      and relation.relname in (
        'access_code',
        'applications',
        'attendance',
        'attendance_logs',
        'events',
        'password_resets',
        'profiles',
        'rsvps',
        'rsvps_admin',
        'strikes_log',
        'users',
        'whitelist'
      )
  loop
    if legacy_relation.relkind in ('r', 'p') then
      execute format(
        'alter table %s enable row level security',
        legacy_relation.qualified_name
      );
      execute format(
        'alter table %s force row level security',
        legacy_relation.qualified_name
      );
    end if;

    -- PostgreSQL's GRANT/REVOKE TABLE syntax also applies to views.
    execute format(
      'revoke all on table %s from public, anon, authenticated, service_role',
      legacy_relation.qualified_name
    );
  end loop;
end
$$;

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

-- Verification:
-- - Every base/partitioned table must show rls_enabled=true and rls_forced=true.
-- - The rsvps_admin view shows relation_type=view and cannot have RLS; its
--   anon/authenticated/service-role access columns must all be false.
select
  namespace.nspname as schema_name,
  table_class.relname as relation_name,
  case table_class.relkind
    when 'r' then 'table'
    when 'p' then 'partitioned table'
    when 'v' then 'view'
    when 'm' then 'materialized view'
    else table_class.relkind::text
  end as relation_type,
  table_class.relrowsecurity as rls_enabled,
  table_class.relforcerowsecurity as rls_forced,
  has_table_privilege('anon', table_class.oid, 'select') as anon_can_select,
  has_table_privilege('authenticated', table_class.oid, 'select')
    as authenticated_can_select,
  has_table_privilege('service_role', table_class.oid, 'select')
    as service_role_can_select
from pg_class as table_class
join pg_namespace as namespace
  on namespace.oid = table_class.relnamespace
where namespace.nspname = 'public'
  and table_class.relname in (
    'access_code',
    'applications',
    'attendance',
    'attendance_logs',
    'events',
    'password_resets',
    'profiles',
    'rsvps',
    'rsvps_admin',
    'strikes_log',
    'users',
    'whitelist'
  )
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
