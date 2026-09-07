# Invitation UI (design & presentation)

**Status:** implemented against Figma “Invitación boda” + post-Figma polish (maps, music, cover crop, gifts, outfit
inspiration, personalized cover greeting)

**Last reviewed:** 2026-09-07

This document describes the **public invitation presentation layer** and shared brand rules used by the admin UI. It
does not authorize product features outside `docs/current-phase.md`.

## Source of truth

1. User/product request for a given task.
2. Figma file **Invitación boda** (desktop + mobile wireframes).
3. `src/config/wedding.ts` for copy, dates, couple names, feature flags, maps, and asset paths.
4. `src/config/transport.ts` for boarding point id helpers (keep in sync with meeting point ids).
5. CSS variables and utilities in `src/app/globals.css`.
6. Admin shared classes: `src/components/admin/admin-ui.ts`.
7. Event display timezone: `src/lib/datetime/event-timezone.ts` (`America/Bogota`).
8. This file for layout/component conventions.

## Couple names

Presentation and product display names:

| Role      | Value  | Source                                                          |
|-----------|--------|-----------------------------------------------------------------|
| Partner 1 | Nychol | `weddingConfig.couple.partnerOne` (+ `events.partner_one_name`) |
| Partner 2 | Miguel | `weddingConfig.couple.partnerTwo` (+ `events.partner_two_name`) |

Do not reintroduce “Nombre 1 / Nombre 2” placeholders for this couple.

## Routes

```text
/i/[slug]              invitation cover (personalized greeting by guest count / gender)
/i/[slug]/invitacion   full invitation page (hero → footer + RSVP + share memories CTA)
/i/[slug]/fotos        guest photo/video uploader (family-bound)
/fotos?code=…          same uploader via event QR (no family list)
/inspiracion/ellos     outfit inspiration board (men)
/inspiracion/ellas     outfit inspiration board (women)
```

Slug lookup goes through invitation services; presentation must never surface internal DB ids.

Cover CTA “Ver Invitación” navigates to `/invitacion` and, when music is enabled, starts the soundtrack on that user
gesture.

### Cover greeting

Logic: `formatCoverGreeting` in `src/lib/invitation/cover-greeting.ts` (prefixes in `weddingConfig.cover`).

| Guest count      | Greeting                                                                             |
|------------------|--------------------------------------------------------------------------------------|
| 1                | `Querido` / `Querida` / `Hola` + guest full name (`male` / `female` / `unspecified`) |
| 2                | `Queridos` + `Nombre1 y Nombre2`                                                     |
| 3+ (or no names) | `Querida` + family `display_name` (e.g. Familia Pérez)                               |

Admin create/edit family forms require a gender per guest (`male`, `female`, or `unspecified`) so singular invitations
stay correct. Plus-ones named “Acompañante” are stored as `unspecified` with `needs_name_confirmation`; the RSVP form
asks for the real name **only if that person will attend**. Each listed guest can be marked Asistirá / No asistirá.

## Design language

### Palette (CSS)

| Token                    | Value              | Role                                                                                             |
|--------------------------|--------------------|--------------------------------------------------------------------------------------------------|
| `--accent` / `bg-accent` | `#BEB950`          | Brand yellow bands (transport, gallery, gifts); share-memories + inspiration pages; Resumen CTAs |
| `--cream-figma`          | `#F5F5DC`          | Cream sections (countdown, dress code, RSVP); admin page bg                                      |
| `--cover-cta-fg`         | `#454411`          | Olive body/title text on cream                                                                   |
| `--cover-cta-bg`         | `#CFCFCF`          | Gray pill buttons (e.g. venue secondary pills)                                                   |
| `--gallery-dot`          | `#4A5D2A`          | Carousel dots                                                                                    |
| `--countdown-number`     | `#111827`          | Countdown figures                                                                                |
| `--olive-muted`              | `#7A783A`          | Admin directory secondary copy (Figma `85:40`)                                           |
| `--olive-border`             | `#E5E4C6`          | Admin directory card/row borders + TÚ badge                                              |
| `--olive-wash`               | `#FAF9E6`          | Admin invite input / Cancelar surface                                                    |
| `--status-active-*`          | `#EBFEE6` / `#166500` | Activo badge                                                                          |
| `--status-pending-*`         | `#FEF08A` / `#854D0E` | Pendiente badge                                                                       |
| `--admin-canvas`             | `#F5F4EB`          | Admin Resumen page (all viewports, Figma `94:414` / `94:232` / `94:34` / `91:40`)       |
| `--admin-olive` / `--admin-olive-end` | `#5F6446` / `#888F68` | Resumen header pills, banner gradient, progress fill                          |
| `--admin-ink` / `--admin-muted` | `#303026` / `#727263` | Resumen body / secondary copy                                                   |
| `--admin-border` / `--admin-wash` | `#E4E3DA` / `#F0F2EA` | Resumen cards, pills, gauges                                                    |
| `--admin-logout`                 | `#A84343`          | Resumen drawer **Salir**                                                        |
| `--admin-checkbox-border`        | `#A8A89A`          | Unchecked list checkbox (Figma `100:38`)                                        |


