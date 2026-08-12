# AGENTS.md

## Project overview

This repository contains a full-stack wedding invitation web application for approximately 90 guests (couple: **Nychol** and **Miguel**).

The application provides:

- A public wedding invitation.
- Personalized invitation links per family (`/i/[slug]`).
- RSVP management (attendance, dietary restrictions, bus transport + boarding point).
- Guest-level attendance confirmation.
- A private administration panel (dashboard, analytics, families, guests).
- CSV export for attendance data (roadmap; not yet implemented).

The application must be elegant, mobile-first, secure, inexpensive to operate, reusable, and easy to deploy.

## Technical stack

Use the following stack:

- Next.js with App Router.
- React.
- TypeScript.
- Tailwind CSS.
- pnpm.
- Supabase.
- PostgreSQL.
- Supabase Auth.
- Supabase Row Level Security.
- Vercel.
- Cloudflare DNS.

Do not introduce:

- A separate Java backend.
- Flutter or Dart.
- Microservices.
- Kubernetes.
- Prisma unless explicitly requested later.
- Redux unless a concrete need appears.
- Paid services without justification.

## Architecture

The project is a single full-stack Next.js application.

Use:

- Server Components by default.
- Client Components only when browser interaction is required.
- Server Actions for mutations when appropriate.
- Route Handlers for HTTP endpoints when appropriate.
- Supabase for database, authentication, and storage.
- SQL migrations for every database change.

Next.js runs directly through pnpm during local development.

Supabase runs locally through Docker and the Supabase CLI.

## Project structure

Use the following structure as a guide:

```text
src/
├── actions/
│   ├── admin/
│   └── rsvp/
├── app/
│   ├── i/
│   │   └── [slug]/
│   ├── admin/
│   └── page.tsx
├── components/
│   ├── admin/
│   ├── invitation/
│   ├── rsvp/
│   └── ui/
├── config/
│   ├── wedding.ts
│   ├── transport.ts
│   └── admin.ts
├── hooks/
├── lib/
│   ├── auth/
│   ├── security/
│   ├── supabase/
│   └── validation/
├── services/
├── styles/
├── types/
├── utils/
└── proxy.ts            # Next.js 16 edge gate for /admin (not middleware.ts)

public/
│   └── invitation/    # invitation media (see docs/invitation-ui.md)
supabase/
docs/
```

The structure may be adjusted when there is a clear technical reason. Avoid unnecessary folders and abstractions.

## Coding rules

- Use strict TypeScript.
- Do not use `any` unless it is justified and documented.
- Prefer small components with clear responsibilities.
- Prefer named exports except where Next.js requires default exports.
- Keep business logic outside presentation components.
- Keep configuration outside components.
- Avoid duplicated constants and strings.
- Use Zod for server-side validation.
- Validate all untrusted input.
- Do not trust client-side validation alone.
- Use async error handling explicitly.
- Return useful typed errors.
- Do not silently swallow exceptions.
- Avoid premature abstractions.
- Avoid overengineering.

## React and Next.js rules

- Use Server Components by default.
- Add `"use client"` only when required.
- Do not convert entire pages into Client Components for a small interactive section.
- Use `next/image` for images.
- Use Next.js metadata APIs.
- Use route-level `loading.tsx`, `error.tsx`, and `not-found.tsx` where useful.
- Keep secrets and privileged database access on the server.
- Do not expose service-role credentials to the browser.

## Supabase rules

Create the following clients:

```text
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/admin.ts
```

Rules:

- `client.ts` is for browser usage.
- `server.ts` is for Server Components, Server Actions, and Route Handlers.
- `admin.ts` uses the service-role key and must remain server-only.
- Never import the admin client into a Client Component.
- Never expose `SUPABASE_SERVICE_ROLE_KEY`.
- Use `@supabase/ssr` for cookie-aware server authentication.
- All schema changes must be represented as SQL migrations.
- Do not rely on manual Studio changes without migrations.
- Add Row Level Security policies before production use.

## Environment variables

Expected variables:

```env
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ADMIN_NOTIFICATION_EMAIL=
ADMIN_EMAIL=
ADMIN_EMAILS=
```

Fixed admin emails live in `src/config/admin.ts`. `ADMIN_EMAIL` / `ADMIN_EMAILS` only add extras.

Rules:

- Never commit `.env.local`.
- Never print secrets in logs.
- Keep `.env.example` free of real credentials.
- Only variables prefixed with `NEXT_PUBLIC_` may be used in browser code.

## Invitation security

Personalized links use secure random tokens.

Rules:

