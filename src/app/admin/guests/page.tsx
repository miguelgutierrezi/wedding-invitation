import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { admin } from "@/components/admin/admin-ui";
import { formatTransportBoardingPoint } from "@/config/transport";
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
      <p className={admin.muted}>
        Resumen invitado por invitado. Totales: {guests.length} · Asisten{" "}
        {attending.length} · No asisten {notAttending.length} · Pendientes{" "}
        {pending.length} · Bus {withBus.length}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/analytics" className={admin.btnSecondary}>
          Analytics
        </Link>
        <Link href="/admin/families" className={admin.btnSecondary}>
          Familias
        </Link>
      </div>

      {guests.length === 0 ? (
        <p className={`mt-8 ${admin.muted}`}>
          Aún no hay invitados. Crea familias para empezar.
        </p>
      ) : (
        <div className={`mt-8 ${admin.tableShell}`}>
          <table className="min-w-full text-left text-sm font-[family-name:var(--font-timer)]">
            <thead className={admin.tableHead}>
              <tr>
                <th className="px-4 py-3 font-medium">Invitado</th>
                <th className="px-4 py-3 font-medium">Familia</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Bus</th>
                <th className="px-4 py-3 font-medium">Punto de salida</th>
                <th className="px-4 py-3 font-medium">Dieta</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.id} className={admin.tableRow}>
                  <td className="px-4 py-3 font-medium text-cover-cta-fg">
                    {guest.fullName}
                    {guest.isPrimaryContact ? (
                      <span className="ml-2 text-xs text-cover-cta-fg/65">
                        principal
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-cover-cta-fg/75">
                    {guest.familyName}
                  </td>
                  <td className="px-4 py-3 text-cover-cta-fg/75">
                    {statusLabel(guest.attendanceStatus)}
                  </td>
                  <td className="px-4 py-3 text-cover-cta-fg/75">
                    {guest.needsTransport ? "Sí" : "—"}
                  </td>
                  <td className="max-w-[12rem] px-4 py-3 text-cover-cta-fg/75">
                    {guest.needsTransport
                      ? formatTransportBoardingPoint(
                          guest.transportBoardingPoint,
                        )
                      : "—"}
                  </td>
                  <td className="max-w-[14rem] px-4 py-3 text-cover-cta-fg/75">
                    {guest.dietaryRestrictions?.trim()
                      ? guest.dietaryRestrictions
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-cover-cta-fg/75">
                    {guest.email ?? guest.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/families/${guest.familyId}`}
                      className={admin.link}
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
