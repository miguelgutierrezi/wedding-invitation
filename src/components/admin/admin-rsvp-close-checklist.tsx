import Link from "next/link";

import {admin} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import type {
    CloseFollowUpItem,
    RsvpCloseChecklist,
} from "@/lib/admin/rsvp-close-checklist";

function followUpValue(item: CloseFollowUpItem, doneLabel: string): string {
    if (item.key === "diet" || item.key === "transport") {
        return String(item.count);
    }
    if (item.done) {
        return doneLabel;
    }
    return String(item.count);
}

export function AdminRsvpCloseChecklist({
    checklist,
    followUps,
}: {
    checklist: RsvpCloseChecklist;
    followUps: CloseFollowUpItem[];
}) {
    const copy = adminCopy.operations;

    return (
        <section className={`${admin.card} p-5`}>
            <p className={admin.eyebrow}>{copy.closeTitle}</p>
            <p className={`mt-2 text-lg font-bold text-cover-cta-fg`}>
                {checklist.ready ? copy.closeReady : copy.closeNotReady}
            </p>
            <p className={`mt-1 ${admin.muted}`}>
                {checklist.ready ? copy.closeReadyBody : copy.closeNotReadyBody}
            </p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                    <dt className={admin.muted}>{copy.familyRate}</dt>
                    <dd className="text-xl font-bold tabular-nums text-cover-cta-fg">
                        {checklist.familyResponseRate}%
                    </dd>
                </div>
                <div>
                    <dt className={admin.muted}>{copy.guestRate}</dt>
                    <dd className="text-xl font-bold tabular-nums text-cover-cta-fg">
                        {checklist.guestConfirmRate}%
                    </dd>
                </div>
                <div>
                    <dt className={admin.muted}>{copy.attending}</dt>
                    <dd className="text-xl font-bold tabular-nums text-cover-cta-fg">
                        {checklist.guestsAttending}
                    </dd>
                </div>
                <div>
                    <dt className={admin.muted}>{copy.stillPending}</dt>
                    <dd className="text-xl font-bold tabular-nums text-cover-cta-fg">
                        {checklist.familiesPending} familias · {checklist.guestsPending}{" "}
                        invitados
                        {checklist.guestsPendingNameConfirmation > 0
                            ? ` · ${checklist.guestsPendingNameConfirmation} nombres`
                            : ""}
                    </dd>
                </div>
            </dl>
            <p className={`mt-6 ${admin.eyebrow}`}>{copy.closeFollowUpsTitle}</p>
            <p className={`mt-1 ${admin.muted}`}>{copy.closeFollowUpsIntro}</p>
            <ul className="mt-3 grid gap-2">
                {followUps.map((item) => (
                    <li key={item.key}>
                        <Link
                            href={item.href}
                            className={`${admin.panel} flex min-h-11 items-start justify-between gap-3 px-4 py-3 transition-opacity hover:opacity-90`}
                        >
                            <span>
                                <span className="block font-medium text-cover-cta-fg">
                                    {item.done ? "✓ " : ""}
                                    {item.label}
                                </span>
                                <span className={`block ${admin.muted}`}>{item.hint}</span>
                            </span>
                            <span className="shrink-0 text-lg font-bold tabular-nums text-cover-cta-fg">
                                {followUpValue(item, copy.closeItemDone)}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