### Typography

| Role                                           | Family / variable                                 | Use                                                     |
|------------------------------------------------|---------------------------------------------------|---------------------------------------------------------|
| Invitation section titles & body (Figma Times) | `--font-timer` (`Times New Roman` stack)          | Venue, transport, dress, gifts, RSVP, footer, countdown |
| Cover subtitle                                 | Vollkorn (`--font-cover-serif`)                   | Multi-line cover invitation copy, **uppercase**         |
| Cover / script accents                         | `--font-script` / cover fonts as loaded in layout | Cover greeting script line and specialized display      |
| Admin UI                                       | same `--font-timer` + olive / cream tokens        | `/admin` forms and lists via `admin-ui.ts` (navbar + Resumen workspace use `adminResumen`) |
| Admin Resumen (`/admin`)                       | `--font-body` (Source Sans 3) + Times metrics     | Shared Figma navbar; workspace `94:414` / `94:232` / `94:34` / `91:40`; Inter maps to `--font-body` |
| Admin Estadísticas (`/admin/analytics`)        | `--font-body` + Times metrics                     | Figma `96:39` desktop + `99:229` landscape + `99:419` portrait + `99:607` mobile; 1-col phone; 2-col from 834px; 3-col from `lg` |
| Admin Invitados (`/admin/guests`)              | `--font-body` table + Times banner                | Figma `109:372` mobile (1-col cards) + `109:36` from 834px (2-col) + `103:33` from `lg` + `100:38` from `xl` |
| Admin Familias (`/admin/families`)             | `--font-body` table + Times banner                | Figma `126:29` mobile (1-col family cards) + `123:268` from 834px (2-col) + `117:29` from `lg` (compact date columns) + `109:645` from `xl` |
| Admin Fotos (`/admin/photos`)                  | `--font-body` + Times banner                      | Figma `128:528` mobile (1-col cards) + `128:364` from 834px (2-col) + `128:201` from `lg` + `128:34` from `xl` |
| Admin directory (`/admin/admins`)              | `--font-body` + Times banner on all sizes | Figma `136:29` mobile (nested cards) + `134:207` portrait from 834px + `134:121` landscape from `lg` + `134:35` desktop from `xl`; shared Figma navbar |




Do not reintroduce generic marketing fonts (e.g. Inter-like default stacks) on invitation sections that already use
Times.

### Admin invite email (Supabase Auth)

`emails/admin-invite.html` follows Figma **email-admin-invite** (`80:40`) so the invite matches the admin chrome
(olive gradient, cream body, gold kicker). `emails/admin-reset-password.html` uses the **same layout** (header, two
body paragraphs, olive pill CTA, disclaimer, footer) with reset copy; paste it into Auth **Reset password**. Inter in
Figma maps to **Sora**; Times maps to **Vollkorn** (email-safe stacks — do not switch the HTML to Inter).

