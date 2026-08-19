# Architecture

**Status:** Guest Media Uploads complete; invitation polish (cover greeting + guest gender) documented

**Last reviewed:** 2026-08-12

This document describes the intended technical architecture and its boundaries. It does not authorize implementation beyond `current-phase.md`.

## System context

The product is a single full-stack Next.js application for approximately 90 wedding guests. It serves a public invitation, personalized family invitation links, RSVP mutations, and an authenticated administration area.

```text
Guest or administrator
        |
        v
Cloudflare DNS
        |
        v
Vercel / Next.js
  - Server Components
  - Client Components
  - Server Actions
  - Route Handlers
        |
        v
Supabase
  - PostgreSQL
  - Auth
  - Row Level Security
  - Storage when needed
```

During local development, Next.js runs directly with pnpm. Supabase runs through Docker and Supabase CLI. Next.js must not be placed in a development Docker container without a documented reason.

## Application boundaries

Use one Next.js repository and deployment. Do not introduce a separate backend, microservices, an ORM, a global client state library, or additional infrastructure without a demonstrated need and explicit approval.

Use:

- Server Components for rendering and server-side reads by default.
- Small Client Components only for forms, countdown, gallery carousel, music control / open CTA, venue platform links, and other browser interaction.
- Server Actions for application-owned mutations when they provide a clear typed workflow.
- Route Handlers for HTTP endpoints such as exports or integrations.
- Plain TypeScript services for business rules that should not live in presentation components.
- Zod at every untrusted server boundary.

## Route direction

```text
/                      public landing (as implemented)
/i/[slug]              personalized invitation cover (greeting by guest count / gender)
/i/[slug]/invitacion   full invitation + embedded RSVP
/i/[slug]/fotos        guest media upload (family-bound)
/fotos?code=…          guest media upload (event QR)
/inspiracion/ellos     outfit inspiration (men)
/inspiracion/ellas     outfit inspiration (women)
/admin/login           administrator sign-in
/admin                 dashboard (summary metrics)
/admin/analytics       rates + transport boarding breakdown
/admin/guests          per-guest listing
/admin/families        family list
/admin/families/new    create family + invitation link
/admin/families/[id]   family detail / edit
/admin/photos          guest media moderation + QR URL
/api/admin/export      Excel export
/api/...               HTTP endpoints only when appropriate
```

Public invitation presentation details live in `docs/invitation-ui.md`. Admin presentation tokens live in `src/components/admin/admin-ui.ts` (same brand palette/fonts as the invitation). Do not treat product roadmap sections as authorization to implement unfinished work.

## Configuration

Stable event presentation data belongs in `src/config/wedding.ts` until a future phase explicitly moves editable settings into the database. Components should receive data via props or import the centralized configuration; they should not scatter event copy, asset paths, or brand colors across the UI.

- **Couple display names** (presentation): `weddingConfig.couple.partnerOne` / `partnerTwo` → **Nychol** & **Miguel**.
- **Event partner names** (DB): updated via migration so invitation load from `events` matches; keep config and DB aligned when changing names.
- **Event timezone:** Colombia `America/Bogota` (UTC−5, no DST). Format invitation/admin/export labels with `src/lib/datetime/event-timezone.ts`, not the Vercel host TZ. Optional process pin: `TZ=America/Bogota` (see `.env.example`).
- **Transport boarding point ids**: `weddingConfig.transport.meetingPoints[].id` must match `src/config/transport.ts` (`TRANSPORT_BOARDING_POINT_IDS`) and the SQL check constraint / RPC (`modelia`, `villa_sonia`).
- **Guest gender:** `guests.gender` (`male` \| `female` \| `unspecified`, nullable for legacy rows). Required on admin create/update. Singular cover greeting uses Querido / Querida / Hola.
- **Placeholder plus-ones:** `guests.needs_name_confirmation`. Names like “Acompañante” are backfilled as unspecified + flag; RSVP must send a real `full_name`.

