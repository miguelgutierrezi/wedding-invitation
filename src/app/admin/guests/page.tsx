import {AdminGuestsBrowser} from "@/components/admin/admin-guests-browser";
import {AdminShell} from "@/components/admin/admin-shell";
import {rsvpDeadlineLead} from "@/lib/admin/dashboard-resumen";
import {daysUntilDeadline} from "@/lib/datetime/event-timezone";
import {parseAdminGuestsFilters} from "@/lib/validation/admin-filters";
import {getAnalyticsSnapshot, listAllGuests} from "@/services/admin/analytics";

type AdminGuestsPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminGuestsPage({
                                                  searchParams,
                                              }: AdminGuestsPageProps) {
    const [search, guests, analytics] = await Promise.all([
        searchParams,
        listAllGuests(),
        getAnalyticsSnapshot(),
    ]);
    const deadlineLead = rsvpDeadlineLead(
        daysUntilDeadline(analytics.rsvpDeadline),
    );

    return (
        <AdminShell
            flush
            familyCount={analytics.familyCount}
            guestCount={analytics.totalGuests}
        >
            <AdminGuestsBrowser
                guests={guests}
                initialFilters={parseAdminGuestsFilters(search)}
                deadlineLead={deadlineLead}
            />
        </AdminShell>
    );
}
