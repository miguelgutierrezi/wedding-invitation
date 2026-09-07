import {formatTransportBoardingPoint} from "@/config/transport";
import {
    ADMIN_RESUMEN_LANDSCAPE_MIN_PX,
    ADMIN_RESUMEN_WIDE_MIN_PX,
} from "@/lib/admin/admin-chrome";
import {adminCopy} from "@/lib/admin/admin-copy";
import type {GuestGender} from "@/types/guest";

/** Figma family detail phone `144:245` (below iPad 11" / 834px). */
export const ADMIN_FAMILY_DETAIL_MOBILE_MAX_PX = ADMIN_RESUMEN_WIDE_MIN_PX - 1;

/** Figma family detail tablet portrait `144:29` (iPad 11" / 834px). */
export const ADMIN_FAMILY_DETAIL_PORTRAIT_MIN_PX = ADMIN_RESUMEN_WIDE_MIN_PX;

/** Figma family detail tablet landscape `143:29` (`lg` / 1024). */
export const ADMIN_FAMILY_DETAIL_LANDSCAPE_MIN_PX =
    ADMIN_RESUMEN_LANDSCAPE_MIN_PX;

/** Figma family detail desktop `137:34` (matches other admin workspaces at `xl`). */
export const ADMIN_FAMILY_DETAIL_DESKTOP_MIN_PX = 1280;

/**
 * Portrait `144:29` and phone `144:245` stack a single column in this order.
 * Landscape/desktop split status+edit+regenerate left and
 * link+guests+activity+delete right.
 */
export const FAMILY_DETAIL_PORTRAIT_CARD_ORDER = [
    "status",
    "link",
    "edit",
    "guests",
    "activity",
    "regenerate",
    "delete",
] as const;

export function familyDetailMobileWorkspace(viewportPx: number): boolean {
    return viewportPx < ADMIN_FAMILY_DETAIL_PORTRAIT_MIN_PX;
}

export function familyDetailPortraitWorkspace(viewportPx: number): boolean {
    return (
        viewportPx >= ADMIN_FAMILY_DETAIL_PORTRAIT_MIN_PX &&
        viewportPx < ADMIN_FAMILY_DETAIL_LANDSCAPE_MIN_PX
    );
}

export function familyDetailLandscapeWorkspace(viewportPx: number): boolean {
    return (
        viewportPx >= ADMIN_FAMILY_DETAIL_LANDSCAPE_MIN_PX &&
        viewportPx < ADMIN_FAMILY_DETAIL_DESKTOP_MIN_PX
    );
}

export function familyDetailDesktopWorkspace(viewportPx: number): boolean {
    return viewportPx >= ADMIN_FAMILY_DETAIL_DESKTOP_MIN_PX;
}

export function familyDetailFigmaWorkspace(viewportPx: number): boolean {
    return viewportPx >= 0;
}

/** Landscape `143:29` shortens labels and guest cards; desktop `137:34` uses full density. */
export function familyDetailCompactChrome(viewportPx: number): boolean {
    return familyDetailLandscapeWorkspace(viewportPx);
}

/**
 * Banner chip uses remaining days. The clock icon lives in the UI — do not
 * prefix the hourglass used on Familias / Invitados lists.
 */
export function formatFamilyDetailDeadlineChip(
    deadlineLead: string | null,
): string | null {
    return deadlineLead;
}

export function familyDetailConfirmationLabel(
    willAttend: boolean | null,
    confirmedGuestCount: number | null,
): string {
    if (willAttend === null) {
        return adminCopy.rsvp.noResponse;
    }
    if (!willAttend) {
        return adminCopy.familyDetail.notAttending;
    }
    const count = confirmedGuestCount ?? 0;
    const noun = count === 1 ? "persona" : "personas";
    return `${adminCopy.familyDetail.attending} (${count} ${noun})`;
}

export function familyDetailTransportLabel(count: number): string {
    const noun = count === 1 ? "invitado" : "invitados";
    return `${count} ${noun} ${adminCopy.familyDetail.transportSuffix}`;
}

export function familyDetailGuestAttendanceLabel(
    status: string,
    sentenceCase = false,
): string {
    if (status === "attending") {
        return sentenceCase
            ? adminCopy.familyDetail.guestAttending
            : adminCopy.familyDetail.guestAttendingLegacy;
    }
    if (status === "not_attending") {
        return sentenceCase
            ? adminCopy.familyDetail.guestNotAttending
            : adminCopy.familyDetail.guestNotAttendingLegacy;
    }
    return sentenceCase
        ? adminCopy.rsvp.noResponse
        : adminCopy.familyDetail.guestPendingLegacy;
}

export type FamilyDetailStatusPillTone =
    | "confirmed"
    | "declined"
    | "pending"
    | "disabled"
    | "bus";

export type FamilyDetailStatusPill = {
    key: string;
    label: string;
    tone: FamilyDetailStatusPillTone;
    icon: "check" | "bus" | null;
};

