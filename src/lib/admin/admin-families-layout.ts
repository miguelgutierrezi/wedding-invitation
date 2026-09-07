import {ADMIN_RESUMEN_WIDE_MIN_PX} from "@/lib/admin/admin-chrome";
import {adminCopy} from "@/lib/admin/admin-copy";
import {familyOperationChips} from "@/lib/admin/family-ops";
import {formatGuestsDeadlineChip} from "@/lib/admin/admin-guests-layout";
import type {AdminSortDir} from "@/lib/admin/list-view";

/** Figma Familias tablet portrait `123:268` (iPad 11" / 834px). */
export const ADMIN_FAMILIES_PORTRAIT_MIN_PX = ADMIN_RESUMEN_WIDE_MIN_PX;

/** Figma Familias tablet landscape `117:29` (`lg` / 1024). */
export const ADMIN_FAMILIES_LANDSCAPE_MIN_PX = 1024;

/** Figma Familias desktop `109:645` (matches Resumen / Invitados `xl`). */
export const ADMIN_FAMILIES_DESKTOP_MIN_PX = 1280;

export type AdminFamilyBrowserItem = {
    id: string;
    displayName: string;
    maximumGuests: number;
    status: "pending" | "responded" | "disabled";
    isEnabled: boolean;
    lastOpenedAt: string | null;
    invitationSlug: string;
    invitationUrl: string;
    confirmedGuestCount: number | null;
    guestCount: number;
    willAttend: boolean | null;
    submittedAt: string | null;
    updatedAt: string;
    hasPendingName: boolean;
    usesBus: boolean;
    hasDietary: boolean;
};

export type FamiliesListSubNavItem = {
    href: string;
    label: string;
    current?: boolean;
};

/** In-page shortcuts only — no Figma-only Mensajes / Transporte / Configuración. */
export const FAMILIES_LIST_SUBNAV: readonly FamiliesListSubNavItem[] = [
    {href: "/admin/analytics", label: adminCopy.nav.statistics},
    {
        href: "/admin/families",
        label: adminCopy.nav.families,
        current: true,
    },
    {
        href: "/admin/guests",
        label: adminCopy.familiesList.fullListTab,
    },
];

/** Portrait Figma `123:268` shortens the guests tab to “Lista completa”. */
export function familiesListSubnav(
    compactFullList = false,
): readonly FamiliesListSubNavItem[] {
    if (!compactFullList) {
        return FAMILIES_LIST_SUBNAV;
    }

    return FAMILIES_LIST_SUBNAV.map((item) =>
        item.href === "/admin/guests"
            ? {...item, label: adminCopy.familiesList.fullListTabCompact}
            : item,
    );
}

export function familiesDesktopTable(viewportPx: number): boolean {
    return viewportPx >= ADMIN_FAMILIES_LANDSCAPE_MIN_PX;
}

/** Landscape `117:29` shortens date columns; desktop `109:645` uses full labels. */
export function familiesCompactTableChrome(viewportPx: number): boolean {
    return (
        viewportPx >= ADMIN_FAMILIES_LANDSCAPE_MIN_PX &&
        viewportPx < ADMIN_FAMILIES_DESKTOP_MIN_PX
    );
}

/** Landscape `117:29` and desktop `109:645` both keep all five filters. */
export function familiesFilterFieldCount(): 5 {
    return 5;
}

export function familiesOpenedColumnLabel(compact: boolean): string {
    return compact
        ? adminCopy.familiesList.colOpenedCompact
        : adminCopy.familiesList.colOpened;
}

export function familiesSubmittedColumnLabel(compact: boolean): string {
    return compact
        ? adminCopy.familiesList.colSubmittedCompact
        : adminCopy.rsvp.submitted;
}

export function familiesUpdatedColumnLabel(compact: boolean): string {
    return compact
        ? adminCopy.familiesList.colUpdatedCompact
        : adminCopy.familiesList.colUpdated;
}

