import {AdminFamilyDetailDesktop} from "@/components/admin/admin-family-detail-desktop";
import {AdminFamilyDetailMobile} from "@/components/admin/admin-family-detail-mobile";
import {AdminFamilyDetailPortrait} from "@/components/admin/admin-family-detail-portrait";
import {AdminShell} from "@/components/admin/admin-shell";
import {rsvpDeadlineLead} from "@/lib/admin/dashboard-resumen";
import {daysUntilDeadline} from "@/lib/datetime/event-timezone";
import {redirectUnknownRoute} from "@/lib/public/root-not-found-layout";
import {getAnalyticsSnapshot} from "@/services/admin/analytics";
import {listFamilyActivity} from "@/services/admin/family-activity";
import {getFamilyById} from "@/services/admin/families";

type FamilyDetailPageProps = {
    params: Promise<{id: string}>;
};

export default async function AdminFamilyDetailPage({
    params,
}: FamilyDetailPageProps) {
    const {id} = await params;
    const [family, activity, analytics] = await Promise.all([
        getFamilyById(id),
        listFamilyActivity(id),
        getAnalyticsSnapshot(),
    ]);

    if (!family) {
        redirectUnknownRoute();
    }

    const deadlineLead = rsvpDeadlineLead(
        daysUntilDeadline(analytics.rsvpDeadline),
    );

    return (
        <AdminShell
            flush
            familyCount={analytics.familyCount}
            guestCount={analytics.totalGuests}
        >
            <AdminFamilyDetailDesktop
                family={family}
                activity={activity}
                deadlineLead={deadlineLead}
            />
            <AdminFamilyDetailPortrait
                family={family}
                activity={activity}
                deadlineLead={deadlineLead}
            />
            <AdminFamilyDetailMobile
                family={family}
                activity={activity}
                deadlineLead={deadlineLead}
            />
        </AdminShell>
    );
}
