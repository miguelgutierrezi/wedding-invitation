/**
 * Compact vs desktop admin chrome.
 *
 * - Hamburger until Tailwind `xl` (1280px) on most admin pages, so iPad 11"
 *   (834×1194) keeps the drawer in portrait and landscape.
 * - Resumen (`/admin`) uses the Figma layout on all viewports: mobile stacked
 *   cards, hamburger until `lg` (Figma left drawer `94:591`), inline nav from tablet landscape.
 * - Floating “+” is phone-only (hidden from iPad 11" / 834px up).
 * Layout itself is Tailwind in `AdminChrome`; these helpers keep path behavior testable.
 */

import {adminCopy} from "@/lib/admin/admin-copy";

/** iPad 11" portrait CSS width. Hide the new-family FAB from this width up. */
export const ADMIN_FAB_HIDE_MIN_PX = 834;

/** Inline desktop nav on non-Resumen admin pages (`xl`). iPad 11" landscape is 1194px. */
export const ADMIN_DESKTOP_NAV_MIN_PX = 1280;

/** Figma Resumen portrait density (2×2 KPIs, side-by-side banner CTAs). */
export const ADMIN_RESUMEN_WIDE_MIN_PX = 834;

/** Figma Resumen tablet landscape: inline nav + two-column workspace (`lg`). */
export const ADMIN_RESUMEN_LANDSCAPE_MIN_PX = 1024;

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

export type ResumenDrawerIcon =
    | "grid"
    | "users"
    | "user"
    | "chart"
    | "camera"
    | "shield";

export type ResumenDrawerBadge = "families" | "guests";

export type ResumenDrawerNavItem = {
    href: string;
    label: string;
    icon: ResumenDrawerIcon;
    badge?: ResumenDrawerBadge;
};

/** Existing admin routes only — no Figma-only Transporte / Mensajes / Configuración. */
export const RESUMEN_DRAWER_NAV: readonly ResumenDrawerNavItem[] = [
    {href: "/admin", label: adminCopy.nav.summary, icon: "grid"},
    {href: "/admin/families", label: adminCopy.nav.families, icon: "users", badge: "families"},
    {href: "/admin/guests", label: adminCopy.nav.guests, icon: "user", badge: "guests"},
    {href: "/admin/analytics", label: adminCopy.nav.statistics, icon: "chart"},
    {href: "/admin/photos", label: adminCopy.nav.photos, icon: "camera"},
    {href: "/admin/admins", label: adminCopy.nav.admins, icon: "shield"},
];

export function resumenDrawerBadgeCount(
    badge: ResumenDrawerBadge | undefined,
    counts: {familyCount: number; guestCount: number} | undefined,
): number | undefined {
    if (!badge || !counts) {
        return undefined;
    }
    if (badge === "families") {
        return counts.familyCount;
    }
    return counts.guestCount;
}

/** Local-part of the email as a display name; never invent “Wedding Planner”. */
export function adminDrawerDisplayName(email: string): string {
    const local = email.trim().split("@")[0] ?? "";
    const parts = local.split(/[._+\-]+/).filter(Boolean);
    if (parts.length === 0) {
        return adminCopy.resumen.drawerUserFallback;
    }
    return parts
        .map(
            (part) =>
                part.charAt(0).toLocaleUpperCase() +
                part.slice(1).toLocaleLowerCase(),
        )
        .join(" ");
}
