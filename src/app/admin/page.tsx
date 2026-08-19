import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { admin } from "@/components/admin/admin-ui";
import { adminCopy } from "@/lib/admin/admin-copy";
import { formatEventDateTime } from "@/lib/datetime/event-timezone";
import { getDashboardMetrics } from "@/services/admin/families";

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  const cards = [
    { label: "Familias", value: metrics.familyCount },
    { label: "Respondidas", value: metrics.familiesResponded },
    { label: "Pendientes", value: metrics.familiesPending },
    { label: "Cupos asignados", value: metrics.assignedSeats },
    { label: "Asistentes", value: metrics.guestsAttending },
    { label: "No asisten", value: metrics.guestsNotAttending },
    { label: "Invitados sin responder", value: metrics.guestsPending },
    { label: "Cupos de bus", value: metrics.guestsNeedingTransport },
  ] as const;

  return (
    <AdminShell title="Resumen">
      <p className={admin.muted}>
        {metrics.eventName ?? "Evento"} · {adminCopy.rsvp.deadline}:{" "}
        {formatEventDateTime(metrics.rsvpDeadline)}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className={`${admin.card} px-5 py-4`}>
            <p className={admin.eyebrow}>{card.label}</p>
            <p className={`mt-2 ${admin.metricValue}`}>{card.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <a href="/api/admin/export" className={admin.btnPrimary} download>
          {adminCopy.nav.exportList}
        </a>
        <Link href="/admin/analytics" className={admin.btnSecondary}>
          Ver estadísticas
        </Link>
        <Link href="/admin/guests" className={admin.btnSecondary}>
          Ver invitados
        </Link>
        <Link href="/admin/families" className={admin.btnSecondary}>
          Ver familias
        </Link>
      </div>
    </AdminShell>
  );
}
