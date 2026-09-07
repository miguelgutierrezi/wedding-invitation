import type {ReactNode} from "react";

import {AdminChrome} from "@/components/admin/admin-chrome";
import {AdminPageHeading} from "@/components/admin/admin-page-heading";
import {admin} from "@/components/admin/admin-ui";
import {requireAdmin} from "@/lib/auth/require-admin";
import {getAnalyticsSnapshot} from "@/services/admin/analytics";

type AdminShellProps = {
    children: ReactNode;
    /** In-page title under the shared Figma navbar. Omit on Resumen. */
    title?: string;
    familyCount?: number;
    guestCount?: number;
    /** Full-bleed main (Resumen workspace). */
    flush?: boolean;
};

/**
 * Shared admin chrome: Figma white navbar, olive pills from `lg`, cream left
 * drawer below that. Page titles live in the main column, not the bar.
 */
export async function AdminShell({
    children,
    title,
    familyCount,
    guestCount,
    flush = false,
}: AdminShellProps) {
    const session = await requireAdmin();
    let drawerFamilyCount = familyCount;
    let drawerGuestCount = guestCount;
    if (drawerFamilyCount == null || drawerGuestCount == null) {
        const snapshot = await getAnalyticsSnapshot();
        drawerFamilyCount = snapshot.familyCount;
        drawerGuestCount = snapshot.totalGuests;
    }

    return (
        <div
            className={`${admin.page} flex min-h-full flex-1 flex-col bg-admin-canvas text-admin-ink`}
        >
            <div className="shrink-0">
                <AdminChrome
                    email={session.email}
                    familyCount={drawerFamilyCount}
                    guestCount={drawerGuestCount}
                />
            </div>
            <main
                className={
                    flush
                        ? "w-full min-w-0 flex-1 px-0 py-0 pb-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] min-[834px]:pb-[max(2.5rem,env(safe-area-inset-bottom))]"
                        : "mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-6 pb-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] min-[834px]:pb-[max(2.5rem,env(safe-area-inset-bottom))] lg:px-8 lg:py-10"
                }
            >
                {title ? <AdminPageHeading title={title} /> : null}
                {children}
            </main>
        </div>
    );
}