Asset paths under `public/invitation/` are listed in `weddingConfig.assets` and documented in `docs/invitation-ui.md`.

Ceremony maps URLs live on `weddingConfig.ceremony` (`mapsUrl`, `wazeUrl`, `appleMapsUrl`, `mapsEmbedUrl`). Empty strings disable the corresponding CTA or embed. Do not invent private logistics (e.g. bus departure times still “por confirmar”). Outfit inspiration routes are implemented under `/inspiracion/*`.

## Presentation layer

- Invitation sections are independent components under `src/components/invitation/`.
- Page composition: `invitation-page-view.tsx`.
- Cover greeting: `formatCoverGreeting` (`src/lib/invitation/cover-greeting.ts`) — 1 guest Querido/Querida/Hola by gender, 2 guests Queridos A y B, 3+ Querida + family display name.
- Gallery uses a dual-buffer strategy (preload next slide, then swipe) to avoid flash between photos.
- Venue directions: optional map iframe + external navigation links (`venue-map-links.tsx`); Apple Maps only when `isApplePlatform()` is true.
- Music: module singleton `src/lib/invitation-audio.ts`; start after cover “Ver Invitación” gesture; floating mute on the invitation body. Controlled by `features.music` + `assets.music`.
- RSVP form is embedded in the invitation (cream band); it is not a separate navigation-only CTA page.
- Cap multi-column invitation layouts on ultra-wide viewports so copy and CTAs stay visually grouped.
- Admin chrome reuses invitation brand (accent header, cream page, Times/olive type).
- Admin family/guest lists filter in memory, show active-filter chips, sort by column, and paginate at 25 rows. Query string (`q`, filters, `sort`, `dir`, `page`) is updated with `history.replaceState`. SQL push-down can wait until a commercial install outgrows a few hundred guests.

## Edge proxy (admin auth)

Next.js 16 uses the **proxy** file convention (replaces deprecated `middleware`).

```text
src/proxy.ts
```

Responsibilities:

- Refresh Supabase auth cookies on matched requests via `@supabase/ssr` `createServerClient`.
- Redirect unauthenticated users away from `/admin/*` (except `/admin/login`) to login with a `next` return path.
- Redirect already-authenticated users away from `/admin/login` to `/admin`.

Matcher: `/admin/:path*` and `/api/admin/:path*`. Do not put invitation public routes through this gate.

## Testing

Unit tests use **Vitest** (`pnpm test`). Prefer fast tests of Zod schemas and pure helpers over UI or full Next.js bootstrapping.

Current coverage targets:

- `submitRsvpSchema` (boarding, honeypot, attendance rules, slug/email).
- Transport boarding id sync with `weddingConfig`.
- Invitation slug helpers.
- In-memory rate limiter + `serverLog` PII stripping.
- Admin `updateFamily` / `createFamily` RPC error mapping.
- Cover greeting helper (`formatCoverGreeting`).
- Placeholder companion names (`isPlaceholderGuestName`).
- Event timezone helpers.
- Outfit inspiration route helpers.
- Guest media MIME/size policy, object keys, status transitions, queue retry helpers.

## Guest media uploads

- Private Storage bucket `guest-media` (see `docs/guest-media-storage.md`).
- Metadata table `guest_media_uploads` + QR access `event_guest_media_access`.
- Browser uploads directly via signed URL / TUS (`tus-js-client`); Vercel never receives media bytes.
- Provider port `MediaStorageProvider` isolates Supabase so objects can later move to R2/S3.
- Soft quotas (session / IP) and authorize rate limits; durable global rate limiting remains a future enhancement.

Integration tests against live Supabase / RPC are optional and must not require secrets in CI. Operational confidence also comes from `docs/go-live-checklist.md`.

## Observability and abuse controls

