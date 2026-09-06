# Current phase

**Status:** Admin operations (action queue, WhatsApp copy, RSVP close checklist, practical Excel exports) **complete**
in repo (apply hosted migrations)

**Last reviewed:** 2026-09-06

**Authorized scope:** Guest media QR PNG download authorized by explicit request. Admin list pagination/chips/column
sort, RSVP contact mirror onto `guests`, and admin operations (action queue, clipboard WhatsApp reminder, RSVP close
checklist, practical Excel exports, status badges) authorized for product reuse. Branded **Supabase Auth invite HTML**
(`emails/admin-invite.html`) is authorized so the admin invite email matches the invitation. Do not implement Resend,
public gallery, ZIP-on-Vercel, AWS/GCP/R2, or WhatsApp Cloud API unless newly authorized. Invitation copy/layout polish
may proceed when the user requests it explicitly.

## Snapshot of the repository

| Area                                        | State                                                                          |
|---------------------------------------------|--------------------------------------------------------------------------------|
| Invitation + RSVP + boarding                | Implemented; **per-guest attend / not attend**                                 |
| Cover greeting (1 / 2 / 3+ guests + gender) | Implemented (`cover-greeting.ts` + `guests.gender`)                            |
| Plus-ones “Acompañante”                     | Implemented; name required **only if that person attends**                     |
| Gender `unspecified`                        | Implemented (admin + cover “Hola”)                                             |
| Outfit inspiration pages                    | Implemented (`/inspiracion/ellos\|ellas`)                                      |
| Event TZ display (`America/Bogota`)         | Implemented (`event-timezone.ts`)                                              |
| Admin Excel export                          | Full workbook + `kind=attending\|transport\|dietary\|contacts`                 |
| Admin families/guests lists                 | Filters, chips, column sort, page size 25; cards below `lg`                    |
| Admin compact chrome                        | Hamburger until `xl`; FAB phone-only (hidden iPad 11"+)        |
| Guest phone/email                           | Mirrored from family RSVP onto `guests`                                        |
| Admin plain-language UI                     | Non-technical Spanish labels in admin panel                                    |
| Delete family (admin)                       | RPC + confirm-by-name; works with unsaved edits                                |
| Admin operations                            | Action queue, close follow-ups, family activity, **batch actions** |
| Admin invite flow                          | **Implemented**; accept → `/admin/aceptar-invitacion` (set password) → `/admin` |
| Admin invite email HTML                    | Branded template in `emails/admin-invite.html` (paste into Supabase Auth) |
| Admin password reset                       | Login link + `emails/admin-reset-password.html`; OTP 24 h                  |
| Analytics example families                  | Names containing the word **ejemplo** omitted from stats           |
| Guest media uploads                         | **Implemented**                                                                |
| WhatsApp scheduled send                     | Not implemented                                                                |
| Resend transactional email product         | Not implemented (Auth invite/reset SMTP only)                      |

## Completed: analytics omit example families

`/admin/analytics` (and Resumen cards that share `getAnalyticsSnapshot`) ignore families whose display name contains the
word **ejemplo**. They remain on the families/guests lists and in Excel.

## Completed: delete family with unsaved edits

Family detail delete does not require Guardar cambios first. Confirmation accepts the saved name or the draft on
screen. The delete form is isolated (`noValidate` + `form=`) so empty required guest fields cannot block it. The
server still checks the name stored in the database.

## Completed: admin compact chrome (phone + tablet)

- Hamburger / drawer until Tailwind `xl` (1280px), so iPad 11" (834×1194) keeps it in portrait and landscape. Closed
  drawer overlay uses `pointer-events-none` so it cannot swallow the hamburger tap (iPad Chrome).
- Floating **+** is **phone-only** (hidden from 834px / iPad 11" up). Tablets use **Nueva familia** in the drawer (and
  the families page button). Still hidden on `/admin/families/new`.
- Lists: cards below `lg`; tables from `lg`. Desktop inline nav from `xl`.
- Path helpers + tests: `src/lib/admin/admin-chrome.ts` (`ADMIN_FAB_HIDE_MIN_PX`, `ADMIN_DESKTOP_NAV_MIN_PX`).
- Drawer respects `prefers-reduced-motion`. Back chevron on create and family detail.

## Completed: RSVP partial attendance

A family can confirm some guests and decline others (including a plus-one named “Acompañante”). The companion name is
required only if that person will attend. Per-guest radios Asistirá / No asistirá. Migration
`…_rsvp_partial_attendance.sql` updates `submit_family_rsvp`. Apply it on hosted Supabase.

## Completed: admin batch actions

Reusable row selection (`src/lib/admin/selection.ts`, max `ADMIN_BATCH_MAX_IDS`) on families, guests, and photos:

## Completed: admin invite flow

Admins can now be invited from the dashboard by email. The app calls Supabase Auth `inviteUserByEmail` with
`redirectTo` `/admin/aceptar-invitacion`. Re-sending a **pending** invite uses `auth.admin.generateLink({ type: "invite" })`
without deleting the Auth user. Inviting an email that is already an **active** admin returns
“Ese correo ya es administrador activo.” Pending rows show **Enviada hace …** (and **Caducada** when past the OTP
window). Local + recommended hosted `otp_expiry` is **86400** (24 h).

The invitee clicks the email link, lands on `/admin/aceptar-invitacion` to create a password, then continues to
`/admin`. Returning admins use `/admin/login`, which includes **¿Olvidaste tu contraseña?**
(`resetPasswordForEmail` → same accept page; paste `emails/admin-reset-password.html` into Supabase **Reset password**).

The **Admins** menu lists **active** admins and **pending** invitations. Cancel pending with **Cancelar**. Active
admins can be removed with **Borrar admin** only after typing their email; the signed-in account and
`ADMIN_ALLOWED_EMAILS` owners (couple) show **No disponible**. Invite / resend / cancel / delete / accept / password-reset
requests are written to `audit_events` (`admin_*` actions, `family_id` null) via `recordAdminDirectoryAudit`.

Pending detection uses `invited_at` + absence of `last_sign_in_at` (and admin role metadata). Listing pages through Auth
Admin `listUsers` via `listAdminDirectory`. Helpers: `src/lib/auth/admin-invite.ts`,
`src/lib/auth/list-pending-admin-invites.ts`, `src/lib/auth/admin-accept-invite.ts`. The accept-invite route is public in
`src/proxy.ts` (like login).

The invite email field + button stack until Tailwind `lg` (aligned with primary CTA `w-full` → `lg:w-auto`), so phones
and portrait tablets no longer crush the input. Layout class: `src/lib/admin/admin-invite-form-layout.ts`. Directory row
classes: `src/lib/admin/admin-directory-layout.ts`. Visual tokens from Figma (`--olive-border`, `--olive-wash`,
`--olive-muted`, status active/pending) live in `globals.css`; email + **TÚ** sit in one identity group with `gap-2`
(8px). Responsive content: phone nested cards (`85:220`, shorter invite lead, wash fill for TÚ) → tablet
portrait left/right clusters (`85:133`) → `lg+` single row (`85:40`). Chrome/nav unchanged.

The hosted **Invite user** email uses the branded HTML in `emails/admin-invite.html` (Figma node `80:40`: cream page, olive header, pill CTA **Aceptar invitación**, dark footer). Paste it into Supabase Dashboard → Authentication → Email Templates → Invite user. Keep `{{ .ConfirmationURL }}` on the button. Subject: `Invitación al panel · Nychol & Miguel`. This is not Resend.

## Completed: pending companion count by attendance state

A companion placeholder counts as “Nombre por confirmar” while the guest is still pending or already attending, and it is excluded only when the guest has already declined. The admin counters, family chips, and list filters follow that rule consistently.

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
- Analytics omit families whose name includes the word **ejemplo** (Resumen cards share the same snapshot).
- Disabled invitations (`is_enabled = false` / `status = disabled`) are excluded from resumen, estadísticas, guest list,
  RSVP close checklist, and Excel. They remain on `/admin/families` via the desactivada filter and only feed the
  “Familias desactivadas” metric.

## Completed: admin lists + guest contact

- `/admin/families` and `/admin/guests`: chips for active filters, sortable columns, 25-row pagination, URL via
  Next `router.replace` (so back/forward restores filters). Filter helpers live in `src/lib/validation/admin-filters.ts`
  (parse → match → chips → query string). Hook: `useAdminListFilters`. The in-app back chevron on family detail/create
  restores the last filtered Familias URL from `sessionStorage` (`admin-list-return.ts`), matching browser back.
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
…_rsvp_partial_attendance.sql   # companion name required only when that guest attends
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
2. Confirm plus-ones named “Acompañante”: attending requires a real name; **No asistirá** saves without a name. Apply
   `…_rsvp_partial_attendance.sql` on hosted Supabase.
3. Manual E2E: invitation fotos + QR fotos + admin approve/reject; cover greetings for 1 / 2 / 3+ guests.
4. WhatsApp optional send / Resend when needed.
