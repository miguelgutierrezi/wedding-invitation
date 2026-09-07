import {
    ADMIN_RESUMEN_LANDSCAPE_MIN_PX,
    ADMIN_RESUMEN_WIDE_MIN_PX,
} from "@/lib/admin/admin-chrome";
import {adminCopy} from "@/lib/admin/admin-copy";

/** Figma nueva-familia-mobile `145:298` (below iPad 11" / 834px). */
export const ADMIN_NEW_FAMILY_MOBILE_MAX_PX = ADMIN_RESUMEN_WIDE_MIN_PX - 1;

/** Figma nueva-familia-tablet-portrait `145:228` (iPad 11" / 834px). */
export const ADMIN_NEW_FAMILY_PORTRAIT_MIN_PX = ADMIN_RESUMEN_WIDE_MIN_PX;

/** Figma nueva-familia-tablet-landscape `145:151` (`lg` / 1024). */
export const ADMIN_NEW_FAMILY_LANDSCAPE_MIN_PX = ADMIN_RESUMEN_LANDSCAPE_MIN_PX;

/** Figma nueva-familia-desktop `145:68` (matches other admin workspaces at `xl`). */
export const ADMIN_NEW_FAMILY_DESKTOP_MIN_PX = 1280;

export const NEW_FAMILY_DEFAULT_GUEST_COUNT = 2;
export const NEW_FAMILY_MIN_GUESTS = 1;
export const NEW_FAMILY_MAX_GUESTS = 30;

export function newFamilyPortraitWorkspace(viewportPx: number): boolean {
    return (
        viewportPx >= ADMIN_NEW_FAMILY_PORTRAIT_MIN_PX &&
        viewportPx < ADMIN_NEW_FAMILY_LANDSCAPE_MIN_PX
    );
}

export function newFamilyLandscapeWorkspace(viewportPx: number): boolean {
    return (
        viewportPx >= ADMIN_NEW_FAMILY_LANDSCAPE_MIN_PX &&
        viewportPx < ADMIN_NEW_FAMILY_DESKTOP_MIN_PX
    );
}

export function newFamilyDesktopWorkspace(viewportPx: number): boolean {
    return viewportPx >= ADMIN_NEW_FAMILY_DESKTOP_MIN_PX;
}

export function newFamilyMobileWorkspace(viewportPx: number): boolean {
    return viewportPx <= ADMIN_NEW_FAMILY_MOBILE_MAX_PX;
}

/** Landscape `145:151` uses the same card as desktop at tighter density. */
export function newFamilyCompactChrome(viewportPx: number): boolean {
    return newFamilyLandscapeWorkspace(viewportPx);
}

export function newFamilyOverline(compact: boolean): string {
    return compact
        ? adminCopy.newFamily.overlineCompact
        : adminCopy.newFamily.overline;
}

export function clampNewFamilyGuestCount(value: number): number {
    if (!Number.isFinite(value) || value < NEW_FAMILY_MIN_GUESTS) {
        return NEW_FAMILY_MIN_GUESTS;
    }
    if (value > NEW_FAMILY_MAX_GUESTS) {
        return NEW_FAMILY_MAX_GUESTS;
    }
    return Math.trunc(value);
}

export function newFamilyGuestLabel(index: number): string {
    const label = `${adminCopy.newFamily.guestLabel} ${index + 1}`;
    if (index === 0) {
        return `${label} (${adminCopy.guest.primaryContact})`;
    }
    return label;
}