- **Structured logs:** `src/lib/logging/server-log.ts` emits one JSON object per line. Do not log emails, phones, dietary text, messages, or raw invitation tokens/slugs (use `fingerprintPublicId` when correlation is needed).
- **RSVP action:** logs validation failures, honeypot hits, rate limits, success, and sanitized failure codes.
- **Admin mutations:** `createFamily` / `updateFamily` / slug regen and admin auth actions emit `serverLog` events (`admin_family_*`, `admin_sign_in_*`) without emails or guest names.
- **Invitation lookup:** rate-limited per IP; misses log `invitation_lookup_miss` with slug fingerprint only.
- **Rate limit:** `src/lib/security/rate-limit.ts` + `src/config/rate-limit.ts`. In-memory / per-isolate — complement with Cloudflare WAF for global protection. Budgets are intentionally generous for WhatsApp retries.

## Supabase access

Maintain three explicit client entry points:

```text
src/lib/supabase/client.ts  browser, anonymous public credentials
src/lib/supabase/server.ts  cookie-aware server client
src/lib/supabase/admin.ts   privileged service-role client, server-only
```

The admin client is an escape hatch for narrowly scoped privileged operations, not the default data-access path. Never expose or log the service-role key. Browser code may access only `NEXT_PUBLIC_` variables.

## Data model direction

The expected domain entities are:

- `events`
- `families`
- `guests`
- `rsvp_responses`
- `rsvp_response_guests`
- `audit_events`
- `guest_media_uploads`
- `event_guest_media_access`

Approved decisions:

- **Events:** multiple events are allowed via `event_id` foreign keys for reuse. Product v1 typically uses one event row; the database does not enforce a singleton.
- **Attendance source of truth:** the latest `rsvp_responses` / `rsvp_response_guests` rows are authoritative after submission. `guests.attendance_status` (and denormalized transport fields) is a mirror for admin listing.
- **Guest contact:** the RSVP form still collects one family phone (required) and optional email. On submit, `submit_family_rsvp` copies that contact onto every `guests.email` / `guests.phone` in the family (optional per-guest JSON `email`/`phone` overrides). `rsvp_responses.contact_*` remains the family-level submission. Existing RSVPs are backfilled in `…_guest_contact_from_rsvp.sql`.
- **RSVP persistence:** one `rsvp_responses` row per family (`unique(family_id)`), updated in place. Guest answers live in `rsvp_response_guests`.
- **Admin family create:** `create_family_with_guests` RPC inserts the family row, guests (names + genders), and audit event in one transaction (service-role only).
- **Admin family update:** `update_family_with_guests` RPC updates the family row, syncs guests (names + genders) **by guest id** when `p_guest_ids` is provided, and writes an audit event in one transaction (service-role only).
- **Guest gender:** `guests.gender` text nullable with check `male` \| `female` \| `unspecified`. Admin Zod + RPC require a gender array aligned with guest names (`p_guest_genders`) and, on update, guest ids (`p_guest_ids`).
- **Companion names:** `needs_name_confirmation` plus `is_placeholder_guest_name()`; RSVP RPC `submit_family_rsvp` accepts `full_name` only when the flag is set.
- **Transport:**
  - `needs_transport` (boolean) on guest / rsvp_response_guest.
  - `transport_boarding_point` text nullable; allowed values `modelia` \| `villa_sonia`; **required server-side when** the guest is attending and needs transport.
- **Idempotency / concurrency:** application mutations upsert the single family response inside one transaction via RPC `submit_family_rsvp`.
- **Public family key:** `invitation_slug` on `families` for `/i/[slug]` URLs. Token hash/preview remain for security design; do not put sequential DB ids in public routes.
- **Tokens:** store SHA-256 `invitation_token_hash` plus a short `invitation_token_preview`. Never store the raw token. Revoke with `is_enabled` / `status`. No token expiry column in v1.
- **RLS:** enabled on all domain tables with deny-by-default for `anon` and `authenticated`. Privileged domain CRUD after admin auth uses the service-role server client.

Every schema change must be a SQL migration. Seed data uses fictional **families/guests**; couple names in the seed event row are the real product names (Nychol & Miguel).

Relevant migrations include:

