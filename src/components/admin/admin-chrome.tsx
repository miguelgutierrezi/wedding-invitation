"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useId, useState} from "react";

import {signOutAdminAction} from "@/actions/admin/auth";
import {admin} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {isAdminNavActive, showAdminBackToFamilies, showAdminNewFamilyFab,} from "@/lib/admin/admin-chrome";

const navItems = [
    {href: "/admin", label: adminCopy.nav.summary},
    {href: "/admin/analytics", label: adminCopy.nav.statistics},
    {href: "/admin/guests", label: adminCopy.nav.guests},
    {href: "/admin/families", label: adminCopy.nav.families},
    {href: "/admin/photos", label: adminCopy.nav.photos},
] as const;

function MenuIcon({open}: { open: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="size-6"
        >
            {open ? (
                <path
                    d="M6 6 18 18M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            ) : (
                <path
                    d="M5 7h14M5 12h14M5 17h14"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            )}
        </svg>
    );
}

type AdminChromeProps = {
    title: string;
    email: string;
};

export function AdminChrome({title, email}: AdminChromeProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const menuId = useId();
    const showFab = showAdminNewFamilyFab(pathname);
    const showBack = showAdminBackToFamilies(pathname);

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

    const desktopNav = (
        <nav className="hidden gap-2 lg:flex" aria-label="Menú de administración">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    className={
                        isAdminNavActive(pathname, item.href) ? admin.navLinkActive : admin.navLink
                    }
                >
                    {item.label}
                </Link>
            ))}
            <Link
                href="/admin/families/new"
                prefetch={false}
                className="inline-flex min-h-11 shrink-0 items-center rounded-full border-2 border-cover-cta-fg bg-cream-figma px-4 font-[family-name:var(--font-timer)] text-sm font-medium text-cover-cta-fg transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cream-figma focus-visible:outline-none"
            >
                {adminCopy.nav.newFamily}
            </Link>
            <a href="/api/admin/export" className={admin.navLink} download>
                {adminCopy.nav.exportList}
            </a>
            <form action={signOutAdminAction} className="shrink-0">
                <button type="submit" className={admin.btnGhost}>
                    {adminCopy.nav.signOut}
                </button>
            </form>
        </nav>
    );

    return (
        <>
            <header
                className="sticky top-0 z-30 border-b-2 border-cover-cta-fg/15 bg-accent pt-[max(0.75rem,env(safe-area-inset-top))]">
                <div
                    className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-4 px-4 py-4 lg:gap-5 lg:px-8 lg:py-5">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-start gap-1">
                            {showBack ? (
                                <Link
                                    href="/admin/families"
                                    prefetch={false}
                                    className="-ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-cream-figma hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-cream-figma/60 focus-visible:outline-none"
                                    aria-label={adminCopy.nav.backToFamilies}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                        className="size-6"
                                    >
                                        <path
                                            d="M15 6 9 12l6 6"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </Link>
                            ) : null}
                            <div className="min-w-0">
                                <p className="font-[family-name:var(--font-timer)] text-xs font-medium tracking-[0.18em] text-cream-figma/80 uppercase">
                                    Administración
                                </p>
                                <h1 className={admin.titleOnAccent}>{title}</h1>
                                <p className="mt-1 hidden truncate font-[family-name:var(--font-timer)] text-sm text-cream-figma/85 lg:block">
                                    {email}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-cream-figma hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-cream-figma/60 focus-visible:outline-none lg:hidden"
                            aria-label={open ? adminCopy.nav.closeMenu : adminCopy.nav.menu}
                            aria-expanded={open}
                            aria-controls={menuId}
                            onClick={() => setOpen((value) => !value)}
                        >
                            <MenuIcon open={open}/>
                        </button>
                    </div>
                    {desktopNav}
                </div>
            </header>

            <div
                id={menuId}
                className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
                role="dialog"
                aria-modal={open}
                aria-hidden={!open}
                aria-label={adminCopy.nav.menu}
            >
                <button
                    type="button"
                    tabIndex={open ? 0 : -1}
                    className={`absolute inset-0 bg-cover-cta-fg/35 transition-opacity duration-300 ease-out motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
                    aria-label={adminCopy.nav.closeMenu}
                    onClick={closeMenu}
                />
                <div
                    className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-accent pt-[max(0.75rem,env(safe-area-inset-top))] shadow-[-16px_0_40px_rgba(69,68,17,0.18)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${open ? "translate-x-0" : "translate-x-full"}`}
                >
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                        <p className="font-[family-name:var(--font-timer)] text-xs font-medium tracking-[0.18em] text-cream-figma/80 uppercase">
                            Administración
                        </p>
                        <button
                            type="button"
                            tabIndex={open ? 0 : -1}
                            className="inline-flex size-11 items-center justify-center rounded-full text-cream-figma hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-cream-figma/60 focus-visible:outline-none"
                            aria-label={adminCopy.nav.closeMenu}
                            onClick={closeMenu}
                        >
                            <MenuIcon open/>
                        </button>
                    </div>
                    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                prefetch={false}
                                tabIndex={open ? 0 : -1}
                                onClick={closeMenu}
                                className={
                                    isAdminNavActive(pathname, item.href)
                                        ? admin.navLinkActive
                                        : admin.navLink
                                }
                            >
                                {item.label}
                            </Link>
                        ))}
                        <a
                            href="/api/admin/export"
                            tabIndex={open ? 0 : -1}
                            className={admin.navLink}
                            download
                        >
                            {adminCopy.nav.exportList}
                        </a>
                        <p className="mt-6 px-4 font-[family-name:var(--font-timer)] text-sm text-cream-figma/75">
                            {email}
                        </p>
                        <form
                            action={signOutAdminAction}
                            className="mt-auto border-t border-cream-figma/20 px-3 pt-4"
                        >
                            <button
                                type="submit"
                                tabIndex={open ? 0 : -1}
                                className={`${admin.btnGhost} w-full justify-start`}
                            >
                                {adminCopy.nav.signOut}
                            </button>
                        </form>
                    </nav>
                </div>
            </div>

            {showFab ? (
                <Link
                    href="/admin/families/new"
                    prefetch={false}
                    className="admin-new-family-fab inline-flex size-14 items-center justify-center rounded-full bg-accent font-[family-name:var(--font-timer)] text-3xl leading-none text-white shadow-[0_8px_20px_rgba(69,68,17,0.16)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none active:scale-[0.98]"
                    aria-label={adminCopy.nav.newFamily}
                >
          <span aria-hidden="true" className="translate-y-[-1px]">
            +
          </span>
                </Link>
            ) : null}
        </>
    );
}
