-- Public family invitation paths use lowercase slugs (e.g. familia-gutierrez-panqueva).
-- Replaces opaque tokens in URLs; uniqueness is enforced per invitation_slug.

create or replace function public.slugify_label(input text)
returns text
language sql
immutable
as $$
  select nullif(
    trim(both '-' from regexp_replace(
      lower(
        translate(
          coalesce(input, ''),
          'ÁÀÄÂáàäâÉÈËÊéèëêÍÌÏÎíìïîÓÒÖÔóòöôÚÙÜÛúùüûÑñÇç',
          'AAAAaaaaEEEEeeeeIIIIiiiiOOOOooooUUUUuuuuNnCc'
        )
      ),
      '[^a-z0-9]+',
      '-',
      'g'
    )),
    ''
  );
$$;

alter table public.families
  add column if not exists invitation_slug text;

update public.families
set invitation_slug = coalesce(
  public.slugify_label(display_name),
  'familia-' || substr(replace(id::text, '-', ''), 1, 8)
)
where invitation_slug is null
   or char_length(trim(invitation_slug)) = 0;

-- Disambiguate collisions after bulk slugify.
with ranked as (
  select
    id,
    invitation_slug,
    row_number() over (
      partition by invitation_slug
      order by created_at asc, id asc
    ) as rn
  from public.families
)
update public.families f
set invitation_slug = f.invitation_slug || '-' || ranked.rn::text
from ranked
where f.id = ranked.id
  and ranked.rn > 1;

-- Align legacy token columns with the public slug (hash still stored for audit symmetry).
update public.families
set
  invitation_token_hash = encode(
    extensions.digest(invitation_slug, 'sha256'),
    'hex'
  ),
  invitation_token_preview = left(invitation_slug, 24);

alter table public.families
  alter column invitation_slug set not null;

alter table public.families
  drop constraint if exists families_invitation_slug_unique;

alter table public.families
  add constraint families_invitation_slug_unique unique (invitation_slug);

alter table public.families
  drop constraint if exists families_invitation_slug_format;

alter table public.families
  add constraint families_invitation_slug_format check (
    invitation_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  );

create index if not exists families_invitation_slug_idx
  on public.families (invitation_slug);

-- RSVP mutation resolves families by public slug.
drop function if exists public.submit_family_rsvp(
  text,
  boolean,
  jsonb,
  text,
  text,
  text
);

