# Current phase: Admin panel

**Status:** in progress

**Last reviewed:** 2026-08-06

**Authorized scope:** only the work listed in this document

## Objective

Add a private administration area so the couple can sign in, list families, create families with guests and capacity, generate personalized invitation links, copy those links, and see basic RSVP status.

Do not implement CSV export, email delivery, full settings UI, dress-code asset management, or public invitation design polish beyond what already ships.

## Prior phase note

Invitation UI remains usable in production. Final Canva media under `public/invitation/` can land in a later polish pass without blocking admin work.

## Approved behavior

1. Admin authentication uses Supabase Auth (email + password), cookie session via `@supabase/ssr`.
2. All `/admin` routes except `/admin/login` require a signed-in user; otherwise redirect to login.
3. Admin allowlist is fixed in `src/config/admin.ts` (`migueangel97@hotmail.com`, `nycholpg@gmail.com`). Optional extra emails may be added via `ADMIN_EMAIL` / `ADMIN_EMAILS`.
4. Domain data reads/writes after auth use the **service-role** server client; never expose service-role to the browser.
5. Invitation tokens are generated cryptographically; only the hash + short preview are stored.
6. Raw invitation URL is shown only at creation time (and on explicit regenerate), so it can be copied. Regenerating invalidates the previous token.
7. Creating a family creates guest rows; family detail allows editing names, capacity, enable flag.
8. Dashboard shows counts: families, assigned seats, attending / not attending / pending guests, responded vs pending families.
9. Do not log tokens, secrets, or full dietary/contact payloads.

## Checklist

- [x] Authorize this phase in `docs/current-phase.md`.
- [x] Add auth helpers, middleware, and admin session guards.
- [x] Add `/admin/login` and sign-out.
- [x] Add dashboard with summary metrics.
- [x] List families with RSVP-related status.
- [x] Create family + guests + generate invitation URL (copy once).
- [x] Family detail: guests, status, regenerate/copy flow, enable/disable.
- [x] Document local admin user creation in README.
- [x] Run `pnpm lint`, `pnpm typecheck`, and `pnpm build`.
- [ ] Optional polish after smoke test in production (confirm `ADMIN_EMAIL` + first real family).

## Out of scope

- CSV export
- Email / Resend
- Admin multi-user roles beyond a single allowlisted email
- `/admin/settings` event editor
- Public invitation asset polish

## Important technical decisions

- Auth gate uses the cookie-aware server client; privileged CRUD uses `createAdminClient()` only after the gate passes.
- RLS remains deny-by-default for anon/authenticated on domain tables; service role bypasses RLS on the server.
- Invitation raw tokens are not persisted by design.

## Known limitations

- Guest delete may fail if RSVP response rows still reference the guest.
- Event metadata is not editable in admin (row must already exist, e.g. seed).
- Middleware deprecation warning in Next.js 16 (`middleware` → future `proxy`); still functional.

## Recommended next step after completion

CSV export + filters, or Canva asset polish.

## Completion report

### Files created

- `src/middleware.ts`
- `src/lib/auth/require-admin.ts`
- `src/lib/security/generate-invitation-token.ts`
- `src/lib/validation/admin-family.ts`
- `src/services/admin/families.ts`
- `src/actions/admin/auth.ts`
- `src/components/admin/*`
- `src/app/admin/**`

### Commands executed

```bash
pnpm lint
pnpm typecheck
pnpm build
```

### Validation results

- `pnpm lint`: passed
- `pnpm typecheck`: passed
- `pnpm build`: passed
