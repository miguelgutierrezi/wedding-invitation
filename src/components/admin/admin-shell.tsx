import Link from "next/link";
import type { ReactNode } from "react";

import { signOutAdminAction } from "@/actions/admin/auth";
import { requireAdmin } from "@/lib/auth/require-admin";

type AdminShellProps = {
  children: ReactNode;
  title: string;
};

export async function AdminShell({ children, title }: AdminShellProps) {
  const admin = await requireAdmin();

  return (
    <>
      <header className="border-b border-[color:var(--ring)] bg-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
              Administración
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl text-foreground">
              {title}
            </h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin"
              className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-accent hover:bg-cream"
            >
              Resumen
            </Link>
            <Link
              href="/admin/analytics"
              className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-accent hover:bg-cream"
            >
              Analytics
            </Link>
            <Link
              href="/admin/guests"
              className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-accent hover:bg-cream"
            >
              Invitados
            </Link>
            <Link
              href="/admin/families"
              className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-accent hover:bg-cream"
            >
              Familias
            </Link>
            <Link
              href="/admin/families/new"
              className="inline-flex min-h-11 items-center rounded-full bg-accent px-4 text-sm font-medium text-foreground"
            >
              Nueva familia
            </Link>
            <form action={signOutAdminAction}>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center rounded-full border border-[color:var(--ring)] px-4 text-sm font-medium"
              >
                Salir ({admin.email})
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
    </>
  );
}
