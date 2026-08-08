# Repository instructions

Follow `/AGENTS.md` for permanent engineering and workflow rules.

Before changing code, read:

1. `/docs/current-phase.md` for the only currently authorized implementation scope and live snapshot.
2. `/docs/architecture.md` for technical boundaries (including RSVP transport boarding).
3. `/docs/invitation-ui.md` when the task touches public invitation layout, tokens, assets, or admin brand.
4. `/docs/product-spec.md` for product requirements relevant to the task.
5. `/README.md` for the verified local workflow.

Inspect the current implementation before creating or replacing files. Do not treat roadmap items or historical handoff sections as authorization to implement future phases.

Couple display names are **Nychol** and **Miguel**. Bus RSVP requires a boarding point id (`modelia` | `villa_sonia`) kept in sync across `wedding.ts`, `transport.ts`, Zod, and SQL migrations—never invent logistics data (maps URLs, bus times). Use pnpm and run the relevant lint, typecheck, build, and test commands before claiming success.

Presentation copy and media paths for the invitation belong in `src/config/wedding.ts` (see `docs/invitation-ui.md`). Admin shared styles: `src/components/admin/admin-ui.ts`.
