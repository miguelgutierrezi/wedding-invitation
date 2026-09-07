"use client";

import {ChevronLeft} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";

import {admin} from "@/components/admin/admin-ui";
import {showAdminBackToFamilies} from "@/lib/admin/admin-chrome";
import {adminCopy} from "@/lib/admin/admin-copy";
import {readAdminFamiliesListReturnHref} from "@/lib/admin/admin-list-return";

export function AdminPageHeading({title}: {title: string}) {
    const pathname = usePathname();
    const router = useRouter();
    const showBack = showAdminBackToFamilies(pathname);

    return (
        <div className="mb-6 flex min-w-0 items-start gap-1 lg:mb-8">
            {showBack ? (
                <button
                    type="button"
                    className="-ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-cover-cta-fg hover:bg-cover-cta-fg/10 focus-visible:ring-2 focus-visible:ring-cover-cta-fg/40 focus-visible:outline-none"
                    aria-label={adminCopy.nav.backToFamilies}
                    onClick={() => {
                        router.push(readAdminFamiliesListReturnHref());
                    }}
                >
                    <ChevronLeft
                        strokeWidth={1.8}
                        className="max-w-none size-6"
                        aria-hidden="true"
                    />
                </button>
            ) : null}
            <h1 className={admin.title}>{title}</h1>
        </div>
    );
}
