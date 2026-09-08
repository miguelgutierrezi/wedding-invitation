import {ADMIN_RESUMEN_WIDE_MIN_PX} from "@/lib/admin/admin-chrome";
import {adminCopy} from "@/lib/admin/admin-copy";
import type {AdminSortDir} from "@/lib/admin/list-view";

/** Figma Invitados tablet portrait `109:36` (iPad 11" / 834px). */
export const ADMIN_GUESTS_PORTRAIT_MIN_PX = ADMIN_RESUMEN_WIDE_MIN_PX;

/** Figma Invitados tablet landscape `103:33` (`lg` / 1024). */
export const ADMIN_GUESTS_LANDSCAPE_MIN_PX = 1024;

/** Figma Invitados desktop `100:38` (matches Resumen desktop `xl`). */
export const ADMIN_GUESTS_DESKTOP_MIN_PX = 1280;

export type GuestsViewCounts = {
    total: number;
    attending: number;
    notAttending: number;
    pending: number;
    bus: number;
};

export type AdminGuestBrowserItem = {
    id: string;
    fullName: string;
    familyId: string;
    familyName: string;
    isPrimaryContact: boolean;
    attendanceStatus: "pending" | "attending" | "not_attending";
    needsTransport: boolean;
    transportBoardingPoint: string | null;
    dietaryRestrictions: string | null;
    email: string | null;
    phone: string | null;
    needsNameConfirmation: boolean;
};

export function summarizeGuestsView(
    guests: ReadonlyArray<Pick<AdminGuestBrowserItem, "attendanceStatus" | "needsTransport">>,
): GuestsViewCounts {
    let attending = 0;
    let notAttending = 0;
    let pending = 0;
    let bus = 0;

    for (const guest of guests) {
        if (guest.attendanceStatus === "attending") {
            attending += 1;
        } else if (guest.attendanceStatus === "not_attending") {
            notAttending += 1;
        } else {
            pending += 1;
        }
        if (guest.needsTransport) {
            bus += 1;
        }
    }

    return {
        total: guests.length,
        attending,
        notAttending,
        pending,
        bus,
    };
}

export function guestRoleLabel(isPrimaryContact: boolean): string {
    return isPrimaryContact
        ? adminCopy.guest.primaryContact
        : adminCopy.guest.companion;
}

/**
 * Banner chip copy matches Resumen / Estadísticas (`rsvpDeadlineLead`).
 * Ignore Figma “RSVP Límite” / date chips — always remaining days.
 */
export function formatGuestsDeadlineChip(
    deadlineLead: string | null,
): string | null {
    return deadlineLead ? `⏳ ${deadlineLead}` : null;
}

/** Landscape `103:33` / `158:355` has 6 filters (2+4 wrap); desktop `100:38` adds Nombre del acompañante. */
export function guestsFilterFieldCount(viewportPx: number): 6 | 7 {
    return viewportPx >= ADMIN_GUESTS_DESKTOP_MIN_PX ? 7 : 6;
}

export function guestsPortraitCardGrid(viewportPx: number): boolean {
    return (
        viewportPx >= ADMIN_GUESTS_PORTRAIT_MIN_PX &&
        viewportPx < ADMIN_GUESTS_LANDSCAPE_MIN_PX
    );
}

export function guestsMobileCardStack(viewportPx: number): boolean {
    return viewportPx < ADMIN_GUESTS_PORTRAIT_MIN_PX;
}

export function guestBusLabel(needsTransport: boolean, verbose = false): string {
    if (needsTransport) {
        return "Sí";
    }
    return verbose ? "Sin bus" : "No";
}

export function guestsSortSelectOptions(prefixed: boolean): readonly GuestsSortSelectOption[] {
    if (!prefixed) {
        return GUESTS_SORT_SELECT_OPTIONS;
    }
    const prefix = adminCopy.guestsList.sortByPrefix;
    return GUESTS_SORT_SELECT_OPTIONS.map((option) => ({
        value: option.value,
        label: `${prefix} ${option.label}`,
    }));
}

export type GuestsSortSelectOption = {
    value: `${string}:${AdminSortDir}`;
    label: string;
};

export const GUESTS_SORT_SELECT_OPTIONS: readonly GuestsSortSelectOption[] = [
    {value: "fullName:asc", label: "Invitado ↑"},
    {value: "fullName:desc", label: "Invitado ↓"},
    {value: "familyName:asc", label: "Familia ↑"},
    {value: "familyName:desc", label: "Familia ↓"},
    {value: "attendanceStatus:asc", label: "Estado ↑"},
    {value: "attendanceStatus:desc", label: "Estado ↓"},
    {value: "needsTransport:asc", label: "Bus ↑"},
    {value: "needsTransport:desc", label: "Bus ↓"},
    {value: "transportBoardingPoint:asc", label: "Punto de salida ↑"},
    {value: "transportBoardingPoint:desc", label: "Punto de salida ↓"},
    {value: "dietaryRestrictions:asc", label: "Dieta ↑"},
    {value: "dietaryRestrictions:desc", label: "Dieta ↓"},
    {value: "phone:asc", label: "Teléfono ↑"},
    {value: "phone:desc", label: "Teléfono ↓"},
    {value: "email:asc", label: "Correo ↑"},
    {value: "email:desc", label: "Correo ↓"},
];

export function guestsSortSelectValue(
    sort: string,
    dir: AdminSortDir,
): GuestsSortSelectOption["value"] {
    const column = sort || "fullName";
    const value = `${column}:${dir}` as GuestsSortSelectOption["value"];
    return GUESTS_SORT_SELECT_OPTIONS.some((option) => option.value === value)
        ? value
        : "fullName:asc";
}

export function parseGuestsSortSelect(value: string): {
    sort: string;
    dir: AdminSortDir;
} {
    const [sort = "fullName", dir] = value.split(":");
    return {sort, dir: dir === "desc" ? "desc" : "asc"};
}

export type GuestsListSubNavItem = {
    href: string;
    label: string;
    current?: boolean;
};

/** In-page shortcuts only — no Figma-only Mensajes / Transporte / Configuración. */
export const GUESTS_LIST_SUBNAV: readonly GuestsListSubNavItem[] = [
    {href: "/admin/analytics", label: adminCopy.nav.statistics},
    {href: "/admin/families", label: adminCopy.nav.families},
    {
        href: "/admin/guests",
        label: adminCopy.guestsList.fullListTab,
        current: true,
    },
];
