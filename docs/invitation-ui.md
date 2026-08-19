# Invitation UI (design & presentation)

**Status:** implemented against Figma “Invitación boda” + post-Figma polish (maps, music, cover crop, gifts, outfit
inspiration, personalized cover greeting)

**Last reviewed:** 2026-08-19

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
asks for the real name.

## Design language

### Palette (CSS)

| Token                    | Value              | Role                                                                                             |
|--------------------------|--------------------|--------------------------------------------------------------------------------------------------|
| `--accent` / `bg-accent` | `#BEB950`          | Brand yellow bands (transport, gallery, gifts); admin header; share-memories + inspiration pages |
| `--cream-figma`          | `#F5F5DC`          | Cream sections (countdown, dress code, RSVP); admin page bg                                      |
| `--cover-cta-fg`         | `#454411`          | Olive body/title text on cream                                                                   |
| `--cover-cta-bg`         | `#CFCFCF`          | Gray pill buttons (e.g. venue secondary pills)                                                   |
| `--gallery-dot`          | `#4A5D2A`          | Carousel dots                                                                                    |
| `--countdown-number`     | `#111827`          | Countdown figures                                                                                |
| Cream text on photos     | `text-cream-figma` | Venue / footer type                                                                              |

### Typography

| Role                                           | Family / variable                                 | Use                                                     |
|------------------------------------------------|---------------------------------------------------|---------------------------------------------------------|
| Invitation section titles & body (Figma Times) | `--font-timer` (`Times New Roman` stack)          | Venue, transport, dress, gifts, RSVP, footer, countdown |
| Cover subtitle                                 | Vollkorn (`--font-cover-serif`)                   | Multi-line cover invitation copy, **uppercase**         |
| Cover / script accents                         | `--font-script` / cover fonts as loaded in layout | Cover greeting script line and specialized display      |
| Admin UI                                       | same `--font-timer` + olive / cream tokens        | Entire `/admin` shell and forms via `admin-ui.ts`       |

Do not reintroduce generic marketing fonts (e.g. Inter-like default stacks) on invitation sections that already use
Times.

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

Admin analytics and guest tables surface the same points for planning bus capacity.

Guests with `needs_name_confirmation` (typically labeled “Acompañante”) show a required **nombre completo** field.
Placeholder labels are rejected server-side. Those guests still count in analytics totals (`Nombres por confirmar` is an
extra metric, not an exclusion).

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
nav, and metrics. Header uses `bg-accent` with cream type/pills; page shell uses `bg-cream-figma`.

Compact admin (viewport `< lg`): hamburger drawer is the same accent band as the header. New-family **+** uses
`.admin-new-family-fab` so iPad Safari keeps it at the visible bottom (not mid-list). Create-family screen: cream back
chevron to `/admin/families`. Family/guest/photo **cards** replace tables until `lg`.

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
