# Current phase

**Status:** Admin operations (action queue, WhatsApp copy, RSVP close checklist, practical Excel exports) **complete**
in repo (apply hosted migrations)

**Last reviewed:** 2026-08-19

**Authorized scope:** Guest media QR PNG download authorized by explicit request. Admin list pagination/chips/column
sort, RSVP contact mirror onto `guests`, and admin operations (action queue, clipboard WhatsApp reminder, RSVP close
checklist, practical Excel exports, status badges) authorized for product reuse. Do not implement Resend/email, public
gallery, ZIP-on-Vercel, AWS/GCP/R2, or WhatsApp Cloud API unless newly authorized. Invitation copy/layout polish may
proceed when the user requests it explicitly.

## Snapshot of the repository

| Area                                        | State                                                                          |
|---------------------------------------------|--------------------------------------------------------------------------------|
| Invitation + RSVP + boarding                | Implemented                                                                    |
| Cover greeting (1 / 2 / 3+ guests + gender) | Implemented (`cover-greeting.ts` + `guests.gender`)                            |
| Plus-ones “Acompañante”                     | Implemented (`needs_name_confirmation` + RSVP name field)                      |
| Gender `unspecified`                        | Implemented (admin + cover “Hola”)                                             |
| Outfit inspiration pages                    | Implemented (`/inspiracion/ellos\|ellas`)                                      |
| Event TZ display (`America/Bogota`)         | Implemented (`event-timezone.ts`)                                              |
| Admin Excel export                          | Full workbook + `kind=attending\|transport\|dietary\|contacts`                 |
| Admin families/guests lists                 | Filters, chips, column sort, page size 25; cards below `lg`                    |
| Admin compact chrome                        | Hamburger (accent drawer), FAB +, back arrow on create/detail  |
| Guest phone/email                           | Mirrored from family RSVP onto `guests`                                        |
| Admin plain-language UI                     | Non-technical Spanish labels in admin panel                                    |
| Delete family (admin)                       | RPC + confirm-by-name in family detail                                         |
| Admin operations                            | Action queue, close follow-ups, family activity, **batch actions** |
| Guest media uploads                         | **Implemented**                                                                |
| WhatsApp scheduled send                     | Not implemented                                                                |
| Resend / settings UI                        | Not implemented                                                                |

## Completed: admin compact chrome (phone + tablet portrait)

Breakpoint: Tailwind `lg` (1024px). Below it (phone and tablet vertical) the admin is compact; from `lg` up it is the
desktop bar + tables.

- `src/components/admin/admin-chrome.tsx`: hamburger, slide-in drawer from the right (`bg-accent`, cream pills like the
  desktop nav), floating **+** (`bg-accent`, white Times plus, no olive border) except on `/admin/families/new`, back
  arrow to `/admin/families` on create **and** family detail. FAB is portaled to `document.body` with `bottom` +
  visualViewport inset (iPad Safari and Chrome).
- Lists (families, guests, photos): stacked cards below `lg`; tables from `lg` up. Primary/secondary actions are full
  width below `lg`.
- Path helpers + tests: `src/lib/admin/admin-chrome.ts` (`isAdminNavActive`, FAB/back visibility).
- Drawer respects `prefers-reduced-motion` (no slide, instant show/hide).

## Completed: admin batch actions

Reusable row selection (`src/lib/admin/selection.ts`, max `ADMIN_BATCH_MAX_IDS`) on families, guests, and photos:

- Families: copy invitation links, Excel of the selection, enable/disable (confirm).
- Guests: copy phones/emails, Excel of the selection.
- Photos: approve/reject selected (skips invalid statuses).
- POST `/api/admin/export` with `familyIds` / `guestIds`. Explicit selection includes disabled families.

## Completed: family activity + close follow-ups

- Family detail shows **Actividad reciente** from `audit_events` (created/edited, slug regenerated, opened, RSVP) plus guest media uploads. Consecutive invitation opens are collapsed.
- Family list cards/table show extra chips: sin abrir / abrió, nombre pendiente, bus, dieta (`src/lib/admin/family-ops.ts`).
- Resumen: days until RSVP deadline; action queue includes photos awaiting review and disabled-pending families; close block adds linked follow-ups for transport, boarding, catering, names, and photos.

## Completed: admin operations

