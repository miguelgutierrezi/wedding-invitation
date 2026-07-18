# Current phase: RSVP Flow

**Status:** completed

**Last reviewed:** 2026-07-18

**Authorized scope:** only the work listed in this document

## Objective

Wire personalized invitation links to Supabase and allow families to submit or update an RSVP through a validated server mutation.

Do not implement the administration panel, admin authentication UI, email delivery, design-system invitation sections beyond what the RSVP page needs, or remote Supabase provisioning.

## Approved behavior

1. Resolve invitations by hashing the URL token (SHA-256) and looking up `families.invitation_token_hash` with the service-role server client.
2. Invalid, unknown, and disabled invitations return the same not-found experience.
3. Validate RSVP open state and deadline from the related `events` row.
4. Validate guest membership, capacity (`maximum_guests`), and input with Zod on the server.
5. Persist one `rsvp_responses` row per family (upsert in place), sync `rsvp_response_guests`, mirror `guests.attendance_status`, set family `status` to `responded`, and write an audit event.
6. Prefer a single database transaction (SQL function) for the mutation.
7. Do not log raw tokens, secrets, or full contact/dietary payloads.

## Checklist

- [x] Authorize this phase in `docs/current-phase.md`.
- [x] Add token hashing helper and invitation lookup service.
- [x] Add Zod RSVP schemas and a Server Action for submit/update.
- [x] Add an atomic SQL mutation (migration) invoked by the server.
- [x] Replace the mock `/i/[token]` page with Supabase-backed invitation + RSVP UI.
- [x] Record `last_opened_at` when an invitation is opened successfully.
- [x] Update README with local RSVP test tokens/routes as needed.
- [x] Run `pnpm lint`, `pnpm typecheck`, and `pnpm build`.

## Completion report

### Files created

- `supabase/migrations/20260718215030_submit_family_rsvp.sql`
- `src/lib/security/invitation-token.ts`
- `src/lib/validation/rsvp.ts`
- `src/services/invitations/get-invitation-by-token.ts`
- `src/services/rsvp/submit-family-rsvp.ts`
- `src/actions/rsvp/submit-rsvp.ts`
- `src/components/rsvp/rsvp-form.tsx`
- `src/app/i/[token]/not-found.tsx`

### Files modified

- `docs/current-phase.md`
- `README.md`
- `src/app/i/[token]/page.tsx`
- `src/app/page.tsx`

### Important technical decisions

- Invitation reads and RSVP writes use the service-role admin client while RLS remains deny-by-default for anon/authenticated.
- Mutation is atomic via `public.submit_family_rsvp(...)`.
- Client validation uses React Hook Form + Zod; server re-validates with the same schema.
- Honeypot field `website` rejects bot-like submissions.
- Unknown/disabled tokens share the same `not-found` page.

### Commands executed

```bash
supabase migration up
pnpm lint
pnpm typecheck
pnpm build
```

### Validation results

- `pnpm lint`: passed
- `pnpm typecheck`: passed
- `pnpm build`: passed
- SQL RPC smoke test for `dev-family-demo`: passed
- HTTP: `/i/dev-family-demo` and `/i/dev-family-ejemplo` → 200; invalid token → 404

### Known limitations

- No admin panel to create families or copy links yet.
- No rate limiting beyond honeypot.
- Presentation still uses event data from the database for RSVP gating, while the public landing still relies on `weddingConfig` placeholders.
- Remote Supabase is not wired; local `.env.local` must point at `supabase status` keys.

### Recommended next phase

**Admin panel** (login + families/guests management + copy invitation links), or **Design System / public invitation sections** if visual polish is the priority before operations tooling.
