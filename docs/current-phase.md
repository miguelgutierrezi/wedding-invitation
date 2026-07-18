# Current phase: Project Foundation

**Status:** completed

**Last reviewed:** 2026-07-18

**Authorized scope:** only the work listed in this document

## Objective

Prepare a clean, typed, documented, and executable foundation for the wedding invitation project.

Do not implement the real RSVP flow, domain database migrations, administration panel, authentication, email delivery, or production deployment in this phase.

## Verified starting state

At the start of this phase:

- The Next.js project existed and used App Router, TypeScript, Tailwind CSS, `src/`, and pnpm.
- Supabase CLI had been initialized in `supabase/`.
- The default `create-next-app` page and metadata were still present.
- Foundation stubs existed but were empty.
- `.env.example`, `src/lib/utils.ts`, and `src/app/i/[token]/page.tsx` did not exist.
- `package.json` did not yet provide a `typecheck` script.

## Checklist

- [x] Verify the current project starts with `pnpm dev`.
- [x] Verify the current lint baseline with `pnpm lint`.
- [x] Add `"typecheck": "tsc --noEmit"` to `package.json`.
- [x] Install `@supabase/ssr`; do not reinstall dependencies that are already present.
- [x] Complete the Prettier configuration and create `.prettierignore`.
- [x] Create `.env.example` without real credentials.
- [x] Implement typed centralized wedding configuration in `src/config/wedding.ts`.
- [x] Implement browser, server, and admin Supabase clients.
- [x] Create `src/lib/utils.ts` with the shared `cn` utility.
- [x] Implement the base TypeScript types without prematurely finalizing the database schema.
- [x] Replace the default Next.js page with a polished temporary landing page.
- [x] Replace the default metadata and set the document language appropriately.
- [x] Create the mocked `/i/[token]` route.
- [x] Run lint, typecheck, and build and fix errors caused by the phase.

## Completion report

### Files created

- `.env.example`
- `.prettierignore`
- `src/lib/utils.ts`
- `src/lib/supabase/env.ts`
- `src/app/i/[token]/page.tsx`

### Files modified

- `.prettierrc`
- `package.json`
- `pnpm-lock.yaml`
- `README.md`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/config/wedding.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/admin.ts`
- `src/types/event.ts`
- `src/types/family.ts`
- `src/types/guest.ts`
- `src/types/rsvp.ts`
- `docs/current-phase.md`

### Dependencies added

- `@supabase/ssr`
- `server-only`

### Important technical decisions

- Shared public Supabase env validation lives in `src/lib/supabase/env.ts` so client and server entry points fail consistently without logging secrets.
- The admin client imports `server-only` and uses the service-role key with session persistence disabled.
- Domain types remain intentionally small and presentation-oriented; they do not finalize the SQL schema.
- The `/i/[token]` route uses local mock family data and does not query Supabase.
- Document language is Spanish (`lang="es"`). Wedding copy stays in `src/config/wedding.ts`.

### Commands executed

```bash
pnpm lint
pnpm add @supabase/ssr
pnpm add server-only
pnpm typecheck
pnpm build
```

### Validation results

- `pnpm lint`: passed
- `pnpm typecheck`: passed
- `pnpm build`: passed

### Manual verification

- Root route `/` renders the temporary under-construction landing from centralized config.
- Sample route `/i/example-token` renders mock family details and the raw token for development.

### Known limitations

- Supabase clients are ready but unused by the UI.
- No database migrations, RSVP mutations, authentication, or admin panel.
- Invitation tokens are not hashed or validated against persistence.
- Remote Supabase is not required for this phase; local env values come from `supabase status`.

### Recommended next phase

**Design System**: define visual tokens, reusable UI primitives, and invitation section scaffolding using the temporary landing as the visual starting point—still without real RSVP persistence.

Alternative if data is preferred first: **Supabase Schema** (migrations, RLS direction, seed placeholders).

Do not begin the next phase until this document is replaced or updated with a new authorized scope.
