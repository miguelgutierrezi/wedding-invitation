# Current phase

**Status:** hardening follow-up **completed** (`createFamily` transactional + admin structured logging); no new implementation authorized until this file is updated again

**Last reviewed:** 2026-08-12

**Authorized scope:** Do not start a new implementation phase until this file is updated.

## Snapshot of the repository

| Area | State |
|------|--------|
| Public invitation UI | Implemented |
| RSVP | Bus + boarding; Zod + RPC; rate limit + structured logs |
| Admin family create | Transactional RPC `create_family_with_guests` |
| Admin family update | Transactional RPC `update_family_with_guests` |
| Admin observability | `serverLog` on create/update/slug regen + auth actions |
| Rate limit | In-memory best-effort (RSVP + invitation lookup) |
| Automated tests | Vitest including admin RPC error maps |
| Go-live checklist | `docs/go-live-checklist.md` |
| CSV / Resend | Not implemented |

## Completed: hardening — createFamily + admin logs (2026-08-12)

### Objective

Close the last multi-step admin write path and align operational logging with RSVP.

### Delivered

1. SQL RPC `public.create_family_with_guests` — insert family + guests + audit in one transaction (`service_role` only).
2. `createFamily` in `families.ts` allocates a unique slug in TS, then calls the RPC.
3. Shared error mapping: `src/services/admin/admin-family-rpc-errors.ts` (create + update).
4. Structured logs for admin create/update/slug regen and sign-in/sign-out (no PII/emails).
5. Migration: `supabase/migrations/20260813090000_create_family_with_guests.sql`.

### Apply migration

```bash
supabase db reset   # local
# or supabase db push / CI migrate workflow for remote
```

### Key paths

```text
supabase/migrations/20260813090000_create_family_with_guests.sql
src/services/admin/families.ts
src/services/admin/admin-family-rpc-errors.ts
src/actions/admin/auth.ts
```

## Prior hardening (still in effect)

- Vitest + CI tests; go-live checklist.
- `update_family_with_guests`.
- RSVP rate limit + structured logging.
- Invitation lookup rate limit.

## Out of scope

- CSV / Resend / settings UI
- Distributed Redis rate limit
- Dress inspiration URLs / bus departure times

## Recommended next steps

1. Apply `create_family_with_guests` (+ prior admin RPC) on remote Supabase.
2. Run `docs/go-live-checklist.md`.
3. Product content / CSV when needed.

## Known limitations

- In-app rate limit remains per Vercel isolate.
- Slug uniqueness allocation for create/update still runs in TypeScript before the RPC (race → `SLUG_IN_USE`).
