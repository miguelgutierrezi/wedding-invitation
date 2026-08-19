import Link from "next/link";

import {AdminActionQueue} from "@/components/admin/admin-action-queue";
import {AdminRsvpCloseChecklist} from "@/components/admin/admin-rsvp-close-checklist";
import {AdminShell} from "@/components/admin/admin-shell";
import {admin} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {adminFilterLinks} from "@/lib/admin/admin-filter-links";
import {isActiveInvitation} from "@/lib/admin/active-invitation";
import {buildRsvpCloseChecklist} from "@/lib/admin/rsvp-close-checklist";
import {formatEventDateTime} from "@/lib/datetime/event-timezone";
import {getAnalyticsSnapshot, listAllGuests} from "@/services/admin/analytics";
import {listFamilies} from "@/services/admin/families";

export default async function AdminDashboardPage() {
    const [metrics, families, guests] = await Promise.all([
        getAnalyticsSnapshot(),
        listFamilies(),
        listAllGuests(),
    ]);

    const familiesOpenedPending = families.filter(
        (family) =>
            isActiveInvitation(family) &&
            family.status === "pending" &&
            Boolean(family.lastOpenedAt),
    ).length;
    const guestsBusMissingPoint = guests.filter(
        (guest) => guest.needsTransport && !guest.transportBoardingPoint,
    ).length;

    const cards = [
        {
            label: "Familias",
            value: metrics.familyCount,
            href: adminFilterLinks.families,
        },
        {
            label: "Ya confirmaron",
            value: metrics.familiesResponded,
            href: adminFilterLinks.familiesResponded,
        },
        {
            label: "Sin confirmar",
            value: metrics.familiesPending,
            href: adminFilterLinks.familiesPending,
        },
        {label: "Cupos asignados", value: metrics.assignedSeats},
        {
            label: "Asistentes",
            value: metrics.guestsAttending,
            href: adminFilterLinks.guestsAttending,
        },
        {
            label: "No asisten",
            value: metrics.guestsNotAttending,
            href: adminFilterLinks.guestsNotAttending,
        },
        {
            label: "Invitados sin responder",
            value: metrics.guestsPending,
            href: adminFilterLinks.guestsPending,
        },
        {
            label: "Cupos de bus",
            value: metrics.guestsNeedingTransport,
            href: adminFilterLinks.guestsWithBus,
        },
    ] as const;

    return (
        <AdminShell title="Resumen">
            <p className={admin.muted}>
                {metrics.eventName ?? "Evento"} · {adminCopy.rsvp.deadline}:{" "}
                {formatEventDateTime(metrics.rsvpDeadline)}
            </p>

            <div className="mt-8 space-y-6">
                <AdminActionQueue
                    counts={{
                        familiesPending: metrics.familiesPending,
                        familiesOpenedPending,
                        guestsNeedsName: metrics.guestsPendingNameConfirmation,
                        guestsBusMissingPoint,
                    }}
                />
                <AdminRsvpCloseChecklist
                    checklist={buildRsvpCloseChecklist({
                        familyResponseRate: metrics.familyResponseRate,
                        guestConfirmRate: metrics.guestConfirmRate,
                        guestsAttending: metrics.guestsAttending,
                        familiesPending: metrics.familiesPending,
                        guestsPending: metrics.guestsPending,
                        guestsPendingNameConfirmation: metrics.guestsPendingNameConfirmation,
                    })}
                />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => {
                    const inner = (
                        <>
                            <p className={admin.eyebrow}>{card.label}</p>
                            <p className={`mt-2 ${admin.metricValue}`}>{card.value}</p>
                        </>
                    );

                    if ("href" in card && card.href) {
                        return (
                            <Link
                                key={card.label}
                                href={card.href}
                                className={`${admin.card} px-5 py-4 transition-opacity hover:opacity-90`}
                            >
                                {inner}
                            </Link>
                        );
                    }

                    return (
                        <div key={card.label} className={`${admin.card} px-5 py-4`}>
                            {inner}
                        </div>
                    );
                })}
            </div>
            <div className="mt-10">
                <a href="/api/admin/export" className={admin.btnPrimary} download>
                    {adminCopy.nav.exportList}
                </a>
            </div>
        </AdminShell>
    );
}
