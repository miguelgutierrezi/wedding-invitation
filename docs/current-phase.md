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
| Admin families/guests lists                 | Filters, chips, column sort, page size 25; URL debounce 300 ms; search icon padding; **controls** mobile `161:29` / portrait `158:469` / landscape `158:355` / desktop `158:228` (stacked phone filter card; phone tabs stay equal pills, not stacked `161:29` nav; chevrons 12px desktop glyph on every width; landscape wrap 2+3) on every list viewport; **alerts** desktop `161:151` / landscape `161:371` / portrait `161:560` / mobile `161:738`; guests Figma `109:372` mobile, `109:36` from 834px, `103:33` from `lg`, `100:38` from `xl`; families Figma `126:29` mobile, `123:268` from 834px, `117:29` from `lg`, `109:645` from `xl`; family detail Figma `144:245` mobile, `144:29` from 834px, `143:29` from `lg`, `137:34` from `xl`; new family Figma `145:298` mobile, `145:228` from 834px, `145:151` from `lg`, `145:68` from `xl` |
| Admin photos                                | Mobile Figma `128:528` below 834px, portrait `128:364` from 834px, landscape `128:201` from `lg`, desktop `128:34` from `xl`; QR rotate + PNG still after generate |
| Admin Admins                                | Mobile Figma `136:29` below 834px, portrait `134:207` from 834px, landscape `134:121` from `lg`, desktop `134:35` from `xl` |
| Admin compact chrome                        | Figma white navbar on all `AdminShell` pages; hamburger until `lg`; open drawer locks page scroll; FAB on every viewport (hidden on `/admin/families/new`) |
| Admin Resumen                               | Figma `94:414` + drawer `94:591`; `94:232` from 834px; `94:34` from `lg`; `91:40` from `xl` |
| Admin Estadísticas                          | Figma `96:39` + `99:229` landscape + `99:419` portrait + `99:607` mobile |
| Guest phone/email                           | Mirrored from family RSVP onto `guests`                                        |
| Admin plain-language UI                     | Non-technical Spanish labels in admin panel                                    |
| Delete family (admin)                       | RPC + confirm-by-name; works with unsaved edits                                |
| Admin operations                            | Action queue, close follow-ups, family activity, **batch actions** |
| Admin login                                 | Mobile Figma `152:29` below 834px; portrait `151:30` from 834px; landscape `149:29` from `lg`; desktop `145:364` from `xl`; recovery `153:103` below 834px + `153:80` from 834px + `153:57` from `lg` + `153:34` from `xl` |
| Admin invite flow                          | **Implemented**; accept mobile Figma `158:136` below 834px, portrait `158:103` from 834px, landscape `158:72` from `lg`, desktop `158:34` from `xl`; set password → `/admin` |
| Admin invite email HTML                    | Figma `80:40` olive-gradient template in `emails/admin-invite.html` (paste into Supabase Auth) |
| Admin password reset                       | Same Figma `80:40` layout as invite (`emails/admin-reset-password.html`); OTP 24 h |
| Analytics example families                  | Names containing the word **ejemplo** omitted from stats           |
| Guest media uploads                         | **Implemented**; public `/fotos` + `/i/[slug]/fotos` mobile Figma `157:165` below 834px, portrait `157:97` from 834px, landscape `157:29` from `lg`, desktop `155:34` from `xl` |
| Public root `/`                             | Figma `158:213` below 834px + `158:198` from 834px + `158:183` from `lg` + `158:168` from `xl`; unmatched routes redirect here |
| WhatsApp scheduled send                     | Not implemented                                                                |
| Resend transactional email product         | Not implemented (Auth invite/reset SMTP only)                      |

## Completed: admin dropdowns, chips, and tabs (Figma `161:29` / `158:469`)

List filters, dropdowns, active-filter chips, and in-page tabs on `/admin/families` and `/admin/guests` follow the
interactive specs (mobile `161:29`, portrait `158:469`, landscape `158:355`, desktop `158:228`). The filter card stays
open on every width: phones stack **Buscar** + dropdowns (sort outside); from **834px** full-width **Buscar** then
2-col wrap. Closed fields use 11px bold uppercase labels, 10px-radius inputs with `--admin-control` (`#d1cfc7`)
borders, and a 14px search glyph. Dropdown chevrons follow desktop Figma `158:228` on every breakpoint (12px Lucide
chevron-down, muted `#727263`, flip on open). Open dropdowns get a 2px olive trigger, flipped chevron, sage selected
row (`#e5e8dd` + check), and wash hover (`#f0f2ea`). Active chips are olive pills with an X (`Invitación: Activa`);
**Limpiar todo** stays underlined. Phone in-page tabs stay a **row of equal pills** (not the
stacked `161:29` nav); from 834px they sit in a
20px-radius equal-pill bar (landscape `158:355` uses a full-pill bar; families wrap **2+3**). Helpers:
`src/lib/admin/admin-controls.ts`. Classes live in `adminGuests`. Invitation screens are unchanged.

## Completed: admin desktop alerts (Figma `161:151`)

