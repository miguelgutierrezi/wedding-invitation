"use client";

import type {ReactNode} from "react";
import {ChevronLeft} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";

import {admin} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {showAdminBackToFamilies} from "@/lib/admin/admin-chrome";
import {readAdminFamiliesListReturnHref} from "@/lib/admin/admin-list-return";

export function AdminFamiliesBackButton({
    className,
    children,
}: {
    className: string;
    children: ReactNode;
}) {
    const router = useRouter();

    return (
        <button
            type="button"
            className={className}
            aria-label={adminCopy.nav.backToFamilies}
            onClick={() => {
                router.push(readAdminFamiliesListReturnHref());
            }}
        >
            {children}
        </button>
    );
}

export function AdminPageHeading({title}: {title: string}) {
    const pathname = usePathname();
    const showBack = showAdminBackToFamilies(pathname);

    return (
        <div className="mb-6 flex min-w-0 items-start gap-1 lg:mb-8">
            {showBack ? (
                <AdminFamiliesBackButton className="-ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-cover-cta-fg hover:bg-cover-cta-fg/10 focus-visible:ring-2 focus-visible:ring-cover-cta-fg/40 focus-visible:outline-none">
                    <ChevronLeft
                        strokeWidth={1.8}
                        className="max-w-none size-6"
                        aria-hidden="true"
                    />
                </AdminFamiliesBackButton>
            ) : null}
            <h1 className={admin.title}>{title}</h1>
        </div>
    );
}
