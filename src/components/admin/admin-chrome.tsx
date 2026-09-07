"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useId, useState} from "react";

import {signOutAdminAction} from "@/actions/admin/auth";
import {AdminNewFamilyFab} from "@/components/admin/admin-new-family-fab";
import {AdminResumenDrawer} from "@/components/admin/admin-resumen-drawer";
import {ResumenMenuIcon} from "@/components/admin/admin-resumen-icons";
import {adminResumen} from "@/components/admin/admin-ui";
import {useVisualViewportBottom} from "@/hooks/use-visual-viewport-bottom";
import {
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

    function closeMenu() {
        setOpen(false);
    }

    useEffect(() => {
        if (!open) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", onKeyDown);
        };
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