Desktop (`lg`+ list/detail chrome) feedback uses the alert spec: 16px padding, 8px radius,
4px left accent, 20px Lucide-style icons, title + description. Tones are success `#EDF2E8` / `#4D6B3C` / `#2C4021`,
warning `#FDF6E3` / `#D9822B` / `#6E3F0F`, error `#FDF0F0` / `#DB3737` / `#731F1F`, info `#EFF5FB` / `#106BA3` /
`#15426B`. Wired on Familias/Invitados notices, family-detail save feedback, nueva familia, invite form, photos quota,
and media-table notices. Login / accept-invite keep their own Figma. Helpers: `src/lib/admin/admin-alerts.ts`. Classes:
`adminAlert`. Invitation screens are unchanged.

## Completed: admin tablet portrait alerts (Figma `161:560`)

From 834px, in-page notices reuse the same `AdminAlert` banners as desktop (`161:151`): 16px padding, 8px radius, 4px
left accent, 20px icons, four tones. Wired on Familias/Invitados portrait lists, family-detail save feedback, nueva
familia, invite form, photos quota, and media-table notices. Invalid fields use a 2px `#DB3737` border from 834px
(phone `161:738` later extends this to all widths); inline helper copy is 13px until `xl` (12px). Floating toast
overlays from the spec are not mounted. Helpers: `ADMIN_ALERTS_PORTRAIT_FIGMA` in `admin-alerts.ts`. Invitation screens
are unchanged.

## Completed: admin mobile alerts (Figma `161:738`)

Below 834px, in-page notices use the same four tones with compact metrics: 12px padding, 10px icon gap, 13px title /
12px description, 20px icons, 4px left accent, 8px radius, and the same shadow. Wired on Familias/Invitados lists,
family-detail save feedback, nueva familia, invite form, photos quota, and media-table notices. Invalid fields use a
2px `#DB3737` border on every width; helper copy is 11px on phone, 13px from 834px, 12px from `xl`. Login /
accept-invite keep their own Figma. Floating toast overlays from the spec are not mounted. Helpers:
`ADMIN_ALERTS_MOBILE_FIGMA` in `admin-alerts.ts`. Invitation screens are unchanged.

## Completed: admin tablet landscape alerts (Figma `161:371`)

From `lg` until `xl`, list/detail chrome already uses `AdminAlert` (same surfaces as desktop). Landscape matches the
16px padding, 14px title/body, 20px icons, 4px left accent, and 13px inline field helper (12px from `xl` / `161:151`).
Floating toast overlays (320px stack) from the spec are not mounted. Helpers: `ADMIN_ALERTS_LANDSCAPE_FIGMA`,
`adminAlertsFigmaNode`. Invitation screens are unchanged.

## Completed: public root mobile (Figma `158:213`)

`/` below 834px uses the Figma canvas at 390×844 density: cream board with safe-area padding (16×48×32), **inline**
centered brand (20px couple names + 13px **• Admin Panel**), full-width 20px-radius card (24×40 padding, 80px
olive **404**, 26px Times title, 13px lead), 12px footer. No home CTA (`/` is already this page). Portrait `158:198` still
starts at 834px. Helpers: `rootNotFoundMobileWorkspace`.

## Completed: public root tablet portrait (Figma `158:198`)

`/` from 834px until `lg` uses the Figma canvas at 768×1024 density: stacked centered brand (24px couple names + 14px
**• Admin Panel**), 40×64×48 padding, the same 480px card as landscape/desktop (24px radius, 48×56 padding, 96px olive
**404**, Times **Página no encontrada**), 14px footer. No home CTA. Landscape `158:183` still starts at
`lg`. Mobile `158:213` covers below 834px. Helpers: `rootNotFoundPortraitWorkspace`.

## Completed: public root tablet landscape (Figma `158:183`)

`/` from `lg` until `xl` uses the Figma canvas at 1024×768 density: the same 480px create-style card as desktop (24px
radius, 48×56 padding, 96px olive **404**, Times **Página no encontrada**), with landscape
chrome in the page flow — 20px couple names + 14px **• Admin Panel** at 64×48, 14px footer at 40px. No home CTA.
Desktop `158:168` still starts at `xl`. Portrait `158:198` covers 834px until `lg`. Mobile `158:213` covers below 834px.
Helpers: `rootNotFoundLandscapeWorkspace`.

## Completed: public root desktop (Figma `158:168`)

`/` from `xl` uses the Figma not-found canvas: cream board, **Nychol & Miguel • Admin Panel** in the page flow at
64×48, centered 480px white card (24px radius, 48×56 padding, 96px olive **404**, Times **Página no encontrada**, 14px
lead), 14px footer copyright. No home CTA (`/` is already this page). Landscape `158:183` covers `lg` until `xl`. Portrait
`158:198` covers 834px until `lg`. Mobile `158:213` covers below 834px. Unknown public paths (`app/[...slug]`), unknown
admin paths (`app/admin/[...slug]`), invalid invitation slugs, and missing family ids **redirect to `/`**.
`app/not-found.tsx` renders the same screens as a fallback. Helpers: `src/lib/public/root-not-found-layout.ts`.
Layout convention: `docs/invitation-ui.md` **Public root 404**.

## Completed: admin login mobile (Figma `152:29`)

`/admin/login` below 834px uses the Figma canvas with stacked centered brand (24px couple names, 14px **• Admin Panel**),
full-width 24px-radius card (24×36 padding, 28px gap, 11px overline, 28px title, 13px lead, 12px labels, 44px inputs,
46px olive CTA), and 11px footer. Safe-area padding stays. Portrait `151:30` still starts at 834px. Recovery still lives
in the same card (mobile `153:103` below 834px, portrait `153:80` from 834px, landscape `153:57` from `lg`, desktop `153:34` from `xl`). Helpers: `src/lib/admin/admin-login-layout.ts`.

