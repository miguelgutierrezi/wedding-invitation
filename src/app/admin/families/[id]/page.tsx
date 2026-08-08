import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { admin } from "@/components/admin/admin-ui";
import { FamilyDetailForm } from "@/components/admin/family-detail-form";
import { formatTransportBoardingPoint } from "@/config/transport";
import { getFamilyById } from "@/services/admin/families";

type FamilyDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminFamilyDetailPage({
  params,
}: FamilyDetailPageProps) {
  const { id } = await params;
  const family = await getFamilyById(id);

  if (!family) {
    notFound();
  }

  return (
    <AdminShell title={family.displayName}>
      <div
        className={`mb-8 grid gap-4 ${admin.card} p-5 sm:grid-cols-3`}
      >
        <div>
          <p className={admin.eyebrow}>Estado</p>
          <p className={`mt-1 capitalize ${admin.body}`}>{family.status}</p>
        </div>
        <div>
          <p className={admin.eyebrow}>RSVP</p>
          <p className={`mt-1 ${admin.body}`}>
            {family.willAttend === null
              ? "Sin respuesta"
              : family.willAttend
                ? `Asisten (${family.confirmedGuestCount ?? 0})`
                : "No asisten"}
          </p>
        </div>
        <div>
          <p className={admin.eyebrow}>Contacto RSVP</p>
          <p className={`mt-1 ${admin.body}`}>
            {family.contactEmail ?? family.contactPhone ?? "—"}
          </p>
        </div>
        <div>
          <p className={admin.eyebrow}>Transporte</p>
          <p className={`mt-1 ${admin.body}`}>
            {family.guestsTransportCount} invitado
            {family.guestsTransportCount === 1 ? "" : "s"} en bus
          </p>
        </div>
        {family.rsvpMessage ? (
          <div className="sm:col-span-3">
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
              <span className="capitalize text-cover-cta-fg/70">
                {guest.attendanceStatus}
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
            </li>
          ))}
        </ul>
      </div>

      <div className={`max-w-xl ${admin.card} p-6 sm:p-8`}>
        <FamilyDetailForm family={family} />
      </div>
    </AdminShell>
  );
}
