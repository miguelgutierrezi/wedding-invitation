-- Drop "& Acompañante" (and numbered variants) from invitation slugs.
-- Keep in sync with `displayNameForInvitationSlug` in invitation-slug.ts.

create
or replace function public.display_name_for_invitation_slug(p_name text)
returns text
language sql
immutable
as $$
select coalesce(
               nullif(
                       trim(
                               regexp_replace(
                                       coalesce(p_name, ''),
                                       '\s*&\s*acompa[nñ]ante(\s+[0-9]+)?\s*$',
                                       '',
                                       'i'
                               )
                       ),
                       ''
               ),
               trim(coalesce(p_name, ''))
       );
$$;

do
$$
declare
r record;
  v_base
text;
  v_slug
text;
  v_suffix
integer;
begin
for r in
select id, display_name, invitation_slug
from public.families
where display_name ~* '&[[:space:]]*acompa[nñ]ante'
order by created_at asc, id asc
    loop
    v_base := coalesce (
    public.slugify_label(public.display_name_for_invitation_slug(r.display_name)),
    'familia'
    );

if
char_length(v_base) < 2 then
      v_base := 'familia';
end if;

    v_slug
:= v_base;
    v_suffix
:= 2;

    while
exists (
      select 1
      from public.families
      where invitation_slug = v_slug
        and id <> r.id
    ) loop
      v_slug := v_base || '-' || v_suffix::text;
      v_suffix
:= v_suffix + 1;
end loop;

    if
v_slug is distinct from r.invitation_slug then
update public.families
set invitation_slug          = v_slug,
    invitation_token_hash    = encode(extensions.digest(v_slug, 'sha256'), 'hex'),
    invitation_token_preview = left (v_slug, 24)
where id = r.id;
end if;
end loop;
end;
$$;