- Never use sequential database IDs as invitation tokens.
- Generate tokens cryptographically.
- Store a hash of the token where practical.
- Do not expose internal family or guest IDs publicly.
- Validate that each guest belongs to the family being updated.
- Enforce guest limits on the server.
- Enforce RSVP deadlines on the server.
- When transport is requested, require a valid boarding point id on the server (`modelia` | `villa_sonia`; keep config, Zod, and SQL in sync).
- Prevent accidental duplicate submissions.
- Avoid leaking whether arbitrary tokens exist.

## Product principles

The invitation must be:

- Mobile-first.
- Responsive.
- Elegant.
- Fast.
- Accessible.
- Easy to use from WhatsApp's embedded browser.
- Easy to update through centralized configuration.

Support:

- iPhone safe areas.
- Safari mobile browser behavior.
- Android browsers.
- Desktop Safari, Chrome, and Edge.
- Touch targets of at least 44 by 44 pixels.
- `prefers-reduced-motion`.

## Design principles

The visual style should be:

- Romantic.
- Modern.
- Clean.
- Elegant.
- Timeless.
- Subtle rather than overly decorative.

Invitation presentation conventions (tokens, sections, assets) live in:

```text
docs/invitation-ui.md
```

Copy and media paths belong in `src/config/wedding.ts`. Do not scatter Figma hex values or asset paths across many components.

Avoid:

- Heavy animations.
- Autoplay audio without an explicit user gesture (invitation music after “Ver Invitación” is allowed when `features.music` is on).
- Large background videos.
- Generic template appearance.
- Excessive gradients.
- Excessive shadows.
- Excessive client-side JavaScript.
- Cropping dress-code or transport illustrations with aggressive `object-cover` when the subject must remain fully visible.
- The deprecated `middleware` file convention; use `src/proxy.ts` for the admin edge gate.

## Data model direction

The expected primary entities are:

- `events`
- `families`
- `guests` (includes `needs_transport`, `transport_boarding_point`)
- `rsvp_responses`
- `rsvp_response_guests` (includes the same transport fields as the denormalized guest mirror)
- `audit_events`

Do not finalize or heavily expand the data model without checking the current project phase and product specification.

## Git conventions

Use small, descriptive commits.

Suggested prefixes:

```text
chore:
feat:
fix:
refactor:
docs:
test:
```

Examples:

```text
chore: configure project foundation
feat: add invitation token route
feat: add RSVP validation
fix: enforce family guest limit
```

Do not commit:

- `.env.local`
- Secrets
- `node_modules`
- `.next`
- Generated build artifacts

## Required checks

Before declaring a task complete, run the relevant checks:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Run tests when test coverage exists (`pnpm test`).

Do not claim success if a check was not executed.

Report:

- Files created.
- Files modified.
- Dependencies added.
- Commands executed.
- Validation results.
- Known limitations.
- Recommended next step.

## Agent workflow

Before modifying the repository:

1. Inspect the current files.
2. Read `package.json`.
3. Read `README.md`.
4. Read the files under `docs/`.
5. Check Git status.
6. Check the current implementation before creating new abstractions.

During implementation:

1. Make incremental changes.
2. Preserve working behavior.
3. Avoid unnecessary dependencies.
4. Keep the application runnable.
5. Document meaningful decisions.
6. Do not implement features outside the current requested phase.

When requirements are incomplete:

- Choose the simplest reasonable option.
- Make the decision easy to change.
- Document the assumption.
- Do not invent real wedding data beyond what is already confirmed in the repository.

Confirmed couple display names:

```text
Nychol
Miguel
```

For unset logistics (maps URLs, bus departure times, etc.), use safe placeholders such as:

```text
por confirmar
Lugar por definir
```

Empty CTA URLs are preferred over invented links.

## Current source of truth

Instruction precedence, from highest to lowest:

1. The user's explicit request for the current task.
2. `docs/current-phase.md` for the currently authorized implementation scope.
3. `docs/architecture.md` for approved technical boundaries.
4. `docs/invitation-ui.md` for public invitation presentation conventions (when relevant).
5. `docs/product-spec.md` for product behavior and long-term requirements.
6. This file for permanent repository workflow and engineering defaults.

If two documents conflict, follow the higher-precedence source and report the conflict. Do not interpret the product roadmap as authorization to implement future work.

Permanent engineering rules live in this file.

Product requirements live in:

```text
docs/product-spec.md
```

Architecture details live in:

```text
docs/architecture.md
```

Invitation UI (Figma alignment, tokens, assets) lives in:

```text
docs/invitation-ui.md
```

The currently authorized implementation scope lives in:

```text
docs/current-phase.md
```

Do not implement future phases unless explicitly requested.

When a phase is completed, update `docs/current-phase.md` before beginning another phase so that it reflects the repository rather than a historical handoff.
