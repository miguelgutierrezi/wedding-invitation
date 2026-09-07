/**
 * Admin directory (`/admin/admins`) — Figma mobile `136:29` below 834px,
 * portrait `134:207` from 834px, landscape `134:121` from `lg`, desktop
 * `134:35` from `xl`.
 */

import {
    ADMIN_RESUMEN_LANDSCAPE_MIN_PX,
    ADMIN_RESUMEN_WIDE_MIN_PX,
} from "@/lib/admin/admin-chrome";
import {adminCopy} from "@/lib/admin/admin-copy";
import {formatEventDateTime} from "@/lib/datetime/event-timezone";

/** Figma Admins phone `136:29` (below iPad 11" / 834px). */
export const ADMIN_ADMINS_MOBILE_MAX_PX = ADMIN_RESUMEN_WIDE_MIN_PX - 1;

/** Figma Admins tablet portrait `134:207` (iPad 11" / 834px). */
export const ADMIN_ADMINS_PORTRAIT_MIN_PX = ADMIN_RESUMEN_WIDE_MIN_PX;

/** Figma Admins tablet landscape `134:121` (`lg` / 1024). */
export const ADMIN_ADMINS_LANDSCAPE_MIN_PX = ADMIN_RESUMEN_LANDSCAPE_MIN_PX;

/** Figma Admins desktop `134:35` (matches Resumen / Invitados / Familias / Fotos `xl`). */
export const ADMIN_ADMINS_DESKTOP_MIN_PX = 1280;

export function adminsMobileWorkspace(viewportPx: number): boolean {
    return viewportPx < ADMIN_ADMINS_PORTRAIT_MIN_PX;
}

export function adminsPortraitWorkspace(viewportPx: number): boolean {
    return (
        viewportPx >= ADMIN_ADMINS_PORTRAIT_MIN_PX &&
        viewportPx < ADMIN_ADMINS_LANDSCAPE_MIN_PX
    );
}

export function adminsFigmaWorkspace(viewportPx: number): boolean {
    return viewportPx >= 0;
}

export function adminsDesktopWorkspace(viewportPx: number): boolean {
    return viewportPx >= ADMIN_ADMINS_DESKTOP_MIN_PX;
}

/** Landscape `134:121` tightens cards and the last-access column; desktop `134:35` uses full density. */
export function adminsCompactChrome(viewportPx: number): boolean {
    return (
        viewportPx >= ADMIN_ADMINS_LANDSCAPE_MIN_PX &&
        viewportPx < ADMIN_ADMINS_DESKTOP_MIN_PX
    );
}

/** Phone `136:29` and portrait `134:207` stack the invite field + full-width CTA. */
export function adminsInviteStacked(viewportPx: number): boolean {
    return viewportPx < ADMIN_ADMINS_LANDSCAPE_MIN_PX;
}

export function adminsPortraitCardStack(viewportPx: number): boolean {
    return adminsPortraitWorkspace(viewportPx);
}

export function adminsMobileCardStack(viewportPx: number): boolean {
    return adminsMobileWorkspace(viewportPx);
}

export function adminsLastAccessParts(iso: string | null | undefined): {
    prefix: string;
    value: string;
} {
    return {
        prefix: adminCopy.adminsList.lastAccessPrefix,
        value: formatEventDateTime(iso, adminCopy.adminsList.neverSignedIn),
    };
}

export function adminsPendingStatusLabel(expired: boolean): string {
    return expired
        ? adminCopy.adminsList.statusExpired
        : adminCopy.adminsList.statusPending;
}
