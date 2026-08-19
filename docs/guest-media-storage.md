# Guest media Storage (Supabase)

**Phase:** Guest Media Uploads  
**Last reviewed:** 2026-08-12

Private bucket `guest-media` stores original photos and videos. Metadata and review state live in PostgreSQL
(`guest_media_uploads`). Bytes never transit Vercel Server Actions or Route Handlers.

## Architecture

```text
Browser (queue + tus-js-client / signed PUT)
        |
        | 1) authorizeMediaUpload (Server Action) → pending row + signed token
        | 2) upload directly to Supabase Storage (TUS or signed URL)
        | 3) completeMediaUpload → verify object exists → status uploaded
        v
Supabase Storage (private bucket) + PostgreSQL
```

Provider port: `src/services/media/storage-provider.ts`  
Supabase adapter: `src/services/media/supabase-storage-provider.ts`

Future R2/S3: implement the same port and swap `getMediaStorageProvider()`; migrate objects offline (rclone / S3 sync).
Metadata rows keep `object_key` (optionally prefix with provider).

## Manual Supabase configuration (hosted)

1. Prefer **Supabase Pro** (or a plan that allows large object uploads). Free tiers often keep a low global file size
   limit.
2. Dashboard → **Storage** → raise the **global file size limit** to at least **3 GiB** (videos).
3. Ensure bucket `guest-media` exists (migration inserts it). Confirm:
    - Public: **off**
    - File size limit: **3 GiB**
    - Allowed MIME: jpeg, png, webp, mp4, quicktime, webm
4. Do **not** add public read/list policies for `anon` / `authenticated` on this bucket.
5. Uploads use **service-role minted signed upload URLs** (`createSignedUploadUrl`) and TUS endpoint
   `/storage/v1/upload/resumable/sign` with `x-signature`.
6. Set `GUEST_MEDIA_STORAGE_QUOTA_BYTES` in Vercel to the soft budget used for admin alerts (default 50 GiB in config).

Local (`supabase/config.toml`):

```toml
[storage]
file_size_limit = "3GiB"

[storage.buckets.guest-media]
public = false
file_size_limit = "3GiB"
```

After pulling migrations:

```bash
supabase db reset   # local
# or
supabase db push    # linked / CI remote
```

## QR access

Table `event_guest_media_access` stores **SHA-256 token hash** + preview. Admin → **Fotos** → rotate token to obtain
`/fotos?code=…` once, preview the QR, and **download PNG** for print. Enable/disable without rotating. Optional
`opens_at` / `closes_at`.

## Quotas and rate limits

| Guard                    | Default          | Where                         |
|--------------------------|------------------|-------------------------------|
| Session bytes            | 20 GiB           | DB sum by `session_id` cookie |
| IP/token window          | 50 GiB / 24h     | DB sum by `client_ip_hash`    |
| Active uploads / session | 8                | DB count pending/uploading    |
| Authorize rate limit     | 60 / 15 min / IP | In-memory (`rate-limit.ts`)   |

In-memory limits are **per Vercel isolate** — not globally strong. Documented interface exists; durable store
(Upstash/Redis) is a future option without changing call sites much. Complement with Cloudflare WAF.

## Cleanup / reconciliation

Admin button **Reconciliar Storage** (or `reconcileGuestMedia`):

- Marks stale `pending`/`uploading` (>24h) as `failed` and best-effort deletes objects.
- Marks `uploaded` rows whose object is missing as `failed`.

**Orphan objects** (Storage without row) are not fully scanned online (list cost). Offline:

```bash
# Example patterns — adjust project ref / keys
supabase storage ls --experimental
# or rclone sync against the S3-compatible endpoint
```

Incomplete TUS uploads expire server-side (~24h per Supabase docs).

## Bulk download / backup (not via Vercel)

Do **not** ZIP large libraries through Next.js/Vercel.

Options:

1. Supabase Dashboard download for small sets.
2. Supabase CLI / Storage API with service role on a trusted machine.
3. `rclone` or AWS CLI against Supabase S3-compatible API.
4. Periodic backup job outside Vercel.

## HEIC

Not enabled. Revisit only after Safari, Android, Storage, and admin preview are verified end-to-end.

## Safari / mobile notes

- WhatsApp in-app browser: keep the tab open during video TUS uploads; show the in-UI warning.
- iOS may report `video/quicktime` for `.mov`.
- Large videos: prefer Wi-Fi; resumable TUS recovers from brief drops.
- Image previews use `URL.createObjectURL` (revoked on remove/unmount). No video autoplay.

## Estimated Storage consumption

Rough planning for ~90 guests:

| Scenario                      | Estimate    |
|-------------------------------|-------------|
| ~30 guests × 20 photos × 4 MB | ~2.4 GiB    |
| + 40 short videos × 200 MB    | ~8 GiB      |
| Heavy day (many 1 GB clips)   | tens of GiB |

Set `GUEST_MEDIA_STORAGE_QUOTA_BYTES` and watch admin alerts at 60/80/90%.

## Slug security note

Invitation media routes reuse `/i/[slug]`. Human-readable slugs are easier to guess than opaque tokens. Uploads never
list other families' files; `family_id` is bound server-side from the validated slug. Prefer non-guessable slugs in
production when practical. QR route never reveals family lists.
