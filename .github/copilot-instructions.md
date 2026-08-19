# Repository instructions

Follow `/AGENTS.md` for permanent engineering and workflow rules (including the completion gate: tests + docs +
`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`).

Before changing code, read:

1. `/docs/current-phase.md` for the only currently authorized implementation scope and live snapshot.
2. `/docs/architecture.md` for technical boundaries (including RSVP transport boarding and `src/proxy.ts` admin gate).
3. `/docs/invitation-ui.md` when the task touches public invitation layout, tokens, assets, maps, music, or admin brand.
4. `/docs/go-live-checklist.md` for production smoke expectations (hardening).
5. `/docs/product-spec.md` for product requirements relevant to the task.
6. `/README.md` for the verified local workflow.

Inspect the current implementation before creating or replacing files. Do not treat roadmap items or historical handoff
sections as authorization to implement future phases.

Couple display names are **Nychol** and **Miguel**. Bus RSVP requires a boarding point id (`modelia` | `villa_sonia`)
kept in sync across `wedding.ts`, `transport.ts`, Zod, and SQL migrations. Ceremony maps URLs live in
`weddingConfig.ceremony`; do not invent unfinished logistics (inspiration links, bus departure times). Use pnpm and do
not claim success until tests and docs for the change are updated and `pnpm lint`, `pnpm typecheck`, `pnpm test`, and
`pnpm build` have been run (see `AGENTS.md` **Required checks**).

Presentation copy and media paths for the invitation belong in `src/config/wedding.ts` (see `docs/invitation-ui.md`).
Admin shared styles: `src/components/admin/admin-ui.ts`. Edge auth for `/admin`: `src/proxy.ts` (Next.js 16 proxy
convention).
