import Link from "next/link";

import {admin} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    type AdminActionQueueCounts,
    buildActionQueueItems,
} from "@/lib/admin/dashboard-resumen";

export type {AdminActionQueueCounts};

export function AdminActionQueue({counts}: {counts: AdminActionQueueCounts}) {
    const copy = adminCopy.operations;
    const items = buildActionQueueItems(counts);

    return (
        <section className={`${admin.card} p-5`}>
            <p className={admin.eyebrow}>{copy.queueTitle}</p>
            {items.length === 0 ? (
                <p className={`mt-2 ${admin.muted}`}>{copy.queueEmpty}</p>
            ) : (
                <>
                    <p className={`mt-1 ${admin.muted}`}>{copy.queueIntro}</p>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        {items.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`${admin.panel} flex min-h-11 flex-col items-start gap-2 px-4 py-3 transition-opacity hover:opacity-90 lg:flex-row lg:items-center lg:justify-between lg:gap-3`}
                                >
                                    <span>
                                        <span className="block font-medium text-cover-cta-fg">
                                            {item.label}
                                        </span>
                                        <span className={`block ${admin.muted}`}>
                                            {item.hint}
                                        </span>
                                    </span>
                                    <span className="text-2xl font-bold tabular-nums text-cover-cta-fg">
                                        {item.count}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </section>
    );
}
