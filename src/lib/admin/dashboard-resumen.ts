import {adminCopy} from "@/lib/admin/admin-copy";
import {adminFilterLinks} from "@/lib/admin/admin-filter-links";
import type {CloseFollowUpItem} from "@/lib/admin/rsvp-close-checklist";

export const RESUMEN_FOLLOW_UP_KEYS = [
    "rsvp",
    "names",
    "diet",
    "transport",
    "photos",
] as const;

export type DashboardKpiCard = {
    key: "families" | "seats" | "attending" | "bus";
    label: string;
    value: number;
    pill: string;
    footnote: string;
    href?: string;
};

export type ActionQueueItem = {
    key:
        | "familiesPending"
        | "openedPending"
        | "needsName"
        | "busMissing"
        | "photos"
        | "disabledPending";
    href: string;
    label: string;
    hint: string;
    count: number;
};

export type AdminActionQueueCounts = {
    familiesPending: number;
    familiesOpenedPending: number;
    guestsNeedsName: number;
    guestsBusMissingPoint: number;
    photosAwaitingReview: number;
    familiesDisabledPending: number;
};

export type PendingSummary = {
    totalsLabel: string;
    totalsValue: string;
    compactTotalsValue: string;
    namesLabel: string;
    namesValue: string;
};

export function clampPercent(value: number): number {
    if (!Number.isFinite(value)) {
        return 0;
    }
    return Math.min(100, Math.max(0, Math.round(value)));
}

export function rsvpDeadlineLead(days: number | null): string | null {
    if (days == null) {
        return null;
    }
    if (days < 0) {
        return adminCopy.operations.deadlinePassed;
    }
    if (days === 0) {
        return adminCopy.operations.deadlineToday;
    }
    return adminCopy.operations.daysLeft(days);
}

export function formatResumenDeadlineOverline(
    deadlineOverline: string,
    compact: boolean,
): string {
    if (compact) {
        return `⏰ ${adminCopy.resumen.overlineDeadlineShort}: ${deadlineOverline}`;
    }
    return `${adminCopy.resumen.overlineDeadline}: ${deadlineOverline}`;
}

export function countPhrase(
    count: number,
    singular: string,
    plural: string,
): string {
    return `${count} ${count === 1 ? singular : plural}`;
}

export function familyProgressHint(
    responded: number,
    pending: number,
): string {
    return `${countPhrase(responded, "confirmada", "confirmadas")} • ${countPhrase(pending, "pendiente", "pendientes")}`;
}

export function guestProgressHint(responded: number, pending: number): string {
    return `${countPhrase(responded, "respondió", "respondieron")} • ${countPhrase(pending, "sin responder", "sin responder")}`;
}

export function followUpCountBadge(
    item: CloseFollowUpItem,
    compact = false,
): string {
    if (item.key === "diet") {
        return countPhrase(item.count, "requerimiento", "requerimientos");
    }
    if (item.key === "transport") {
        return compact
            ? countPhrase(item.count, "cupo", "cupos")
            : countPhrase(item.count, "cupo reservado", "cupos reservados");
    }
    if (item.done) {
        return adminCopy.operations.closeItemDone;
    }
    if (item.key === "rsvp") {
        return compact
            ? countPhrase(item.count, "restante", "restantes")
            : countPhrase(item.count, "familia restante", "familias restantes");
    }
    if (item.key === "names") {
        return compact
            ? countPhrase(item.count, "faltante", "faltantes")
            : countPhrase(item.count, "nombre faltante", "nombres faltantes");
    }
    if (item.key === "photos") {
        return compact
            ? countPhrase(item.count, "por revisar", "por revisar")
            : countPhrase(
                item.count,
                "archivo por revisar",
                "archivos por revisar",
            );
    }
    if (item.key === "boarding") {
        return compact
            ? countPhrase(item.count, "sin punto", "sin punto")
            : countPhrase(item.count, "sin punto de salida", "sin punto de salida");
    }
    return String(item.count);
}

