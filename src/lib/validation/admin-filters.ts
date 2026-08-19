/**
 * Admin list filters.
 *
 * Convention (keep this file as the single module):
 * 1. parse* — search params → typed filters
 * 2. *MatchesFilters — in-memory predicate
 * 3. *FilterChips — active-filter labels
 * 4. buildAdmin*FilterQuery — typed filters → query string
 *
 * Named dashboard/analytics URLs: `src/lib/admin/admin-filter-links.ts`.
 * Sort + pagination: `src/lib/admin/list-view.ts`.
 */

import {z} from "zod";

import {adminCopy, familyStatusLabel} from "@/lib/admin/admin-copy";
import {TRANSPORT_BOARDING_POINT_IDS} from "@/config/transport";
import type {AttendanceStatus} from "@/types/guest";

const searchParamValueSchema = z
    .union([z.string(), z.array(z.string()), z.undefined()])
    .transform((value) => (Array.isArray(value) ? value[0] : value));

const trimmedStringSchema = searchParamValueSchema.transform((value) =>
    typeof value === "string" ? value.trim() : "",
);

const enumSearchParam = <T extends readonly [string, ...string[]]>(
    values: T,
    fallback: T[number],
) =>
    searchParamValueSchema.transform((value) =>
        typeof value === "string" ? value : fallback,
    ).pipe(z.enum(values).catch(fallback));

const adminFamiliesFiltersSchema = z.object({
    q: trimmedStringSchema.transform((value) => value.slice(0, 120)).default(""),
    status: enumSearchParam(["all", "pending", "responded", "disabled"], "all").default(
        "all",
    ),
    enabled: enumSearchParam(["all", "enabled", "disabled"], "all").default(
        "all",
    ),
    opened: enumSearchParam(["all", "opened", "not_opened"], "all").default(
        "all",
    ),
    response: enumSearchParam(
        ["all", "responded", "pending", "attending", "not_attending"],
        "all",
    ).default("all"),
    sort: trimmedStringSchema.default(""),
    dir: enumSearchParam(["asc", "desc"], "asc").default("asc"),
    page: searchParamValueSchema
        .transform((value) => {
            const parsed = Number.parseInt(typeof value === "string" ? value : "1", 10);
            return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
        })
        .default(1),
});

export type AdminFamiliesFilters = {
    query: string;
    status: "all" | "pending" | "responded" | "disabled";
    enabled: "all" | "enabled" | "disabled";
    opened: "all" | "opened" | "not_opened";
    response: "all" | "responded" | "pending" | AttendanceStatus;
    sort: string;
    dir: "asc" | "desc";
    page: number;
};

export function parseAdminFamiliesFilters(
    input: Record<string, string | string[] | undefined>,
): AdminFamiliesFilters {
    const parsed = adminFamiliesFiltersSchema.parse(input);

    return {
        query: parsed.q,
        status: parsed.status as AdminFamiliesFilters["status"],
        enabled: parsed.enabled as AdminFamiliesFilters["enabled"],
        opened: parsed.opened as AdminFamiliesFilters["opened"],
        response: parsed.response as AdminFamiliesFilters["response"],
        sort: parsed.sort,
        dir: parsed.dir as AdminFamiliesFilters["dir"],
        page: parsed.page,
    };
}

const adminGuestsFiltersSchema = z.object({
    q: trimmedStringSchema.transform((value) => value.slice(0, 120)).default(""),
    attendance: enumSearchParam(
        ["all", "pending", "attending", "not_attending"],
        "all",
    ).default("all"),
    transport: enumSearchParam(["all", "with_bus", "without_bus"], "all").default(
        "all",
    ),
    boarding: enumSearchParam(
        ["all", ...TRANSPORT_BOARDING_POINT_IDS, "none"],
        "all",
    ).default("all"),
    dietary: enumSearchParam(
        ["all", "with_dietary", "without_dietary"],
        "all",
    ).default("all"),
    primary: enumSearchParam(["all", "primary", "other"], "all").default(
        "all",
    ),
    name: enumSearchParam(["all", "needs_name"], "all").default("all"),
    sort: trimmedStringSchema.default(""),
    dir: enumSearchParam(["asc", "desc"], "asc").default("asc"),
    page: searchParamValueSchema
        .transform((value) => {
            const parsed = Number.parseInt(typeof value === "string" ? value : "1", 10);
            return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
        })
        .default(1),
});

export type AdminGuestsFilters = {
    query: string;
    attendance: "all" | AttendanceStatus;
    transport: "all" | "with_bus" | "without_bus";
    boarding: "all" | (typeof TRANSPORT_BOARDING_POINT_IDS)[number] | "none";
    dietary: "all" | "with_dietary" | "without_dietary";
    primary: "all" | "primary" | "other";
    name: "all" | "needs_name";
    sort: string;
    dir: "asc" | "desc";
    page: number;
};