create or replace function public.submit_family_rsvp(
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
  v_event public.events%rowtype;
  v_response_id uuid;
  v_existing_response_id uuid;
  v_confirmed_count integer := 0;
  v_transport_count integer := 0;
  v_guest jsonb;
  v_guest_id uuid;
  v_guest_will_attend boolean;
  v_guest_needs_transport boolean;
  v_dietary text;
  v_menu text;
  v_family_guest_count integer;
  v_payload_guest_count integer;
  v_matched_guest_count integer;
  v_action text;
  v_slug text;
begin
  v_slug := lower(trim(coalesce(p_invitation_slug, '')));

  if v_slug is null or char_length(v_slug) = 0 then
    raise exception 'INVITATION_NOT_FOUND' using errcode = 'P0001';
  end if;

  if p_guest_responses is null or jsonb_typeof(p_guest_responses) <> 'array' then
    raise exception 'INVALID_GUEST_PAYLOAD' using errcode = 'P0001';
  end if;

  select * into v_family
  from public.families
  where invitation_slug = v_slug
  for update;

  if not found then
    raise exception 'INVITATION_NOT_FOUND' using errcode = 'P0001';
  end if;

  if not v_family.is_enabled or v_family.status = 'disabled' then
    raise exception 'INVITATION_NOT_FOUND' using errcode = 'P0001';
  end if;

  select * into v_event
  from public.events
  where id = v_family.event_id
  for update;

  if not found then
    raise exception 'INVITATION_NOT_FOUND' using errcode = 'P0001';
  end if;

  if not v_event.is_rsvp_open then
    raise exception 'RSVP_CLOSED' using errcode = 'P0001';
  end if;

  if timezone('utc', now()) > v_event.rsvp_deadline then
    raise exception 'RSVP_DEADLINE_PASSED' using errcode = 'P0001';
  end if;

  select count(*)::integer into v_family_guest_count
  from public.guests
  where family_id = v_family.id;

  select count(*)::integer into v_payload_guest_count
  from jsonb_array_elements(p_guest_responses);

  if v_payload_guest_count <> v_family_guest_count then
    raise exception 'INVALID_GUEST_PAYLOAD' using errcode = 'P0001';
  end if;

  select count(*)::integer into v_matched_guest_count
  from jsonb_array_elements(p_guest_responses) as guest_row(value)
  join public.guests g
    on g.id = (guest_row.value ->> 'guest_id')::uuid
   and g.family_id = v_family.id;

  if v_matched_guest_count <> v_family_guest_count then
    raise exception 'INVALID_GUEST_PAYLOAD' using errcode = 'P0001';
  end if;

  if p_will_attend then
    select count(*)::integer into v_confirmed_count
    from jsonb_array_elements(p_guest_responses) as guest_row(value)
    where coalesce((guest_row.value ->> 'will_attend')::boolean, false);

    if v_confirmed_count < 1 then
      raise exception 'ATTENDING_REQUIRES_GUESTS' using errcode = 'P0001';
    end if;

    if v_confirmed_count > v_family.maximum_guests then
      raise exception 'GUEST_LIMIT_EXCEEDED' using errcode = 'P0001';
    end if;

    select count(*)::integer into v_transport_count
    from jsonb_array_elements(p_guest_responses) as guest_row(value)
    where coalesce((guest_row.value ->> 'will_attend')::boolean, false)
      and coalesce((guest_row.value ->> 'needs_transport')::boolean, false);
  else
    v_confirmed_count := 0;
    v_transport_count := 0;
  end if;

  select id into v_existing_response_id
  from public.rsvp_responses
  where family_id = v_family.id;

  v_action := case
    when v_existing_response_id is not null then 'rsvp_updated'
    else 'rsvp_submitted'
  end;

  insert into public.rsvp_responses (
    family_id,
    will_attend,
    confirmed_guest_count,
    contact_email,
    contact_phone,
    message,
    submitted_at,
    updated_at
  )
  values (
    v_family.id,
    p_will_attend,
    v_confirmed_count,
    nullif(trim(p_contact_email), ''),
    nullif(trim(p_contact_phone), ''),
    nullif(trim(p_message), ''),
    timezone('utc', now()),
    timezone('utc', now())
  )
  on conflict (family_id) do update
  set
    will_attend = excluded.will_attend,
    confirmed_guest_count = excluded.confirmed_guest_count,
    contact_email = excluded.contact_email,
    contact_phone = excluded.contact_phone,
    message = excluded.message,
    updated_at = timezone('utc', now())
  returning id into v_response_id;

  delete from public.rsvp_response_guests
  where rsvp_response_id = v_response_id;

  for v_guest in
    select value from jsonb_array_elements(p_guest_responses)
  loop
    v_guest_id := (v_guest ->> 'guest_id')::uuid;
    v_guest_will_attend := case
      when p_will_attend then coalesce((v_guest ->> 'will_attend')::boolean, false)
      else false
    end;
    v_guest_needs_transport := case
      when v_guest_will_attend then
        coalesce((v_guest ->> 'needs_transport')::boolean, false)
      else false
    end;
    v_dietary := nullif(trim(v_guest ->> 'dietary_restrictions'), '');
    v_menu := nullif(trim(v_guest ->> 'menu_option'), '');

    insert into public.rsvp_response_guests (
      rsvp_response_id,
      guest_id,
      will_attend,
      dietary_restrictions,
      menu_option,
      needs_transport
    )
    values (
      v_response_id,
      v_guest_id,
      v_guest_will_attend,
      v_dietary,
      v_menu,
      v_guest_needs_transport
    );

    update public.guests
    set
      attendance_status = case
        when v_guest_will_attend then 'attending'
        when p_will_attend then 'not_attending'
        else 'not_attending'
      end,
      dietary_restrictions = v_dietary,
      menu_option = v_menu,
      needs_transport = v_guest_needs_transport,
      updated_at = timezone('utc', now())
    where id = v_guest_id
      and family_id = v_family.id;
  end loop;

  update public.families
  set
    status = 'responded',
    updated_at = timezone('utc', now())
  where id = v_family.id;

  insert into public.audit_events (event_id, family_id, action, metadata)
  values (
    v_family.event_id,
    v_family.id,
    v_action,
    jsonb_build_object(
      'confirmed_guest_count', v_confirmed_count,
      'transport_guest_count', v_transport_count,
      'will_attend', p_will_attend
    )
  );

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

grant execute on function public.submit_family_rsvp(
  text,
  boolean,
  jsonb,
  text,
  text,
  text
) to service_role;
