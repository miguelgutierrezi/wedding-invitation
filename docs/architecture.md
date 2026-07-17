# Architecture

**Status:** foundation baseline

**Last reviewed:** 2026-07-16

This document describes the intended technical architecture and its boundaries. It does not authorize implementation beyond `current-phase.md`.

## System context

The product is a single full-stack Next.js application for approximately 90 wedding guests. It serves a public invitation, personalized family invitation links, RSVP mutations, and an authenticated administration area.

```text
Guest or administrator
        |
        v
Cloudflare DNS
        |
        v
Vercel / Next.js
  - Server Components
  - Client Components
  - Server Actions
  - Route Handlers
        |
        v
Supabase
  - PostgreSQL
  - Auth
  - Row Level Security
  - Storage when needed
```

During local development, Next.js runs directly with pnpm. Supabase runs through Docker and Supabase CLI. Next.js must not be placed in a development Docker container without a documented reason.

## Application boundaries

Use one Next.js repository and deployment. Do not introduce a separate backend, microservices, an ORM, a global client state library, or additional infrastructure without a demonstrated need and explicit approval.

Use:

- Server Components for rendering and server-side reads by default.
- Small Client Components only for forms, countdowns, and browser interaction.
- Server Actions for application-owned mutations when they provide a clear typed workflow.
- Route Handlers for HTTP endpoints such as exports or integrations.
- Plain TypeScript services for business rules that should not live in presentation components.
- Zod at every untrusted server boundary.

## Route direction

```text
/                  public invitation or landing page
/i/[token]         personalized invitation and RSVP
/admin/login       administrator sign-in
/admin             protected administration area
/api/...           HTTP endpoints only when appropriate
```

Only the mock `/i/[token]` route is authorized during Project Foundation. Future routes describe product direction, not current implementation scope.

## Configuration

Stable event presentation data belongs in `src/config/wedding.ts` until a future phase explicitly moves editable settings into the database. Components should receive data via props or import the centralized configuration; they should not scatter event copy or dates across the UI.

Real wedding data must not be invented. Configuration should remain easy to replace with confirmed data later.

## Supabase access

Maintain three explicit client entry points:

```text
src/lib/supabase/client.ts  browser, anonymous public credentials
src/lib/supabase/server.ts  cookie-aware server client
src/lib/supabase/admin.ts   privileged service-role client, server-only
```

The admin client is an escape hatch for narrowly scoped privileged operations, not the default data-access path. Never expose or log the service-role key. Browser code may access only `NEXT_PUBLIC_` variables.

## Data model direction

The expected domain entities are:

- `events`
- `families`
- `guests`
- `rsvp_responses`
- `rsvp_response_guests`
- `audit_events`

The field lists in `product-spec.md` are exploratory. Before the database phase, define and approve:

- SQL types, nullability, defaults, constraints, indexes, and foreign-key behavior.
- Whether one event is an enforced product constraint or the schema supports multiple events for reuse.
- The source of truth for guest attendance.
- Whether RSVP records are updated in place or versioned.
- Idempotency and concurrency behavior for submissions.
- Token rotation, revocation, and expiry behavior.
- Exact RLS policies and the operations allowed to anonymous guests.

Every schema change must be a SQL migration. Seed data must use fictional placeholders.

## Invitation token boundary

Public URLs use cryptographically random, non-sequential tokens. Production behavior should:

1. Generate sufficient random entropy on the server.
2. Share the raw token with the invited family.
3. Store a one-way hash and a short non-sensitive preview.
4. Hash the presented token before lookup.
5. Return indistinguishable not-found behavior for invalid, disabled, and unknown invitations where appropriate.

Do not place internal family or guest IDs in public URLs or client-visible mutation payloads when an opaque identifier can be used.

## RSVP consistency and security

The eventual server mutation must validate, within one consistent operation:

- Token validity and family status.
- RSVP open state and deadline using the configured event timezone.
- Guest membership in the family.
- Maximum guest capacity.
- Allowed attendance states and input lengths.
- Duplicate or concurrent submission behavior.

Client validation improves usability but is never an authorization boundary. Rate limiting and a honeypot should be added before public production use. CAPTCHA is deferred unless abuse justifies it.

## Authentication and authorization

Guests do not create accounts; their invitation token grants narrowly scoped access to their family invitation workflow. Administrators authenticate through Supabase Auth.

RLS must be enabled and reviewed before production. Admin pages require server-side authorization; hiding navigation in the client is not access control. Detailed policies belong to the future database/authentication phase.

## UI and delivery constraints

The UI is mobile-first and must work in current Safari, Chrome, Edge, and WhatsApp's embedded browser. Preserve:

- Touch targets of at least 44 by 44 pixels.
- Keyboard access, visible focus, semantic markup, and adequate contrast.
- iPhone safe areas and mobile viewport behavior.
- `prefers-reduced-motion`.
- Optimized images through `next/image`.
- No autoplay audio, heavy background video, or essential interaction dependent on animation.

## Observability and privacy

Do not log invitation tokens, environment secrets, dietary details, contact details, or full mutation payloads. Audit events should record useful actions without copying unnecessary personal data into metadata.

Store only information required to manage the invitation. Do not collect identity documents or unrelated sensitive data.

## Deployment direction

The intended production path is GitHub private repository to Vercel, backed by a remote Supabase project and a domain managed through Cloudflare. Production deployment, remote project creation, DNS, email, and secret provisioning require their own authorized phase.

## Architectural decision policy

Prefer the simplest reversible design that meets the current phase. Document meaningful deviations here or in a dedicated ADR if the decision has long-term consequences. A future possibility is not sufficient reason to add an abstraction now.