export function parseAdminGuestsFilters(
    input: Record<string, string | string[] | undefined>,
): AdminGuestsFilters {
    const parsed = adminGuestsFiltersSchema.parse(input);

    return {
        query: parsed.q,
        attendance: parsed.attendance as AdminGuestsFilters["attendance"],
        transport: parsed.transport as AdminGuestsFilters["transport"],
        boarding: parsed.boarding as AdminGuestsFilters["boarding"],
        dietary: parsed.dietary as AdminGuestsFilters["dietary"],
        primary: parsed.primary as AdminGuestsFilters["primary"],
        name: parsed.name as AdminGuestsFilters["name"],
        sort: parsed.sort,
        dir: parsed.dir as AdminGuestsFilters["dir"],
        page: parsed.page,
    };
}

export const DEFAULT_ADMIN_FAMILIES_FILTERS: AdminFamiliesFilters = {
    query: "",
    status: "all",
    enabled: "all",
    opened: "all",
    response: "all",
    sort: "",
    dir: "asc",
    page: 1,
};

export const DEFAULT_ADMIN_GUESTS_FILTERS: AdminGuestsFilters = {
    query: "",
    attendance: "all",
    transport: "all",
    boarding: "all",
    dietary: "all",
    primary: "all",
    name: "all",
    sort: "",
    dir: "asc",
    page: 1,
};

function includesNormalized(haystack: string, needle: string): boolean {
    return haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase());
}

function hasDietaryRestrictions(value: string | null | undefined): boolean {
    return Boolean(value?.trim());
}

export function hasActiveAdminFamiliesFilters(
    filters: AdminFamiliesFilters,
): boolean {
    return (
        filters.query.length > 0 ||
        filters.status !== "all" ||
        filters.enabled !== "all" ||
        filters.opened !== "all" ||
        filters.response !== "all"
    );
}

export function hasActiveAdminGuestsFilters(filters: AdminGuestsFilters): boolean {
    return (
        filters.query.length > 0 ||
        filters.attendance !== "all" ||
        filters.transport !== "all" ||
        filters.boarding !== "all" ||
        filters.dietary !== "all" ||
        filters.primary !== "all" ||
        filters.name !== "all"
    );
}

export type AdminFamilyFilterItem = {
    displayName: string;
    invitationSlug: string;
    status: "pending" | "responded" | "disabled";
    isEnabled: boolean;
    lastOpenedAt: string | null;
    submittedAt: string | null;
    willAttend: boolean | null;
};

export function familyMatchesFilters(
    family: AdminFamilyFilterItem,
    filters: AdminFamiliesFilters,
): boolean {
    const query = filters.query.trim();

    if (
        query &&
        !includesNormalized(family.displayName, query) &&
        !includesNormalized(family.invitationSlug, query)
    ) {
        return false;
    }

    if (filters.status !== "all" && family.status !== filters.status) {
        return false;
    }

    if (filters.enabled === "enabled" && !family.isEnabled) {
        return false;
    }

    if (filters.enabled === "disabled" && family.isEnabled) {
        return false;
    }

    if (filters.opened === "opened" && !family.lastOpenedAt) {
        return false;
    }

    if (filters.opened === "not_opened" && family.lastOpenedAt) {
        return false;
    }

    if (filters.response === "responded" && !family.submittedAt) {
        return false;
    }

    if (filters.response === "pending" && family.submittedAt) {
        return false;
    }

    if (
        (filters.response === "attending" || filters.response === "not_attending") &&
        family.willAttend !== (filters.response === "attending")
    ) {
        return false;
    }

    return true;
}

export type AdminGuestFilterItem = {
    fullName: string;
    familyName: string;
    email: string | null;
    phone: string | null;
    attendanceStatus: AttendanceStatus;
    needsTransport: boolean;
    transportBoardingPoint: string | null;
    dietaryRestrictions: string | null;
    isPrimaryContact: boolean;
    needsNameConfirmation?: boolean;
};

export function guestMatchesFilters(
    guest: AdminGuestFilterItem,
    filters: AdminGuestsFilters,
): boolean {
    const query = filters.query.trim();

    if (
        query &&
        !includesNormalized(guest.fullName, query) &&
        !includesNormalized(guest.familyName, query) &&
        !includesNormalized(guest.email ?? "", query) &&
        !includesNormalized(guest.phone ?? "", query)
    ) {
        return false;
    }

    if (
        filters.attendance !== "all" &&
        guest.attendanceStatus !== filters.attendance
    ) {
        return false;
    }

    if (filters.transport === "with_bus" && !guest.needsTransport) {
        return false;
    }

    if (filters.transport === "without_bus" && guest.needsTransport) {
        return false;
    }

    if (filters.boarding === "none" && guest.transportBoardingPoint) {
        return false;
    }

    if (
        filters.boarding !== "all" &&
        filters.boarding !== "none" &&
        guest.transportBoardingPoint !== filters.boarding
    ) {
        return false;
    }

    if (
        filters.dietary === "with_dietary" &&
        !hasDietaryRestrictions(guest.dietaryRestrictions)
    ) {
        return false;
    }

    if (
        filters.dietary === "without_dietary" &&
        hasDietaryRestrictions(guest.dietaryRestrictions)
    ) {
        return false;
    }

    if (filters.primary === "primary" && !guest.isPrimaryContact) {
        return false;
    }

    if (filters.primary === "other" && guest.isPrimaryContact) {
        return false;
    }

    if (filters.name === "needs_name" && !guest.needsNameConfirmation) {
        return false;
    }

    return true;
}

