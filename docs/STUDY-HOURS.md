Study Hours submissions are recorded once per member per event. Members can
submit for multiple events in the same week, including occurrences in the same
recurring series. Approved hours from all events in the current Monday–Sunday
week are added together: 2 hours on Tuesday plus 1 hour on Thursday meets a
3-hour requirement. Reviewers award the hours separately for each submission.

For an existing database, run
`supabase/migrations/20261005_allow_study_hour_events.sql` in the Supabase SQL
Editor. It allows the `study_hours` event type without changing existing
submissions. New databases receive the same rule from `supabase/portal-schema.sql`.

Create Tuesday and Thursday as separate Study Hours events (distinct event IDs).
After each event ends, members can upload its start/end photos and submit it.
Submitting one event does not remove the other from the available events, even
when both belong to the same recurring series or the weekly requirement is met.
