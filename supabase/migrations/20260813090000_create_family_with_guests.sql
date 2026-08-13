-- Transactional admin family create (family + guests + audit).
-- Called only via service-role from the Next.js admin service.

create or replace function public.create_family_with_guests(
  p_event_id uuid,
  p_display_name text,
  p_maximum_guests integer,
  p_custom_message text,
  p_guest_names text[],
  p_invitation_slug text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slug text;
  v_token_hash text;
  v_token_preview text;
  v_guest_count integer;
  v_name text;
  v_index integer;
  v_family_id uuid;
  v_custom text;
begin
  if p_event_id is null then
    raise exception 'EVENT_NOT_FOUND' using errcode = 'P0001';
  end if;

  if not exists (select 1 from public.events where id = p_event_id) then
    raise exception 'EVENT_NOT_FOUND' using errcode = 'P0001';
  end if;

  if p_display_name is null or char_length(trim(p_display_name)) = 0 then
    raise exception 'INVALID_DISPLAY_NAME' using errcode = 'P0001';
  end if;

  if p_maximum_guests is null or p_maximum_guests < 1 then
    raise exception 'GUEST_LIMIT_EXCEEDED' using errcode = 'P0001';
  end if;

  if p_guest_names is null or coalesce(array_length(p_guest_names, 1), 0) < 1 then
    raise exception 'INVALID_GUEST_NAMES' using errcode = 'P0001';
  end if;

  v_guest_count := array_length(p_guest_names, 1);

  if v_guest_count > p_maximum_guests then
    raise exception 'GUEST_LIMIT_EXCEEDED' using errcode = 'P0001';
  end if;

  foreach v_name in array p_guest_names loop
    if v_name is null or char_length(trim(v_name)) = 0 then
      raise exception 'INVALID_GUEST_NAMES' using errcode = 'P0001';
    end if;
  end loop;

  if p_invitation_slug is null or char_length(trim(p_invitation_slug)) = 0 then
    raise exception 'INVALID_SLUG' using errcode = 'P0001';
  end if;

  v_slug := lower(trim(p_invitation_slug));

  if v_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    or char_length(v_slug) < 2
    or char_length(v_slug) > 80 then
    raise exception 'INVALID_SLUG' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.families where invitation_slug = v_slug
  ) then
    raise exception 'SLUG_IN_USE' using errcode = 'P0001';
  end if;

  v_token_hash := encode(extensions.digest(v_slug, 'sha256'), 'hex');
  v_token_preview := left(v_slug, 24);
  v_custom := nullif(trim(coalesce(p_custom_message, '')), '');

  begin
    insert into public.families (
      event_id,
      display_name,
      invitation_slug,
      invitation_token_hash,
      invitation_token_preview,
      maximum_guests,
      custom_message,
      status,
      is_enabled
    ) values (
      p_event_id,
      trim(p_display_name),
      v_slug,
      v_token_hash,
      v_token_preview,
      p_maximum_guests,
      v_custom,
      'pending',
      true
    )
    returning id into v_family_id;
  exception
    when unique_violation then
      raise exception 'SLUG_IN_USE' using errcode = 'P0001';
  end;

  for v_index in 1..v_guest_count loop
    insert into public.guests (
      family_id,
      full_name,
      is_primary_contact,
      attendance_status
    ) values (
      v_family_id,
      trim(p_guest_names[v_index]),
      (v_index = 1),
      'pending'
    );
  end loop;

  insert into public.audit_events (
    event_id,
    family_id,
    action,
    metadata
  ) values (
    p_event_id,
    v_family_id,
    'family_created',
    jsonb_build_object(
      'maximum_guests', p_maximum_guests,
      'guest_count', v_guest_count,
      'invitation_slug', v_slug,
      'source', 'admin'
    )
  );

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
  text
) from public;

grant execute on function public.create_family_with_guests(
  uuid,
  text,
  integer,
  text,
  text[],
  text
) to service_role;