## Completed: admin login tablet portrait (Figma `151:30`)

`/admin/login` from 834px until `lg` uses the Figma canvas with brand and footer **in the page flow** (not absolute):
64×48×40 padding, couple names 22px + **• Admin Panel** 14px, flex-1 centered 460px card (same density as desktop:
24px radius, 48×56 padding, 36px title, tracking overline), 13px footer. Landscape `149:29` still starts at `lg`. Mobile
`152:29` covers below 834px. Recovery from below 834px uses Figma `153:103`; from 834px, `153:80`. Helpers: `src/lib/admin/admin-login-layout.ts`.

## Completed: admin login tablet landscape (Figma `149:29`)

`/admin/login` from `lg` (1024px) until `xl` uses the Figma canvas at landscape density: cream board, couple names
18px + **• Admin Panel** 14px at 48×40, centered 420px white card (20px radius, 36×48 padding, 28px gap, 32px title,
13px lead, 16px field gap), same Inter fields / password eye / olive CTA as desktop, footer 13px at 32px. Desktop
`145:364` density still starts at `xl`. Portrait `151:30` covers 834px until `lg`. Mobile `152:29` covers below 834px.
Recovery below 834px uses Figma `153:103`; from 834px, `153:80`; from `lg`, `153:57`; from `xl`, `153:34`. Helpers: `src/lib/admin/admin-login-layout.ts`.

## Completed: admin login desktop (Figma `145:364`)

`/admin/login` from `xl` uses the Figma canvas: cream board, **Nychol & Miguel • Admin Panel** top-left, centered 460px
white card (24px radius, olive shadow), Inter fields with **Correo electrónico** placeholder, password eye
(inline SVG from Figma `145:390`, pupil added so the 16px glyph is legible), olive **Iniciar sesión**, underlined recovery link, and footer copyright. Landscape
`149:29` covers `lg` until `xl`. Portrait `151:30` covers 834px until `lg`. Mobile `152:29` covers below 834px.
Recovery below 834px uses Figma `153:103`; from 834px, `153:80`; from `lg`, `153:57`; from `xl`, `153:34`. Helpers: `src/lib/admin/admin-login-layout.ts`.

## Completed: admin password recovery desktop (Figma `153:34`)

`/admin/login` recovery from `xl` uses the Figma canvas in the same cream chrome as login: **PANEL PRIVADO**, Times
**Recuperar contraseña**, the admin-only lead, a separate 14px/1.6 explanation, **Correo electrónico**, olive **Enviar
enlace**, and underlined **Volver a iniciar sesión**. Landscape recovery uses Figma `153:57`; portrait uses `153:80`;
mobile uses `153:103`. Helpers: `src/lib/admin/admin-login-layout.ts`.

## Completed: admin password recovery tablet landscape (Figma `153:57`)

`/admin/login` recovery from `lg` until `xl` uses the Figma canvas in the same cream chrome as landscape login, with
recovery density: 20px couple names at 48×36, 440px card (24px radius, 40×52 padding, 28px gap), 12px tracking overline,
32px Times title, 14px lead + 1.6 explanation, 20px form/actions gap, olive **Enviar enlace**, underlined **Volver a
iniciar sesión**, 13px footer at 36px. Desktop `153:34` still starts at `xl`. Login landscape `149:29` (420px / 20px
radius) is unchanged. Helpers: `loginResetCardWidthPx`.

## Completed: admin password recovery tablet portrait (Figma `153:80`)

`/admin/login` recovery from 834px until `lg` uses the Figma canvas with **absolute** chrome (unlike login portrait, which
keeps brand and footer in the page flow): 20px couple names at 48×48, centered 460px card (24px radius, 48×56 padding,
32px gap, 36px Times title, 14px lead + 1.6 explanation), olive **Enviar enlace**, underlined **Volver a iniciar
sesión**, 13px footer at 48px. Login portrait `151:30` (22px brand in flow, 64×48×40 padding) is unchanged. Landscape
`153:57` still starts at `lg`. Helpers: `src/lib/admin/admin-login-layout.ts`.

## Completed: admin password recovery mobile (Figma `153:103`)

`/admin/login` recovery below 834px uses the Figma canvas in the same cream board and safe-area padding as login mobile,
with recovery density: **inline** 20px couple names + 14px **• Admin Panel** (not stacked 24px), full-width 24px-radius
card (24×40 padding, 28px gap, 10px header gap, 28px title, 14px lead + 1.6 explanation, 13px labels, 46px input, 48px
olive **Enviar enlace**), underlined **Volver a iniciar sesión**, 12px footer. Login mobile `152:29` (stacked 24px
brand, 36px card padding, 44px inputs, 46px CTA, 11px footer) is unchanged. Portrait `153:80` still starts at 834px.
Helpers: `src/lib/admin/admin-login-layout.ts`.

## Completed: admin accept-invite desktop (Figma `158:34`)

`/admin/aceptar-invitacion` from `xl` uses the Figma canvas: cream board, **Nychol & Miguel • Admin Panel** at 64×48,
centered 460px white card (24px radius, 48×56 padding, olive shadow), Inter **PANEL PRIVADO**, Times **Crear
contraseña**, account row, two password fields with the shared eye control, olive **Guardar y entrar al panel**, 12px
footer copyright. Landscape `158:72` covers `lg` until `xl`. Portrait `158:103` covers 834px until `lg`. Mobile `158:136`
covers below 834px. Helpers: `src/lib/admin/admin-accept-invite-layout.ts`.

