# KTP Events: how to add and remove events

The Recruitment page shows an "Upcoming Events" section that is managed entirely
from Supabase. You never touch the code or redeploy the site to add, edit, or
remove an event. This doc explains how.

## How it works

| Piece | File | Role |
| --- | --- | --- |
| Events section (UI) | `components/EventsSection.jsx` | Client component on the Recruitment page. Fetches events and renders them as cards. Hides itself when there are no upcoming events. |
| Events API route | `app/api/events/route.js` | Server-side reader. Returns active, upcoming rows from the Supabase `events` table. Degrades gracefully (returns an empty list) if Supabase is unavailable. |
| Events table | Supabase (KTP Blog project) | The `events` table. This is the single place you manage events. |

Only events that are **active** and **in the future** are shown, sorted soonest
first. Past events drop off automatically once their date passes. If there are no
upcoming events, the whole section disappears from the page.

## One-time setup

Run this once in the **KTP Blog** Supabase project (SQL Editor):

```sql
create table if not exists public.events (
  id          bigint generated always as identity primary key,
  title       text        not null,
  description text,
  location    text,
  event_date  timestamptz not null,
  rsvp_url    text,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Public can read active events"
  on public.events for select
  using (is_active = true);
```

## Add an event

Supabase dashboard -> **KTP Blog** project -> **Table Editor** -> `events` -> **Insert row**:

| Field | Required | Notes |
| --- | --- | --- |
| `title` | Yes | The event name, e.g. `Info Session`. |
| `event_date` | Yes | Date and time. Set the timezone to **Central** so the time displays correctly. |
| `location` | No | e.g. `ECSW 1.365`. |
| `description` | No | A short blurb shown under the title. |
| `rsvp_url` | No | If set, an **RSVP** button links here. Leave blank for no button. |
| `is_active` | No | Defaults to `true`. |

The event appears on the site immediately (just refresh the Recruitment page).

## Examples

Prefer SQL? You can add several events at once from the SQL Editor. Note the
`-05` (Central) offset on each timestamp, and that a `null` `rsvp_url` simply
hides the RSVP button (handy for invite-only events):

```sql
insert into public.events (title, description, location, event_date, rsvp_url) values
  ('Info Session',     'Learn what KTP is all about. Free food!', 'ECSW 1.365',        '2026-09-03 19:00:00-05', 'https://tally.so/r/xxxxxx'),
  ('Meet the Bros',    'Hang out and meet our members.',          'Science Courtyard', '2026-09-05 19:00:00-05', 'https://tally.so/r/xxxxxx'),
  ('Game Night',       'Board games and snacks.',                 'NS Skylounge',      '2026-09-09 19:00:00-05', 'https://tally.so/r/xxxxxx'),
  ('KTP Speed Dating', 'Quick one-on-ones with brothers.',        'GR 3.420',          '2026-09-10 19:00:00-05', 'https://tally.so/r/xxxxxx'),
  ('Professional Event (Invite Only)', 'Details are sent with your invite.', 'Sent with invite', '2026-09-11 19:00:00-05', null);
```

## View events

The easiest way to see your events is the **Table Editor** (`events` table),
which lists every row visually. To query them from the **SQL Editor** instead:

```sql
-- All events, soonest first (includes past and hidden rows)
select id, title, event_date, location, rsvp_url, is_active
from public.events
order by event_date;
```

```sql
-- Only what the site is currently showing (active and upcoming)
select id, title, event_date, location
from public.events
where is_active = true
  and event_date >= now()
order by event_date;
```

## Remove or hide an event

You have two options:

- **Hide it (recommended, reversible):** set the row's `is_active` to `false` in
  the Table Editor. It disappears from the site immediately but stays in the
  table, so you can bring it back later by flipping `is_active` back to `true`.
- **Delete it permanently:** select the row in the Table Editor and choose
  **Delete row**.

You do **not** need to remove past events. Once an event's `event_date` is in the
past it stops showing automatically, so you can leave old rows in place as a
record if you like.

## Notes

- No redeploy is ever needed to manage events; changes are read live.
- Only PUBLIC-safe info belongs here. The table is readable via the public anon key.
- `rsvp_url` typically points to a Tally, Google Form, or Luma link.
- These events also feed the site's AI chatbot, so it can answer "what events are coming up?" using the live list (updates within about 5 minutes due to a short cache).