function appendNonDefault(
    params: URLSearchParams,
    key: string,
    value: string,
    fallback = "all",
) {
    if (value && value !== fallback) {
        params.set(key, value);
    }
}

export function buildAdminFamiliesFilterQuery(
    filters: AdminFamiliesFilters,
): string {
    const params = new URLSearchParams();
    if (filters.query) {
        params.set("q", filters.query);
    }
    appendNonDefault(params, "status", filters.status);
    appendNonDefault(params, "enabled", filters.enabled);
    appendNonDefault(params, "opened", filters.opened);
    appendNonDefault(params, "response", filters.response);
    if (filters.sort) {
        params.set("sort", filters.sort);
    }
    if (filters.dir === "desc") {
        params.set("dir", "desc");
    }
    if (filters.page > 1) {
        params.set("page", String(filters.page));
    }
    return params.toString();
}

export function buildAdminGuestsFilterQuery(filters: AdminGuestsFilters): string {
    const params = new URLSearchParams();
    if (filters.query) {
        params.set("q", filters.query);
    }
    appendNonDefault(params, "attendance", filters.attendance);
    appendNonDefault(params, "transport", filters.transport);
    appendNonDefault(params, "boarding", filters.boarding);
    appendNonDefault(params, "dietary", filters.dietary);
    appendNonDefault(params, "primary", filters.primary);
    appendNonDefault(params, "name", filters.name);
    if (filters.sort) {
        params.set("sort", filters.sort);
    }
    if (filters.dir === "desc") {
        params.set("dir", "desc");
    }
    if (filters.page > 1) {
        params.set("page", String(filters.page));
    }
    return params.toString();
}

export function replaceQueryString(pathname: string, query: string) {
    if (typeof window === "undefined") {
        return;
    }

    const url = query ? `${pathname}?${query}` : pathname;
    window.history.replaceState(window.history.state, "", url);
}

export type AdminFilterChipItem = {
    id: string;
    label: string;
};

const familyResponseLabels: Record<string, string> = {
    pending: adminCopy.rsvp.noResponse,
    responded: adminCopy.rsvp.responded,
    attending: "Asistirá",
    not_attending: "No asistirá",
};

export function familiesFilterChips(
    filters: AdminFamiliesFilters,
): AdminFilterChipItem[] {
    const chips: AdminFilterChipItem[] = [];

    if (filters.query.trim()) {
        chips.push({id: "query", label: `Buscar: ${filters.query.trim()}`});
    }
    if (filters.status !== "all") {
        chips.push({
            id: "status",
            label: `Estado: ${familyStatusLabel(filters.status as "pending" | "responded" | "disabled")}`,
        });
    }
    if (filters.enabled !== "all") {
        chips.push({
            id: "enabled",
            label: filters.enabled === "enabled" ? "Activa" : "Desactivada",
        });
    }
    if (filters.opened !== "all") {
        chips.push({
            id: "opened",
            label:
                filters.opened === "opened"
                    ? adminCopy.invitation.opened
                    : adminCopy.invitation.notOpened,
        });
    }
    if (filters.response !== "all") {
        chips.push({
            id: "response",
            label: `${adminCopy.rsvp.response}: ${familyResponseLabels[filters.response] ?? filters.response}`,
        });
    }

    return chips;
}

const guestAttendanceLabels: Record<string, string> = {
    pending: "Pendiente",
    attending: "Asiste",
    not_attending: "No asiste",
};

export function guestsFilterChips(filters: AdminGuestsFilters): AdminFilterChipItem[] {
    const chips: AdminFilterChipItem[] = [];

    if (filters.query.trim()) {
        chips.push({id: "query", label: `Buscar: ${filters.query.trim()}`});
    }
    if (filters.attendance !== "all") {
        chips.push({
            id: "attendance",
            label: guestAttendanceLabels[filters.attendance] ?? filters.attendance,
        });
    }
    if (filters.transport !== "all") {
        chips.push({
            id: "transport",
            label: filters.transport === "with_bus" ? "Con bus" : "Sin bus",
        });
    }
    if (filters.boarding !== "all") {
        const boardingLabel =
            filters.boarding === "none"
                ? "Sin punto"
                : filters.boarding === "modelia"
                    ? "Modelia"
                    : "Villa Sonia";
        chips.push({id: "boarding", label: `Salida: ${boardingLabel}`});
    }
    if (filters.dietary !== "all") {
        chips.push({
            id: "dietary",
            label:
                filters.dietary === "with_dietary" ? "Con restricción" : "Sin restricción",
        });
    }
    if (filters.primary !== "all") {
        chips.push({
            id: "primary",
            label:
                filters.primary === "primary"
                    ? adminCopy.guest.primaryContact
                    : "Otros invitados",
        });
    }
    if (filters.name !== "all") {
        chips.push({
            id: "name",
            label: "Nombre por confirmar",
        });
    }

    return chips;
}




