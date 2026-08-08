import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
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
        <span className="text-muted">{label}</span>
        <span className="font-medium tabular-nums text-foreground">{safe}%</span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-cream-deep">
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
      <p className="text-sm text-muted">
        {analytics.eventName ?? "Evento"} · Límite RSVP:{" "}
        {formatDate(analytics.rsvpDeadline)}
      </p>

      <section className="mt-8 space-y-5 rounded-2xl border border-[color:var(--ring)] bg-surface p-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-accent">
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-[color:var(--ring)] bg-surface px-5 py-4"
          >
            <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">
              {card.label}
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-foreground">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/guests"
          className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-foreground"
        >
          Ver invitados uno a uno
        </Link>
        <Link
          href="/admin/families"
          className="inline-flex min-h-11 items-center rounded-full border border-[color:var(--ring)] px-5 text-sm font-medium"
        >
          Ver familias
        </Link>
      </div>
    </AdminShell>
  );
}
