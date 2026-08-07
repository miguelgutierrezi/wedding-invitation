import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { listFamilies } from "@/services/admin/families";

function formatDate(iso: string | null): string {
  if (!iso) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export default async function AdminFamiliesPage() {
  const families = await listFamilies();

  return (
    <AdminShell title="Familias">
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/families/new"
          className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-on-dark"
        >
          Nueva familia
        </Link>
      </div>

      {families.length === 0 ? (
        <p className="text-sm text-muted">
          Aún no hay familias. Crea la primera para generar un enlace.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[color:var(--ring)] bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[color:var(--ring)] bg-cream/80 text-xs tracking-wide text-muted uppercase">
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
                <tr
                  key={family.id}
                  className="border-b border-[color:var(--ring)] last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {family.displayName}
                    {!family.isEnabled ? (
                      <span className="ml-2 text-xs text-red-700">off</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {family.guestCount}/{family.maximumGuests}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {family.confirmedGuestCount ?? "—"}
                  </td>
                  <td className="px-4 py-3 capitalize text-muted">
                    {family.status}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatDate(family.lastOpenedAt)}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatDate(family.submittedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/families/${family.id}`}
                      className="inline-flex min-h-11 items-center text-sm font-medium text-accent underline-offset-4 hover:underline"
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
