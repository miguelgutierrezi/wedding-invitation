# Current phase: Supabase Schema

**Status:** completed

**Last reviewed:** 2026-07-18

**Authorized scope:** only the work listed in this document

## Objective

Version the initial domain database schema for the wedding invitation app using SQL migrations, Row Level Security, and fictional seed data.

Do not implement RSVP mutations, invitation token resolution in the Next.js UI, admin authentication, email delivery, or remote Supabase provisioning in this phase.

## Approved schema decisions

These decisions close the open questions in `docs/architecture.md` for this phase:

1. **Events:** the schema supports multiple events via `event_id` foreign keys for reuse. Product v1 will typically use a single event row; the database does not enforce a singleton.
2. **Attendance source of truth:** the latest `rsvp_responses` / `rsvp_response_guests` rows are authoritative for a submitted RSVP. `guests.attendance_status` is a denormalized mirror for admin listing and starts as `pending`.
3. **RSVP persistence:** one `rsvp_responses` row per family (`unique(family_id)`), updated in place. Guest lines live in `rsvp_response_guests` and are replaced or updated as part of a later application transaction.
4. **Tokens:** store `invitation_token_hash` (SHA-256 hex) and a short `invitation_token_preview`. Never store the raw token. Disable invitations with `is_enabled` / `status`; no token expiry column in v1.
5. **RLS:** enable RLS on all domain tables. Do not grant useful anon/authenticated policies yet. Privileged access during early development uses the service-role client from the Next.js server. Token-scoped RPCs can arrive in the RSVP phase.
6. **Seed data:** fictional placeholders only (aligned with `src/config/wedding.ts` naming style). Include at least one event, two families, guests, and one sample RSVP.

## Checklist

- [x] Document this phase as the authorized scope in `docs/current-phase.md`.
- [x] Record the approved schema decisions in `docs/architecture.md`.
- [x] Create the initial SQL migration for domain tables, constraints, indexes, and `updated_at` triggers.
- [x] Enable RLS on all domain tables with deny-by-default for `anon` / `authenticated`.
- [x] Create `supabase/seed.sql` with fictional placeholder data and a known development token hash.
- [x] Apply locally with `supabase db reset` (or equivalent) and verify tables exist.
- [x] Align base TypeScript domain types with the migrated schema without inventing persistence services.
- [x] Update `README.md` with migration/seed commands if needed.
- [x] Run `pnpm lint`, `pnpm typecheck`, and `pnpm build`.

## Completion report

### Files created

- `supabase/migrations/20260718175317_initial_domain_schema.sql`
- `supabase/seed.sql`

### Files modified

- `docs/current-phase.md`
- `docs/architecture.md`
- `README.md`
- `src/types/event.ts`
- `src/types/family.ts`
- `src/types/guest.ts`
- `src/types/rsvp.ts`

### Important technical decisions

- Domain tables: `events`, `families`, `guests`, `rsvp_responses`, `rsvp_response_guests`, `audit_events`.
- RLS enabled on all domain tables; `anon` / `authenticated` revoked; `service_role` granted.
- Seed tokens for local use only: `dev-family-ejemplo`, `dev-family-demo` (stored as SHA-256 hashes).

### Commands executed

```bash
supabase db reset
pnpm lint
pnpm typecheck
pnpm build
```

### Validation results

- `supabase db reset`: passed (migration + seed applied).
- Verified 6 public tables with RLS enabled.
- Seed: 2 families, 5 guests, 1 RSVP response.
- `pnpm lint`: passed
- `pnpm typecheck`: passed
- `pnpm build`: passed

### Known limitations

- `/i/[token]` still uses mock data and does not query Supabase.
- No RSVP mutations, admin auth policies, or token-lookup RPCs yet.
- Remote Supabase / Vercel database wiring is not part of this phase.

### Recommended next phase

**RSVP flow**: resolve invitations by token hash, submit/update RSVP through server actions with Zod validation, and keep the UI wired to the new schema.

Alternative: **Design System** if visual invitation sections should come before persistence wiring.
