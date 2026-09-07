"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useId, useState} from "react";

import {signOutAdminAction} from "@/actions/admin/auth";
import {AdminNewFamilyFab} from "@/components/admin/admin-new-family-fab";
import {AdminResumenDrawer} from "@/components/admin/admin-resumen-drawer";
import {ResumenMenuIcon} from "@/components/admin/admin-resumen-icons";
import {adminResumen} from "@/components/admin/admin-ui";
import {useLockBodyScroll} from "@/hooks/use-lock-body-scroll";
import {useVisualViewportBottom} from "@/hooks/use-visual-viewport-bottom";
import {
    ADMIN_DESKTOP_NAV_MIN_PX,
    RESUMEN_DRAWER_NAV,
    isAdminNavActive,
    showAdminNewFamilyFab,
} from "@/lib/admin/admin-chrome";
import {adminCopy} from "@/lib/admin/admin-copy";
import {weddingConfig} from "@/config/wedding";

type AdminChromeProps = {
    email: string;
    familyCount?: number;
    guestCount?: number;
};

export function AdminChrome({
    email,
    familyCount,
    guestCount,
}: AdminChromeProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const menuId = useId();
    const showFab = showAdminNewFamilyFab(pathname);
    useVisualViewportBottom();
    useLockBodyScroll(open, menuId);

    function closeMenu() {
        setOpen(false);
    }

    useEffect(() => {
        const media = window.matchMedia(
            `(min-width: ${ADMIN_DESKTOP_NAV_MIN_PX}px)`,
        );
        const onChange = () => {
            if (media.matches) {
                setOpen(false);
            }
        };
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    useEffect(() => {
        if (!open) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open]);

    return (
        <>
            <header className={`${adminResumen.header} sticky top-0 z-30`}>
                <div className="flex min-w-0 items-center gap-2">
                    <button
                        type="button"
                        className={adminResumen.menuButton}
                        aria-label={open ? adminCopy.nav.closeMenu : adminCopy.nav.menu}
                        aria-expanded={open}
                        aria-controls={menuId}
                        onClick={() => setOpen((value) => !value)}
                    >
                        <ResumenMenuIcon />
                    </button>
                    <p className={adminResumen.brand}>
                        {weddingConfig.couple.partnerOne} & {weddingConfig.couple.partnerTwo}
                    </p>
                    <span className={adminResumen.brandBadge}>
                        {adminCopy.resumen.adminBadge}
                    </span>
                </div>
                <nav
                    className={adminResumen.headerNav}
                    aria-label="Menú de administración"
                >
                    {RESUMEN_DRAWER_NAV.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            prefetch={false}
                            className={
                                isAdminNavActive(pathname, item.href)
                                    ? adminResumen.navLinkActive
                                    : adminResumen.navLink
                            }
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex min-w-0 items-center gap-2">
                    <p className={adminResumen.user} title={email}>
                        {email}
                    </p>
                    <form action={signOutAdminAction} className="shrink-0">
                        <button type="submit" className={adminResumen.signOut}>
                            {adminCopy.nav.signOut}
                        </button>
                    </form>
                </div>
            </header>

            <AdminResumenDrawer
                open={open}
                menuId={menuId}
                pathname={pathname}
                email={email}
                familyCount={familyCount}
                guestCount={guestCount}
                onClose={closeMenu}
            />

            {showFab ? <AdminNewFamilyFab /> : null}
        </>
    );
}