| Role                                      | Value                                                         |
|-------------------------------------------|---------------------------------------------------------------|
| Page                                      | `#F5F4EB`                                                     |
| Card body                                 | `#F5F3EB`                                                     |
| Header / footer (fallback)                | `#5F6446`                                                     |
| Header / footer gradient                  | `#5F6446` → `#888F68` (~10.5deg)                              |
| Kicker **ADMINISTRACIÓN**                 | `#BEB950`                                                     |
| Headline / ink                            | `#303026`                                                     |
| Body / disclaimer                         | `#727263`                                                     |
| CTA pill                                  | fill `#5F6446`, text `#FFFFFF`, no gold border                |
| Divider                                   | `#5F6446` at 70% opacity                                      |
| “Con cariño”                              | `#F0F2EA` italic serif                                        |
| Serif (names, headline, sign-off)         | Vollkorn, Georgia / Times fallback                            |
| Sans (kicker, body, CTA)                  | Sora, Arial / Helvetica fallback                              |

Table layout, inline CSS, pill CTA. Paste into Supabase Auth **Invite user** and **Reset password**; keep
`{{ .ConfirmationURL }}`. `inviteUserByEmail` and `resetPasswordForEmail` redirect to `/admin/aceptar-invitacion`.
Outlook falls back to solid `#5F6446` when `background-image` is stripped.

### Layout principles

- **Mobile-first**, safe areas, 44px targets, `prefers-reduced-motion`.
- **Full-bleed** photo sections (cover, hero, venue, couple, closing) edge-to-edge.
- **Cap content width** on large screens for multi-column blocks (venue row, dress grid, transport, RSVP, gifts) so
  copy/CTAs do not pin to opposite edges (`max-w-5xl` / `max-w-6xl` patterns).
- **Accent continuous runs** are intentional (e.g. gallery → gifts stay yellow).
- Prefer **one job per section** (title + short support + media or form).

### Cover crop

Cover photo uses class `.cover-photo` (`globals.css`):

| Breakpoint       | `background-position` |
|------------------|-----------------------|
| default (mobile) | `47% top`             |
| ≥640px (tablet)  | `48.5% top`           |
| ≥1024px          | `center top`          |

Asset: `weddingConfig.assets.coverBackground` → `Portada.jpg`.

## Section components

| Section            | Component                       | Notes                                                                                       |
|--------------------|---------------------------------|---------------------------------------------------------------------------------------------|
| Cover              | `invitation-cover.tsx`          | Full-bleed; script greeting line; Vollkorn subtitle; open CTA                               |
| Open CTA           | `invitation-open-button.tsx`    | Starts music (if enabled) then navigates                                                    |
| Music              | `invitation-music-control.tsx`  | Floating mute on body page                                                                  |
| Hero               | `invitation-hero.tsx`           | Photo crop via `.hero-photo`                                                                |
| Countdown          | `invitation-countdown.tsx`      | Client; absolute event timestamps; labels via event TZ helper when needed                   |
| Venue              | `invitation-venue.tsx`          | MediaFrame + optional embed + map links                                                     |
| Map links          | `venue-map-links.tsx`           | Google / Waze / Apple (Apple OS only)                                                       |
| Transport          | `invitation-transport.tsx`      | Chiva art; meeting points; landscape frame ~509/286; gratuito in copy                       |
| Couple photo       | `invitation-couple-photo.tsx`   | Full-width                                                                                  |
| Dress code         | `invitation-dress-code.tsx`     | ELLOS \| photo \| ELLAS; palettes share row width; inspiration CTAs `text-center`           |
| Gallery            | `invitation-gallery.tsx`        | Dual-buffer + swipe; `onLoad`; desktop arrows                                               |
| Gifts              | `invitation-gifts.tsx`          | Two equal columns on `lg+`; illustration capped (`max-w-sm` → `lg`); `Lluvia de sobres.png` |
| RSVP shell         | `invitation-rsvp-section.tsx`   | Intro from Figma + children form                                                            |
| RSVP form          | `rsvp-form.tsx`                 | Attendance, bus, **boarding point**, diet, contact (phone required)                         |
| Share memories CTA | `invitation-share-memories.tsx` | Accent band + cream CTA → `/i/[slug]/fotos`                                                 |
| Footer             | `invitation-footer.tsx`         | Closing message + date on photo                                                             |

Orchestration: `invitation-page-view.tsx`.

