import {adminCopy} from "@/lib/admin/admin-copy";
import {adminFilterLinks} from "@/lib/admin/admin-filter-links";
import {clampPercent} from "@/lib/admin/dashboard-resumen";
import {
    type TransportBoardingPointId,
    getTransportBoardingPoint,
    isTransportBoardingPointId,
} from "@/config/transport";
import {weddingConfig} from "@/config/wedding";

export type AnalyticsRateRow = {
    key: "families" | "guests" | "bus";
    title: string;
    hint: string;
    percent: number;
};

export type AnalyticsStatCard = {
    key:
        | "families"
        | "familiesResponded"
        | "familiesPending"
        | "familiesOpened"
        | "familiesDisabled"
        | "guests"
        | "attending"
        | "notAttending"
        | "pending"
        | "bus"
        | "dietary"
        | "names";
    label: string;
    value: number;
    pill: string;
    footnote: string;
    href: string;
};

export type AnalyticsBusPointCard = {
    id: TransportBoardingPointId;
    title: string;
    place: string;
    count: number;
    href: string;
};

const BUS_POINT_HREF: Record<TransportBoardingPointId, string> = {
    modelia: adminFilterLinks.guestsBusModelia,
    villa_sonia: adminFilterLinks.guestsBusVillaSonia,
};

export function formatAnalyticsBannerBody(
    venue: string,
    compact = false,
): string {
    return compact
        ? adminCopy.analytics.bannerBodyCompact(venue)
        : adminCopy.analytics.bannerBody(venue);
}

export function buildAnalyticsRateRows(input: {
    familyResponseRate: number;
    guestConfirmRate: number;
    transportAmongAttendingRate: number;
}): AnalyticsRateRow[] {
    const copy = adminCopy.analytics;
    return [
        {
            key: "families",
            title: copy.familyRateTitle,
            hint: copy.familyRateHint,
            percent: clampPercent(input.familyResponseRate),
        },
        {
            key: "guests",
            title: copy.guestRateTitle,
            hint: copy.guestRateHint,
            percent: clampPercent(input.guestConfirmRate),
        },
        {
            key: "bus",
            title: copy.busRateTitle,
            hint: copy.busRateHint,
            percent: clampPercent(input.transportAmongAttendingRate),
        },
    ];
}

export function buildAnalyticsStatCards(input: {
    familyCount: number;
    familyResponseRate: number;
    familiesResponded: number;
    familiesPending: number;
    familiesOpened: number;
    familiesDisabled: number;
    totalGuests: number;
    guestConfirmRate: number;
    guestsAttending: number;
    guestsNotAttending: number;
    guestsPending: number;
    guestsNeedingTransport: number;
    guestsWithDietary: number;
    guestsPendingNameConfirmation: number;
}): AnalyticsStatCard[] {
    const copy = adminCopy.analytics;
    const familyRate = clampPercent(input.familyResponseRate);
    const guestRate = clampPercent(input.guestConfirmRate);

    return [
        {
            key: "families",
            label: copy.cardFamilies,
            value: input.familyCount,
            pill: copy.cardFamiliesPill,
            footnote: adminCopy.resumen.kpiFamiliesFootnote(familyRate),
            href: adminFilterLinks.families,
        },
        {
            key: "familiesResponded",
            label: copy.cardResponded,
            value: input.familiesResponded,
            pill: copy.cardRespondedPill,
            footnote: copy.cardRespondedFootnote,
            href: adminFilterLinks.familiesResponded,
        },
        {
            key: "familiesPending",
            label: copy.cardPending,
            value: input.familiesPending,
            pill: copy.cardPendingPill,
            footnote: copy.cardPendingFootnote,
            href: adminFilterLinks.familiesPending,
        },
        {
            key: "familiesOpened",
            label: copy.cardOpened,
            value: input.familiesOpened,
            pill: copy.cardOpenedPill,
            footnote: copy.cardOpenedFootnote,
            href: adminFilterLinks.familiesOpened,
        },
        {
            key: "familiesDisabled",
            label: copy.cardDisabled,
            value: input.familiesDisabled,
            pill: copy.cardDisabledPill,
            footnote: copy.cardDisabledFootnote,
            href: adminFilterLinks.familiesDisabled,
        },
        {
            key: "guests",
            label: copy.cardGuests,
            value: input.totalGuests,
            pill: copy.cardGuestsPill,
            footnote: adminCopy.resumen.kpiSeatsFootnote(guestRate),
            href: adminFilterLinks.guests,
        },
        {
            key: "attending",
            label: copy.cardAttending,
            value: input.guestsAttending,
            pill: copy.cardAttendingPill,
            footnote: copy.cardAttendingFootnote,
            href: adminFilterLinks.guestsAttending,
        },
        {
            key: "notAttending",
            label: copy.cardNotAttending,
            value: input.guestsNotAttending,
            pill: copy.cardNotAttendingPill,
            footnote: copy.cardNotAttendingFootnote,
            href: adminFilterLinks.guestsNotAttending,
        },
        {
            key: "pending",
            label: copy.cardGuestsPending,
            value: input.guestsPending,
            pill: copy.cardGuestsPendingPill,
            footnote: copy.cardGuestsPendingFootnote,
            href: adminFilterLinks.guestsPending,
        },
        {
            key: "bus",
            label: copy.cardBus,
            value: input.guestsNeedingTransport,
            pill: copy.cardBusPill,
            footnote: copy.cardBusFootnote,
            href: adminFilterLinks.guestsWithBus,
        },
        {
            key: "dietary",
            label: copy.cardDietary,
            value: input.guestsWithDietary,
            pill: copy.cardDietaryPill,
            footnote: copy.cardDietaryFootnote,
            href: adminFilterLinks.guestsWithDietary,
        },
        {
            key: "names",
            label: copy.cardNames,
            value: input.guestsPendingNameConfirmation,
            pill: copy.cardNamesPill,
            footnote: copy.cardNamesFootnote,
            href: adminFilterLinks.guestsNeedsName,
        },
    ];
}

export function buildAnalyticsBusPoints(
    counts: Record<TransportBoardingPointId, number>,
): AnalyticsBusPointCard[] {
    return weddingConfig.transport.meetingPoints.flatMap((point) => {
        if (!isTransportBoardingPointId(point.id)) {
            return [];
        }

        const detail = getTransportBoardingPoint(point.id);
        return [
            {
                id: point.id,
                title: point.title,
                place: detail?.place ?? point.place,
                count: counts[point.id] ?? 0,
                href: BUS_POINT_HREF[point.id],
            },
        ];
    });
}
