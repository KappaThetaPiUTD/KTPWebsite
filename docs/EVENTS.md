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