### Venue directions

Config on `weddingConfig.ceremony`:

| Field          | Role                                                                 |
|----------------|----------------------------------------------------------------------|
| `mapsEmbedUrl` | Google Maps iframe `src` (hidden if empty)                           |
| `mapsUrl`      | External Google Maps link                                            |
| `wazeUrl`      | External Waze link                                                   |
| `appleMapsUrl` | Apple Maps; UI shows only on Apple platforms (`src/lib/platform.ts`) |

Labels: `weddingConfig.venue` (`mapsCtaLabel`, `wazeCtaLabel`, `appleMapsCtaLabel`, `directionsLabel`).

### Music

| Config           | Role                                                     |
|------------------|----------------------------------------------------------|
| `features.music` | Master toggle                                            |
| `assets.music`   | Path under `/public` (e.g. `/invitation/soundtrack.mp3`) |

Behavior:

1. Guest taps “Ver Invitación” → `startInvitationMusic` (user gesture unlocks playback).
2. Invitation body shows floating mute when feature + path enabled.
3. Module singleton `src/lib/invitation-audio.ts` (loop, moderate volume; stored on `globalThis` + attached to
   `document.body` so it survives soft navigations).
4. Soft navigations to `/inspiracion/*` keep music playing: CTA / Volver call `continueInvitationMusicIfNeeded` on the
   same gesture; mute state is remembered in `sessionStorage`.
5. Missing file or flag off → no audio / no control; cover navigation still works.

Do not autoplay on first paint without a gesture.

### RSVP form UX (boarding)

When an attending guest checks “Usará el transporte (bus)”:

1. Show radios for each `weddingConfig.transport.meetingPoints` entry (`id`, title, place).
2. Boarding is **required** before submit (client Zod + server RPC).
3. Clearing attendance or bus clears the boarding selection.
4. Ids must stay: `modelia` (Modelia), `villa_sonia` (Villa Sonia).

Admin analytics and guest tables surface the same points for planning bus capacity. Analytics omit families whose
name contains the word **ejemplo**.

Guests with `needs_name_confirmation` (typically labeled “Acompañante”) show **nombre completo** only when that person
will attend. Placeholder labels are rejected server-side. A family can leave the plus-one (or any other listed person)
as **No asistirá** without inventing a name. Those guest rows still count in invitation totals (`Nombres por confirmar`
is an extra metric, not an exclusion). Guest-facing lead (`rsvpInvitationSeatsLead`): “Esta invitación es para N
personas. Esperamos a todos; si alguien no puede asistir, indícalo en su nombre.” (1 seat uses the singular). Do not
revive “Cupos… dejar sin ir” or “no hace falta que vayan todos.”

### Dress code layout

- Center illustration larger on desktop (column ~26–30rem).
- Allowed / forbidden palette blocks share the same content width rhythm as the ELLOS \| photo \| ELLAS row.
- Desktop outer alignment: ELLOS start / ELLAS end relative to the shared grid.
- Prefer `object-contain` so figures (heads/feet) are not cropped.
- “Ver Inspiración” pills: centered label text (`text-center` + flex center).

## Assets (`public/invitation/`)

Paths are always configured in `weddingConfig.assets` (do not hardcode new paths inside many components).

| Asset key                       | Expected file                     | Used by                                                |
|---------------------------------|-----------------------------------|--------------------------------------------------------|
| `coverBackground`               | `Portada.jpg`                     | Cover                                                  |
| `heroPhoto`                     | `Boda 3.jpg`                      | Hero                                                   |
| `venueBackground`               | `Boda 19.jpg`                     | Venue                                                  |
| `couplePhoto`                   | `Imagen recortada.png`            | Couple band                                            |
| `busPhoto`                      | `chiva.png`                       | Transport (file key remains `busPhoto` for less churn) |
| `gallery`                       | ordered `Boda N.jpg` list         | Gallery carousel                                       |
| `footerBackground`              | `Boda 19.jpg`                     | Closing                                                |
| `dressCodePhoto`                | `cabezas.png`                     | Dress code                                             |
| `giftsIllustration`             | `Lluvia de sobres.png`            | Gifts                                                  |
| `allowedPaletteImage`           | `paleta sugerida.png`             | Dress code                                             |
| `forbiddenPaletteImage`         | `paleta colores.png`              | Dress code                                             |
| `menOutfitInspiration`          | `Ideas outfit hombre.png`         | `/inspiracion/ellos` (teléfono + tablet vertical)      |
| `menOutfitInspirationDesktop`   | `Ideas outfit hombre desktop.png` | `/inspiracion/ellos` (`md` + landscape)                |
| `womenOutfitInspiration`        | `Ideas outfit mujer.png`          | `/inspiracion/ellas` (teléfono + tablet vertical)      |
| `womenOutfitInspirationDesktop` | `Ideas outfit mujer desktop.png`  | `/inspiracion/ellas` (`md` + landscape)                |
| `music`                         | `soundtrack.mp3`                  | Background track (optional file)                       |

