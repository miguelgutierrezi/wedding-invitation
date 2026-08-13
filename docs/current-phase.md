# Current phase

**Status:** Guest Media Uploads **complete**

**Last reviewed:** 2026-08-12

**Authorized scope:** Guest media QR PNG download authorized by explicit request. Do not implement Resend/email, public gallery, ZIP-on-Vercel, or AWS/GCP/R2 unless newly authorized.

## Snapshot of the repository

| Area | State |
|------|--------|
| Invitation + RSVP + boarding | Implemented |
| Admin Excel export | Implemented |
| Guest media uploads | **Implemented** |
| Resend / settings UI | Not implemented |

## Completed: Guest Media Uploads

### Delivered

- Private bucket `guest-media` + tables `guest_media_uploads`, `event_guest_media_access`
- Shared uploader + concurrency queue (3 images / 1 video)
- `/i/[slug]/fotos`, `/fotos?code=`, CTA on invitation
- Direct browser → Storage uploads (signed PUT + TUS)
- Provider port for future R2/S3
- `/admin/photos` moderation, QR URL rotate/enable, **PNG QR download**, reconcile
- Soft quotas + authorize rate limits (in-memory caveat documented)
- Vitest coverage for policy, keys, statuses, queue helpers, QR window, quotas, authorize/complete mocks, admin auth gate, QR PNG
- Docs: `docs/guest-media-storage.md`, README, architecture, invitation-ui

### Manual hosted setup

Raise Storage global file size to ≥3 GiB (often Supabase Pro). See `docs/guest-media-storage.md`.

### Out of scope (still)

- Public collaborative gallery
- ZIP download via Vercel
- Resend
- Durable Redis rate limit
- HEIC

## Recommended next steps

1. On hosted Supabase: apply migration + raise Storage limits; rotate QR in `/admin/photos`.
2. Manual E2E: invitation fotos + QR fotos + admin approve/reject.
3. Go-live checklist / Resend when needed.
