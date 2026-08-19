-- Placeholder plus-ones ("Acompañante") need a real name on RSVP.
-- Keep `is_placeholder_guest_name` in sync with
-- `src/lib/invitation/placeholder-guest-name.ts`.

create
or replace function public.is_placeholder_guest_name(p_name text)
returns boolean
language sql
immutable
as $$
select (
           regexp_replace(
                   translate(lower(trim(coalesce(p_name, ''))), 'áéíóúüñ', 'aeiouun'),
                   '[[:space:]]+',
                   ' ',
                   'g'
           )
           ) ~ '^(acompanante( [0-9]+)?|plus one|plus-one|plusone)$';
$$;

comment
on function public.is_placeholder_guest_name(text) is
  'True when the guest label is a plus-one placeholder, not a real name.';

alter table public.guests
    add column if not exists needs_name_confirmation boolean not null default false;

comment
on column public.guests.needs_name_confirmation is
  'When true, RSVP must collect a real full_name (not Acompañante).';

update public.guests
set gender                  = 'unspecified',
    needs_name_confirmation = true
where public.is_placeholder_guest_name(full_name);

revoke all on function public.is_placeholder_guest_name(text) from public;
grant
execute
on
function
public
.
is_placeholder_guest_name
(text) to service_role;

create
or replace function public.create_family_with_guests(
  p_event_id uuid,
  p_display_name text,
  p_maximum_guests integer,
  p_custom_message text,
  p_guest_names text[],
  p_guest_genders text[],
  p_invitation_slug text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
v_slug text;
  v_token_hash
text;
  v_token_preview
text;
  v_guest_count
integer;
  v_name
text;
  v_gender
text;
  v_index
integer;
  v_family_id
uuid;
  v_custom
text;
begin
  if
p_event_id is null then
    raise exception 'EVENT_NOT_FOUND' using errcode = 'P0001';
end if;

  if
not exists (select 1 from public.events where id = p_event_id) then
    raise exception 'EVENT_NOT_FOUND' using errcode = 'P0001';
end if;

  if
p_display_name is null or char_length(trim(p_display_name)) = 0 then
    raise exception 'INVALID_DISPLAY_NAME' using errcode = 'P0001';
end if;

  if
p_maximum_guests is null or p_maximum_guests < 1 then
    raise exception 'GUEST_LIMIT_EXCEEDED' using errcode = 'P0001';
end if;

  if
p_guest_names is null or coalesce(array_length(p_guest_names, 1), 0) < 1 then
    raise exception 'INVALID_GUEST_NAMES' using errcode = 'P0001';
end if;

  v_guest_count
:= array_length(p_guest_names, 1);

  if
p_guest_genders is null
    or coalesce(array_length(p_guest_genders, 1), 0) <> v_guest_count then
    raise exception 'INVALID_GUEST_GENDERS' using errcode = 'P0001';
end if;

  if
v_guest_count > p_maximum_guests then
    raise exception 'GUEST_LIMIT_EXCEEDED' using errcode = 'P0001';
end if;

  foreach
v_name in array p_guest_names loop
    if v_name is null or char_length(trim(v_name)) = 0 then
      raise exception 'INVALID_GUEST_NAMES' using errcode = 'P0001';
end if;
end loop;

  foreach
v_gender in array p_guest_genders loop
    if v_gender is null or v_gender not in ('male', 'female', 'unspecified') then
      raise exception 'INVALID_GUEST_GENDERS' using errcode = 'P0001';
end if;
end loop;

  if
p_invitation_slug is null or char_length(trim(p_invitation_slug)) = 0 then
    raise exception 'INVALID_SLUG' using errcode = 'P0001';
end if;

  v_slug
:= lower(trim(p_invitation_slug));

  if
v_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    or char_length(v_slug) < 2
    or char_length(v_slug) > 80 then
    raise exception 'INVALID_SLUG' using errcode = 'P0001';
end if;

  if
exists (
    select 1 from public.families where invitation_slug = v_slug
  ) then
    raise exception 'SLUG_IN_USE' using errcode = 'P0001';
end if;

  v_token_hash
:= encode(extensions.digest(v_slug, 'sha256'), 'hex');
  v_token_preview
:= left(v_slug, 24);
  v_custom
:= nullif(trim(coalesce(p_custom_message, '')), '');

begin
insert into public.families (event_id,
                             display_name,
                             invitation_slug,
                             invitation_token_hash,
                             invitation_token_preview,
                             maximum_guests,
                             custom_message,
                             status,
                             is_enabled)
values (p_event_id,
        trim(p_display_name),
        v_slug,
        v_token_hash,
        v_token_preview,
        p_maximum_guests,
        v_custom,
        'pending',
        true) returning id
into v_family_id;
exception
    when unique_violation then
      raise exception 'SLUG_IN_USE' using errcode = 'P0001';
end;

for v_index in 1..v_guest_count loop
    insert into public.guests (
      family_id,
      full_name,
      gender,
      needs_name_confirmation,
      is_primary_contact,
      attendance_status
    ) values (
      v_family_id,
      trim(p_guest_names[v_index]),
      p_guest_genders[v_index],
      public.is_placeholder_guest_name(p_guest_names[v_index]),
      (v_index = 1),
      'pending'
    );
end loop;

insert into public.audit_events (event_id,
                                 family_id,
                                 action,
                                 metadata)
values (p_event_id,
        v_family_id,
        'family_created',
        jsonb_build_object(
                'maximum_guests', p_maximum_guests,
                'guest_count', v_guest_count,
                'invitation_slug', v_slug,
                'source', 'admin'
        ));

return jsonb_build_object(
        'family_id', v_family_id,
        'invitation_slug', v_slug,
        'guest_count', v_guest_count
       );
end;
$$;

revoke all on function public.create_family_with_guests(
    uuid,
    text,
    integer,
    text,
    text[],
    text[],
    text
    ) from public;

grant
execute
on
function
public
.
create_family_with_guests
(
  uuid,
  text,
  integer,
  text,
  text[],
  text[],
  text
) to service_role;

create
or replace function public.update_family_with_guests(
  p_family_id uuid,
  p_display_name text,
  p_maximum_guests integer,
  p_custom_message text,
  p_is_enabled boolean,
  p_guest_names text[],
  p_guest_genders text[],
  p_invitation_slug text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
v_family public.families%rowtype;
  v_status
text;
  v_slug
text;
  v_change_slug
boolean := false;
  v_token_hash
text;
  v_token_preview
text;
  v_guest_count
integer;
  v_existing_count
integer;
  v_existing_ids
uuid[];
  v_index
integer;
  v_name
text;
  v_gender
text;
begin
  if
p_family_id is null then
    raise exception 'FAMILY_NOT_FOUND' using errcode = 'P0001';
end if;

  if
p_display_name is null or char_length(trim(p_display_name)) = 0 then
    raise exception 'INVALID_DISPLAY_NAME' using errcode = 'P0001';
end if;

  if
p_maximum_guests is null or p_maximum_guests < 1 then
    raise exception 'GUEST_LIMIT_EXCEEDED' using errcode = 'P0001';
end if;

  if
p_guest_names is null or coalesce(array_length(p_guest_names, 1), 0) < 1 then
    raise exception 'INVALID_GUEST_NAMES' using errcode = 'P0001';
end if;

  v_guest_count
:= array_length(p_guest_names, 1);

  if
p_guest_genders is null
    or coalesce(array_length(p_guest_genders, 1), 0) <> v_guest_count then
    raise exception 'INVALID_GUEST_GENDERS' using errcode = 'P0001';
end if;

  if
v_guest_count > p_maximum_guests then
    raise exception 'GUEST_LIMIT_EXCEEDED' using errcode = 'P0001';
end if;

  foreach
v_name in array p_guest_names loop
    if v_name is null or char_length(trim(v_name)) = 0 then
      raise exception 'INVALID_GUEST_NAMES' using errcode = 'P0001';
end if;
end loop;

  foreach
v_gender in array p_guest_genders loop
    if v_gender is null or v_gender not in ('male', 'female', 'unspecified') then
      raise exception 'INVALID_GUEST_GENDERS' using errcode = 'P0001';
end if;
end loop;

select *
into v_family
from public.families
where id = p_family_id
    for update;

if
not found then
    raise exception 'FAMILY_NOT_FOUND' using errcode = 'P0001';
end if;

  v_status
:= case
    when coalesce(p_is_enabled, false) = false then 'disabled'
    when v_family.status = 'disabled' then 'pending'
    else v_family.status
end;

  v_slug
:= v_family.invitation_slug;

  if
p_invitation_slug is not null and char_length(trim(p_invitation_slug)) > 0 then
    v_slug := lower(trim(p_invitation_slug));

    if
v_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
      or char_length(v_slug) < 2
      or char_length(v_slug) > 80 then
      raise exception 'INVALID_SLUG' using errcode = 'P0001';
end if;

    if
exists (
      select 1
      from public.families
      where invitation_slug = v_slug
        and id <> p_family_id
    ) then
      raise exception 'SLUG_IN_USE' using errcode = 'P0001';
end if;

    v_change_slug
:= true;
    v_token_hash
:= encode(extensions.digest(v_slug, 'sha256'), 'hex');
    v_token_preview
:= left(v_slug, 24);
end if;

begin
update public.families
set display_name             = trim(p_display_name),
    maximum_guests           = p_maximum_guests,
    custom_message           = nullif(trim(coalesce(p_custom_message, '')), ''),
    is_enabled               = coalesce(p_is_enabled, false),
    status                   = v_status,
    invitation_slug          = v_slug,
    invitation_token_hash    = case
                                   when v_change_slug then v_token_hash
                                   else invitation_token_hash
        end,
    invitation_token_preview = case
                                   when v_change_slug then v_token_preview
                                   else invitation_token_preview
        end
where id = p_family_id;
exception
    when unique_violation then
      raise exception 'SLUG_IN_USE' using errcode = 'P0001';
end;

select coalesce(
               array_agg(id order by is_primary_contact desc, created_at asc),
               array[] ::uuid[]
       )
into v_existing_ids
from public.guests
where family_id = p_family_id;

v_existing_count
:= coalesce(array_length(v_existing_ids, 1), 0);

for v_index in 1..v_guest_count loop
    v_name := trim(p_guest_names[v_index]);
    v_gender
:= p_guest_genders[v_index];

    if
v_index <= v_existing_count then
update public.guests
set full_name               = v_name,
    gender                  = v_gender,
    needs_name_confirmation = public.is_placeholder_guest_name(v_name),
    is_primary_contact      = (v_index = 1)
where id = v_existing_ids[v_index];
else
      insert into public.guests (
        family_id,
        full_name,
        gender,
        needs_name_confirmation,
        is_primary_contact,
        attendance_status
      ) values (
        p_family_id,
        v_name,
        v_gender,
        public.is_placeholder_guest_name(v_name),
        (v_index = 1),
        'pending'
      );
end if;
end loop;

  if
v_existing_count > v_guest_count then
begin
delete
from public.guests
where id = any (
    v_existing_ids[v_guest_count + 1:v_existing_count]
    );
exception
      when foreign_key_violation then
        raise exception 'GUEST_DELETE_BLOCKED' using errcode = 'P0001';
end;
end if;

insert into public.audit_events (event_id,
                                 family_id,
                                 action,
                                 metadata)
values (v_family.event_id,
        p_family_id,
        'family_updated',
        jsonb_build_object(
                'maximum_guests', p_maximum_guests,
                'guest_count', v_guest_count,
                'is_enabled', coalesce(p_is_enabled, false),
                'invitation_slug', v_slug,
                'source', 'admin'
        ));

return jsonb_build_object(
        'family_id', p_family_id,
        'invitation_slug', v_slug,
        'guest_count', v_guest_count
       );
end;
$$;

revoke all on function public.update_family_with_guests(
    uuid,
    text,
    integer,
    text,
    boolean,
    text[],
    text[],
    text
    ) from public;

grant
execute
on
function
public
.
update_family_with_guests
(
  uuid,
  text,
  integer,
  text,
  boolean,
  text[],
  text[],
  text
) to service_role;

create
or replace function public.submit_family_rsvp(
  p_invitation_slug text,
  p_will_attend boolean,
  p_guest_responses jsonb,
  p_contact_email text default null,
  p_contact_phone text default null,
  p_message text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
v_family public.families%rowtype;
  v_event
public.events%rowtype;
  v_response_id
uuid;
  v_existing_response_id
uuid;
  v_confirmed_count
integer := 0;
  v_transport_count
integer := 0;
  v_guest
jsonb;
  v_guest_id
uuid;
  v_guest_will_attend
boolean;
  v_guest_needs_transport
boolean;
  v_boarding
text;
  v_dietary
text;
  v_menu
text;
  v_full_name
text;
  v_needs_name
boolean;
  v_family_guest_count
integer;
  v_payload_guest_count
integer;
  v_matched_guest_count
integer;
  v_action
text;
  v_slug
text;
begin
  v_slug
:= lower(trim(coalesce(p_invitation_slug, '')));

  if
v_slug is null or char_length(v_slug) = 0 then
    raise exception 'INVITATION_NOT_FOUND' using errcode = 'P0001';
end if;

  if
p_guest_responses is null or jsonb_typeof(p_guest_responses) <> 'array' then
    raise exception 'INVALID_GUEST_PAYLOAD' using errcode = 'P0001';
end if;

select *
into v_family
from public.families
where invitation_slug = v_slug
    for update;

if
not found then
    raise exception 'INVITATION_NOT_FOUND' using errcode = 'P0001';
end if;

  if
not v_family.is_enabled or v_family.status = 'disabled' then
    raise exception 'INVITATION_NOT_FOUND' using errcode = 'P0001';
end if;

select *
into v_event
from public.events
where id = v_family.event_id
    for update;

if
not found then
    raise exception 'INVITATION_NOT_FOUND' using errcode = 'P0001';
end if;

  if
not v_event.is_rsvp_open then
    raise exception 'RSVP_CLOSED' using errcode = 'P0001';
end if;

  if
timezone('utc', now()) > v_event.rsvp_deadline then
    raise exception 'RSVP_DEADLINE_PASSED' using errcode = 'P0001';
end if;

select count(*) ::integer
into v_family_guest_count
from public.guests
where family_id = v_family.id;

select count(*) ::integer
into v_payload_guest_count
from jsonb_array_elements(p_guest_responses);

if
v_payload_guest_count <> v_family_guest_count then
    raise exception 'INVALID_GUEST_PAYLOAD' using errcode = 'P0001';
end if;

select count(*) ::integer
into v_matched_guest_count
from jsonb_array_elements(p_guest_responses) as guest_row(value)
         join public.guests g
              on g.id = (guest_row.value ->> 'guest_id')::uuid
   and g.family_id = v_family.id;

if
v_matched_guest_count <> v_family_guest_count then
    raise exception 'INVALID_GUEST_PAYLOAD' using errcode = 'P0001';
end if;

  if
p_will_attend then
select count(*) ::integer
into v_confirmed_count
from jsonb_array_elements(p_guest_responses) as guest_row(value)
where coalesce((guest_row.value ->> 'will_attend')::boolean, false);

if
v_confirmed_count < 1 then
      raise exception 'ATTENDING_REQUIRES_GUESTS' using errcode = 'P0001';
end if;

    if
v_confirmed_count > v_family.maximum_guests then
      raise exception 'GUEST_LIMIT_EXCEEDED' using errcode = 'P0001';
end if;

select count(*) ::integer
into v_transport_count
from jsonb_array_elements(p_guest_responses) as guest_row(value)
where coalesce((guest_row.value ->> 'will_attend')::boolean, false)
  and coalesce((guest_row.value ->> 'needs_transport')::boolean, false);
else
    v_confirmed_count := 0;
    v_transport_count
:= 0;
end if;

select id
into v_existing_response_id
from public.rsvp_responses
where family_id = v_family.id;

v_action
:= case
    when v_existing_response_id is not null then 'rsvp_updated'
    else 'rsvp_submitted'
end;

insert into public.rsvp_responses (family_id,
                                   will_attend,
                                   confirmed_guest_count,
                                   contact_email,
                                   contact_phone,
                                   message,
                                   submitted_at,
                                   updated_at)
values (v_family.id,
        p_will_attend,
        v_confirmed_count,
        nullif(trim(p_contact_email), ''),
        nullif(trim(p_contact_phone), ''),
        nullif(trim(p_message), ''),
        timezone('utc', now()),
        timezone('utc', now())) on conflict (family_id) do
update
    set
        will_attend = excluded.will_attend,
    confirmed_guest_count = excluded.confirmed_guest_count,
    contact_email = excluded.contact_email,
    contact_phone = excluded.contact_phone,
    message = excluded.message,
    updated_at = timezone('utc', now())
    returning id
into v_response_id;

delete
from public.rsvp_response_guests
where rsvp_response_id = v_response_id;

for v_guest in
select value
from jsonb_array_elements(p_guest_responses) loop v_guest_id := (v_guest ->> 'guest_id')::uuid;
v_guest_will_attend
:= case
      when p_will_attend then coalesce((v_guest ->> 'will_attend')::boolean, false)
      else false
end;
    v_guest_needs_transport
:= case
      when v_guest_will_attend then
        coalesce((v_guest ->> 'needs_transport')::boolean, false)
      else false
end;
    v_boarding
:= nullif(trim(coalesce(v_guest ->> 'transport_boarding_point', '')), '');
    if
v_guest_needs_transport then
      if v_boarding is null or v_boarding not in ('modelia', 'villa_sonia') then
        raise exception 'TRANSPORT_BOARDING_REQUIRED' using errcode = 'P0001';
end if;
else
      v_boarding := null;
end if;
    v_dietary
:= nullif(trim(v_guest ->> 'dietary_restrictions'), '');
    v_menu
:= nullif(trim(v_guest ->> 'menu_option'), '');

select needs_name_confirmation
into v_needs_name
from public.guests
where id = v_guest_id
  and family_id = v_family.id;

v_full_name
:= null;
    if
coalesce(v_needs_name, false) then
      v_full_name := nullif(trim(coalesce(v_guest ->> 'full_name', '')), '');
      if
v_full_name is null or public.is_placeholder_guest_name(v_full_name) then
        raise exception 'GUEST_NAME_REQUIRED' using errcode = 'P0001';
end if;
end if;

insert into public.rsvp_response_guests (rsvp_response_id,
                                         guest_id,
                                         will_attend,
                                         dietary_restrictions,
                                         menu_option,
                                         needs_transport,
                                         transport_boarding_point)
values (v_response_id,
        v_guest_id,
        v_guest_will_attend,
        v_dietary,
        v_menu,
        v_guest_needs_transport,
        v_boarding);

update public.guests
set full_name                = coalesce(v_full_name, full_name),
    needs_name_confirmation  = case
                                   when v_full_name is not null then false
                                   else needs_name_confirmation
        end,
    attendance_status        = case
                                   when v_guest_will_attend then 'attending'
                                   when p_will_attend then 'not_attending'
                                   else 'not_attending'
        end,
    dietary_restrictions     = v_dietary,
    menu_option              = v_menu,
    needs_transport          = v_guest_needs_transport,
    transport_boarding_point = v_boarding,
    updated_at               = timezone('utc', now())
where id = v_guest_id
  and family_id = v_family.id;
end loop;

update public.families
set status     = 'responded',
    updated_at = timezone('utc', now())
where id = v_family.id;

insert into public.audit_events (event_id, family_id, action, metadata)
values (v_family.event_id,
        v_family.id,
        v_action,
        jsonb_build_object(
                'confirmed_guest_count', v_confirmed_count,
                'transport_guest_count', v_transport_count,
                'will_attend', p_will_attend
        ));

return jsonb_build_object(
        'response_id', v_response_id,
        'family_id', v_family.id,
        'action', v_action,
        'confirmed_guest_count', v_confirmed_count,
        'transport_guest_count', v_transport_count
       );
end;
$$;

revoke all on function public.submit_family_rsvp(
    text,
    boolean,
    jsonb,
    text,
    text,
    text
    ) from public;

grant
execute
on
function
public
.
submit_family_rsvp
(
  text,
  boolean,
  jsonb,
  text,
  text,
  text
) to service_role;

