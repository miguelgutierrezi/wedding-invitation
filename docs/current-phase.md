# Current phase

**Status:** hardening phase **completed** for authorized slices (tests, transactional `updateFamily`, rate limit + structured logging); no new implementation authorized until this file is updated again

**Last reviewed:** 2026-08-11

**Authorized scope:** Do not start a new implementation phase until this file is updated. Remaining optional hardening (global Redis rate limit, transactional `createFamily`) is listed below but not authorized.

## Snapshot of the repository

| Area | State |
|------|--------|
| Public invitation UI (`/i/[slug]`) | Aligned with Figma; mobile-first |
| Couple names | **Nychol** & **Miguel** |
| RSVP | Bus + boarding; Zod + RPC |
| Admin family update | Transactional RPC `update_family_with_guests` |
| Rate limit | In-memory best-effort on RSVP + invitation lookup |
| Logging | Structured JSON server logs without PII |
| Automated tests | Vitest (RSVP, transport, slug, RPC errors, rate limit, logger) |
| Go-live checklist | `docs/go-live-checklist.md` |
| CSV / Resend | Not implemented |

## Completed: hardening — rate limit + logging (2026-08-11)

### Objective

Slow bursty abuse on public invitation/RSVP and improve operability of failures without logging personal data.

### Delivered

1. **Rate limit** — `src/lib/security/rate-limit.ts` sliding window; budgets in `src/config/rate-limit.ts`.
2. **Public gates** — `assertRsvpRateLimit` on `submitRsvpAction`; `allowInvitationLookup` inside `getInvitationBySlug` (limited → same as not-found).
3. **Client IP** — `getRequestClientIp` from proxy headers (`x-forwarded-for` / CF / `x-real-ip`).
4. **Logging** — `serverLog` JSON lines; slug fingerprint via `fingerprintPublicId`; events for validation, honeypot, rate limit, submit ok/fail, invitation miss.
5. **Tests** — rate-limit + serverLog unit tests.

### Limits (defaults)

| Gate | Budget |
|------|--------|
| RSVP submit / IP | 12 / 15 min |
| Invitation lookup / IP | 120 / 5 min |

### Caveat

In-memory maps are **per server isolate**. On multi-instance Vercel this is best-effort; keep Cloudflare (or similar) as the global edge control.

### Key paths

```text
src/config/rate-limit.ts
src/lib/security/rate-limit.ts
src/lib/security/client-ip.ts
src/lib/security/public-rate-limit.ts
src/lib/logging/server-log.ts
src/lib/logging/fingerprint.ts
src/actions/rsvp/submit-rsvp.ts
src/services/invitations/get-invitation-by-token.ts
```

## Completed: hardening — transactional updateFamily (2026-08-11)

RPC `update_family_with_guests`; migration `20260812010000_update_family_with_guests.sql`. Apply on all environments.

## Completed: hardening — tests (2026-08-11)

Vitest + CI `pnpm test` + `docs/go-live-checklist.md`.

## Out of scope (until a new phase authorizes them)

- CSV export and advanced filters
- Email / Resend notifications
- `/admin/settings` event editor in UI
- Multi-role admin ACL beyond email allowlist
- Distributed rate limit (Redis / Upstash)
- Transactional `createFamily`
- Dress inspiration URLs / confirmed bus departure times

## Recommended next steps

1. Apply pending migrations remotely (`update_family_with_guests` + boarding if needed).
2. Run `docs/go-live-checklist.md` on staging/production.
3. Confirm Cloudflare rate/WAF rules if desired for global edge.
4. Soundtrack asset / CSV when product asks.

## Important technical decisions

- Auth gate: `src/proxy.ts`.
- Admin family edits: RPC transactional.
- Public abuse controls: in-app rate limit + honeypot + structured logs (no PII).
- Boarding ids: `wedding.ts` ↔ `transport.ts` ↔ Zod ↔ SQL.

## Known limitations

- Rate limit is not global across all Vercel isolates.
- `createFamily` still multi-step.
- Invitation miss logs use slug fingerprints only (enumeration still returns identical not-found UX).
- Soundtrack / inspiration / bus departure times may still be incomplete.