export function selectResumenFollowUps(
    items: CloseFollowUpItem[],
): CloseFollowUpItem[] {
    const byKey = new Map(items.map((item) => [item.key, item]));
    const selected = RESUMEN_FOLLOW_UP_KEYS.flatMap((key) => {
        const item = byKey.get(key);
        return item ? [item] : [];
    });
    const boarding = byKey.get("boarding");
    if (boarding && !boarding.done) {
        const transportIndex = selected.findIndex((item) => item.key === "transport");
        selected.splice(
            transportIndex >= 0 ? transportIndex + 1 : selected.length,
            0,
            boarding,
        );
    }
    return selected;
}

export function actionQueueCtaLabel(key: ActionQueueItem["key"]): string {
    if (key === "needsName") {
        return adminCopy.operations.ctaAssign;
    }
    return adminCopy.operations.ctaViewList;
}

export function buildActionQueueItems(
    counts: AdminActionQueueCounts,
): ActionQueueItem[] {
    const copy = adminCopy.operations;
    const items: ActionQueueItem[] = [
        {
            key: "familiesPending",
            href: adminFilterLinks.familiesPending,
            label: copy.familiesPendingLabel,
            hint: copy.familiesPendingHint,
            count: counts.familiesPending,
        },
        {
            key: "needsName",
            href: adminFilterLinks.guestsNeedsName,
            label: copy.needsNameLabel,
            hint: copy.needsNameHint,
            count: counts.guestsNeedsName,
        },
        {
            key: "openedPending",
            href: adminFilterLinks.familiesOpenedPending,
            label: copy.openedPendingLabel,
            hint: copy.openedPendingHint,
            count: counts.familiesOpenedPending,
        },
        {
            key: "busMissing",
            href: adminFilterLinks.guestsBusMissingPoint,
            label: copy.busMissingLabel,
            hint: copy.busMissingHint,
            count: counts.guestsBusMissingPoint,
        },
        {
            key: "photos",
            href: "/admin/photos",
            label: copy.photosPendingLabel,
            hint: copy.photosPendingHint,
            count: counts.photosAwaitingReview,
        },
        {
            key: "disabledPending",
            href: adminFilterLinks.familiesDisabled,
            label: copy.disabledPendingLabel,
            hint: copy.disabledPendingHint,
            count: counts.familiesDisabledPending,
        },
    ];

    return items.filter((item) => item.count > 0);
}

export function buildPendingSummary(input: {
    familiesPending: number;
    guestsPending: number;
    guestsPendingNameConfirmation: number;
}): PendingSummary {
    return {
        totalsLabel: adminCopy.resumen.pendingTotalsLabel,
        totalsValue: `${countPhrase(input.familiesPending, "familia", "familias")} • ${countPhrase(input.guestsPending, "invitado", "invitados")}`,
        compactTotalsValue: `${input.familiesPending} fam. • ${input.guestsPending} inv.`,
        namesLabel: adminCopy.resumen.pendingNamesLabel,
        namesValue: countPhrase(
            input.guestsPendingNameConfirmation,
            "acompañante",
            "acompañantes",
        ),
    };
}

export function buildDashboardKpiCards(input: {
    familyCount: number;
    familyResponseRate: number;
    assignedSeats: number;
    guestConfirmRate: number;
    guestsAttending: number;
    guestsNeedingTransport: number;
}): DashboardKpiCard[] {
    const copy = adminCopy.resumen;
    return [
        {
            key: "families",
            label: copy.kpiFamilies,
            value: input.familyCount,
            pill: copy.kpiFamiliesPill,
            footnote: copy.kpiFamiliesFootnote(clampPercent(input.familyResponseRate)),
            href: adminFilterLinks.families,
        },
        {
            key: "seats",
            label: copy.kpiSeats,
            value: input.assignedSeats,
            pill: copy.kpiSeatsPill,
            footnote: copy.kpiSeatsFootnote(clampPercent(input.guestConfirmRate)),
            href: adminFilterLinks.guests,
        },
        {
            key: "attending",
            label: copy.kpiAttending,
            value: input.guestsAttending,
            pill: copy.kpiAttendingPill,
            footnote: copy.kpiAttendingFootnote,
            href: adminFilterLinks.guestsAttending,
        },
        {
            key: "bus",
            label: copy.kpiBus,
            value: input.guestsNeedingTransport,
            pill: copy.kpiBusPill,
            footnote: copy.kpiBusFootnote,
            href: adminFilterLinks.guestsWithBus,
        },
    ];
}