```text
…_initial_domain_schema.sql
…_submit_family_rsvp.sql
…_rsvp_needs_transport.sql
…_invitation_slug.sql
…_couple_names_and_transport_boarding.sql
…_update_family_with_guests.sql
…_create_family_with_guests.sql
…_guest_media_uploads.sql
…_guest_gender.sql          # guests.gender + RPC p_guest_genders
…_guest_gender_unspecified.sql
…_placeholder_companion_names.sql
…_update_family_guests_by_id.sql
…_guest_contact_from_rsvp.sql
```

## Invitation token / slug boundary

Public invitation routes key off the **slug**. Production security expectations still include opaque non-guessable identifiers and hashed secrets where tokens are used. Behavior should:

1. Generate sufficient random entropy on the server when regenerating tokens if the product still mints them.
2. Prefer slug URLs for sharing (`/i/familia-ejemplo`).
3. Store a one-way hash and a short non-sensitive preview when tokens are generated.
4. Return indistinguishable not-found behavior for invalid, disabled, and unknown invitations where appropriate.

Do not place internal family or guest IDs in public URLs. Guest UUIDs may appear only in authenticated/mutation payloads already tied to a validated invitation server-side.

## RSVP consistency and security

The server mutation (`submit_family_rsvp`) must validate, within one consistent operation:

- Invitation slug validity and family status.
- RSVP open state and deadline using the event timezone.
- Guest membership in the family (exact set of guests).
- Maximum guest capacity.
- Allowed attendance states and input lengths.
- `needs_transport` only when the guest (and family) will attend.
- **Valid `transport_boarding_point` when transport is requested**; clear boarding point when transport is not requested.
- Duplicate or concurrent submission behavior (upsert family response).

Client validation (Zod + RHF) improves usability but is never an authorization boundary. Rate limiting and a honeypot should remain enabled where implemented before public production use. CAPTCHA is deferred unless abuse justifies it.

## Authentication and authorization

Guests do not create accounts; their invitation link grants narrowly scoped access to their family invitation workflow. Administrators authenticate through Supabase Auth.

RLS remains deny-by-default for anon/authenticated on domain tables. Admin pages require server-side authorization after a signed-in allowlisted user; hiding navigation in the client is not access control.

Fixed allowlist: `src/config/admin.ts`. Optional extras: `ADMIN_EMAIL` / `ADMIN_EMAILS`.

## UI and delivery constraints

The UI is mobile-first and must work in current Safari, Chrome, Edge, and WhatsApp's embedded browser. Preserve:

- Touch targets of at least 44 by 44 pixels.
- Keyboard access, visible focus, semantic markup, and adequate contrast.
- iPhone safe areas and mobile viewport behavior.
- `prefers-reduced-motion`.
- Static invitation images under `/public/invitation/` (often `unoptimized` when paths are fixed brand assets).
- No **autoplay-without-gesture** audio, heavy background video, or essential interaction dependent on animation. Invitation music may start only after an explicit tap (cover CTA) when `features.music` is enabled.

Invitation brand tokens and section behavior: `docs/invitation-ui.md`.

## Observability and privacy

Do not log invitation tokens, environment secrets, dietary details, contact details, or full mutation payloads. Audit events should record useful actions without copying unnecessary personal data into metadata.

Application logs use `serverLog` (JSON). Correlate public requests with `slugFp` from `fingerprintPublicId`, never the raw slug in warn/error paths when avoidable. Prefer Cloudflare WAF alongside the in-app rate limiter for production edge abuse.

Store only information required to manage the invitation. Do not collect identity documents or unrelated sensitive data.

## Deployment direction

The intended production path is GitHub private repository to Vercel, backed by a remote Supabase project and a domain managed through Cloudflare. CI runs lint/typecheck/test/build on every PR/push to main; Supabase migrations run only when migration files change (or manually).

Production go-live checklists require their own authorized phase when not already done.

## Architectural decision policy

Prefer the simplest reversible design that meets the current phase. Document meaningful deviations here or in `docs/invitation-ui.md` when the decision is presentation-specific. A future possibility is not sufficient reason to add an abstraction now.
