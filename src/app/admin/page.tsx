import {AdminResumenDesktop} from "@/components/admin/admin-resumen-desktop";
import {AdminShell} from "@/components/admin/admin-shell";
import {adminFilterLinks} from "@/lib/admin/admin-filter-links";
import {isActiveInvitation} from "@/lib/admin/active-invitation";
import {
    buildActionQueueItems,
    buildDashboardKpiCards,
    buildPendingSummary,
    rsvpDeadlineLead,
    selectResumenFollowUps,
} from "@/lib/admin/dashboard-resumen";
import {
    buildCloseFollowUpItems,
    buildRsvpCloseChecklist,
} from "@/lib/admin/rsvp-close-checklist";
import {
    daysUntilDeadline,
    formatEventDeadlineOverline,
} from "@/lib/datetime/event-timezone";
import {getAnalyticsSnapshot, listAllGuests} from "@/services/admin/analytics";
import {listFamilies} from "@/services/admin/families";
import {getAdminMediaStats} from "@/services/admin/guest-media";

export default async function AdminDashboardPage() {
    const [metrics, families, guests, mediaStats] = await Promise.all([
        getAnalyticsSnapshot(),
        listFamilies(),
        listAllGuests(),
        getAdminMediaStats(),
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
    const familiesDisabledPending = families.filter(
        (family) => !isActiveInvitation(family) && family.status === "pending",
    ).length;
    const daysUntilRsvp = daysUntilDeadline(metrics.rsvpDeadline);
    const deadlineLead = rsvpDeadlineLead(daysUntilRsvp);
    const queueCounts = {
        familiesPending: metrics.familiesPending,
        familiesOpenedPending,
        guestsNeedsName: metrics.guestsPendingNameConfirmation,
        guestsBusMissingPoint,
        photosAwaitingReview: mediaStats.uploadedCount,
        familiesDisabledPending,
    };
    const checklist = buildRsvpCloseChecklist({
        familyResponseRate: metrics.familyResponseRate,
        guestConfirmRate: metrics.guestConfirmRate,
        guestsAttending: metrics.guestsAttending,
        familiesPending: metrics.familiesPending,
        guestsPending: metrics.guestsPending,
        guestsPendingNameConfirmation: metrics.guestsPendingNameConfirmation,
    });
    const followUps = buildCloseFollowUpItems({
        familiesPending: metrics.familiesPending,
        familiesPendingHref: adminFilterLinks.familiesPending,
        guestsPendingNameConfirmation: metrics.guestsPendingNameConfirmation,
        guestsPendingNameHref: adminFilterLinks.guestsNeedsName,
        guestsNeedingTransport: metrics.guestsNeedingTransport,
        guestsTransportHref: adminFilterLinks.guestsWithBus,
        guestsBusMissingPoint,
        guestsBusMissingHref: adminFilterLinks.guestsBusMissingPoint,
        guestsWithDietary: metrics.guestsWithDietary,
        guestsDietaryHref: adminFilterLinks.guestsWithDietary,
        photosAwaitingReview: mediaStats.uploadedCount,
        photosHref: "/admin/photos",
    });

    return (
        <AdminShell
            flush
            familyCount={metrics.familyCount}
            guestCount={metrics.totalGuests}
        >
            <AdminResumenDesktop
                deadlineOverline={formatEventDeadlineOverline(metrics.rsvpDeadline)}
                deadlineLead={deadlineLead}
                kpis={buildDashboardKpiCards({
                    familyCount: metrics.familyCount,
                    familyResponseRate: metrics.familyResponseRate,
                    assignedSeats: metrics.assignedSeats,
                    guestConfirmRate: metrics.guestConfirmRate,
                    guestsAttending: metrics.guestsAttending,
                    guestsNeedingTransport: metrics.guestsNeedingTransport,
                })}
                checklist={checklist}
                familyResponded={metrics.familiesResponded}
                familyPending={metrics.familiesPending}
                guestsResponded={metrics.totalGuests - metrics.guestsPending}
                guestsPending={metrics.guestsPending}
                followUps={selectResumenFollowUps(followUps)}
                attentionItems={buildActionQueueItems(queueCounts)}
                pendingSummary={buildPendingSummary({
                    familiesPending: metrics.familiesPending,
                    guestsPending: metrics.guestsPending,
                    guestsPendingNameConfirmation:
                        metrics.guestsPendingNameConfirmation,
                })}
            />
        </AdminShell>
    );
}