- `/admin` shows **Pendientes de acción** (sin confirmar, abrieron y no respondieron, nombres por confirmar, bus sin
  punto) and a **cierre de confirmaciones** checklist (95% familias e invitados definidos, 0 nombres pendientes).
- Family detail copies a WhatsApp reminder (`weddingConfig.admin.whatsappReminderTemplate`) plus the invitation URL. No
  WhatsApp Cloud API.
- Excel: one **Descargar lista** on Resumen (`/api/admin/export`). Extra `?kind=` slices still exist on the API but are
  not shown as extra buttons.
- Family/guest lists: status badges, last-updated column, name-confirmation filter. Disable invitation and regenerate
  link ask for `window.confirm`.
- Disabled invitations (`is_enabled = false` / `status = disabled`) are excluded from resumen, estadísticas, guest list,
  RSVP close checklist, and Excel. They remain on `/admin/families` via the desactivada filter and only feed the
  “Familias desactivadas” metric.

## Completed: admin lists + guest contact

- `/admin/families` and `/admin/guests`: chips for active filters, sortable columns, 25-row pagination, URL via
  `replaceState`. Filter helpers live in `src/lib/validation/admin-filters.ts` (parse → match → chips → query string).
  On mobile, changing page scrolls to the list top, the range is shown (e.g. 26–49), and pagination sits left of the
  FAB so **Siguiente** stays tappable.
- Dashboard and analytics cards deep-link into those lists (`status=pending`, `transport=with_bus`,
  `opened=not_opened`, …).
- RSVP still has one family phone (required) + optional email. `submit_family_rsvp` copies that contact onto every
  guest. Existing responses are backfilled (`…_guest_contact_from_rsvp.sql`).
- Admin guest table splits Teléfono / Correo; family detail shows both.
- Admin can delete a family (`delete_family` RPC) after typing the family display name.

## Completed: Guest Media Uploads

### Delivered

- Private bucket `guest-media` + tables `guest_media_uploads`, `event_guest_media_access`
- Shared uploader + concurrency queue (3 images / 1 video)
- `/i/[slug]/fotos`, `/fotos?code=`, CTA on invitation
- Direct browser → Storage uploads (signed PUT + TUS)
- Provider port for future R2/S3
- `/admin/photos` moderation, QR URL rotate/enable, **PNG QR download**, reconcile
- Soft quotas + authorize rate limits (in-memory caveat documented)
- Vitest coverage for policy, keys, statuses, queue helpers, QR window, quotas, authorize/complete mocks, admin auth
  gate, QR PNG
- Docs: `docs/guest-media-storage.md`, README, architecture, invitation-ui

### Manual hosted setup

Raise Storage global file size to ≥3 GiB (often Supabase Pro). See `docs/guest-media-storage.md`.

### Out of scope (still)

- Public collaborative gallery
- ZIP download via Vercel
- Resend
- Durable Redis rate limit
- HEIC

## Hosted migrations (do not skip)

Apply in timestamp order. Omitting later files leaves hosted DB behind the app:

```text
…_guest_gender.sql
…_guest_gender_unspecified.sql
…_placeholder_companion_names.sql
…_update_family_guests_by_id.sql
…_guest_contact_from_rsvp.sql   # copies RSVP contact onto guests; updates submit_family_rsvp
…_delete_family.sql             # admin delete_family RPC
```

## Invitation polish (user-requested, post media)

Documented in `docs/invitation-ui.md` / `docs/architecture.md`:

- Personalized cover line by guest count and gender
- Admin gender field on guests (`…_guest_gender.sql` migration + RPC args)
- Gifts illustration sizing; dress “Ver Inspiración” centered text
- Outfit boards phone vs desktop; share-memories accent CTA

## Recommended next steps

1. On hosted Supabase: apply **all** pending migrations, including **`update_family_guests_by_id`**, **
   `guest_contact_from_rsvp`**, and **`delete_family`** (see `docs/architecture.md` and `docs/go-live-checklist.md`).
   Raise Storage limits; rotate QR in `/admin/photos`.
2. Confirm plus-ones named “Acompañante” show the RSVP name field and still count in analytics.
3. Manual E2E: invitation fotos + QR fotos + admin approve/reject; cover greetings for 1 / 2 / 3+ guests.
4. WhatsApp optional send / Resend when needed.
