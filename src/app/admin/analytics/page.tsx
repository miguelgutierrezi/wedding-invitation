import {AdminAnalyticsDesktop} from "@/components/admin/admin-analytics-desktop";
import {AdminShell} from "@/components/admin/admin-shell";
import {
    buildAnalyticsBusPoints,
    buildAnalyticsRateRows,
    buildAnalyticsStatCards,
    formatAnalyticsBannerBody,
} from "@/lib/admin/admin-analytics";
import {adminCopy} from "@/lib/admin/admin-copy";
import {rsvpDeadlineLead} from "@/lib/admin/dashboard-resumen";
import {
    daysUntilDeadline,
    formatEventDeadlineOverline,
} from "@/lib/datetime/event-timezone";
import {getAnalyticsSnapshot} from "@/services/admin/analytics";
import {weddingConfig} from "@/config/wedding";

export default async function AdminAnalyticsPage() {
    const analytics = await getAnalyticsSnapshot();
    const deadlineLead = rsvpDeadlineLead(
        daysUntilDeadline(analytics.rsvpDeadline),
    );

    return (
        <AdminShell
            flush
            familyCount={analytics.familyCount}
            guestCount={analytics.totalGuests}
        >
            <AdminAnalyticsDesktop
                deadlineOverline={formatEventDeadlineOverline(analytics.rsvpDeadline)}
                deadlineLead={deadlineLead}
                bannerBody={formatAnalyticsBannerBody(weddingConfig.ceremony.name)}
                bannerBodyCompact={formatAnalyticsBannerBody(
                    weddingConfig.ceremony.name,
                    true,
                )}
                rates={buildAnalyticsRateRows({
                    familyResponseRate: analytics.familyResponseRate,
                    guestConfirmRate: analytics.guestConfirmRate,
                    transportAmongAttendingRate:
                        analytics.transportAmongAttendingRate,
                })}
                busIntro={adminCopy.analytics.busIntro(
                    analytics.guestsNeedingTransport,
                )}
                busPoints={buildAnalyticsBusPoints(analytics.transportByBoardingPoint)}
                stats={buildAnalyticsStatCards({
                    familyCount: analytics.familyCount,
                    familyResponseRate: analytics.familyResponseRate,
                    familiesResponded: analytics.familiesResponded,
                    familiesPending: analytics.familiesPending,
                    familiesOpened: analytics.familiesOpened,
                    familiesDisabled: analytics.familiesDisabled,
                    totalGuests: analytics.totalGuests,
                    guestConfirmRate: analytics.guestConfirmRate,
                    guestsAttending: analytics.guestsAttending,
                    guestsNotAttending: analytics.guestsNotAttending,
                    guestsPending: analytics.guestsPending,
                    guestsNeedingTransport: analytics.guestsNeedingTransport,
                    guestsWithDietary: analytics.guestsWithDietary,
                    guestsPendingNameConfirmation:
                        analytics.guestsPendingNameConfirmation,
                })}
            />
        </AdminShell>
    );
}