/**
 * Banner chip copy matches Resumen / Invitados (`rsvpDeadlineLead`).
 * Ignore Figma date chips — always remaining days.
 */
export function formatFamiliesDeadlineChip(
    deadlineLead: string | null,
): string | null {
    return formatGuestsDeadlineChip(deadlineLead);
}

/** Summary strip (Figma `109:645`): “N familias en total. Mostrando 1–25 de N familias.” */
export function familiesSummaryLine(
    total: number,
    page: {from: number; to: number; total: number},
): string {
    const noun = total === 1 ? "familia" : "familias";
    if (page.total === 0) {
        return `${total} ${noun} en total.`;
    }

    return `${total} ${noun} en total. Mostrando ${page.from}–${page.to} de ${page.total} ${
        page.total === 1 ? "familia" : "familias"
    }.`;
}

export function familyInvitationPath(slug: string): string {
    return `/i/${slug}`;
}

export type FamiliesViewCounts = {
    total: number;
    responded: number;
    pending: number;
    bus: number;
};

export function summarizeFamiliesView(
    families: ReadonlyArray<Pick<AdminFamilyBrowserItem, "status" | "usesBus">>,
): FamiliesViewCounts {
    let responded = 0;
    let pending = 0;
    let bus = 0;

    for (const family of families) {
        if (family.status === "responded") {
            responded += 1;
        } else if (family.status === "pending") {
            pending += 1;
        }
        if (family.usesBus) {
            bus += 1;
        }
    }

    return {
        total: families.length,
        responded,
        pending,
        bus,
    };
}

export function familiesPortraitCardGrid(viewportPx: number): boolean {
    return (
        viewportPx >= ADMIN_FAMILIES_PORTRAIT_MIN_PX &&
        viewportPx < ADMIN_FAMILIES_LANDSCAPE_MIN_PX
    );
}

export function familiesMobileCardStack(viewportPx: number): boolean {
    return viewportPx < ADMIN_FAMILIES_PORTRAIT_MIN_PX;
}

export type FamilyCardBadgeTone =
    | "confirmed"
    | "declined"
    | "unopened"
    | "disabled";

export type FamilyCardBadge = {
    label: string;
    tone: FamilyCardBadgeTone;
};

/**
 * Phone Figma `126:29`: Confirmó / No asiste / Sin abrir.
 * Do not copy guest “contacto principal” chips. Disabled stays Desactivada.
 */
export function familyCardBadge(
    family: Pick<
        AdminFamilyBrowserItem,
        "status" | "isEnabled" | "willAttend"
    >,
): FamilyCardBadge {
    if (!family.isEnabled || family.status === "disabled") {
        return {
            label: adminCopy.family.status.disabled,
            tone: "disabled",
        };
    }
    if (family.status === "responded") {
        if (family.willAttend === false) {
            return {
                label: adminCopy.familiesList.cardDeclined,
                tone: "declined",
            };
        }
        return {
            label: adminCopy.family.status.responded,
            tone: "confirmed",
        };
    }
    return {
        label: adminCopy.familiesList.cardUnopened,
        tone: "unopened",
    };
}

export type FamilyCardMetaRow = {
    label: string;
    value: string;
};

/**
 * Phone Figma `126:29` body: Estado (pending extras) / Cupos / Confirmados.
 * No slug, Bus, guest roles, or dummy “Familia: Materna” leftover.
 */
export function familyCardMobileMeta(
    family: Pick<
        AdminFamilyBrowserItem,
        | "status"
        | "isEnabled"
        | "lastOpenedAt"
        | "hasPendingName"
        | "usesBus"
        | "hasDietary"
        | "maximumGuests"
        | "confirmedGuestCount"
    >,
): FamilyCardMetaRow[] {
    const copy = adminCopy.familiesList;
    const rows: FamilyCardMetaRow[] = [];
    const statusDetail = familyCardStatusDetail(family);
    if (statusDetail) {
        rows.push({label: copy.metaStatus, value: statusDetail});
    }
    rows.push({label: copy.metaSeats, value: String(family.maximumGuests)});
    rows.push({
        label: copy.metaConfirmed,
        value: familyCardConfirmedCount(family.confirmedGuestCount),
    });
    return rows;
}

