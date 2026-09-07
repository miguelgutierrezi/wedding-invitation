# Current phase

**Status:** Admin operations (action queue, WhatsApp copy, RSVP close checklist, practical Excel exports) **complete**
in repo (apply hosted migrations)

**Last reviewed:** 2026-09-07

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
| Admin families/guests lists                 | Filters, chips, column sort, page size 25; guests Figma `109:372` mobile, `109:36` from 834px, `103:33` from `lg`, `100:38` from `xl` |
| Admin compact chrome                        | Figma white navbar on all `AdminShell` pages; hamburger until `lg`; FAB phone-only |
| Admin Resumen                               | Figma `94:414` + drawer `94:591`; `94:232` from 834px; `94:34` from `lg`; `91:40` from `xl` |
| Admin Estadísticas                          | Figma `96:39` + `99:229` landscape + `99:419` portrait + `99:607` mobile |
| Guest phone/email                           | Mirrored from family RSVP onto `guests`                                        |
| Admin plain-language UI                     | Non-technical Spanish labels in admin panel                                    |
| Delete family (admin)                       | RPC + confirm-by-name; works with unsaved edits                                |
| Admin operations                            | Action queue, close follow-ups, family activity, **batch actions** |
| Admin invite flow                          | **Implemented**; accept → `/admin/aceptar-invitacion` (set password) → `/admin` |
| Admin invite email HTML                    | Figma `80:40` olive-gradient template in `emails/admin-invite.html` (paste into Supabase Auth) |
| Admin password reset                       | Same Figma `80:40` layout as invite (`emails/admin-reset-password.html`); OTP 24 h |
| Analytics example families                  | Names containing the word **ejemplo** omitted from stats           |
| Guest media uploads                         | **Implemented**                                                                |
| WhatsApp scheduled send                     | Not implemented                                                                |
| Resend transactional email product         | Not implemented (Auth invite/reset SMTP only)                      |

## Completed: admin Invitados mobile (Figma `109:372`)

`/admin/guests` below 834px uses the Figma workspace with the shared hamburger chrome and the phone **+** FAB
(untouched; do not add a second FAB). Stacked olive banner (24px title, remaining-days chip
`⏳ Quedan N días para confirmar`, full-width **Descargar
lista**), 2×2 KPI pills, full-width **Ordenar por** + **Mostrar filtros** (search lives inside the expanded filters),
equal-width tabs, then a **single-column** card list (role badge, Familia/Bus/Telf/Correo, **Ver familia**). Batch bar
is stacked full-width with long labels including **Descargar lista**, sitting above the FAB. Helper:
`guestsMobileCardStack`.

## Completed: admin Invitados tablet portrait (Figma `109:36`)

`/admin/guests` from 834px (iPad 11" portrait) uses the Figma workspace with the shared hamburger chrome (untouched; no
tablet FAB). Stacked olive banner with live remaining-days chip (`⏳ Quedan N días para confirmar`) and **Descargar lista**, four KPI
pills, search + sort + **Mostrar filtros**, in-page tabs, then a **2-column** card grid (role badge, Asiste/Pendiente/No
asiste, Familia/Bus/Telf/Correo, **Ver familia**). Batch bar stays compact (no Descargar in the bar — the banner CTA
covers export). Helper: `ADMIN_GUESTS_PORTRAIT_MIN_PX`.

## Completed: admin Invitados tablet landscape (Figma `103:33`)

`/admin/guests` from `lg` (1024px) uses the same Figma workspace as desktop, at landscape density: remaining-days
chip (`⏳ Quedan N días para confirmar`; not Figma’s “RSVP Límite” date), 6 filters in 2×3 (no **Nombre del acompañante** until `xl`), tighter type, and compact batch
labels (Seleccionar N / Copiar tels / Descargar). Table action stays **Ver familia** (no kebab). Shared navbar is
untouched. Helpers: `ADMIN_GUESTS_LANDSCAPE_MIN_PX`.

## Completed: admin Invitados desktop (Figma `100:38`)

