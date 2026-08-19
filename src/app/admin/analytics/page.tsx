import Link from "next/link";
import type {ReactNode} from "react";

import {AdminShell} from "@/components/admin/admin-shell";
import {admin} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {adminFilterLinks} from "@/lib/admin/admin-filter-links";
import {getTransportBoardingPoint} from "@/config/transport";
import {weddingConfig} from "@/config/wedding";
import {formatEventDateTime} from "@/lib/datetime/event-timezone";
import {getAnalyticsSnapshot} from "@/services/admin/analytics";

function RateBar({label, percent}: { label: string; percent: number }) {
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
                    style={{width: `${safe}%`}}
                />
            </div>
        </div>
    );
}

function MetricCard({
                        label,
                        value,
                        href,
                    }: {
    label: string;
    value: number;
    href?: string;
}) {
    const inner: ReactNode = (
        <>
            <p className={admin.eyebrow}>{label}</p>
            <p className={`mt-2 ${admin.metricValue}`}>{value}</p>
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                className={`${admin.card} px-5 py-4 transition-opacity hover:opacity-90`}
            >
                {inner}
            </Link>
        );
    }

    return <div className={`${admin.card} px-5 py-4`}>{inner}</div>;
}

export default async function AdminAnalyticsPage() {
    const analytics = await getAnalyticsSnapshot();

    const cards = [
        {label: "Familias", value: analytics.familyCount, href: adminFilterLinks.families},
        {
            label: "Familias que confirmaron",
            value: analytics.familiesResponded,
            href: adminFilterLinks.familiesResponded,
        },
        {
            label: "Familias sin confirmar",
            value: analytics.familiesPending,
            href: adminFilterLinks.familiesPending,
        },
        {
            label: "Abrieron la invitación",
            value: analytics.familiesOpened,
            href: adminFilterLinks.familiesOpened,
        },
        {
            label: "Familias desactivadas",
            value: analytics.familiesDisabled,
            href: adminFilterLinks.familiesDisabled,
        },
        {label: "Invitados totales", value: analytics.totalGuests, href: adminFilterLinks.guests},
        {
            label: "Asistentes",
            value: analytics.guestsAttending,
            href: adminFilterLinks.guestsAttending,
        },
        {
            label: "No asisten",
            value: analytics.guestsNotAttending,
            href: adminFilterLinks.guestsNotAttending,
        },
        {
            label: "Sin confirmar",
            value: analytics.guestsPending,
            href: adminFilterLinks.guestsPending,
        },
        {
            label: "Cupos de bus",
            value: analytics.guestsNeedingTransport,
            href: adminFilterLinks.guestsWithBus,
        },
        {
            label: "Con dieta especial",
            value: analytics.guestsWithDietary,
            href: adminFilterLinks.guestsWithDietary,
        },
        {
            label: "Nombres por confirmar",
            value: analytics.guestsPendingNameConfirmation,
            href: adminFilterLinks.guestsNeedsName,
        },
    ] as const;

    return (
        <AdminShell title={adminCopy.nav.statistics}>
            <p className={admin.muted}>
                {analytics.eventName ?? "Evento"} · {adminCopy.rsvp.deadline}:{" "}
                {formatEventDateTime(analytics.rsvpDeadline)}
            </p>

            <section className={`mt-8 space-y-5 ${admin.card} p-6`}>
                <h2 className="font-[family-name:var(--font-timer)] text-xl font-bold text-cover-cta-fg">
                    Porcentajes
                </h2>
                <RateBar
                    label="Familias que ya confirmaron (activas)"
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
                        const count = analytics.transportByBoardingPoint[point.id] ?? 0;
                        const detail = getTransportBoardingPoint(point.id);

                        return (
                            <Link
                                key={point.id}
                                href={
                                    point.id === "modelia"
                                        ? adminFilterLinks.guestsBusModelia
                                        : adminFilterLinks.guestsBusVillaSonia
                                }
                                className={`${admin.panel} px-5 py-4 transition-opacity hover:opacity-90`}
                            >
                                <p className={admin.eyebrow}>{point.title}</p>
                                <p className={`mt-1 ${admin.muted}`}>
                                    {detail?.place ?? point.place}
                                </p>
                                <p className={`mt-2 ${admin.metricValue}`}>{count}</p>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                    <MetricCard
                        key={card.label}
                        label={card.label}
                        value={card.value}
                        href={"href" in card ? card.href : undefined}
                    />
                ))}
            </div>
        </AdminShell>
    );
}
