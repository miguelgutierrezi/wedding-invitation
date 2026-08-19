-- RSVP confirmation deadline: 4 September 2026 (end of day, America/Bogota).

update public.events
set rsvp_deadline = '2026-09-04T23:59:59-05:00'::timestamptz,
  updated_at = timezone('utc', now())
where rsvp_deadline is not null;
