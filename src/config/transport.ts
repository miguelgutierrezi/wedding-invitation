import {weddingConfig} from "@/config/wedding";

/** Allowed boarding keys — must match DB check constraint and RPC. */
export const TRANSPORT_BOARDING_POINT_IDS = ["modelia", "villa_sonia"] as const;

export type TransportBoardingPointId =
    (typeof TRANSPORT_BOARDING_POINT_IDS)[number];

export function isTransportBoardingPointId(
    value: string,
): value is TransportBoardingPointId {
    return (TRANSPORT_BOARDING_POINT_IDS as readonly string[]).includes(value);
}

export function getTransportBoardingPoint(
    id: string | null | undefined,
): (typeof weddingConfig.transport.meetingPoints)[number] | null {
    if (!id) {
        return null;
    }

    return (
        weddingConfig.transport.meetingPoints.find((point) => point.id === id) ??
        null
    );
}

/** Short label for admin tables (place line). */
export function formatTransportBoardingPoint(
    id: string | null | undefined,
): string {
    const point = getTransportBoardingPoint(id);
    if (!point) {
        return "—";
    }
    return point.place;
}
