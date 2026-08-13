# Current phase

**Status:** admin Excel export **complete**; ready for go-live follow-ups

**Last reviewed:** 2026-08-12

**Authorized scope:** Closed for this slice (Excel export). Do not implement Resend/email or settings UI unless newly authorized.

## Snapshot of the repository

| Area | State |
|------|--------|
| Invitation + RSVP + boarding | Implemented |
| Hardening | Tests, transactional admin RPCs, rate limit, logs |
| Outfit inspiration | `/inspiracion/ellos` · `/inspiracion/ellas` |
| Admin Excel export | Implemented (`GET /api/admin/export`) |
| Resend / settings UI | Not implemented |

## Completed: admin Excel export (2026-08-12)

### Objective

One-click workbook for planners with useful sheets.

### Delivered

- Multi-sheet `.xlsx` via `exceljs`: Resumen, Invitados, Familias, Buses, Dietas.
- Route `GET /api/admin/export` behind admin session + email allowlist.
- Edge gate extended to `/api/admin/*` in `src/proxy.ts`.
- Buttons in admin shell (“Exportar Excel”) and dashboard.
- Unit tests for sheet row builders.

### Files

- `src/services/admin/export-workbook-rows.ts` (+ `.test.ts`)
- `src/services/admin/export-workbook.ts`
- `src/app/api/admin/export/route.ts`
- `src/components/admin/admin-shell.tsx`, `src/app/admin/page.tsx`
- `src/proxy.ts`

## Out of scope

- Resend / email notifications
- `/admin/settings` event editor
- Distributed Redis rate limit

## Recommended next steps

1. Apply pending migrations on remote if any remain.
2. Run go-live checklist.
3. Resend / product content when needed.
