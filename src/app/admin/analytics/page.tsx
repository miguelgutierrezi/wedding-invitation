import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { admin } from "@/components/admin/admin-ui";
import { getTransportBoardingPoint } from "@/config/transport";
import { weddingConfig } from "@/config/wedding";
import { getAnalyticsSnapshot } from "@/services/admin/analytics";

function formatDate(iso: string | null): string {
  if (!iso) {
    return "Por definir";
  }

  try {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function RateBar({ label, percent }: { label: string; percent: number }) {
  const safe = Math.min(100, Math.max(0, percent));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-cover-cta-fg/70">{label}</span>
        <span className="font-medium tabular-nums text-cover-cta-fg">
          {safe}%
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-cover-cta-fg/10">
        <div
          className="h-full rounded-full bg-accent transition-[width]"
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalyticsSnapshot();

  const cards = [
    { label: "Familias", value: analytics.familyCount },
    { label: "Familias respondidas", value: analytics.familiesResponded },
    { label: "Familias pendientes", value: analytics.familiesPending },
    { label: "Invitaciones abiertas", value: analytics.familiesOpened },
    { label: "Familias deshabilitadas", value: analytics.familiesDisabled },
    { label: "Invitados totales", value: analytics.totalGuests },
    { label: "Asistentes", value: analytics.guestsAttending },
    { label: "No asisten", value: analytics.guestsNotAttending },
    { label: "Sin responder", value: analytics.guestsPending },
    { label: "Cupos de bus", value: analytics.guestsNeedingTransport },
    { label: "Con dieta especial", value: analytics.guestsWithDietary },
    { label: "Cupos asignados", value: analytics.assignedSeats },
  ] as const;

  return (
    <AdminShell title="Analytics">
      <p className={admin.muted}>
        {analytics.eventName ?? "Evento"} · Límite RSVP:{" "}
        {formatDate(analytics.rsvpDeadline)}
      </p>

      <section className={`mt-8 space-y-5 ${admin.card} p-6`}>
        <h2 className="font-[family-name:var(--font-timer)] text-xl font-bold text-cover-cta-fg">
          Tasas
        </h2>
        <RateBar
          label="Familias que ya respondieron (habilitadas)"
          percent={analytics.familyResponseRate}
        />
        <RateBar
          label="Invitados con respuesta (asiste / no asiste)"
          percent={analytics.guestConfirmRate}
        />
        <RateBar
          label="Asistentes que usarán bus"
          percent={analytics.transportAmongAttendingRate}
        />
      </section>

      <section className={`mt-8 space-y-4 ${admin.card} p-6`}>
        <h2 className="font-[family-name:var(--font-timer)] text-xl font-bold text-cover-cta-fg">
          Cupos de bus por punto de encuentro
        </h2>
        <p className={admin.muted}>
          Solo asistentes que confirmaron transporte. Total con bus:{" "}
          {analytics.guestsNeedingTransport}.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {weddingConfig.transport.meetingPoints.map((point) => {
            const count =
              analytics.transportByBoardingPoint[point.id] ?? 0;
            const detail = getTransportBoardingPoint(point.id);

            return (
              <div key={point.id} className={`${admin.panel} px-5 py-4`}>
                <p className={admin.eyebrow}>{point.title}</p>
                <p className={`mt-1 ${admin.muted}`}>
                  {detail?.place ?? point.place}
                </p>
                <p className={`mt-2 ${admin.metricValue}`}>{count}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className={`${admin.card} px-5 py-4`}>
            <p className={admin.eyebrow}>{card.label}</p>
            <p className={`mt-2 ${admin.metricValue}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/admin/guests" className={admin.btnPrimary}>
          Ver invitados uno a uno
        </Link>
        <Link href="/admin/families" className={admin.btnSecondary}>
          Ver familias
        </Link>
      </div>
    </AdminShell>
  );
}