### Outfit inspiration pages

- Routes: `/inspiracion/ellos`, `/inspiracion/ellas`.
- Background: brand `bg-accent` (`#BEB950`).
- CTAs “Ver Inspiración” in dress code link via `dressCode.inspirationUrls`.
- Assets and copy live in `weddingConfig` (`assets.*OutfitInspiration*`, `dressCode.inspirationPages`).
- Art direction via CSS: **phone + tablet portrait** use the standard boards; **`md` + landscape** (tablet horizontal /
  desktop) use `* desktop.png`. (Do not wrap `next/image` in `<picture>` — the `<source>` is ignored.)
- Layout: **full width** + scrollable image area on portrait. Height-capped / centered on landscape from `md` up so
  “Volver” stays visible without scroll when possible.

### Gallery rules

- Opening pair: **Boda 10**, **Boda 15**.
- Exclude from carousel: **3** (hero), **8**, **10**/ **15** (not repeated after open), **19** (venue; different
  aspect), **21** (different aspect), **22**. Cover asset is `Portada.jpg` (not in the carousel).
- **23** occupies the former slot of **8**.
- Mobile: 1 per page. Desktop (≥1024px): 2 per page.
- Transition: dual buffer (preload next) then horizontal swipe; respect reduced motion.
- Image ready handler: `onLoad` (not deprecated `onLoadingComplete`).

### Image display tips

- Portrait photos in gallery: height-capped (`max-height: 100svh/dvh`), `object-contain` / top.
- Dress code illustration: **natural aspect**, `object-contain` so feet are not cropped.
- Transport chiva: square art inside **landscape Figma frame** (`aspect-ratio: 509 / 286`), `object-contain`.
- Gifts illustration: keep moderately sized (not full column bleed); `object-contain`.
- Prefer `unoptimized` for static `/invitation/*` brand PNGs when the optimizer adds no value.

## Config copy that must stay centralized

Edit **only** `src/config/wedding.ts` for:

- Couple names, ceremony maps URLs, venue labels, transport meeting points (including **stable `id`s**), dress rules,
  gifts, RSVP intro strings, footer template (`closingTemplate` with `{date}`).
- Cover greeting prefixes (`cover.greetingPrefix*`).
- Feature flags (`features.countdown`, `features.gifts`, `features.music`, …).
- Asset paths including `assets.music` and outfit boards.

When adding or renaming a boarding point:

1. Update `meetingPoints` ids + copy in `wedding.ts`.
2. Update `TRANSPORT_BOARDING_POINT_IDS` in `transport.ts`.
3. Update Zod + SQL check constraint + RPC allow-list (new migration).

RSVP deadlines and event dates may also exist in Supabase `events`; the page prefers DB when available, with config as
presentation fallback labels. Format invitation/admin date labels with `America/Bogota` (`event-timezone.ts`), not the
host TZ.

## Admin brand (same system)

Admin must not drift into a separate purple/gray SaaS look. Use `admin` tokens from `admin-ui.ts` for forms, tables,
and metrics. The shared navbar uses `adminResumen` (white header, olive pills, cream left drawer). Page shell under
the bar uses `bg-admin-canvas`.

