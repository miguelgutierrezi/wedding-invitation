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
        {family.rsvpMessage ? (
          <div className="sm:col-span-3">
            <p className="text-xs tracking-wide text-muted uppercase">Mensaje</p>
            <p className="mt-1 text-sm">{family.rsvpMessage}</p>
          </div>
        ) : null}
      </div>

      <div className="max-w-xl rounded-2xl border border-[color:var(--ring)] bg-surface p-6 sm:p-8">
        <FamilyDetailForm family={family} />
      </div>
    </AdminShell>
  );
}
