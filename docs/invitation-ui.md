# Invitation UI (design & presentation)

**Status:** implemented against Figma “Invitación boda” + post-Figma polish (maps, music, cover crop)

**Last reviewed:** 2026-08-09

This document describes the **public invitation presentation layer** and shared brand rules used by the admin UI. It does not authorize product features outside `docs/current-phase.md`.

## Source of truth

1. User/product request for a given task.
2. Figma file **Invitación boda** (desktop + mobile wireframes).
3. `src/config/wedding.ts` for copy, dates, couple names, feature flags, maps, and asset paths.
4. `src/config/transport.ts` for boarding point id helpers (keep in sync with meeting point ids).
5. CSS variables and utilities in `src/app/globals.css`.
6. Admin shared classes: `src/components/admin/admin-ui.ts`.
7. This file for layout/component conventions.

## Couple names

Presentation and product display names:

| Role | Value | Source |
|------|--------|--------|
| Partner 1 | Nychol | `weddingConfig.couple.partnerOne` (+ `events.partner_one_name`) |
| Partner 2 | Miguel | `weddingConfig.couple.partnerTwo` (+ `events.partner_two_name`) |

Do not reintroduce “Nombre 1 / Nombre 2” placeholders for this couple.

## Routes

```text
/i/[slug]              invitation cover (personalized by family slug)
/i/[slug]/invitacion   full invitation page (hero → footer + RSVP + share memories CTA)
/i/[slug]/fotos        guest photo/video uploader (family-bound)
/fotos?code=…          same uploader via event QR (no family list)
```

Slug lookup goes through invitation services; presentation must never surface internal DB ids.

Cover CTA “Ver Invitación” navigates to `/invitacion` and, when music is enabled, starts the soundtrack on that user gesture.

## Design language

### Palette (CSS)

| Token | Value | Role |
|-------|--------|------|
| `--accent` / `bg-accent` | `#BEB950` | Brand yellow bands (transport, gallery, gifts); admin header |
| `--cream-figma` | `#F5F5DC` | Cream sections (countdown, dress code, RSVP); admin page bg |
| `--cover-cta-fg` | `#454411` | Olive body/title text on cream |
| `--cover-cta-bg` | `#CFCFCF` | Gray pill buttons (e.g. venue secondary pills) |
| `--gallery-dot` | `#4A5D2A` | Carousel dots |
| `--countdown-number` | `#111827` | Countdown figures |
| Cream text on photos | `text-cream-figma` | Venue / footer type |

### Typography

| Role | Family / variable | Use |
|------|-------------------|-----|
| Invitation section titles & body (Figma Times) | `--font-timer` (`Times New Roman` stack) | Venue, transport, dress, gifts, RSVP, footer, countdown |
| Cover subtitle | Vollkorn (`--font-cover-serif`) | Multi-line cover invitation copy, **uppercase** |
| Cover / script accents | `--font-script` / cover fonts as loaded in layout | Cover and specialized display |
| Admin UI | same `--font-timer` + olive / cream tokens | Entire `/admin` shell and forms via `admin-ui.ts` |

Do not reintroduce generic marketing fonts (e.g. Inter-like default stacks) on invitation sections that already use Times.

### Layout principles

- **Mobile-first**, safe areas, 44px targets, `prefers-reduced-motion`.
- **Full-bleed** photo sections (cover, hero, venue, couple, closing) edge-to-edge.
- **Cap content width** on large screens for multi-column blocks (venue row, dress grid, transport, RSVP) so copy/CTAs do not pin to opposite edges (`max-w-5xl` / `max-w-6xl` patterns).
- **Accent continuous runs** are intentional (e.g. gallery → gifts stay yellow).
- Prefer **one job per section** (title + short support + media or form).

### Cover crop

Cover photo uses class `.cover-photo` (`globals.css`):

| Breakpoint | `background-position` |
|------------|------------------------|
| default (mobile) | `47% top` |
| ≥640px (tablet) | `48.5% top` |
| ≥1024px | `center top` |

Asset: `weddingConfig.assets.coverBackground` → `Portada.jpg`.

