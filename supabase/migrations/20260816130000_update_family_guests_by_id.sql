-- Persist admin guest edits by guest id (not display-name / created_at order).
-- Also keeps index-based matching when p_guest_ids is omitted.

drop function if exists public.update_family_with_guests(
    uuid,
    text,
    integer,
    text,
    boolean,
    text[],
    text
    );

drop function if exists public.update_family_with_guests(
    uuid,
    text,
    integer,
    text,
    boolean,
    text[],
    text[],
    text
    );

create function public.update_family_with_guests(
    p_family_id uuid,
    p_display_name text,
    p_maximum_guests integer,
    p_custom_message text,
    p_is_enabled boolean,
    p_guest_names text[],
    p_guest_genders text[],
    p_invitation_slug text default null,
    p_guest_ids uuid[] default null
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
  v_keep_ids
uuid[] := array[]::uuid[];
  v_index
integer;
  v_name
text;
  v_gender
text;
  v_guest_id
uuid;
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
p_guest_ids is not null
    and coalesce(array_length(p_guest_ids, 1), 0) <> v_guest_count then
    raise exception 'INVALID_GUEST_IDS' using errcode = 'P0001';
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
    v_guest_id
:= case
      when p_guest_ids is null then null
      else p_guest_ids[v_index]
end;

    if
p_guest_ids is not null then
      if v_guest_id is not null then
        if v_guest_id = any (v_keep_ids)
          or not exists (
            select 1
            from public.guests
            where id = v_guest_id
              and family_id = p_family_id
          ) then
          raise exception 'INVALID_GUEST_IDS' using errcode = 'P0001';
end if;

update public.guests
set full_name               = v_name,
    gender                  = v_gender,
    needs_name_confirmation = public.is_placeholder_guest_name(v_name),
    is_primary_contact      = (v_index = 1)
where id = v_guest_id;

v_keep_ids
:= v_keep_ids || v_guest_id;
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
        )
        returning id into v_guest_id;

        v_keep_ids
:= v_keep_ids || v_guest_id;
end if;
    elsif
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

begin
    if
p_guest_ids is not null then
delete
from public.guests
where family_id = p_family_id
  and id <> all (v_keep_ids);
elsif
v_existing_count > v_guest_count then
delete
from public.guests
where id = any (
    v_existing_ids[v_guest_count + 1:v_existing_count]
    );
end if;
exception
    when foreign_key_violation then
      raise exception 'GUEST_DELETE_BLOCKED' using errcode = 'P0001';
end;

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
    text,
    uuid[]
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
  text,
  uuid[]
) to service_role;