export function familyDetailStatusPills(family: {
    status: "pending" | "responded" | "disabled";
    isEnabled: boolean;
    willAttend: boolean | null;
    usesBus: boolean;
}): FamilyDetailStatusPill[] {
    const pills: FamilyDetailStatusPill[] = [];
    const disabled = !family.isEnabled || family.status === "disabled";

    if (disabled) {
        pills.push({
            key: "disabled",
            label: adminCopy.family.status.disabled,
            tone: "disabled",
            icon: null,
        });
    } else if (family.status === "responded" && family.willAttend === false) {
        pills.push({
            key: "declined",
            label: adminCopy.familiesList.cardDeclined,
            tone: "declined",
            icon: null,
        });
    } else if (family.status === "responded") {
        pills.push({
            key: "confirmed",
            label: adminCopy.family.status.responded,
            tone: "confirmed",
            icon: "check",
        });
    } else {
        pills.push({
            key: "pending",
            label: adminCopy.family.status.pending,
            tone: "pending",
            icon: null,
        });
    }

    if (family.usesBus) {
        pills.push({
            key: "bus",
            label: adminCopy.familyDetail.busPill,
            tone: "bus",
            icon: "bus",
        });
    }

    return pills;
}

export function familyDetailGuestPills(guest: {
    attendanceStatus: string;
    needsTransport: boolean;
}): FamilyDetailStatusPill[] {
    const pills: FamilyDetailStatusPill[] = [];

    if (guest.attendanceStatus === "attending") {
        pills.push({
            key: "attending",
            label: adminCopy.familyDetail.guestAttending,
            tone: "confirmed",
            icon: "check",
        });
    } else if (guest.attendanceStatus === "not_attending") {
        pills.push({
            key: "declined",
            label: adminCopy.familyDetail.guestNotAttending,
            tone: "declined",
            icon: null,
        });
    } else {
        pills.push({
            key: "pending",
            label: adminCopy.rsvp.noResponse,
            tone: "pending",
            icon: null,
        });
    }

    if (guest.needsTransport) {
        pills.push({
            key: "bus",
            label: adminCopy.familyDetail.busPill,
            tone: "bus",
            icon: "bus",
        });
    }

    return pills;
}

export type FamilyDetailPickupDensity = "full" | "address" | "pickup";

export function familyDetailGuestPickupLine(
    needsTransport: boolean,
    boardingPoint: string | null | undefined,
    density: FamilyDetailPickupDensity = "full",
): string | null {
    if (!needsTransport) {
        return null;
    }
    const place = formatTransportBoardingPoint(boardingPoint);
    const missing = !place || place === "—";
    if (density === "address") {
        return missing
            ? adminCopy.familyDetail.addressMissing
            : `${adminCopy.familyDetail.addressPrefix} ${place}`;
    }
    if (density === "pickup") {
        return missing
            ? `${adminCopy.familyDetail.pickupPrefix} ${adminCopy.familyDetail.addressMissing}`
            : `${adminCopy.familyDetail.pickupPrefix} ${place}`;
    }
    if (missing) {
        return adminCopy.familyDetail.busMissingPickup;
    }
    return `${adminCopy.familyDetail.busPickupPrefix} ${place}`;
}

export function familyDetailStatusPhoneLabel(compact: boolean): string {
    return compact
        ? adminCopy.familyDetail.contactPhoneCompact
        : adminCopy.familyDetail.contactPhone;
}

export function familyDetailStatusEmailLabel(compact: boolean): string {
    return compact
        ? adminCopy.familyDetail.contactEmailCompact
        : adminCopy.familyDetail.contactEmail;
}

export function familyDetailStatusTransportLabel(compact: boolean): string {
    return compact
        ? adminCopy.familyDetail.transportRequestedCompact
        : adminCopy.familyDetail.transportRequested;
}

export function familyDetailDeleteTitle(compact: boolean): string {
    return compact
        ? adminCopy.familyDetail.deleteTitleCompact
        : adminCopy.familyDetail.deleteTitle;
}

export type GuestFormRow = {
    id: string;
    name: string;
    gender: "" | GuestGender;
};

export function guestRowsFromFamily<
    T extends {id: string; fullName: string; gender: GuestGender | null},
>(family: {guests: readonly T[]}, count: number): GuestFormRow[] {
    return Array.from({length: count}, (_, index) => ({
        id: family.guests[index]?.id ?? "",
        name: family.guests[index]?.fullName ?? "",
        gender: family.guests[index]?.gender ?? "",
    }));
}

export function resizeGuestRows(
    current: GuestFormRow[],
    nextCount: number,
): GuestFormRow[] {
    if (nextCount <= current.length) {
        return current.slice(0, nextCount);
    }

    return [
        ...current,
        ...Array.from({length: nextCount - current.length}, () => ({
            id: "",
            name: "",
            gender: "" as const,
        })),
    ];
}

export function familyFormStamp(family: {
    id: string;
    displayName: string;
    invitationSlug: string;
    maximumGuests: number;
    customMessage: string | null;
    isEnabled: boolean;
    guests: ReadonlyArray<{
        id: string;
        fullName: string;
        gender: string | null;
    }>;
}): string {
    return [
        family.id,
        family.displayName,
        family.invitationSlug,
        String(family.maximumGuests),
        family.customMessage ?? "",
        family.isEnabled ? "1" : "0",
        family.guests
            .map((guest) => `${guest.id}:${guest.fullName}:${guest.gender ?? ""}`)
            .join(","),
    ].join("|");
}
