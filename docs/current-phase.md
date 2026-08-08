# Current phase

**Status:** content + transport boarding phase completed; no new implementation authorized until this file is updated again

**Last reviewed:** 2026-08-08

**Authorized scope:** Do not start a new implementation phase until this file is updated. Recommended next work is listed below.

## Snapshot of the repository

| Area | State |
|------|--------|
| Public invitation UI (`/i/[slug]`) | Aligned with Figma “Invitación boda”; mobile-first |
| Couple names | **Nychol** & **Miguel** in `weddingConfig` and `events` (migration) |
| Presentation config | `src/config/wedding.ts` + assets under `public/invitation/` |
| Design tokens (invitation) | `docs/invitation-ui.md` + `src/app/globals.css` |
| Design tokens (admin) | Same brand; shared classes in `src/components/admin/admin-ui.ts` |
| RSVP | Embedded form: attendance, bus opt-in, **boarding point**, diet, contact |
| Admin panel (`/admin`) | Auth, dashboard, analytics, guests, families CRUD, invitation links |
| CSV export / Resend | Not implemented |

## Completed: couple names + transport boarding (2026-08)

### Objective

Set confirmed couple display names and collect **which bus meeting point** each attending guest will use when they opt into transport.

### Delivered

1. **Names** — `partnerOne: "Nychol"`, `partnerTwo: "Miguel"` in `src/config/wedding.ts`; seed + SQL migration update `events.partner_*` / event display name.
2. **Meeting point ids** on transport config: `modelia`, `villa_sonia` (must match DB check + RPC).
3. **Schema** — nullable `transport_boarding_point` on `guests` and `rsvp_response_guests`; valid values `modelia` \| `villa_sonia`.
4. **RPC** — `submit_family_rsvp` requires a valid boarding point when `needs_transport` is true for an attending guest (`TRANSPORT_BOARDING_REQUIRED`).
5. **Validation** — Zod in `src/lib/validation/rsvp.ts` + helpers in `src/config/transport.ts`.
6. **RSVP form** — after “Usará el transporte (bus)”, radios for both meeting points.
7. **Admin** — guests table column “Punto de salida”; family detail shows bus + point; analytics section “Cupos de bus por punto de encuentro”.

### Migration

```text
supabase/migrations/20260808120000_couple_names_and_transport_boarding.sql
```

Apply with `supabase db reset` (local) or `supabase db push` / CI migration workflow (remote). **Code expects this migration applied** or RSVP submit will fail.

### Key paths

```text
src/config/wedding.ts
src/config/transport.ts
src/lib/validation/rsvp.ts
src/components/rsvp/rsvp-form.tsx
src/services/rsvp/submit-family-rsvp.ts
src/services/admin/analytics.ts
src/app/admin/analytics/page.tsx
src/app/admin/guests/page.tsx
src/app/admin/families/[id]/page.tsx
supabase/migrations/20260808120000_couple_names_and_transport_boarding.sql
```

## Completed earlier: invitation design polish

### Delivered sections

1. Cover — full-bleed photo, names, times, CTA “Ver Invitación”.
2. Hero — couple photo, tagline, date chip.
3. Countdown — cream band, Times numbers/labels.
4. Venue — photo band, place/time, “Ver Ubicación” (capped width on large screens).
5. Transport — accent band, meeting points, chiva art.
6. Couple photo — full-width crop image.
7. Dress code — cream board, ELLOS \| photo \| ELLAS, palettes.
8. Gallery — dual-buffer carousel, swipe, 1 photo mobile / 2 desktop.
9. Gifts — accent band, “Lluvia de sobres”.
10. RSVP — cream band + embedded form.
11. Footer / closing — photo band, cream Times message + date.

### Design rules locked in

- Brand yellow `#BEB950` (`accent`), cream Figma `#F5F5DC`, olive text `#454411` (`cover-cta-fg`).
- Invitation section type: Times (`--font-timer`); admin reuses the same brand tokens.
- Gallery: exclude Boda 3, 8, 10, 15, 22 from main order; 10+15 first pair; 23 in former 8 slot.
- Prefer `object-contain` for dress-code and transport illustrations when cover would crop subjects.

Detail: **`docs/invitation-ui.md`**.

## Completed earlier: admin panel

- Supabase Auth + email allowlist (`src/config/admin.ts` + optional env extras).
- Routes: login, dashboard, analytics, guests, families list/new/detail.
- Family invitation slug URLs (`/i/[slug]`), generate/copy link, regenerate slug.
- Visual language aligned with invitation (header accent, cream page, Times/olive forms) via `admin-ui.ts`.

Residual optional: smoke test in production with allowlisted admin + first real family.

## Out of scope (until a new phase authorizes them)

- CSV export and advanced filters
- Email / Resend notifications
- `/admin/settings` event editor in UI
- Multi-role admin ACL beyond email allowlist
- Maps / inspiration / dress inspiration URLs still empty until product provides them
- Confirmed ceremony departure times still “por confirmar” in transport config until known

## Recommended next steps (pick one and authorize)

1. **Production content** — maps URLs, inspiration links, confirm ceremony/bus departure times.
2. **CSV export** for attendance, bus seats, and boarding-point breakdown.
3. **Production smoke** — apply migrations remotely, admin login, create family, end-to-end RSVP with bus + point.
4. **Apply migration** on any environment that still lacks `transport_boarding_point` / couple name update.

## Important technical decisions

- Auth gate uses cookie-aware server client; privileged CRUD uses `createAdminClient()` only after the gate.
- Public invitation path uses **slug** (`invitation_slug`); token hash remains for security/audit as designed.
- Invitation raw tokens are not persisted; hash + preview only where used.
- Copy/media: `weddingConfig`; transport boarding **ids** must stay in sync with DB check (`modelia`, `villa_sonia`) and `src/config/transport.ts`.
- Dual-buffer gallery promotes slides only when ready, then swipe-animating.

## Known limitations

- Guest delete may fail if RSVP response rows still reference the guest.
- Event metadata is not editable in admin UI (row comes from seed/migrations).
- Middleware deprecation warning in Next.js 16 (`middleware` → future `proxy`); still functional.
- Inspiration URLs and maps may still be empty strings until provided.
- Environments without the latest migration cannot save RSVPs that request bus transport correctly.