`/admin/guests` from `xl` uses the Figma workspace: olive banner (Administración · Invitados, remaining-days chip
`⏳ Quedan N días para confirmar`, **Descargar lista**), colored summary strip, two-row filter card (7 fields including **Nombre del acompañante**),
in-page tabs (Estadísticas / Familias / Lista completa), Inter table with role badges and **Ver familia**, olive
list checkboxes (18px, 6px radius, `--admin-olive` when checked), and an olive batch bar. Shared navbar is unchanged
(no extra “Descargar lista” nav item). Helpers: `src/lib/admin/admin-guests-layout.ts`.

## Completed: admin Estadísticas mobile (Figma `99:607`)

`/admin/analytics` below 834px keeps the shared hamburger chrome and the phone **+** FAB (untouched). Banner stays
stacked: two-line overline, compact title (“Panel de Estadísticas”), compact body, then full-width CTAs one under the
other. Rate percents sit **under** the labels (beside them from 834px). Boarding cards and the 12 metrics are a single
column. Gauge type is `22px`. Do not add a second FAB.

## Completed: admin Estadísticas tablet portrait (Figma `99:419`)

`/admin/analytics` from 834px (iPad 11" portrait) keeps the hamburger chrome (untouched). Banner is stacked: two-line
overline, then title, then two equal-width CTAs. Rate bars stay full width; boarding cards and the 12 metrics sit in
**2 columns**. Type density matches landscape numbers (`36px` values, `24px` gauges). No tablet FAB — **Nueva familia**
stays in the drawer. Helper breakpoint: `ADMIN_RESUMEN_WIDE_MIN_PX`.

## Completed: admin Estadísticas tablet landscape (Figma `99:229`)

`/admin/analytics` from `lg` (1024px) uses the landscape workspace: banner CTAs on the right (shared banner token; chrome
untouched), two boarding cards, and a **3-column** metric grid (not waiting for `xl`). Type density steps up
(`statsValue` / `statsGaugeValue` / `busValue` at `lg`). Chrome/nav unchanged.

## Completed: admin Estadísticas desktop (Figma `96:39`)

`/admin/analytics` uses the shared Figma navbar and a full-bleed workspace: olive banner (couple overline, live RSVP
deadline, **Descargar lista**), confirmation rate bars, two boarding-point cards from `weddingConfig.transport`, and a
12-card metric grid (1 column on phone, 2 from 834px, 3 from `lg`). Numbers and list deep-links stay live
(`getAnalyticsSnapshot`). No Figma-only Mensajes tab. The “ejemplo” exclusion note stays under the grid. Helpers:
`src/lib/admin/admin-analytics.ts`.

## Completed: analytics omit example families

`/admin/analytics` (and Resumen cards that share `getAnalyticsSnapshot`) ignore families whose display name contains the
word **ejemplo**. They remain on the families/guests lists and in Excel.

## Completed: delete family with unsaved edits

Family detail delete does not require Guardar cambios first. Confirmation accepts the saved name or the draft on
screen. The delete form is isolated (`noValidate` + `form=`) so empty required guest fields cannot block it. The
server still checks the name stored in the database.

## Completed: admin compact chrome (phone + tablet)

Shared Figma navbar on every `AdminShell` page (not login / accept-invite): white header, olive hamburger until
`lg` (left cream drawer), inline pills from tablet landscape. Page titles live under the bar; back chevron on create
and family detail. Floating **+** is **phone-only** (hidden from 834px / iPad 11" up; olive). Tablets use **Nueva
familia** in the drawer (and the families page button). Still hidden on `/admin/families/new`.
- Lists: cards below `lg`; tables from `lg`.
- Path helpers + tests: `src/lib/admin/admin-chrome.ts` (`ADMIN_FAB_HIDE_MIN_PX`, `ADMIN_DESKTOP_NAV_MIN_PX` = 1024,
  `ADMIN_RESUMEN_WIDE_MIN_PX`, `ADMIN_RESUMEN_LANDSCAPE_MIN_PX`).
- Drawer respects `prefers-reduced-motion`.

## Completed: admin Figma navbar as chrome standard

List, detail, analytics, photos, and admins pages no longer use the yellow accent header or right drawer. They share
the Resumen header + `AdminResumenDrawer`. Resumen itself stays full-bleed (`flush`); other pages keep `max-w-6xl`
padding and an in-page `h1`. Drawer Familias/Invitados badges use the same active-planning counts as Resumen.

## Completed: admin Resumen desktop (Figma `91:40`)

`/admin` at `xl` (1280px+) follows Figma **admin-resumen-modern**: white chrome, olive confirmation banner, four KPI
cards, RSVP close gauges + follow-up rows, and a “Por revisar” attention column. Numbers and deep-links are live
(`getAnalyticsSnapshot`, action queue, close checklist). Helpers + tests: `src/lib/admin/dashboard-resumen.ts`. Icons:
Lucide (`admin-resumen-icons.tsx`), the same set as Figma (`menu`, `download`, `clock`, `check`, `chevron-right`,
`alert-triangle`).

## Completed: admin Resumen mobile drawer (Figma `94:591`)

The Resumen hamburger opens a **left** cream drawer (290px, scrim `admin-ink/65`): couple names + Admin badge, close
control, existing admin routes with Lucide icons (Resumen active in olive), live Familias/Invitados counts, **Acciones
rápidas** (Nueva familia, Descargar lista), and a footer with a name derived from the email local-part plus **Salir**.
No Transporte / Mensajes / Configuración. Nav order: Resumen, Estadísticas, Invitados, Familias, Fotos, Admins. The
same drawer is the standard menu on every `AdminShell` page. Helpers: `RESUMEN_DRAWER_NAV`, `adminDrawerDisplayName`.

## Completed: admin Resumen mobile (Figma `94:414`)

`/admin` below 834px uses the same Figma system: white header (olive hamburger + couple names + Admin badge + truncated
email), stacked overline (`⏰ Límite`), full-width banner CTAs, single-column KPIs, stacked close / follow-ups /
attention, compact badges. Phone FAB stays (`ADMIN_FAB_HIDE_MIN_PX`); it is olive to match Figma. No drinks
list, no “Notificar”. Compact yellow dashboard on `/admin` is gone. Helper: `formatResumenDeadlineOverline`.

## Completed: admin Resumen tablet portrait (Figma `94:232`)

`/admin` from 834px (iPad 11" portrait) uses the Figma system in one column: white header with olive hamburger (opens
the Figma left drawer; no nav pills; Salir stays in the drawer), stacked banner with two equal-width CTAs, 2×2 KPIs,
full-width close + follow-ups + attention (no 340px rail). Stacked panels use `w-full` so they are not content-sized.
Compact title for follow-ups (`followUpsTitleCompact`). No tablet FAB — **Nueva familia** stays in the drawer. Helpers:
`ADMIN_RESUMEN_WIDE_MIN_PX` (834) and `ADMIN_RESUMEN_LANDSCAPE_MIN_PX` (1024). The same header/drawer apply to other
admin pages; only the workspace below is Resumen-specific.

## Completed: admin Resumen tablet landscape (Figma `94:34`)

`/admin` from `lg` (1024px, iPad mini/11 landscape) uses the same Figma system with inline nav pills, 2×2 KPIs, stacked
progress gauges, 340px attention rail, shorter badges (`7 restantes`, `7 fam. • 14 inv.`). That inline-nav breakpoint
is now the chrome standard on every `AdminShell` page. Helper: `ADMIN_RESUMEN_LANDSCAPE_MIN_PX`.

## Completed: RSVP partial attendance

A family can confirm some guests and decline others (including a plus-one named “Acompañante”). The companion name is
required only if that person will attend. Per-guest radios Asistirá / No asistirá. The form lead says the invitation is
for N people, that everyone is expected, and that a name can be marked if someone cannot come
(`rsvpInvitationSeatsLead`). Migration
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

The hosted **Invite user** email uses the branded HTML in `emails/admin-invite.html` (Figma node `80:40`: cream page,
olive gradient header/footer `#5F6446`→`#888F68`, gold kicker `#BEB950`, cream body `#F5F3EB`, olive pill CTA with
white text **Aceptar invitación**). Paste it into Supabase Dashboard → Authentication → Email Templates → Invite user.
**Reset password** uses the same chrome and two-paragraph body in `emails/admin-reset-password.html` (CTA **Crear
contraseña nueva**). Keep `{{ .ConfirmationURL }}` on the button. Invite subject: `Invitación al panel · Nychol & Miguel`.
Reset subject: `Restablecer contraseña · Nychol & Miguel`. This is not Resend. Re-paste after HTML changes.

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
