import {AdminFamiliesBrowser} from "@/components/admin/admin-families-browser";
import {AdminShell} from "@/components/admin/admin-shell";
import {rsvpDeadlineLead} from "@/lib/admin/dashboard-resumen";
import {daysUntilDeadline} from "@/lib/datetime/event-timezone";
import {parseAdminFamiliesFilters} from "@/lib/validation/admin-filters";
import {getAnalyticsSnapshot} from "@/services/admin/analytics";
import {listFamilies} from "@/services/admin/families";

type AdminFamiliesPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminFamiliesPage({
    searchParams,
}: AdminFamiliesPageProps) {
    const [search, families, analytics] = await Promise.all([
        searchParams,
        listFamilies(),
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
            <AdminFamiliesBrowser
                families={families}
                initialFilters={parseAdminFamiliesFilters(search)}
                deadlineLead={deadlineLead}
            />
        </AdminShell>
    );
}
