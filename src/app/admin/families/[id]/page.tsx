import {notFound} from "next/navigation";

import {AdminFamilyActivity} from "@/components/admin/admin-family-activity";
import {AdminFamilyOpsChips} from "@/components/admin/admin-family-ops-chips";
import {AdminShell} from "@/components/admin/admin-shell";
import {admin} from "@/components/admin/admin-ui";
import {FamilyStatusBadge} from "@/components/admin/admin-status-badge";
import {FamilyDetailForm} from "@/components/admin/family-detail-form";
import {adminCopy} from "@/lib/admin/admin-copy";
import {familyOperationChips} from "@/lib/admin/family-ops";
import {formatEventDateTimeShort} from "@/lib/datetime/event-timezone";
import {formatTransportBoardingPoint} from "@/config/transport";
import {listFamilyActivity} from "@/services/admin/family-activity";
import {getFamilyById} from "@/services/admin/families";

type FamilyDetailPageProps = {
    params: Promise<{ id: string }>;
};

function guestAttendanceLabel(status: string): string {
    if (status === "attending") {
        return "asiste";
    }
    if (status === "not_attending") {
        return "no asiste";
    }
    return "sin confirmar";
}

export default async function AdminFamilyDetailPage({
                                                        params,
                                                    }: FamilyDetailPageProps) {
    const {id} = await params;
    const [family, activity] = await Promise.all([
        getFamilyById(id),
        listFamilyActivity(id),
    ]);

    if (!family) {
        notFound();
    }

    const opsChips = familyOperationChips(family);

    return (
        <AdminShell title={family.displayName}>
            <div className={`mb-8 grid gap-4 ${admin.card} p-5 lg:grid-cols-3`}>
                <div>
                    <p className={admin.eyebrow}>Estado</p>
                    <p className={`mt-1 ${admin.body}`}>
                        <FamilyStatusBadge status={family.status}/>
                    </p>
                    {opsChips.length > 0 ? (
                        <div className="mt-2">
                            <AdminFamilyOpsChips chips={opsChips}/>
                        </div>
                    ) : null}
                </div>
                <div>
                    <p className={admin.eyebrow}>Última actualización</p>
                    <p className={`mt-1 ${admin.body}`}>
                        {formatEventDateTimeShort(family.updatedAt)}
                    </p>
                </div>
                <div>
                    <p className={admin.eyebrow}>{adminCopy.rsvp.noun}</p>
                    <p className={`mt-1 ${admin.body}`}>
                        {family.willAttend === null
                            ? adminCopy.rsvp.noResponse
                            : family.willAttend
                                ? `Asisten (${family.confirmedGuestCount ?? 0})`
                                : "No asisten"}
                    </p>
                </div>
                <div>
                    <p className={admin.eyebrow}>{adminCopy.rsvp.phone}</p>
                    <p className={`mt-1 ${admin.body}`}>{family.contactPhone ?? "—"}</p>
                </div>
                <div>
                    <p className={admin.eyebrow}>{adminCopy.rsvp.email}</p>
                    <p className={`mt-1 ${admin.body}`}>{family.contactEmail ?? "—"}</p>
                </div>
                <div>
                    <p className={admin.eyebrow}>Transporte</p>
                    <p className={`mt-1 ${admin.body}`}>
                        {family.guestsTransportCount} invitado
                        {family.guestsTransportCount === 1 ? "" : "s"} en bus
                    </p>
                </div>
                {family.rsvpMessage ? (
                    <div className="lg:col-span-3">
                        <p className={admin.eyebrow}>Mensaje</p>
                        <p className={`mt-1 ${admin.body}`}>{family.rsvpMessage}</p>
                    </div>
                ) : null}
            </div>

            <div className={`mb-8 ${admin.card} p-5`}>
                <p className={admin.eyebrow}>Invitados</p>
                <ul className={`mt-3 space-y-2 ${admin.body}`}>
                    {family.guests.map((guest) => (
                        <li key={guest.id} className="flex flex-wrap gap-x-3 gap-y-1">
                            <span className="font-bold">{guest.fullName}</span>
                            <span className="text-cover-cta-fg/70">
                {guestAttendanceLabel(guest.attendanceStatus)}
              </span>
                            {guest.needsTransport ? (
                                <span className="font-bold text-accent-deep">
                  Bus · {formatTransportBoardingPoint(guest.transportBoardingPoint)}
                </span>
                            ) : null}
                            {guest.dietaryRestrictions ? (
                                <span className="text-cover-cta-fg/70">
                  {guest.dietaryRestrictions}
                </span>
                            ) : null}
                            {guest.phone ? (
                                <span className="text-cover-cta-fg/70">{guest.phone}</span>
                            ) : null}
                            {guest.email ? (
                                <span className="text-cover-cta-fg/70">{guest.email}</span>
                            ) : null}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-8">
                <AdminFamilyActivity items={activity}/>
            </div>

            <div className={`max-w-xl ${admin.card} p-6 sm:p-8`}>
                <FamilyDetailForm family={family}/>
            </div>
        </AdminShell>
    );
}
