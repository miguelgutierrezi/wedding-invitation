import {AdminPhotosBrowser} from "@/components/admin/admin-photos-browser";
import {AdminShell} from "@/components/admin/admin-shell";
import {rsvpDeadlineLead} from "@/lib/admin/dashboard-resumen";
import {requireAdmin} from "@/lib/auth/require-admin";
import {daysUntilDeadline} from "@/lib/datetime/event-timezone";
import {getAnalyticsSnapshot} from "@/services/admin/analytics";
import {getAdminMediaStats, getPrimaryEventId, listAdminMediaUploads} from "@/services/admin/guest-media";
import {getAdminEventMediaQrAccess} from "@/services/media/qr-access";

export default async function AdminPhotosPage() {
    // Gate before any privileged Storage/DB reads (do not rely only on AdminShell).
    await requireAdmin();

    const [stats, items, eventId, analytics] = await Promise.all([
        getAdminMediaStats(),
        listAdminMediaUploads(150),
        getPrimaryEventId(),
        getAnalyticsSnapshot(),
    ]);

    const qr = eventId ? await getAdminEventMediaQrAccess(eventId) : null;
    const deadlineLead = rsvpDeadlineLead(
        daysUntilDeadline(analytics.rsvpDeadline),
    );

    return (
        <AdminShell
            flush
            familyCount={analytics.familyCount}
            guestCount={analytics.totalGuests}
        >
            <AdminPhotosBrowser
                deadlineLead={deadlineLead}
                stats={stats}
                items={items}
                eventId={eventId}
                qr={qr}
            />
        </AdminShell>
    );
}
