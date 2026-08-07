# Current phase: Invitation UI

**Status:** in progress

**Last reviewed:** 2026-08-06

**Authorized scope:** only the work listed in this document

## Objective

Implement the public invitation presentation for `/i/[token]` based on the approved Canva designs: personalized cover gate, scrollable invitation sections, mobile-first responsive layout, and integration of the existing RSVP form.

Do not implement the administration panel, admin authentication UI, email delivery, CSV export, remote Supabase provisioning, or rate limiting beyond what already exists.

## Approved behavior

1. Keep invitation resolution and RSVP mutation from the completed RSVP Flow phase.
2. Present a full-viewport cover with personalized greeting (`display_name`) and a “Ver Invitación” action that reveals the invitation content.
3. Render invitation sections from centralized presentation config (`src/config/wedding.ts`), not hard-coded strings in components.
4. Use the event date from the invitation payload for the countdown and RSVP gating; use presentation config for venue copy, transport, dress code, gifts, and decorative assets.
5. Mobile-first layout that scales cleanly on tablet/desktop without a fixed phone frame.
6. Preserve accessibility baselines: legible contrast, `prefers-reduced-motion`, touch targets ≥ 44px, safe areas where relevant.
7. Do not log raw tokens, secrets, or full contact/dietary payloads.
8. Do not invent additional real wedding data beyond what is already in config/design placeholders; final production photography and confirmed copy may arrive later as assets.

## Checklist

- [x] Authorize this phase in `docs/current-phase.md`.
- [x] Expand `weddingConfig` with presentation data for invitation sections.
- [x] Establish design tokens (colors, fonts, section rhythm) aligned with the Canva palette.
- [x] Build invitation cover (gate) with personalized greeting and CTA.
- [x] Scaffold invitation sections: hero, countdown, venue, transport, photo, dress code, gallery, gifts, RSVP, footer.
- [x] Wire existing `RsvpForm` into the invitation RSVP section.
- [x] Update README with the new phase status and any local preview notes.
- [x] Run `pnpm lint`, `pnpm typecheck`, and `pnpm build`.
- [ ] Drop in final images/icons from Canva exports under `public/invitation/`.
- [ ] Refine section spacing, torn-paper transitions, and desktop polish after assets arrive.

## Out of scope

- Admin panel (`/admin`)
- Invitation email delivery
- CSV export
- Production deployment
- Changing RSVP server rules, schema, or token security

## Important technical decisions

- Presentation copy lives in `src/config/wedding.ts`; family-specific data still comes from Supabase via the token lookup.
- Missing media uses intentional CSS placeholders so the layout can ship without binary assets.
- Countdown is a small Client Component; the rest of the invitation remains Server Components where possible.
- Cover “open” interaction is client-side scroll/reveal only; no extra API.

## Recommended next step after completion

Admin panel (login + families/guests + copy invitation links), or production asset pass + remote Supabase/Vercel hardening.

## Completion report

_Pending phase completion._