**Navbar (all `AdminShell` pages):** white header (couple names + Admin badge + session email). Phone and tablet
portrait use an olive hamburger that opens the Figma left drawer (`94:591`: cream 290px panel, olive active row, live
Familias/Invitados badges, Acciones rápidas, Salir). Landscape/desktop add olive route pills (Resumen, Estadísticas,
Invitados, Familias, Fotos, Admins) and Salir in the header. The olive **+** FAB (nueva familia) is shown on every
viewport except `/admin/families/new`. It is portaled in a full-viewport overlay so a flex `body` cannot park it below a
long desktop table.
Login and accept-invite have no navbar. Page titles (and the families back chevron) sit in the main column.

**Estadísticas** (`/admin/analytics`: desktop Figma `96:39`; landscape `99:229` from `lg`; portrait `99:419` from
834px; mobile `99:607` below 834px): same olive banner pattern as Resumen (live deadline + Excel download; **do not
change the shared navbar**). Phone stacks the overline, compact title/body, and full-width CTAs; rate percents sit
under the labels. Portrait uses two equal CTAs; landscape/desktop put CTAs on the right. White “Métricas de Avance”
panel with olive rate bars, two canvas boarding cards, then a 12-card grid (`statsGrid`: 1 / 2 from 834px / 3 from
`lg`). Cards deep-link to filtered lists. Do not add a Mensajes route. The shared olive **+** FAB stays on every viewport. Classes
live in `adminResumen`; card builders in `admin-analytics.ts`.

