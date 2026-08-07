-- Real wedding date (24 Oct 2026) and RSVP deadline (4 Sep 2026).
-- Hora del evento provisional (16:00 America/Bogota) hasta definir ceremonia.

update public.events
set
  event_date = '2026-10-24T16:00:00-05:00'::timestamptz,
  rsvp_deadline = '2026-09-04T23:59:59-05:00'::timestamptz,
  updated_at = timezone('utc', now())
where event_date is not null;