## Completed: admin accept-invite tablet landscape (Figma `158:72`)

`/admin/aceptar-invitacion` from `lg` until `xl` uses the same 460px create-password card as desktop (24px radius, 48×56
padding, 36px Times title, password eyes, olive CTA), with landscape chrome: 20px couple names + 14px **• Admin Panel**
at 48×40, and a 14px footer at 40px. Desktop `158:34` still starts at `xl` (brand at 64×48, 12px footer). Portrait
`158:103` covers 834px until `lg`. Mobile `158:136` covers below 834px. Helpers: `acceptInviteLandscapeWorkspace`,
`acceptInviteCardWidthPx`.

## Completed: admin accept-invite tablet portrait (Figma `158:103`)

`/admin/aceptar-invitacion` from 834px until `lg` uses the Figma canvas with brand and footer **in the page flow**
(not absolute): stacked centered brand (24px couple names, 13px **• Admin Panel**), 40×64×48 padding, flex-1 centered
440px card (24px radius, 36/48×48 padding, 28px gap, 32px Times title, 16px field gap), olive CTA, 13px footer.
Landscape `158:72` still starts at `lg`. Mobile `158:136` covers below 834px. Helpers:
`acceptInvitePortraitWorkspace`.

## Completed: admin accept-invite mobile (Figma `158:136`)

`/admin/aceptar-invitacion` below 834px uses the Figma canvas with stacked centered brand (22px couple names, 13px
**• Admin Panel**) and a full-width 20px-radius card (24px padding, 24px gap, 11px overline, 28px title, 13px lead,
12px labels, 44px inputs / CTA with 10px radius — Figma’s 42px inputs raised to the 44px touch minimum), olive
**Guardar y entrar al panel**, and an 11px footer. Safe-area padding stays. Portrait `158:103` still starts at 834px.
Helpers: `acceptInviteMobileWorkspace`.

## Completed: admin Fotos mobile (Figma `128:528`)

`/admin/photos` below 834px uses the Figma workspace with the shared hamburger chrome and the phone **+** FAB
(untouched; do not add a second FAB). Stacked olive banner (28px title, remaining-days chip
`⏳ Quedan N días para confirmar`, full-width **Descargar Lista**), 2×4 compact KPI cards, origin line, QR card stacked
(dates full-width, 160px QR centered, generate / disable / review full-width; URL + PNG only after generating a new
code), then **Archivos cargados** as a **single-column** card stack (200px thumb, filename + uppercase status, mime •
size, Origen, Aprobar / Rechazar / Eliminar). Checkboxes and the olive batch bar stay even though the mock omits them;
the batch bar sits above the FAB. The shared **+** FAB stays on every viewport. Helpers: `photosMobileWorkspace`, `photosMobileCardStack`.

## Completed: admin Fotos tablet portrait (Figma `128:364`)

