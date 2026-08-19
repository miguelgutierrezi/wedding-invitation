-- Initial domain schema for the wedding invitation application.
-- Privileged access is expected via the service-role client until token-scoped RPCs exist.

create
extension if not exists pgcrypto with schema extensions;

create
or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at
= timezone('utc', now());
return new;
end;
$$;

create table public.events
(
    id                     uuid primary key     default gen_random_uuid(),
    slug                   text        not null,
    name                   text        not null,
    partner_one_name       text        not null,
    partner_two_name       text        not null,
    event_date             timestamptz not null,
    timezone               text        not null default 'America/Bogota',
    rsvp_deadline          timestamptz not null,
    ceremony_name          text,
    ceremony_address       text,
    ceremony_maps_url      text,
    ceremony_waze_url      text,
    ceremony_time          text,
    reception_name         text,
    reception_address      text,
    reception_maps_url     text,
    reception_waze_url     text,
    reception_time         text,
    dress_code_title       text,
    dress_code_description text,
    gift_message           text,
    is_rsvp_open           boolean     not null default true,
    created_at             timestamptz not null default timezone('utc', now()),
    updated_at             timestamptz not null default timezone('utc', now()),
    constraint events_slug_unique unique (slug),
    constraint events_slug_not_blank check (char_length(trim(slug)) > 0),
    constraint events_name_not_blank check (char_length(trim(name)) > 0)
);

create table public.families
(
    id                       uuid primary key     default gen_random_uuid(),
    event_id                 uuid        not null references public.events (id) on delete cascade,
    display_name             text        not null,
    invitation_token_hash    text        not null,
    invitation_token_preview text        not null,
    maximum_guests           integer     not null,
    custom_message           text,
    status                   text        not null default 'pending',
    is_enabled               boolean     not null default true,
    last_opened_at           timestamptz,
    created_at               timestamptz not null default timezone('utc', now()),
    updated_at               timestamptz not null default timezone('utc', now()),
    constraint families_display_name_not_blank check (char_length(trim(display_name)) > 0),
    constraint families_token_hash_not_blank check (char_length(trim(invitation_token_hash)) > 0),
    constraint families_token_preview_not_blank check (char_length(trim(invitation_token_preview)) > 0),
    constraint families_maximum_guests_positive check (maximum_guests > 0),
    constraint families_status_valid check (
        status in ('pending', 'responded', 'disabled')
        ),
    constraint families_invitation_token_hash_unique unique (invitation_token_hash)
);

create table public.guests
(
    id                   uuid primary key     default gen_random_uuid(),
    family_id            uuid        not null references public.families (id) on delete cascade,
    full_name            text        not null,
    is_primary_contact   boolean     not null default false,
    email                text,
    phone                text,
    attendance_status    text        not null default 'pending',
    dietary_restrictions text,
    menu_option          text,
    created_at           timestamptz not null default timezone('utc', now()),
    updated_at           timestamptz not null default timezone('utc', now()),
    constraint guests_full_name_not_blank check (char_length(trim(full_name)) > 0),
    constraint guests_attendance_status_valid check (
        attendance_status in ('pending', 'attending', 'not_attending')
        )
);

create table public.rsvp_responses
(
    id                    uuid primary key     default gen_random_uuid(),
    family_id             uuid        not null references public.families (id) on delete cascade,
    will_attend           boolean     not null,
    confirmed_guest_count integer     not null,
    contact_email         text,
    contact_phone         text,
    message               text,
    submitted_at          timestamptz not null default timezone('utc', now()),
    updated_at            timestamptz not null default timezone('utc', now()),
    constraint rsvp_responses_family_id_unique unique (family_id),
    constraint rsvp_responses_confirmed_guest_count_nonnegative check (
        confirmed_guest_count >= 0
        )
);

create table public.rsvp_response_guests
(
    id                   uuid primary key     default gen_random_uuid(),
    rsvp_response_id     uuid        not null references public.rsvp_responses (id) on delete cascade,
    guest_id             uuid        not null references public.guests (id) on delete cascade,
    will_attend          boolean     not null,
    dietary_restrictions text,
    menu_option          text,
    created_at           timestamptz not null default timezone('utc', now()),
    updated_at           timestamptz not null default timezone('utc', now()),
    constraint rsvp_response_guests_unique_guest_per_response unique (
                                                                      rsvp_response_id,
                                                                      guest_id
        )
);

create table public.audit_events
(
    id         uuid primary key     default gen_random_uuid(),
    event_id   uuid        not null references public.events (id) on delete cascade,
    family_id  uuid        references public.families (id) on delete set null,
    action     text        not null,
    metadata   jsonb       not null default '{}'::jsonb,
    created_at timestamptz not null default timezone('utc', now()),
    constraint audit_events_action_not_blank check (char_length(trim(action)) > 0)
);

create index events_event_date_idx on public.events (event_date);
create index families_event_id_idx on public.families (event_id);
create index families_status_idx on public.families (status);
create index guests_family_id_idx on public.guests (family_id);
create index guests_attendance_status_idx on public.guests (attendance_status);
create index rsvp_response_guests_response_id_idx
    on public.rsvp_response_guests (rsvp_response_id);
create index rsvp_response_guests_guest_id_idx
    on public.rsvp_response_guests (guest_id);
create index audit_events_event_id_created_at_idx
    on public.audit_events (event_id, created_at desc);
create index audit_events_family_id_idx on public.audit_events (family_id);

create trigger events_set_updated_at
    before update
    on public.events
    for each row
    execute function public.set_updated_at();

create trigger families_set_updated_at
    before update
    on public.families
    for each row
    execute function public.set_updated_at();

create trigger guests_set_updated_at
    before update
    on public.guests
    for each row
    execute function public.set_updated_at();

create trigger rsvp_responses_set_updated_at
    before update
    on public.rsvp_responses
    for each row
    execute function public.set_updated_at();

create trigger rsvp_response_guests_set_updated_at
    before update
    on public.rsvp_response_guests
    for each row
    execute function public.set_updated_at();

alter table public.events enable row level security;
alter table public.families enable row level security;
alter table public.guests enable row level security;
alter table public.rsvp_responses enable row level security;
alter table public.rsvp_response_guests enable row level security;
alter table public.audit_events enable row level security;

-- Deny-by-default for anon/authenticated. service_role bypasses RLS.
-- Token-scoped access will be introduced later via RPC or narrow policies.
revoke all on table public.events from anon, authenticated;
revoke all on table public.families from anon, authenticated;
revoke all on table public.guests from anon, authenticated;
revoke all on table public.rsvp_responses from anon, authenticated;
revoke all on table public.rsvp_response_guests from anon, authenticated;
revoke all on table public.audit_events from anon, authenticated;

grant
all
on table public.events to service_role;
grant all
on table public.families to service_role;
grant all
on table public.guests to service_role;
grant all
on table public.rsvp_responses to service_role;
grant all
on table public.rsvp_response_guests to service_role;
grant all
on table public.audit_events to service_role;