## Section components

| Section | Component | Notes |
|---------|-----------|--------|
| Cover | `invitation-cover.tsx` | Full-bleed cover; Vollkorn subtitle; open CTA |
| Open CTA | `invitation-open-button.tsx` | Starts music (if enabled) then navigates |
| Music | `invitation-music-control.tsx` | Floating mute on body page |
| Hero | `invitation-hero.tsx` | Photo crop via `.hero-photo` |
| Countdown | `invitation-countdown.tsx` | Client; cached second snapshot via `useSyncExternalStore` |
| Venue | `invitation-venue.tsx` | MediaFrame + optional embed + map links |
| Map links | `venue-map-links.tsx` | Google / Waze / Apple (Apple OS only) |
| Transport | `invitation-transport.tsx` | Chiva art; meeting points; landscape frame ~509/286 |
| Couple photo | `invitation-couple-photo.tsx` | Full-width |
| Dress code | `invitation-dress-code.tsx` | ELLOS \| photo \| ELLAS; palettes share row width |
| Gallery | `invitation-gallery.tsx` | Dual-buffer + swipe; `onLoad`; desktop arrows |
| Gifts | `invitation-gifts.tsx` | Two columns: `Lluvia de sobres.png` + copy |
| RSVP shell | `invitation-rsvp-section.tsx` | Intro from Figma + children form |
| RSVP form | `rsvp-form.tsx` | Attendance, bus, **boarding point**, diet, contact |
| Share memories CTA | `invitation-share-memories.tsx` | Links to `/i/[slug]/fotos` |
| Footer | `invitation-footer.tsx` | Closing message + date on photo |

Orchestration: `invitation-page-view.tsx`.

### Venue directions

Config on `weddingConfig.ceremony`:

| Field | Role |
|-------|------|
| `mapsEmbedUrl` | Google Maps iframe `src` (hidden if empty) |
| `mapsUrl` | External Google Maps link |
| `wazeUrl` | External Waze link |
| `appleMapsUrl` | Apple Maps; UI shows only on Apple platforms (`src/lib/platform.ts`) |

Labels: `weddingConfig.venue` (`mapsCtaLabel`, `wazeCtaLabel`, `appleMapsCtaLabel`, `directionsLabel`).

### Music

| Config | Role |
|--------|------|
| `features.music` | Master toggle |
| `assets.music` | Path under `/public` (e.g. `/invitation/soundtrack.mp3`) |

Behavior:

1. Guest taps “Ver Invitación” → `startInvitationMusic` (user gesture unlocks playback).
2. Invitation body shows floating mute when feature + path enabled.
3. Module singleton `src/lib/invitation-audio.ts` (loop, moderate volume).
4. Missing file or flag off → no audio / no control; cover navigation still works.

Do not autoplay on first paint without a gesture.

### RSVP form UX (boarding)

When an attending guest checks “Usará el transporte (bus)”:

1. Show radios for each `weddingConfig.transport.meetingPoints` entry (`id`, title, place).
2. Boarding is **required** before submit (client Zod + server RPC).
3. Clearing attendance or bus clears the boarding selection.
4. Ids must stay: `modelia` (Modelia), `villa_sonia` (Villa Sonia).

Admin analytics and guest tables surface the same points for planning bus capacity.

### Dress code layout

- Center illustration larger on desktop (column ~26–30rem).
- Allowed / forbidden palette blocks share the same content width rhythm as the ELLOS \| photo \| ELLAS row.
- Desktop outer alignment: ELLOS start / ELLAS end relative to the shared grid.
- Prefer `object-contain` so figures (heads/feet) are not cropped.

## Assets (`public/invitation/`)

Paths are always configured in `weddingConfig.assets` (do not hardcode new paths inside many components).

