# Current phase

**Status:** Guest Media Uploads **complete**; companion names + unspecified gender in repo

**Last reviewed:** 2026-08-15

**Authorized scope:** Guest media QR PNG download authorized by explicit request. Do not implement Resend/email, public gallery, ZIP-on-Vercel, AWS/GCP/R2, or WhatsApp Cloud API unless newly authorized. Invitation copy/layout polish may proceed when the user requests it explicitly.

## Snapshot of the repository

| Area | State |
|------|--------|
| Invitation + RSVP + boarding | Implemented |
| Cover greeting (1 / 2 / 3+ guests + gender) | Implemented (`cover-greeting.ts` + `guests.gender`) |
| Plus-ones “Acompañante” | Implemented (`needs_name_confirmation` + RSVP name field) |
| Gender `unspecified` | Implemented (admin + cover “Hola”) |
| Outfit inspiration pages | Implemented (`/inspiracion/ellos\|ellas`) |
| Event TZ display (`America/Bogota`) | Implemented (`event-timezone.ts`) |
| Admin Excel export | Implemented |
| Guest media uploads | **Implemented** |
| WhatsApp scheduled send | Not implemented |
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

## Invitation polish (user-requested, post media)

Documented in `docs/invitation-ui.md` / `docs/architecture.md`:

- Personalized cover line by guest count and gender
- Admin gender field on guests (`…_guest_gender.sql` migration + RPC args)
- Gifts illustration sizing; dress “Ver Inspiración” centered text
- Outfit boards phone vs desktop; share-memories accent CTA

## Recommended next steps

1. On hosted Supabase: apply **all** pending migrations (guest media, **`guest_gender`**, **`guest_gender_unspecified`**, **`placeholder_companion_names`**, **`update_family_guests_by_id`**); raise Storage limits; rotate QR in `/admin/photos`.
2. Confirm plus-ones named “Acompañante” show the RSVP name field and still count in analytics.
3. Manual E2E: invitation fotos + QR fotos + admin approve/reject; cover greetings for 1 / 2 / 3+ guests.
4. WhatsApp optional send / Resend when needed.
