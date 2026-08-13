# Go-live checklist

Operational checklist before sharing invitation links widely. Does not authorize new product features — see `docs/current-phase.md`.

## Environments

- [ ] Latest SQL migrations applied on remote Supabase (including boarding, family RPCs, guest media, and **`guest_gender`** / `p_guest_genders`).
- [ ] Vercel env vars set: `NEXT_PUBLIC_*`, `SUPABASE_SERVICE_ROLE_KEY`, admin emails.
- [ ] Optional: `TZ=America/Bogota` on Vercel (display helpers already pin Colombia TZ).
- [ ] `NEXT_PUBLIC_APP_URL` matches the public domain.
- [ ] Admin allowlist emails exist as Supabase Auth users.

## Smoke — admin

- [ ] `/admin/login` with allowlisted account.
- [ ] Create a test family with 2 guests (**nombre + género** each) and copy `/i/[slug]` (atomic create — no orphan family without guests).
- [ ] Create or edit a **single-guest** family and confirm cover shows Querido/Querida correctly.
- [ ] Edit an existing family (rename guest, change gender/seats, toggle enabled) and confirm no partial state.
- [ ] Regenerate slug if needed; old slug should stop resolving.
- [ ] Dashboard / analytics / guests / photos pages load without errors.

## Smoke — public invitation

- [ ] Cover greeting matches guest count (1 / 2 / 3+).
- [ ] Cover shows `Portada.jpg`; CTA opens `/invitacion`.
- [ ] Music starts only after CTA (if `soundtrack.mp3` present and `features.music`).
- [ ] Venue map embed + Google / Waze links work; Apple Maps only on Apple devices.
- [ ] Dress “Ver Inspiración” opens `/inspiracion/ellos` or `/inspiracion/ellas`.
- [ ] Gallery, dress code, transport, gifts look correct on a real phone (WhatsApp in-app browser).

## Smoke — RSVP

- [ ] Confirm attendance for one guest without bus.
- [ ] Confirm with bus + boarding point (`modelia` or `villa_sonia`).
- [ ] Attempt bus without boarding point → client/server rejection.
- [ ] Update previous RSVP; counts refresh in admin.
- [ ] Decline attendance path works.
- [ ] After RSVP deadline (or with RSVP closed), form shows closed state and rejects submit.

## Hardening checks (local / CI)

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Out of scope for this checklist

- Resend email (tracked as future work). Excel export and guest media uploads are available in admin.
- Distributed (Redis) rate limiting — in-app limiter is best-effort per isolate; prefer Cloudflare for global edge.
- Bus departure times toward Subachoque still “por confirmar” until product provides them.
- Hosted Supabase Storage global limit ≥3 GiB for guest videos (see `docs/guest-media-storage.md`).
- Backfill `guests.gender` for families created before the gender migration.