| Asset key | Expected file | Used by |
|-----------|---------------|---------|
| `coverBackground` | `Portada.jpg` | Cover |
| `heroPhoto` | `Boda 3.jpg` | Hero |
| `venueBackground` | `Boda 19.jpg` | Venue |
| `couplePhoto` | `Imagen recortada.png` | Couple band |
| `busPhoto` | `chiva.png` | Transport (file key remains `busPhoto` for less churn) |
| `gallery` | ordered `Boda N.jpg` list | Gallery carousel |
| `footerBackground` | `Boda 19.jpg` | Closing |
| `dressCodePhoto` | `cabezas.png` | Dress code |
| `giftsIllustration` | `Lluvia de sobres.png` | Gifts |
| `allowedPaletteImage` | `paleta sugerida.png` | Dress code |
| `forbiddenPaletteImage` | `paleta colores.png` | Dress code |
| `menOutfitInspiration` | `Ideas outfit hombre.png` | `/inspiracion/ellos` |
| `womenOutfitInspiration` | `Ideas outfit mujer.png` | `/inspiracion/ellas` |
| `music` | `soundtrack.mp3` | Background track (optional file) |

### Outfit inspiration pages

- Routes: `/inspiracion/ellos`, `/inspiracion/ellas`.
- Background: brand `bg-accent` (`#BEB950`).
- CTAs “Ver Inspiración” in dress code link via `dressCode.inspirationUrls`.
- Assets and copy live in `weddingConfig` (`assets.*OutfitInspiration`, `dressCode.inspirationPages`).

### Gallery rules

- Opening pair: **Boda 10**, **Boda 15**.
- Exclude from carousel: **3** (hero), **8**, **10**/**15** (not repeated after open), **19** (venue; different aspect), **21** (different aspect), **22**. Cover asset is `Portada.jpg` (not in the carousel).
- **23** occupies the former slot of **8**.
- Mobile: 1 per page. Desktop (≥1024px): 2 per page.
- Transition: dual buffer (preload next) then horizontal swipe; respect reduced motion.
- Image ready handler: `onLoad` (not deprecated `onLoadingComplete`).

### Image display tips

- Portrait photos in gallery: height-capped (`max-height: 100svh/dvh`), `object-contain` / top.
- Dress code illustration: **natural aspect**, `object-contain` so feet are not cropped.
- Transport chiva: square art inside **landscape Figma frame** (`aspect-ratio: 509 / 286`), `object-contain`.
- Prefer `unoptimized` for static `/invitation/*` brand PNGs when the optimizer adds no value.

## Config copy that must stay centralized

Edit **only** `src/config/wedding.ts` for:

- Couple names, ceremony maps URLs, venue labels, transport meeting points (including **stable `id`s**), dress rules, gifts, RSVP intro strings, footer template (`closingTemplate` with `{date}`).
- Feature flags (`features.countdown`, `features.gifts`, `features.music`, …).
- Asset paths including `assets.music`.

When adding or renaming a boarding point:

1. Update `meetingPoints` ids + copy in `wedding.ts`.
2. Update `TRANSPORT_BOARDING_POINT_IDS` in `transport.ts`.
3. Update Zod + SQL check constraint + RPC allow-list (new migration).

RSVP deadlines and event dates may also exist in Supabase `events`; the page prefers DB when available, with config as presentation fallback labels.

## Admin brand (same system)

Admin must not drift into a separate purple/gray SaaS look. Use `admin` tokens from `admin-ui.ts` for forms, tables, nav, and metrics. Header uses `bg-accent` with cream type/pills; page shell uses `bg-cream-figma`.

## Accessibility & motion

- Gallery: keyboard arrows on desktop when section is focused or in view; pause on hover/focus.
- Submit and choice controls: min height 44px where interactive.
- `prefers-reduced-motion: reduce` disables gallery swipe/autoplay animations.
- Music mute control must remain keyboard and screen-reader usable when shown.

## Do not

- Reintroduce glass “card” shells that fight the cream Figma boards unless required for form focus groups.
- Stretch dress/chiva art with `object-cover` in fixed frames that crop people or illustration.
- Scatter brand hex values across components; use tokens.
- Invent missing wedding logistics data; leave empty CTA URLs disabled.
- Change boarding point **ids** without a matching DB migration.
- Autoplay invitation audio on page load without a user gesture.
- Reintroduce `src/middleware.ts`; use `src/proxy.ts` for the admin edge gate.
