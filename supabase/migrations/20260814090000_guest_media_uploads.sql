-- Guest media uploads: metadata table, QR access, private Storage bucket.

-- ---------------------------------------------------------------------------
-- Event QR access (opaque token hashed; raw token never stored)
-- ---------------------------------------------------------------------------

create table public.event_guest_media_access
(
    event_id      uuid primary key references public.events (id) on delete cascade,
    token_hash    text        not null,
    token_preview text        not null,
    is_enabled    boolean     not null default false,
    opens_at      timestamptz,
    closes_at     timestamptz,
    rotated_at    timestamptz,
    created_at    timestamptz not null default timezone('utc', now()),
    updated_at    timestamptz not null default timezone('utc', now()),
    constraint event_guest_media_access_token_hash_not_blank
        check (char_length(trim(token_hash)) > 0),
    constraint event_guest_media_access_token_preview_not_blank
        check (char_length(trim(token_preview)) > 0),
    constraint event_guest_media_access_token_hash_unique unique (token_hash),
    constraint event_guest_media_access_window_valid check (
        opens_at is null
            or closes_at is null
            or opens_at <= closes_at
        )
);

create trigger event_guest_media_access_set_updated_at
    before update
    on public.event_guest_media_access
    for each row
    execute function public.set_updated_at();

alter table public.event_guest_media_access enable row level security;

revoke all on table public.event_guest_media_access from anon, authenticated;
grant
all
on table public.event_guest_media_access to service_role;

-- ---------------------------------------------------------------------------
-- Upload metadata
-- ---------------------------------------------------------------------------

create table public.guest_media_uploads
(
    id                uuid primary key     default gen_random_uuid(),
    event_id          uuid        not null references public.events (id) on delete cascade,
    family_id         uuid        references public.families (id) on delete set null,
    source            text        not null,
    uploader_name     text,
    object_key        text        not null,
    original_filename text        not null,
    media_type        text        not null,
    mime_type         text        not null,
    size_bytes        bigint      not null,
    status            text        not null default 'pending',
    session_id        text,
    client_ip_hash    text,
    error_code        text,
    created_at        timestamptz not null default timezone('utc', now()),
    uploaded_at       timestamptz,
    reviewed_at       timestamptz,
    updated_at        timestamptz not null default timezone('utc', now()),
    constraint guest_media_uploads_source_valid check (
        source in ('invitation', 'event_qr')
        ),
    constraint guest_media_uploads_media_type_valid check (
        media_type in ('image', 'video')
        ),
    constraint guest_media_uploads_status_valid check (
        status in (
                   'pending',
                   'uploading',
                   'uploaded',
                   'approved',
                   'rejected',
                   'failed'
            )
        ),
    constraint guest_media_uploads_size_positive check (size_bytes > 0),
    constraint guest_media_uploads_object_key_not_blank
        check (char_length(trim(object_key)) > 0),
    constraint guest_media_uploads_object_key_unique unique (object_key),
    constraint guest_media_uploads_filename_not_blank
        check (char_length(trim(original_filename)) > 0),
    constraint guest_media_uploads_mime_not_blank
        check (char_length(trim(mime_type)) > 0),
    constraint guest_media_uploads_invitation_requires_family check (
        source <> 'invitation' or family_id is not null
        ),
    constraint guest_media_uploads_qr_has_null_family check (
        source <> 'event_qr' or family_id is null
        ),
    constraint guest_media_uploads_uploader_name_length check (
        uploader_name is null or char_length(uploader_name) <= 120
        )
);

create index guest_media_uploads_event_created_idx
    on public.guest_media_uploads (event_id, created_at desc);

create index guest_media_uploads_event_status_idx
    on public.guest_media_uploads (event_id, status);

create index guest_media_uploads_family_idx
    on public.guest_media_uploads (family_id) where family_id is not null;

create index guest_media_uploads_session_created_idx
    on public.guest_media_uploads (session_id, created_at desc) where session_id is not null;

create index guest_media_uploads_ip_created_idx
    on public.guest_media_uploads (client_ip_hash, created_at desc) where client_ip_hash is not null;

create index guest_media_uploads_status_created_idx
    on public.guest_media_uploads (status, created_at) where status in ('pending', 'uploading');

create trigger guest_media_uploads_set_updated_at
    before update
    on public.guest_media_uploads
    for each row
    execute function public.set_updated_at();

alter table public.guest_media_uploads enable row level security;

revoke all on table public.guest_media_uploads from anon, authenticated;
grant
all
on table public.guest_media_uploads to service_role;

-- ---------------------------------------------------------------------------
-- Private Storage bucket (3 GiB object limit; MIME allow-list)
-- Global Storage limit must also be raised in config.toml / Dashboard (Pro).
-- ---------------------------------------------------------------------------

insert into storage.buckets (id,
                             name,
                             public,
                             file_size_limit,
                             allowed_mime_types)
values ('guest-media',
        'guest-media',
        false,
        3221225472, -- 3 GiB
        array[
            'image/jpeg',
        'image/png',
        'image/webp',
        'video/mp4',
        'video/quicktime',
        'video/webm'
            ]) on conflict (id) do
update
    set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Deny-by-default for anon/authenticated; signed upload URLs use service-role minting.
-- No SELECT/INSERT/UPDATE/DELETE policies for public roles on this bucket.

-- Seed QR access row for the primary local event (disabled until admin enables / rotates).
-- Token is NOT seeded here; admin must rotate to obtain a usable URL.
insert into public.event_guest_media_access (event_id,
                                             token_hash,
                                             token_preview,
                                             is_enabled,
                                             opens_at,
                                             closes_at)
select e.id,
       encode(extensions.digest(gen_random_uuid()::text, 'sha256'), 'hex'),
       'pending-rotate',
       false,
       null,
       null
from public.events e
where e.slug = 'nychol-miguel' on conflict (event_id) do nothing;
