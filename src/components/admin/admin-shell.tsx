import Link from "next/link";
import type { ReactNode } from "react";

import { signOutAdminAction } from "@/actions/admin/auth";
import { admin } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/auth/require-admin";

type AdminShellProps = {
  children: ReactNode;
  title: string;
};

const navItems = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/guests", label: "Invitados" },
  { href: "/admin/families", label: "Familias" },
] as const;

/**
 * Admin chrome: accent header + cream page, Times/olive type (invitation brand).
 */
export async function AdminShell({ children, title }: AdminShellProps) {
  const session = await requireAdmin();

  return (
    <div className={`${admin.page} flex min-h-full flex-1 flex-col`}>
      <header className="border-b-2 border-cover-cta-fg/15 bg-accent">
        <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-5 px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-[family-name:var(--font-timer)] text-xs font-medium tracking-[0.18em] text-cream-figma/80 uppercase">
                Administración
              </p>
              <h1 className={admin.titleOnAccent}>{title}</h1>
            </div>
            <p className="font-[family-name:var(--font-timer)] text-sm text-cream-figma/85">
              {session.email}
            </p>
          </div>

          <nav
            className="flex flex-wrap items-center gap-2"
            aria-label="Menú de administración"
          >
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={admin.navLink}>
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/families/new"
              className="inline-flex min-h-11 items-center rounded-full border-2 border-cover-cta-fg bg-cream-figma px-4 font-[family-name:var(--font-timer)] text-sm font-medium text-cover-cta-fg transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cream-figma focus-visible:outline-none"
            >
              Nueva familia
            </Link>
            <a
              href="/api/admin/export"
              className={admin.navLink}
              download
            >
              Exportar Excel
            </a>
            <form action={signOutAdminAction} className="ml-auto sm:ml-0">
              <button type="submit" className={admin.btnGhost}>
                Salir
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-6 py-10 sm:px-8">
        {children}
      </main>
    </div>
  );
}
