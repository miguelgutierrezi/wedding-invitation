# Current phase: Project Foundation

**Status:** in progress

**Last reviewed:** 2026-07-16

**Authorized scope:** only the work listed in this document

## Objective

Prepare a clean, typed, documented, and executable foundation for the wedding invitation project.

Do not implement the real RSVP flow, domain database migrations, administration panel, authentication, email delivery, or production deployment in this phase.

## Verified starting state

- The Next.js project exists and uses App Router, TypeScript, Tailwind CSS, `src/`, and pnpm.
- Supabase CLI has been initialized in `supabase/`.
- The default `create-next-app` page and metadata are still present.
- `.prettierrc` exists with the Tailwind plugin, but `.prettierignore` is missing.
- The base Supabase, form, validation, and UI utility dependencies are installed except for `@supabase/ssr`.
- `src/config/wedding.ts`, the three Supabase client files, and the base type files exist but are empty; they are not implemented.
- `.env.example`, `src/lib/utils.ts`, and `src/app/i/[token]/page.tsx` do not exist.
- `package.json` does not yet provide a `typecheck` script.
- No validation result should be assumed until the commands are executed during this phase.

If the repository changes after this review, inspect the implementation and update this list before acting on it.

## Checklist

- [ ] Verify the current project starts with `pnpm dev`.
- [ ] Verify the current lint baseline with `pnpm lint`.
- [ ] Add `"typecheck": "tsc --noEmit"` to `package.json`.
- [ ] Install `@supabase/ssr`; do not reinstall dependencies that are already present.
- [ ] Complete the Prettier configuration and create `.prettierignore`.
- [ ] Create `.env.example` without real credentials.
- [ ] Implement typed centralized wedding configuration in `src/config/wedding.ts`.
- [ ] Implement browser, server, and admin Supabase clients.
- [ ] Create `src/lib/utils.ts` with the shared `cn` utility.
- [ ] Implement the base TypeScript types without prematurely finalizing the database schema.
- [ ] Replace the default Next.js page with a polished temporary landing page.
- [ ] Replace the default metadata and set the document language appropriately.
- [ ] Create the mocked `/i/[token]` route.
- [ ] Run lint, typecheck, and build and fix errors caused by the phase.

## Files in scope

```text
.env.example
.prettierrc
.prettierignore
package.json
pnpm-lock.yaml
README.md
src/app/layout.tsx
src/app/page.tsx
src/app/globals.css
src/app/i/[token]/page.tsx
src/config/wedding.ts
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/admin.ts
src/lib/utils.ts
src/types/event.ts
src/types/family.ts
src/types/guest.ts
src/types/rsvp.ts
```

Other files may be changed only when directly required to complete this phase. Do not create empty folders merely to match the future target structure.

## Implementation requirements

### Temporary landing page

Show placeholder couple names, a placeholder wedding date, and a clear message that the invitation is under construction. Keep it responsive, accessible, and visually restrained. Do not build the final invitation sections yet.

Use centralized configuration rather than repeating event text in the page. Configure basic Next.js metadata and use Spanish as the current document language.

### Mock invitation route

`/i/[token]` must use local mock data and must not query Supabase. Show:

- An example family name.
- Assigned guest capacity.
- A personalized example message.
- The received token for development visibility only.

Showing the raw token is a temporary diagnostic requirement for this mocked phase and must not be treated as a production UI requirement.

### Supabase clients

- Browser client: public URL and anonymous key only.
- Server client: cookie-aware `@supabase/ssr` client for Server Components, Server Actions, and Route Handlers.
- Admin client: service-role key, explicitly server-only, and never importable into a Client Component.
- Fail with useful errors when required variables are missing.
- Do not log environment variable values.

### Base types

Create small domain types that support the current mocks and configuration. The model in `product-spec.md` is directional, not authorization to implement migrations or a complete persistence model.

## Completion requirements

Run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Also verify the root page and a sample route such as `/i/example-token` locally when practical.

At completion, update this document or create the next authorized phase. Report:

- Files created and modified.
- Dependencies added.
- Important technical decisions.
- Commands executed.
- Lint, TypeScript, and build results.
- Manual verification performed.
- Known limitations.
- Recommended next phase.

Do not mark this phase complete while a required checklist item remains unfinished.
