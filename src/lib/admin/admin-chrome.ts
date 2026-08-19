/**
 * Compact vs desktop admin chrome.
 *
 * - Hamburger until Tailwind `xl` (1280px), so iPad 11" (834×1194) keeps the
 *   drawer in portrait and landscape — including Chrome’s desktop-sized viewport.
 * - Floating “+” is phone-only (hidden from iPad 11" / 834px up).
 * Layout itself is Tailwind in `AdminChrome`; these helpers keep path behavior testable.
 */

/** iPad 11" portrait CSS width. Hide the new-family FAB from this width up. */
export const ADMIN_FAB_HIDE_MIN_PX = 834;

/** Inline desktop nav (`xl`). iPad 11" landscape is 1194px. */
export const ADMIN_DESKTOP_NAV_MIN_PX = 1280;

export function isAdminNavActive(pathname: string, href: string): boolean {
    if (href === "/admin") {
        return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function showAdminNewFamilyFab(pathname: string): boolean {
    return pathname !== "/admin/families/new";
}

export function showAdminBackToFamilies(pathname: string): boolean {
    if (pathname === "/admin/families/new") {
        return true;
    }

    if (pathname === "/admin/families") {
        return false;
    }

    return pathname.startsWith("/admin/families/");
}
