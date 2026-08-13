import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { admin } from "@/components/admin/admin-ui";
import { formatEventDateTimeShort } from "@/lib/datetime/event-timezone";
import { listFamilies } from "@/services/admin/families";

export default async function AdminFamiliesPage() {
  const families = await listFamilies();

  return (
    <AdminShell title="Familias">
      <div className="mb-6 flex justify-end">
        <Link href="/admin/families/new" className={admin.btnPrimary}>
          Nueva familia
        </Link>
      </div>

      {families.length === 0 ? (
        <p className={admin.muted}>
          Aún no hay familias. Crea la primera para generar un enlace.
        </p>
      ) : (
        <div className={admin.tableShell}>
          <table className="min-w-full text-left text-sm font-[family-name:var(--font-timer)]">
            <thead className={admin.tableHead}>
              <tr>
                <th className="px-4 py-3 font-medium">Familia</th>
                <th className="px-4 py-3 font-medium">Cupos</th>
                <th className="px-4 py-3 font-medium">Confirmados</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Abierta</th>
                <th className="px-4 py-3 font-medium">RSVP</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {families.map((family) => (
                <tr key={family.id} className={admin.tableRow}>
                  <td className="px-4 py-3 font-medium text-cover-cta-fg">
                    <div>{family.displayName}</div>
                    <div className="mt-0.5 font-mono text-xs font-normal text-cover-cta-fg/65">
                      /i/{family.invitationSlug}
                    </div>
                    {!family.isEnabled ? (
                      <span className="ml-0 text-xs text-red-800">off</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-cover-cta-fg/75">
                    {family.guestCount}/{family.maximumGuests}
                  </td>
                  <td className="px-4 py-3 text-cover-cta-fg/75">
                    {family.confirmedGuestCount ?? "—"}
                  </td>
                  <td className="px-4 py-3 capitalize text-cover-cta-fg/75">
                    {family.status}
                  </td>
                  <td className="px-4 py-3 text-cover-cta-fg/75">
                    {formatEventDateTimeShort(family.lastOpenedAt)}
                  </td>
                  <td className="px-4 py-3 text-cover-cta-fg/75">
                    {formatEventDateTimeShort(family.submittedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/families/${family.id}`}
                      className={admin.link}
                    >
                      Ver
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
