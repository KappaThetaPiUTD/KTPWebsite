# KTP Birthdays: how the birthday banner works

The home page shows a friendly "Happy Birthday" banner on days when one or more
brothers have a birthday. Like events, birthdays are managed entirely from
Supabase, so you never touch the code or redeploy to add, edit, or remove one.

**Privacy:** we store only the **month and day**, never the birth year, so
nobody's age is published.

## How it works

| Piece | File | Role |
| --- | --- | --- |
| Birthday banner (UI) | `components/BirthdayBanner.jsx` | Client component on the home page. Asks the API who has a birthday today and shows a banner. Renders nothing when there are none, and can be dismissed for the rest of a visitor's session. |
| Birthdays API route | `app/api/birthdays/route.js` | Server-side reader. Works out today's date in U.S. Central time and returns the active birthdays that match. Degrades gracefully (returns an empty list) if Supabase is unavailable. |
| Birthdays table | Supabase (KTP Blog project) | The `birthdays` table. This is the single place you manage birthdays. |

## One-time setup

Run this once in the **KTP Blog** Supabase project (SQL Editor):

```sql
create table if not exists public.birthdays (
  id          bigint generated always as identity primary key,
  name        text        not null,
  birth_month int         not null check (birth_month between 1 and 12),
  birth_day   int         not null check (birth_day between 1 and 31),
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now()
);

alter table public.birthdays enable row level security;

create policy "Public can read active birthdays"
  on public.birthdays for select
  using (is_active = true);
```

## Add a birthday

Supabase dashboard -> **KTP Blog** project -> **Table Editor** -> `birthdays` -> **Insert row**:

| Field | Required | Notes |
| --- | --- | --- |
| `name` | Yes | The name shown in the banner, e.g. `Aman Balam`. |
| `birth_month` | Yes | Month as a number, `1`-`12` (January = 1). |
| `birth_day` | Yes | Day of the month, `1`-`31`. |
| `is_active` | No | Defaults to `true`. Set to `false` to hide without deleting. |

Prefer SQL? You can add several at once from the SQL Editor:

```sql
insert into public.birthdays (name, birth_month, birth_day) values
  ('Aman Balam',   3, 14),
  ('Mekha Mathew', 7, 13),
  ('Noel Emmanuel', 11, 2);
```

The banner will show automatically on each person's day.

## View birthdays

The **Table Editor** lists every row. To query from the **SQL Editor**:

```sql
-- Everyone, sorted by month then day
select name, birth_month, birth_day, is_active
from public.birthdays
order by birth_month, birth_day;
```

## Remove or hide a birthday

- **Hide it (reversible):** set the row's `is_active` to `false` in the Table Editor.
- **Delete it permanently:** select the row and choose **Delete row**.

## Notes

- No redeploy is ever needed; the banner reads birthdays live.
- Only the month and day are stored (no year), so ages are never shown.
- The banner appears on the home page below the navigation and can be dismissed
  for the rest of a visitor's browser session.
