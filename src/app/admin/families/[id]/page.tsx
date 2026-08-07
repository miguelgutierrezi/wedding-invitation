import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { FamilyDetailForm } from "@/components/admin/family-detail-form";
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
      <div className="mb-8 grid gap-4 rounded-2xl border border-[color:var(--ring)] bg-surface p-5 sm:grid-cols-3">
        <div>
          <p className="text-xs tracking-wide text-muted uppercase">Estado</p>
          <p className="mt-1 capitalize">{family.status}</p>
        </div>
        <div>
          <p className="text-xs tracking-wide text-muted uppercase">RSVP</p>
          <p className="mt-1">
            {family.willAttend === null
              ? "Sin respuesta"
              : family.willAttend
                ? `Asisten (${family.confirmedGuestCount ?? 0})`
                : "No asisten"}
          </p>
        </div>
        <div>
          <p className="text-xs tracking-wide text-muted uppercase">Contacto RSVP</p>
          <p className="mt-1 text-sm">
            {family.contactEmail ?? family.contactPhone ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs tracking-wide text-muted uppercase">Transporte</p>
          <p className="mt-1 text-sm">
            {family.guestsTransportCount} invitado
            {family.guestsTransportCount === 1 ? "" : "s"} en bus
          </p>
        </div>
        {family.rsvpMessage ? (
          <div className="sm:col-span-3">
            <p className="text-xs tracking-wide text-muted uppercase">Mensaje</p>
            <p className="mt-1 text-sm">{family.rsvpMessage}</p>
          </div>
        ) : null}
      </div>

      <div className="mb-8 rounded-2xl border border-[color:var(--ring)] bg-surface p-5">
        <p className="text-xs tracking-wide text-muted uppercase">Invitados</p>
        <ul className="mt-3 space-y-2 text-sm">
          {family.guests.map((guest) => (
            <li key={guest.id} className="flex flex-wrap gap-x-3 gap-y-1">
              <span className="font-medium">{guest.fullName}</span>
              <span className="text-muted capitalize">{guest.attendanceStatus}</span>
              {guest.needsTransport ? (
                <span className="text-accent">Bus</span>
              ) : null}
              {guest.dietaryRestrictions ? (
                <span className="text-muted">{guest.dietaryRestrictions}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="max-w-xl rounded-2xl border border-[color:var(--ring)] bg-surface p-6 sm:p-8">
        <FamilyDetailForm family={family} />
      </div>
    </AdminShell>
  );
}
