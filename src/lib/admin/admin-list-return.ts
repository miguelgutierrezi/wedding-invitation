/**
 * Remembers the last Familias list URL (with filters) so the in-app back
 * chevron can restore them — browser history alone is not used by that control.
 */

export const ADMIN_FAMILIES_LIST_RETURN_KEY = "admin:familiesListHref";

function getSessionStorage(): Storage | null {
    try {
        if (typeof globalThis.sessionStorage === "undefined") {
            return null;
        }
        return globalThis.sessionStorage;
    } catch {
        return null;
    }
}

export function rememberAdminFamiliesListHref(href: string): void {
    getSessionStorage()?.setItem(ADMIN_FAMILIES_LIST_RETURN_KEY, href);
}

export function readAdminFamiliesListReturnHref(
    fallback = "/admin/families",
): string {
    const stored = getSessionStorage()?.getItem(ADMIN_FAMILIES_LIST_RETURN_KEY);
    if (!stored || !stored.startsWith("/admin/families")) {
        return fallback;
    }

    // Never return a detail/create path as the list return target.
    if (stored !== "/admin/families" && !stored.startsWith("/admin/families?")) {
        return fallback;
    }

    return stored;
}
