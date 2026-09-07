import Link from "next/link";

import {signOutAdminAction} from "@/actions/admin/auth";
import {
    ResumenDrawerCloseIcon,
    ResumenDrawerDownloadIcon,
    ResumenDrawerLogoutIcon,
    ResumenDrawerNavIcon,
    ResumenDrawerPlusIcon,
} from "@/components/admin/admin-resumen-icons";
import {adminResumen} from "@/components/admin/admin-ui";
import {
    RESUMEN_DRAWER_NAV,
    adminDrawerDisplayName,
    isAdminNavActive,
    resumenDrawerBadgeCount,
} from "@/lib/admin/admin-chrome";
import {adminCopy} from "@/lib/admin/admin-copy";
import {weddingConfig} from "@/config/wedding";

export function AdminResumenDrawer({
    open,
    menuId,
    pathname,
    email,
    familyCount,
    guestCount,
    onClose,
}: {
    open: boolean;
    menuId: string;
    pathname: string;
    email: string;
    familyCount?: number;
    guestCount?: number;
    onClose: () => void;
}) {
    const tabIndex = open ? 0 : -1;
    const counts =
        familyCount == null || guestCount == null
            ? undefined
            : {familyCount, guestCount};
    const displayName = adminDrawerDisplayName(email);

    return (
        <div
            id={menuId}
            className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "invisible pointer-events-none"}`}
            role="dialog"
            aria-modal={open}
            aria-hidden={!open}
            aria-label={adminCopy.nav.menu}
        >
            <button
                type="button"
                tabIndex={tabIndex}
                className={`${adminResumen.drawerScrim} ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
                aria-label={adminCopy.nav.closeMenu}
                onClick={onClose}
            />
            <div
                className={`${adminResumen.drawerPanel} ${open ? "pointer-events-auto translate-x-0" : "pointer-events-none -translate-x-full"}`}
            >
                <div className="flex w-full flex-col gap-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                            <p className={adminResumen.drawerBrand}>
                                {weddingConfig.couple.partnerOne} &{" "}
                                {weddingConfig.couple.partnerTwo}
                            </p>
                            <span className={adminResumen.brandBadge}>
                                {adminCopy.resumen.adminBadge}
                            </span>
                        </div>
                        <button
                            type="button"
                            tabIndex={tabIndex}
                            className={adminResumen.drawerClose}
                            aria-label={adminCopy.nav.closeMenu}
                            onClick={onClose}
                        >
                            <span className={adminResumen.drawerCloseGlyph}>
                                <ResumenDrawerCloseIcon />
                            </span>
                        </button>
                    </div>
                    <div className="h-px w-full bg-admin-border" />
                </div>

                <nav
                    className="flex w-full flex-1 flex-col gap-1.5 overflow-y-auto pt-3"
                    aria-label="Menú de administración"
                >
                    {RESUMEN_DRAWER_NAV.map((item) => {
                        const active = isAdminNavActive(pathname, item.href);
                        const badge = resumenDrawerBadgeCount(item.badge, counts);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                prefetch={false}
                                tabIndex={tabIndex}
                                onClick={onClose}
                                className={
                                    active
                                        ? adminResumen.drawerNavItemActive
                                        : adminResumen.drawerNavItem
                                }
                            >
                                <ResumenDrawerNavIcon name={item.icon} active={active} />
                                <span className="min-w-0 flex-1">{item.label}</span>
                                {badge != null ? (
                                    <span className={adminResumen.drawerBadge}>{badge}</span>
                                ) : null}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex w-full flex-col gap-3 py-4">
                    <div className="h-px w-full bg-admin-border" />
                    <p className={adminResumen.drawerSectionLabel}>
                        {adminCopy.resumen.quickActions}
                    </p>
                    <Link
                        href="/admin/families/new"
                        prefetch={false}
                        tabIndex={tabIndex}
                        onClick={onClose}
                        className={adminResumen.drawerQuickActionPrimary}
                    >
                        <ResumenDrawerPlusIcon />
                        {adminCopy.nav.newFamily}
                    </Link>
                    <a
                        href="/api/admin/export"
                        tabIndex={tabIndex}
                        className={adminResumen.drawerQuickAction}
                        download
                    >
                        <ResumenDrawerDownloadIcon />
                        {adminCopy.nav.exportList}
                    </a>
                </div>

                <div className="flex w-full flex-col gap-4">
                    <div className="h-px w-full bg-admin-border" />
                    <div className="flex items-center justify-between gap-2 px-2">
                        <div className="min-w-0">
                            <p className={adminResumen.drawerUserName}>{displayName}</p>
                            <p className={adminResumen.drawerUserEmail} title={email}>
                                {email}
                            </p>
                        </div>
                        <form action={signOutAdminAction} className="shrink-0">
                            <button
                                type="submit"
                                tabIndex={tabIndex}
                                className={adminResumen.drawerLogout}
                            >
                                <ResumenDrawerLogoutIcon />
                                {adminCopy.nav.signOut}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