`/admin/photos` from 834px (iPad 11" portrait) until `lg` uses the Figma workspace: stacked olive banner
(Administración · Fotos, **Fotos y videos**, remaining-days chip `⏳ Quedan N días para confirmar`, **Descargar Lista**),
eight compact KPI cards in 4×2, origin line, QR card at landscape density (110px; full URL + PNG only after generating
a new code), then **Archivos cargados** as a **2-column** card grid (180px thumb, filename + uppercase status, mime •
size, Origen, Aprobar / Rechazar / Eliminar). Checkboxes and the olive batch bar stay even though the mock omits them.
Shared navbar is untouched (no olive hamburger). The shared **+** FAB stays. Helpers: `ADMIN_PHOTOS_PORTRAIT_MIN_PX`,
`photosPortraitCardGrid`, `photosFileMetaLine`.

## Completed: admin Fotos tablet landscape (Figma `128:201`)

`/admin/photos` from `lg` (1024px) uses the same Figma workspace as desktop, at landscape density: remaining-days chip
and Excel stay off the banner, KPI hints shorten (Total de elementos / Almacenamiento total / Procesados ok / Carga
corrupta / Límite gratuito), QR is 110px with status + reference on one row, and the table uses narrower columns plus
70×52 thumbs. **Aprobar / Rechazar / Eliminar** stay. Shared navbar is untouched. Helper:
`ADMIN_PHOTOS_LANDSCAPE_MIN_PX`.

## Completed: admin Fotos desktop (Figma `128:34`)

`/admin/photos` from `xl` uses the Figma workspace: olive banner (Administración · Fotos, **Fotos y videos**,
moderation body — no RSVP deadline chip and no Excel CTA), eight live KPI cards with full hints, origin counts, restyled
QR card (rotate / window / enable / reconcile; full URL + PNG QR only after generating a new code), and an Inter
moderation table (Vista / Archivo / Origen / Estado / Tamaño / Acciones) with olive batch approve/reject. Shared navbar
is unchanged. Helpers: `src/lib/admin/admin-photos-layout.ts`.

## Completed: admin Admins mobile (Figma `136:29`)

`/admin/admins` below 834px uses the Figma workspace with the shared hamburger chrome and the phone **+** FAB
(untouched; do not add a second FAB). Stacked olive banner (28px title, access-role body), invite card with
full-width email + olive **+ Invitar admin** (`rounded-[10px]`, 10px plus), then **Admins activos** as nested
cards (email + **TÚ** / **Activo**, last access, full-width **Borrar admin** / **No disponible**). Pending
invites use the same card stack when present. Helpers: `adminsMobileWorkspace`, `adminsMobileCardStack`,
`adminsInviteStacked`.

## Completed: admin Admins tablet portrait (Figma `134:207`)

`/admin/admins` from 834px (iPad 11" portrait) until `lg` uses the Figma workspace: stacked olive banner
(Administración · Admins, **Admins**), invite card with full-width email + olive **+ Invitar admin**, then
**Admins activos** as nested cards (email + **TÚ** / **Activo**, last access, full-width **Borrar admin** /
**No disponible**). Pending invites use the same card stack when present. Shared navbar is untouched (hamburger, no
olive pills). The shared **+** FAB stays. Helpers: `ADMIN_ADMINS_PORTRAIT_MIN_PX`, `adminsPortraitCardStack`,
`adminsInviteStacked`.

## Completed: admin Admins tablet landscape (Figma `134:121`)

`/admin/admins` from `lg` (1024px) uses the same Figma workspace as desktop, at landscape density: 32px banner
title, 20px cards (`rounded-[20px]` / `p-6`), 22px invite title, 240px last-access column, truncated emails, and
ink-weight dates. **Invitar admin** / **Borrar admin** / **No disponible** stay. Shared navbar is untouched. Helper:
`ADMIN_ADMINS_LANDSCAPE_MIN_PX`.

## Completed: admin Admins desktop (Figma `134:35`)

`/admin/admins` from `xl` uses the Figma workspace: olive banner (Administración · Admins, **Admins**, access-role
body), Inter invite card (rounded-12 email + olive **Invitar admin**), active-admin rows (email + **TÚ**, last access,
**Activo**, **Borrar admin** / **No disponible**), and pending invites (empty copy or Reenviar / Cancelar). Shared
navbar is unchanged. Helpers: `src/lib/admin/admin-admins-layout.ts`.

## Completed: admin Invitados mobile (Figma `109:372`)

`/admin/guests` below 834px uses the Figma workspace with the shared hamburger chrome and the phone **+** FAB
(untouched; do not add a second FAB). Stacked olive banner (24px title, remaining-days chip
`⏳ Quedan N días para confirmar`, full-width **Descargar
lista**), 2×2 KPI pills, compact sort plus the always-visible **161:29** stacked filter card (labeled Buscar + dropdowns;
no **Mostrar filtros**), a **row of equal pills** (Estadísticas / Familias / Lista completa), then a **single-column** card list (role badge, Familia/Bus/Telf/Correo, **Ver familia**). Batch bar
is stacked full-width with long labels including **Descargar lista**, sitting above the FAB. Helper:
`guestsMobileCardStack`.

## Completed: admin Invitados tablet portrait (Figma `109:36`)

`/admin/guests` from 834px (iPad 11" portrait) uses the Figma workspace with the shared hamburger chrome (untouched).
The shared **+** FAB stays. Stacked olive banner with live remaining-days chip (`⏳ Quedan N días para confirmar`) and **Descargar lista**, four KPI
pills, **158:469** filter card always visible (full-width Buscar + 2-col wrap; sort outside), in-page tabs, then a **2-column** card grid (role badge, Asiste/Pendiente/No
asiste, Familia/Bus/Telf/Correo, **Ver familia**). Batch bar stays compact (no Descargar in the bar — the banner CTA
covers export). Helper: `ADMIN_GUESTS_PORTRAIT_MIN_PX`.

## Completed: admin Invitados tablet landscape (Figma `103:33`)

`/admin/guests` from `lg` (1024px) uses the same Figma workspace as desktop, at landscape density: remaining-days
chip (`⏳ Quedan N días para confirmar`; not Figma’s “RSVP Límite” date), 6 filters wrapping **2+4** (`158:355`; no **Nombre del acompañante** until `xl`), pill tab bar, tighter type, and compact batch
labels (Seleccionar N / Copiar tels / Descargar). Table action stays **Ver familia** (no kebab). Shared navbar is
untouched. Helpers: `ADMIN_GUESTS_LANDSCAPE_MIN_PX`.

## Completed: admin Invitados desktop (Figma `100:38`)

`/admin/guests` from `xl` uses the Figma workspace: olive banner (Administración · Invitados, remaining-days chip
`⏳ Quedan N días para confirmar`, **Descargar lista**), colored summary strip, two-row filter card (7 fields including **Nombre del acompañante**),
in-page tabs (Estadísticas / Familias / Lista completa), Inter table with role badges and **Ver familia**, olive
list checkboxes (18px, 6px radius, `--admin-olive` when checked), and an olive batch bar. Shared navbar is unchanged
(no extra “Descargar lista” nav item). Helpers: `src/lib/admin/admin-guests-layout.ts`.

## Completed: admin Familias desktop (Figma `109:645`)

`/admin/families` from `xl` uses the Figma workspace: olive banner (Administración · Familias, remaining-days chip
`⏳ Quedan N días para confirmar`, **Descargar Lista**), summary strip, five filters in one row, in-page tabs, Inter
table with full date-column labels, slug + ops chips and **Ver**, olive batch bar (copy links / export / disable /
enable). Shared navbar is unchanged. Helpers:
`src/lib/admin/admin-families-layout.ts`.

## Completed: admin nueva familia desktop (Figma `145:68`)

`/admin/families/new` from `xl` uses the Figma workspace: olive banner (Administración > Familias > Nueva familia,
**Nueva Familia** with back arrow, create-link body), then a centered 640px white card (nombre, cupos, mensaje
opcional, Invitados with name + 160px gender rows, **Crear familia y generar enlace**). Shared navbar is unchanged.
Helpers: `src/lib/admin/admin-new-family-layout.ts`.

## Completed: admin nueva familia tablet landscape (Figma `145:151`)

`/admin/families/new` from `lg` (1024px) uses the same Figma workspace as desktop, at landscape density: 32px title,
36px back control, 32px card padding, 24px field gap, 80px message field, and 13px guest hint. Shared navbar is
untouched. Helper: `ADMIN_NEW_FAMILY_LANDSCAPE_MIN_PX`.

## Completed: admin nueva familia tablet portrait (Figma `145:228`)

`/admin/families/new` from 834px (iPad 11" portrait) until `lg` uses a single-column Figma workspace: stacked olive
banner (32px title, 36px back), then a **full-width** white card (32px padding, 24px field gap, 100px message field,
Invitados with name + 160px gender). Shared navbar is untouched (hamburger until `lg`). Helper:
`ADMIN_NEW_FAMILY_PORTRAIT_MIN_PX`.

## Completed: admin nueva familia mobile (Figma `145:298`)

`/admin/families/new` below 834px uses a single-column Figma workspace: stacked olive banner (28px title, 32px back,
overline **Administración > Familias > Nueva**), then a full-width white card (20px padding, 24px field gap, 90px
message field with italic *(opcional)*, Times **Invitados**, stacked guest name + gender). Shared navbar is untouched
(hamburger). Helper: `ADMIN_NEW_FAMILY_MOBILE_MAX_PX`.

## Completed: admin family detail desktop (Figma `137:34`)

`/admin/families/[id]` from `xl` uses the Figma workspace: olive banner (Administración > Familias > Detalle, family
name with back arrow, remaining-days chip with clock icon — no list hourglass), two columns (status + edit + regenerate
on the left; invitation link, guest cards, activity timeline, delete on the right). Delete still confirms by family
name (not Figma “ELIMINAR”). Shared navbar is unchanged. Helpers:
`src/lib/admin/admin-family-detail-layout.ts`.

## Completed: admin family detail tablet landscape (Figma `143:29`)

`/admin/families/[id]` from `lg` (1024px) uses the same Figma workspace as desktop, at landscape density: 28px title,
32px back control, shortened status labels (Teléfono / Correo / Transporte), 356px rail, compact guest rows (Asiste
badge without icons, **Dirección:** pickup, no phone/email), stacked activity timestamps without detail, and
**Eliminar permanentemente**. Delete still confirms by family name. Shared navbar is untouched. Helper:
`ADMIN_FAMILY_DETAIL_LANDSCAPE_MIN_PX`.

## Completed: admin family detail tablet portrait (Figma `144:29`)

`/admin/families/[id]` from 834px (iPad 11" portrait) until `lg` uses a single-column Figma workspace: stacked olive
banner (30px title, 36px back, remaining-days chip on the same row as the body), then status (full labels + row
divider), invitation link with Copiar / WhatsApp side by side, edit (gender column 150px), guest cards (Asiste + Bus
with icons, full pickup line, phone/email under the name), activity with detail + date on the right, regenerate, and
delete. Delete still confirms by family name. Shared navbar is untouched (hamburger until `lg`). Helper:
`ADMIN_FAMILY_DETAIL_PORTRAIT_MIN_PX`.

## Completed: admin family detail mobile (Figma `144:245`)

`/admin/families/[id]` below 834px uses a single-column Figma workspace: stacked olive banner (22px title, 28px back,
remaining-days chip under the body), then status (2-column pairs + full-width correo/transporte), invitation link with
Copiar / WhatsApp stacked, edit (guest name and gender stacked), guest cards (Asiste + Bus with icons, **Recogida:**
pickup, phone/email under the name), activity with timestamp under the title and no detail, regenerate, and delete.
Delete still confirms by family name. Shared navbar is untouched (hamburger). Helper:
`ADMIN_FAMILY_DETAIL_MOBILE_MAX_PX`.

## Completed: admin Familias tablet landscape (Figma `117:29`)

`/admin/families` from `lg` (1024px) uses the same Figma workspace as desktop, at landscape density: remaining-days
chip (`⏳ Quedan N días para confirmar`), five filters wrapping **2+3** (`158:355` compact card + pill tab bar), shorter date columns (**Abrió** / **Confirmó** /
**Últ. cambio**), narrow datetimes without year or a.m./p.m., and the full batch labels (Seleccionar las N). **Activar**
stays even though the landscape mock omits it. Shared navbar is untouched. Helper: `ADMIN_FAMILIES_LANDSCAPE_MIN_PX`.

## Completed: admin Familias tablet portrait (Figma `123:268`)

`/admin/families` from 834px (iPad 11" portrait) until `lg` uses the Figma workspace: stacked olive banner (Administración · Familias, remaining-days chip `⏳ Quedan N días para confirmar`, **Descargar Lista**), 4 KPI pills on the filtered view (Familias / Confirmaron / Pendientes / Con bus), compact sort plus the always-visible **158:469** filter card (full-width Buscar + 2-col wrap), compact tabs (Estadísticas / Familias / Lista completa), and a **2-column** card grid. Cards show the family name, invitation slug, Confirmó/Sin confirmar badge, Bus/Cupos (diet on the Bus row when present), pending Estado text, and **Ver familia**. Do not copy guest role badges from the mock. Batch keeps Activar/Desactivar even if the portrait mock omits them. The shared **+** FAB stays; **Nueva familia** remains in the drawer too. Phone below 834px uses Figma `126:29`. Helpers: `ADMIN_FAMILIES_PORTRAIT_MIN_PX`, `summarizeFamiliesView`.

## Completed: admin Familias mobile (Figma `126:29`)

`/admin/families` below 834px uses the Figma workspace with the shared hamburger chrome and the shared **+** FAB (untouched — do not add a second FAB). Banner is stacked (24px title, remaining-days chip `⏳ Quedan N días para confirmar`, full-width **Descargar Lista**). KPI pills are **2×2** in mock order (Confirmaron / Pendientes / Con bus / Total familias). Compact sort plus the always-visible **161:29** stacked filter card (labeled Buscar + dropdowns; no **Mostrar filtros**). Equal pills (Estadísticas / Familias / Lista completa). **1-column** family cards: name (no slug, no guest roles), attendance badge **Confirmó** / **No asiste** / **Sin abrir** (gray, not the red table chip), pending Estado extras when present, **Cupos** as assigned seats, **Confirmados**. No Bus row. Pagination is stacked. Batch sits above the FAB with Seleccionar las N / Copiar enlaces / Descargar / Desactivar / Activar (ignore Figma’s “Crear selección”). Helpers: `familiesMobileCardStack`, `familyCardBadge`, `familyCardMobileMeta`.

## Completed: admin Estadísticas mobile (Figma `99:607`)

`/admin/analytics` below 834px keeps the shared hamburger chrome and the phone **+** FAB (untouched). Banner stays
stacked: two-line overline, compact title (“Panel de Estadísticas”), compact body, then full-width CTAs one under the
other. Rate percents sit **under** the labels (beside them from 834px). Boarding cards and the 12 metrics are a single
column. Gauge type is `22px`. Do not add a second FAB.

## Completed: admin Estadísticas tablet portrait (Figma `99:419`)

`/admin/analytics` from 834px (iPad 11" portrait) keeps the hamburger chrome (untouched). Banner is stacked: two-line
overline, then title, then two equal-width CTAs. Rate bars stay full width; boarding cards and the 12 metrics sit in
**2 columns**. Type density matches landscape numbers (`36px` values, `24px` gauges). The shared **+** FAB stays;
**Nueva familia** remains in the drawer too. Helper breakpoint: `ADMIN_RESUMEN_WIDE_MIN_PX`.

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
`lg` (left cream drawer), inline pills from tablet landscape. While the drawer is open, page scroll is locked
(`position: fixed` on `body` plus blocked touch/wheel outside the drawer nav — not `overflow: hidden` on `<html>`,
which would break `position: fixed` on iPad). The menu closes if the viewport crosses `lg`. Page titles live under
the bar; back chevron on create
and family detail. Floating **+** (olive) is shown on every viewport; still hidden on `/admin/families/new`.
It is portaled in `.admin-new-family-fab-layer` (`position: fixed; inset: 0`) so a flex `body` cannot hide it at the
end of a long desktop page. **Nueva familia** also stays in the drawer.
- Lists: cards below `lg`; tables from `lg`.
- Path helpers + tests: `src/lib/admin/admin-chrome.ts` (`ADMIN_DESKTOP_NAV_MIN_PX` = 1024,
  `ADMIN_RESUMEN_WIDE_MIN_PX`, `ADMIN_RESUMEN_LANDSCAPE_MIN_PX`, `ADMIN_SHELL_FAB_PADDING`),
  `src/lib/admin/lock-body-scroll.ts`.
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
same drawer is the standard menu on every `AdminShell` page. Open drawer locks the page behind it. Helpers:
`RESUMEN_DRAWER_NAV`, `adminDrawerDisplayName`, `lock-body-scroll.ts`.

## Completed: admin Resumen mobile (Figma `94:414`)

`/admin` below 834px uses the same Figma system: white header (olive hamburger + couple names + Admin badge + truncated
email), stacked overline (`⏰ Límite`), full-width banner CTAs, single-column KPIs, stacked close / follow-ups /
attention, compact badges. The shared olive **+** FAB stays on every viewport. No drinks
list, no “Notificar”. Compact yellow dashboard on `/admin` is gone. Helper: `formatResumenDeadlineOverline`.

## Completed: admin Resumen tablet portrait (Figma `94:232`)

`/admin` from 834px (iPad 11" portrait) uses the Figma system in one column: white header with olive hamburger (opens
the Figma left drawer; no nav pills; Salir stays in the drawer), stacked banner with two equal-width CTAs, 2×2 KPIs,
full-width close + follow-ups + attention (no 340px rail). Stacked panels use `w-full` so they are not content-sized.
Compact title for follow-ups (`followUpsTitleCompact`). The shared **+** FAB stays; **Nueva familia** remains in the drawer too. Helpers:
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
`/admin`. Below 834px that screen uses Figma `158:136`; from 834px, `158:103`; from `lg`, `158:72`; from `xl`, `158:34`. Returning admins use
`/admin/login`, which includes **¿Olvidaste tu contraseña?**
(`resetPasswordForEmail` → same accept page; paste `emails/admin-reset-password.html` into Supabase **Reset password**).

The **Admins** menu lists **active** admins and **pending** invitations. Cancel pending with **Cancelar**. Active
admins can be removed with **Borrar admin** only after typing their email; the signed-in account and
`ADMIN_ALLOWED_EMAILS` owners (couple) show **No disponible**. Invite / resend / cancel / delete / accept / password-reset
requests are written to `audit_events` (`admin_*` actions, `family_id` null) via `recordAdminDirectoryAudit`.

Pending detection uses `invited_at` + absence of `last_sign_in_at` (and admin role metadata). Listing pages through Auth
Admin `listUsers` via `listAdminDirectory`. Helpers: `src/lib/auth/admin-invite.ts`,
`src/lib/auth/list-pending-admin-invites.ts`, `src/lib/auth/admin-accept-invite.ts`. The accept-invite route is public in
`src/proxy.ts` (like login).

The invite email field + button stack below `lg` (phone `136:29` + portrait `134:207`); landscape and desktop sit in
one row. Layout helpers: `src/lib/admin/admin-admins-layout.ts` (`adminsInviteStacked`). Fallback row classes for
`tone="legacy"` remain in `src/lib/admin/admin-invite-form-layout.ts` and `src/lib/admin/admin-directory-layout.ts`.
Email + **TÚ** sit in one identity group. Responsive content: phone nested cards (`136:29`), portrait nested cards
(`134:207`), then `134:121` landscape and `134:35` desktop (Inter, olive banner, table rows). Chrome/nav unchanged.

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
  Next `router.replace` (debounced 300 ms so typing does not refetch the page; in-memory filter stays instant and is
  not overwritten by the URL echo of that replace). Filter helpers live in `src/lib/validation/admin-filters.ts`
  (parse → match → chips → query string). Hook: `useAdminListFilters`. Search boxes use `adminGuests.searchBox` left
  padding (`pl-9`, icon at `left-[14px]`) so the magnifying glass does not overlap the placeholder. Interactive list
  controls follow Figma `161:29` / `158:469` / `158:355` / `158:228` (`admin-controls.ts`: olive chips, 2px-focus
  dropdowns; phone stacked filter card; phone tabs stay equal pills, not stacked `161:29` nav; landscape wrap + pill bar; chevrons from desktop `158:228`). The in-app back chevron on
  family detail/create restores the last filtered Familias URL from `sessionStorage` (`admin-list-return.ts`), matching
  browser back. On mobile, changing page scrolls to the list top, the range is shown (e.g. 26–49), and pagination sits
  left of the FAB so **Siguiente** stays tappable.
- Dashboard and analytics cards deep-link into those lists (`status=pending`, `transport=with_bus`,
  `opened=not_opened`, …).
- RSVP still has one family phone (required) + optional email. `submit_family_rsvp` copies that contact onto every
  guest. Existing responses are backfilled (`…_guest_contact_from_rsvp.sql`).
- Admin guest table splits Teléfono / Correo; family detail shows both.
- Admin can delete a family (`delete_family` RPC) after typing the family display name.

## Completed: guest fotos mobile (Figma `157:165`)

`/i/[slug]/fotos` and `/fotos?code=` below 834px use the Figma canvas: 20px banner/footer pad, 16px workspace, 36px
Cormorant title (~30deg olive gradient), stacked full-width olive **Subir archivos** + outlined **Añadir más**, dropzone
hint **Haz clic para buscar en tu dispositivo**, and the same olive card language as larger sizes. No compact yellow
header and no family-name overline. Portrait `157:97` still starts at 834px. Helpers:
`src/lib/media/guest-fotos-layout.ts`.

## Completed: guest fotos tablet portrait (Figma `157:97`)

`/i/[slug]/fotos` and `/fotos?code=` from 834px until `lg` use the Figma canvas: 48px horizontal padding, 22px brand,
42px Cormorant title (~19deg olive gradient), 640px-capped form, 20px-radius upload card, 140px **Añadir más**. Landscape
`157:29` still starts at `lg`; desktop `155:34` at `xl`. Mobile `157:165` covers below 834px. Helpers:
`src/lib/media/guest-fotos-layout.ts`.

## Completed: guest fotos tablet landscape (Figma `157:29`)

`/i/[slug]/fotos` and `/fotos?code=` from `lg` until `xl` use the Figma canvas: 64px padding, 48px Cormorant title,
~15deg olive gradient, same 640px upload card as desktop. Desktop `155:34` density (120px padding, 56px title, 12deg
gradient) still starts at `xl`. Portrait `157:97` covers 834px until `lg`. Mobile `157:165` covers below 834px. Helpers:
`src/lib/media/guest-fotos-layout.ts`.

## Completed: guest fotos desktop (Figma `155:34`)

`/i/[slug]/fotos` and `/fotos?code=` from `xl` use the Figma canvas: olive-gradient banner (**Nychol & Miguel • Wedding
Gallery**, 56px Cormorant title), 640px cream workspace, optional name field with user glyph (QR only), dashed dropzone
with drag-and-drop, progress tracker, file cards, olive **Subir archivos** + outlined **Añadir más**, success toast, and
copyright footer. Landscape `157:29` covers `lg` until `xl`. Portrait `157:97` covers 834px until `lg`. Mobile `157:165`
covers below 834px. Helpers: `src/lib/media/guest-fotos-layout.ts`.
Icons live in `public/fotos/`.

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
