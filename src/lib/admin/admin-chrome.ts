/**
 * Compact vs desktop admin chrome rules (phone + tablet portrait = below `lg`).
 * Layout itself is Tailwind in `AdminChrome`; these helpers keep path behavior testable.
 */

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
    return pathname === "/admin/families/new";
}
