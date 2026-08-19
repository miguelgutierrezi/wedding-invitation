-- Admin-only: delete a family and cascade guests / RSVP rows.
-- Writes an audit event before delete (family_id becomes null after cascade).

create
or replace function public.delete_family(p_family_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
v_family public.families%rowtype;
begin
  if
p_family_id is null then
    raise exception 'FAMILY_NOT_FOUND' using errcode = 'P0001';
end if;

select *
into v_family
from public.families
where id = p_family_id
    for update;

if
not found then
    raise exception 'FAMILY_NOT_FOUND' using errcode = 'P0001';
end if;

insert into public.audit_events (event_id, family_id, action, metadata)
values (v_family.event_id,
        v_family.id,
        'family_deleted',
        jsonb_build_object(
                'display_name', v_family.display_name,
                'invitation_slug', v_family.invitation_slug,
                'source', 'admin'
        ));

delete
from public.families
where id = p_family_id;

return jsonb_build_object('family_id', p_family_id);
end;
$$;

revoke all on function public.delete_family(uuid) from public;

grant
execute
on
function
public
.
delete_family
(uuid) to service_role;