export function familyCardConfirmedCount(count: number | null): string {
    return count == null ? "0" : String(count);
}

/**
 * Figma `123:268` puts diet on the Bus row (“Sí, Dieta: Sí”).
 * Do not copy guest role labels onto family cards.
 */
export function familyCardBusLabel(usesBus: boolean, hasDietary: boolean): string {
    if (usesBus && hasDietary) {
        return "Sí, Dieta: Sí";
    }
    if (usesBus) {
        return "Sí";
    }
    if (hasDietary) {
        return "No, Dieta: Sí";
    }
    return "No";
}

export function familyCardConfirmedLabel(count: number | null): string {
    return count == null ? "—" : String(count);
}

const FAMILY_CARD_STATUS_CHIP_KEYS = new Set(["not-opened", "opened", "name"]);

/** Pending/disabled cards: “Abrió, Nombre pendiente” / “Sin abrir”. */
export function familyCardStatusDetail(
    family: Pick<
        AdminFamilyBrowserItem,
        | "status"
        | "isEnabled"
        | "lastOpenedAt"
        | "hasPendingName"
        | "usesBus"
        | "hasDietary"
    >,
): string | null {
    if (family.status === "responded") {
        return null;
    }

    const labels = familyOperationChips(family)
        .filter((chip) => FAMILY_CARD_STATUS_CHIP_KEYS.has(chip.key))
        .map((chip) => chip.label);

    return labels.length > 0 ? labels.join(", ") : null;
}

export type FamiliesSortSelectOption = {
    value: `${string}:${AdminSortDir}`;
    label: string;
};

export const FAMILIES_SORT_SELECT_OPTIONS: readonly FamiliesSortSelectOption[] = [
    {value: "displayName:asc", label: "Familia ↑"},
    {value: "displayName:desc", label: "Familia ↓"},
    {value: "guestCount:asc", label: "Cupos ↑"},
    {value: "guestCount:desc", label: "Cupos ↓"},
    {value: "confirmedGuestCount:asc", label: "Confirmados ↑"},
    {value: "confirmedGuestCount:desc", label: "Confirmados ↓"},
    {value: "status:asc", label: "Estado ↑"},
    {value: "status:desc", label: "Estado ↓"},
    {value: "lastOpenedAt:asc", label: "Abrió ↑"},
    {value: "lastOpenedAt:desc", label: "Abrió ↓"},
    {value: "submittedAt:asc", label: "Confirmó ↑"},
    {value: "submittedAt:desc", label: "Confirmó ↓"},
    {value: "updatedAt:asc", label: "Último cambio ↑"},
    {value: "updatedAt:desc", label: "Último cambio ↓"},
];

export function familiesSortSelectOptions(
    prefixed: boolean,
): readonly FamiliesSortSelectOption[] {
    if (!prefixed) {
        return FAMILIES_SORT_SELECT_OPTIONS;
    }
    const prefix = adminCopy.familiesList.sortByPrefix;
    return FAMILIES_SORT_SELECT_OPTIONS.map((option) => ({
        value: option.value,
        label: `${prefix} ${option.label}`,
    }));
}

export function familiesSortSelectValue(
    sort: string,
    dir: AdminSortDir,
): FamiliesSortSelectOption["value"] {
    const column = sort || "displayName";
    const value = `${column}:${dir}` as FamiliesSortSelectOption["value"];
    return FAMILIES_SORT_SELECT_OPTIONS.some((option) => option.value === value)
        ? value
        : "displayName:asc";
}

export function parseFamiliesSortSelect(value: string): {
    sort: string;
    dir: AdminSortDir;
} {
    const [sort = "displayName", dir] = value.split(":");
    return {sort, dir: dir === "desc" ? "desc" : "asc"};
}
