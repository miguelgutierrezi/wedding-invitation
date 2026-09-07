import type {ReactNode} from "react";

import {AdminChrome} from "@/components/admin/admin-chrome";
import {admin} from "@/components/admin/admin-ui";
import {requireAdmin} from "@/lib/auth/require-admin";

type AdminShellProps = {
    children: ReactNode;
    title: string;
    variant?: "classic" | "resumen";
    familyCount?: number;
    guestCount?: number;
};

/**
 * Admin chrome: accent header + cream page, Times/olive type (invitation brand).
 * `variant="resumen"` uses the Figma chrome on all viewports.
 */
export async function AdminShell({
    children,
    title,
    variant = "classic",
    familyCount,
    guestCount,
}: AdminShellProps) {
    const session = await requireAdmin();
    const isResumen = variant === "resumen";

    return (
        <div
            className={`${admin.page} flex min-h-full flex-1 flex-col ${isResumen ? "bg-admin-canvas text-admin-ink" : ""}`}
        >
            <div className="shrink-0">
                <AdminChrome
                    title={title}
                    email={session.email}
                    variant={variant}
                    familyCount={familyCount}
                    guestCount={guestCount}
                />
            </div>
            <main
                className={
                    isResumen
                        ? "w-full min-w-0 flex-1 px-0 py-0 pb-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] min-[834px]:pb-[max(2.5rem,env(safe-area-inset-bottom))]"
                        : "mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-6 pb-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] min-[834px]:pb-[max(2.5rem,env(safe-area-inset-bottom))] lg:px-8 lg:py-10"
                }
            >
                {children}
            </main>
        </div>
    );
}
