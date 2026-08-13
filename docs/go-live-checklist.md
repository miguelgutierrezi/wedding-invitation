# Go-live checklist

Operational checklist before sharing invitation links widely. Does not authorize new product features — see `docs/current-phase.md`.

## Environments

- [ ] Latest SQL migrations applied on remote Supabase (including boarding, `update_family_with_guests`, and `create_family_with_guests`).
- [ ] Vercel env vars set: `NEXT_PUBLIC_*`, `SUPABASE_SERVICE_ROLE_KEY`, admin emails.
- [ ] `NEXT_PUBLIC_APP_URL` matches the public domain.
- [ ] Admin allowlist emails exist as Supabase Auth users.

## Smoke — admin

- [ ] `/admin/login` with allowlisted account.
- [ ] Create a test family with 2 guests and copy `/i/[slug]` (atomic create — no orphan family without guests).
- [ ] Edit an existing family (rename guest, change seats, toggle enabled) and confirm no partial state.
- [ ] Regenerate slug if needed; old slug should stop resolving.
- [ ] Dashboard / analytics / guests pages load without errors.

## Smoke — public invitation

- [ ] Cover shows `Portada.jpg`; CTA opens `/invitacion`.
- [ ] Music starts only after CTA (if `soundtrack.mp3` present and `features.music`).
- [ ] Venue map embed + Google / Waze links work; Apple Maps only on Apple devices.
- [ ] Gallery, dress code, transport copy look correct on a real phone (WhatsApp in-app browser).

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

- CSV export, Resend email (tracked as future work).
- Distributed (Redis) rate limiting — in-app limiter is best-effort per isolate; prefer Cloudflare for global edge.
- Dress inspiration URLs and bus departure times still “por confirmar” until product provides them.
