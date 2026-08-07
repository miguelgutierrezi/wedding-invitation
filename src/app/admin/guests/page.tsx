import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { listAllGuests } from "@/services/admin/analytics";

function statusLabel(status: string): string {
  switch (status) {
    case "attending":
      return "Asiste";
    case "not_attending":
      return "No asiste";
    default:
      return "Pendiente";
  }
}

export default async function AdminGuestsPage() {
  const guests = await listAllGuests();

  const attending = guests.filter((g) => g.attendanceStatus === "attending");
  const notAttending = guests.filter(
    (g) => g.attendanceStatus === "not_attending",
  );
  const pending = guests.filter((g) => g.attendanceStatus === "pending");
  const withBus = guests.filter((g) => g.needsTransport);

  return (
    <AdminShell title="Invitados">
      <p className="text-sm text-muted">
        Resumen invitado por invitado. Totales: {guests.length} · Asisten{" "}
        {attending.length} · No asisten {notAttending.length} · Pendientes{" "}
        {pending.length} · Bus {withBus.length}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/analytics"
          className="inline-flex min-h-11 items-center rounded-full border border-[color:var(--ring)] px-4 text-sm font-medium"
        >
          Analytics
        </Link>
        <Link
          href="/admin/families"
          className="inline-flex min-h-11 items-center rounded-full border border-[color:var(--ring)] px-4 text-sm font-medium"
        >
          Familias
        </Link>
      </div>

      {guests.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          Aún no hay invitados. Crea familias para empezar.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-[color:var(--ring)] bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[color:var(--ring)] bg-cream/80 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Invitado</th>
                <th className="px-4 py-3 font-medium">Familia</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Bus</th>
                <th className="px-4 py-3 font-medium">Dieta</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr
                  key={guest.id}
                  className="border-b border-[color:var(--ring)] last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {guest.fullName}
                    {guest.isPrimaryContact ? (
                      <span className="ml-2 text-xs text-muted">principal</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-muted">{guest.familyName}</td>
                  <td className="px-4 py-3 text-muted">
                    {statusLabel(guest.attendanceStatus)}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {guest.needsTransport ? "Sí" : "—"}
                  </td>
                  <td className="max-w-[14rem] px-4 py-3 text-muted">
                    {guest.dietaryRestrictions?.trim()
                      ? guest.dietaryRestrictions
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {guest.email ?? guest.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/families/${guest.familyId}`}
                      className="inline-flex min-h-11 items-center text-sm font-medium text-accent underline-offset-4 hover:underline"
                    >
                      Familia
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
