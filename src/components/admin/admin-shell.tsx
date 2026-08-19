import type { ReactNode } from "react";

import { AdminChrome } from "@/components/admin/admin-chrome";
import { admin } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/auth/require-admin";

type AdminShellProps = {
  children: ReactNode;
  title: string;
};

/**
 * Admin chrome: accent header + cream page, Times/olive type (invitation brand).
 */
export async function AdminShell({ children, title }: AdminShellProps) {
  const session = await requireAdmin();

  return (
    <div className={`${admin.page} flex min-h-full flex-1 flex-col`}>
      <AdminChrome title={title} email={session.email} />
      <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-6 pb-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] lg:px-8 lg:py-10 lg:pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        {children}
      </main>
    </div>
  );
}