**Invitados** (`/admin/guests`: mobile Figma `109:372` below 834px; portrait `109:36` from 834px; landscape `103:33`
from `lg`; desktop `100:38` from `xl`): olive banner (Administración · Invitados, remaining-days chip
`⏳ Quedan N días para confirmar` on every width — do not use Figma’s “RSVP Límite” / date chip; Excel download; **do
not change the shared navbar**). Phone stacks banner CTAs, 2×2 KPI pills, sort/**Mostrar filtros**, equal tabs, then a
1-column card list; the shared **+** FAB stays on every viewport. Portrait uses a 2-column card grid. Landscape/desktop use the table (6
filters, then 7 from `xl`). List checkboxes: 18px, fill `--admin-olive` when checked (not accent yellow), radius 6px
(rounder than the 4px Figma mock), white check from `public/admin/checkbox-check.svg`. Helpers in
`admin-guests-layout.ts`; classes in `adminGuests`.

**Familias** (`/admin/families`: mobile Figma `126:29` below 834px; portrait `123:268` from 834px; landscape `117:29`
from `lg`; desktop `109:645` from `xl`): olive banner (Administración · Familias, remaining-days chip `⏳ Quedan N días
para confirmar` — do not use a Figma date chip; Excel download; **do not change the shared navbar**; no extra “Descargar
lista” or “Nueva familia” nav item — **Nueva familia** stays in the drawer + shared **+** FAB). Phone stacks the banner CTAs,
2×2 KPI pills, always-visible search, **Ordenar por** + **Mostrar filtros**, equal tabs, then a 1-column **family** card
list (name, not guest roles; Confirmó / No asiste / Sin abrir; Estado extras when pending; Cupos / Confirmados — no slug or Bus on phone). Portrait uses a 2-column card grid. Landscape/
desktop use the table: five filters in one row, in-page tabs (Estadísticas / Familias / Lista completa de Invitados).
Landscape shortens date headers to **Abrió** / **Confirmó** / **Últ. cambio** and drops year/a.m./p.m. from cell times.
Inter table (slug + olive chips; Sin abrir is red), **Ver**, olive batch bar (Copiar enlaces / Descargar / Desactivar /
Activar — keep Activar even if a mock omits it; phone batch ignores Figma’s “Crear selección”). Helpers in
`admin-families-layout.ts`; classes in `adminFamilies` (cards/table/batch reuse `adminGuests`).

**Fotos** (`/admin/photos`: mobile Figma `128:528` below 834px; portrait `128:364` from 834px; landscape `128:201` from
`lg`; desktop `128:34` from `xl`): olive banner (Administración · Fotos, title **Fotos y videos**, moderation body;
**do not change the shared navbar**; the shared **+** FAB stays). Phone and portrait show the remaining-days chip
`⏳ Quedan N días para confirmar` and **Descargar Lista** (stacked full-width on phone); landscape/desktop omit both
(those mocks have neither). Eight live KPI cards (Archivos / Espacio Usado / Fotos / Videos, then Completados / En
Revisión / Fallidos / Cuota Storage) plus the origin line (invitación / código / aprobados / rechazados). Phone uses a
2-column KPI grid and compact hints; portrait is 4×2; landscape shortens hints and uses a 110px QR with status +
reference on one row; desktop uses full hints and a 180px QR. Phone QR is stacked (160px, centered; **Referencia**
short label; generate / disable / review full-width). QR card restyles the existing rotate / window / enable /
reconcile actions; the full URL and PNG QR appear only after generating a new code (the mock’s stored URL is a
placeholder). Phone lists files as a 1-column card stack (200px thumb); portrait as a 2-column grid (180px thumb).
Cards show filename + uppercase status, `mime • size`, Origen — not the Figma typo “Orígen”, Aprobar / Rechazar side by
side, Eliminar full-width, plus olive batch approve/reject (the mock omits checkboxes; keep them; phone batch sits
above the FAB). Landscape/desktop use the moderation table: checkbox, Vista, Archivo, Origen, Estado badge (uppercase
on landscape), Tamaño, Acciones (Aprobar olive fill, Rechazar outline, Eliminar red outline). Helpers in
`admin-photos-layout.ts`; classes in `adminPhotos`.

**Resumen** (`/admin` workspace: Figma `admin-resumen-mobile` `94:414`; portrait `94:232` from 834px; landscape
`94:34` from `lg`; desktop `91:40` from `xl`): olive banner (stacked full-width CTAs on phone, two equal-width CTAs on
portrait), KPI grid (1 column on phone, 2×2 until desktop, 4 across from `xl`), stacked close / follow-ups /
attention until `lg` (`w-full` so portrait cards are not content-width), then a 340px attention rail.
Classes live in `adminResumen`. Icons use Lucide (same glyphs as Figma: menu, download, clock, check, chevron, alert,
plus, log-out, layout-grid, users) with explicit leaf sizes. Do not add Figma-only routes (Transporte / Mensajes /
Configuración) or a “Notificar” WhatsApp send; attention CTAs stay **Ver lista** / **Asignar**. Do not invent a drinks
list: follow-ups stay transporte / fotos from live data. The shared olive **+** FAB stays on every viewport;
**Nueva familia** remains in the drawer too.

New-family **+** is shown on every `AdminShell` viewport (hidden only on `/admin/families/new`); it is portaled in a
full-viewport overlay so a flex `body` cannot hide it on desktop. The drawer includes **Nueva familia**. Closed overlay
cannot intercept hamburger taps. Back chevron on nueva familia **and** family detail. Family list chips (sin abrir /
bus / dieta). Family detail: actividad reciente; eliminar familia no exige guardar el formulario. Family/guest/photo
**cards** replace tables until `lg`.

Family create/edit: each guest row includes **nombre + género** (required). Gender powers the singular cover greeting
only; it is not shown on the public invitation body.

## Accessibility & motion

- Gallery: keyboard arrows on desktop when section is focused or in view; pause on hover/focus.
- Submit and choice controls: min height 44px where interactive.
- `prefers-reduced-motion: reduce` disables gallery swipe/autoplay animations. The admin hamburger drawer also skips the
  slide.
- Music mute control must remain keyboard and screen-reader usable when shown.

## Do not

- Reintroduce glass “card” shells that fight the cream Figma boards unless required for form focus groups.
- Stretch dress/chiva art with `object-cover` in fixed frames that crop people or illustration.
- Scatter brand hex values across components; use tokens.
- Invent missing wedding logistics data; leave empty CTA URLs disabled.
- Change boarding point **ids** without a matching DB migration.
- Autoplay invitation audio on page load without a user gesture.
- Reintroduce `src/middleware.ts`; use `src/proxy.ts` for the admin edge gate.
- Guess guest gender from a real name; persist `guests.gender` from admin (`unspecified` is valid for plus-ones).
