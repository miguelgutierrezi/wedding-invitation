import {describe, expect, it} from "vitest";

import {familyStatusBadgeClass} from "@/components/admin/admin-status-badge";
import {adminCopy} from "@/lib/admin/admin-copy";
import {rsvpDeadlineLead} from "@/lib/admin/dashboard-resumen";
import {adminFamilies, adminGuests} from "@/components/admin/admin-ui";
import {familyOpsChipIsAlert} from "@/lib/admin/family-ops";
import {
    ADMIN_FAMILIES_DESKTOP_MIN_PX,
    ADMIN_FAMILIES_LANDSCAPE_MIN_PX,
    ADMIN_FAMILIES_PORTRAIT_MIN_PX,
    FAMILIES_LIST_SUBNAV,
    FAMILIES_SORT_SELECT_OPTIONS,
    familiesCompactTableChrome,
    familiesDesktopTable,
    familiesFilterFieldCount,
    familiesListSubnav,
    familiesMobileCardStack,
    familiesOpenedColumnLabel,
    familiesPortraitCardGrid,
    familiesSortSelectValue,
    familiesSortSelectOptions,
    familiesSubmittedColumnLabel,
    familiesSummaryLine,
    familiesUpdatedColumnLabel,
    familyCardBadge,
    familyCardBusLabel,
    familyCardConfirmedCount,
    familyCardConfirmedLabel,
    familyCardMobileMeta,
    familyCardStatusDetail,
    familyInvitationPath,
    formatFamiliesDeadlineChip,
    parseFamiliesSortSelect,
    summarizeFamiliesView,
} from "@/lib/admin/admin-families-layout";

describe("admin families Figma helpers", () => {
    it("uses remaining-days copy on the banner chip, not Figma date labels", () => {
        expect(formatFamiliesDeadlineChip(rsvpDeadlineLead(9))).toBe(
            "⏳ Quedan 9 días para confirmar",
        );
        expect(formatFamiliesDeadlineChip(rsvpDeadlineLead(1))).toBe(
            "⏳ Queda 1 día para confirmar",
        );
        expect(formatFamiliesDeadlineChip(null)).toBeNull();
    });

    it("keeps in-page tabs on real admin routes (no Mensajes)", () => {
        expect(FAMILIES_LIST_SUBNAV.map((item) => item.href)).toEqual([
            "/admin/analytics",
            "/admin/families",
            "/admin/guests",
        ]);
        expect(FAMILIES_LIST_SUBNAV.find((item) => item.current)?.href).toBe(
            "/admin/families",
        );
        expect(adminCopy.familiesList.fullListTab).toBe(
            "Lista completa de Invitados",
        );
        expect(FAMILIES_LIST_SUBNAV.map((item) => item.href).join(" ")).not.toMatch(
            /mensajes|transporte|configuraci/i,
        );
    });

    it("uses landscape 1024 then desktop 1280 density", () => {
        expect(ADMIN_FAMILIES_LANDSCAPE_MIN_PX).toBe(1024);
        expect(ADMIN_FAMILIES_DESKTOP_MIN_PX).toBe(1280);
        expect(familiesDesktopTable(1023)).toBe(false);
        expect(familiesDesktopTable(1024)).toBe(true);
        expect(familiesCompactTableChrome(1023)).toBe(false);
        expect(familiesCompactTableChrome(1024)).toBe(true);
        expect(familiesCompactTableChrome(1279)).toBe(true);
        expect(familiesCompactTableChrome(1280)).toBe(false);
        expect(familiesFilterFieldCount()).toBe(5);
        expect(familiesOpenedColumnLabel(true)).toBe("Abrió");
        expect(familiesOpenedColumnLabel(false)).toBe("Abrió invitación");
        expect(familiesSubmittedColumnLabel(true)).toBe("Confirmó");
        expect(familiesUpdatedColumnLabel(true)).toBe("Últ. cambio");
        expect(familiesUpdatedColumnLabel(false)).toBe("Último cambio");
        expect(adminFamilies.filterGrid).toContain("lg:grid-cols-5");
        expect(adminFamilies.filterGrid).not.toContain("lg:grid-cols-3");
        expect(adminGuests.tableCard).toContain("xl:rounded-[20px]");
        expect(adminGuests.subTabActive).toContain("bg-admin-olive");
        expect(adminGuests.tableHead).toContain("text-admin-olive");
        expect(adminGuests.tableRowSelected).toContain("bg-accent/10");
        expect(adminGuests.pageNext).toContain("bg-admin-olive");
        expect(adminGuests.batchBar).toContain("bg-admin-olive");
        expect(adminGuests.batchAnchor).toContain("5.5rem");
        expect(adminGuests.familyLink).toContain("underline");
        expect(adminGuests.checkbox).toContain("checked:bg-admin-olive");
        expect(adminFamilies.tag).toContain("bg-admin-wash");
        expect(adminFamilies.tagAlert).toContain("bg-[#fee2e2]");
        expect(adminCopy.familiesList.bannerTitle).toBe("Gestión de Familias");
        expect(adminCopy.familiesList.viewFamily).toBe("Ver");
        expect(adminCopy.familiesList.viewFamilyCard).toBe("Ver familia");
        expect(adminCopy.familiesList.selectVisible(53)).toBe("Seleccionar las 53");
        expect(adminCopy.familiesList.selectVisibleCompact(53)).toBe(
            "Seleccionar 53",
        );
    });

    it("formats the summary strip like Figma 109:645", () => {
        expect(familiesSummaryLine(53, {from: 1, to: 25, total: 53})).toBe(
            "53 familias en total. Mostrando 1–25 de 53 familias.",
        );
        expect(familiesSummaryLine(1, {from: 1, to: 1, total: 1})).toBe(
            "1 familia en total. Mostrando 1–1 de 1 familia.",
        );
        expect(familiesSummaryLine(0, {from: 0, to: 0, total: 0})).toBe(
            "0 familias en total.",
        );
        expect(familyInvitationPath("amanda-felipe")).toBe("/i/amanda-felipe");
    });

    it("marks only Sin abrir as the red Figma chip", () => {
        expect(familyOpsChipIsAlert("not-opened")).toBe(true);
        expect(familyOpsChipIsAlert("opened")).toBe(false);
        expect(familyOpsChipIsAlert("bus")).toBe(false);
        expect(familyOpsChipIsAlert("diet")).toBe(false);
        expect(familyOpsChipIsAlert("name")).toBe(false);
        expect(familyStatusBadgeClass("responded", "figma")).toContain(
            "bg-[#eaf6ef]",
        );
        expect(familyStatusBadgeClass("pending", "figma")).toContain("bg-[#fee2e2]");
        expect(familyStatusBadgeClass("disabled", "figma")).toContain(
            "bg-admin-wash",
        );
    });

    it("counts filtered-view family totals for portrait KPIs", () => {
        expect(
            summarizeFamiliesView([
                {status: "responded", usesBus: true},
                {status: "responded", usesBus: false},
                {status: "pending", usesBus: true},
                {status: "disabled", usesBus: false},
            ]),
        ).toEqual({
            total: 4,
            responded: 2,
            pending: 1,
            bus: 2,
        });
        expect(adminCopy.familiesList.summaryTotal(53)).toBe(
            "Resumen total. En esta vista: 53 familias",
        );
        expect(adminCopy.familiesList.summaryTotal(1)).toBe(
            "Resumen total. En esta vista: 1 familia",
        );
        expect(adminCopy.familiesList.statTotal).toBe("Familias");
        expect(adminCopy.familiesList.statResponded).toBe("Confirmaron");
        expect(adminCopy.familiesList.statBus).toBe("Con bus");
    });

    it("uses 2-column cards from 834px until landscape table at 1024", () => {
        expect(ADMIN_FAMILIES_PORTRAIT_MIN_PX).toBe(834);
        expect(familiesPortraitCardGrid(833)).toBe(false);
        expect(familiesPortraitCardGrid(834)).toBe(true);
        expect(familiesPortraitCardGrid(1023)).toBe(true);
        expect(familiesPortraitCardGrid(1024)).toBe(false);
        expect(familiesMobileCardStack(833)).toBe(true);
        expect(familiesMobileCardStack(834)).toBe(false);
        expect(familiesListSubnav(true).find((item) => item.href === "/admin/guests")?.label).toBe(
            "Lista completa",
        );
        expect(FAMILIES_LIST_SUBNAV.find((item) => item.href === "/admin/guests")?.label).toBe(
            "Lista completa de Invitados",
        );
        expect(adminCopy.familiesList.searchPlaceholderPortrait).toBe("Buscar...");
        expect(adminCopy.familiesList.showFilters).toBe("Mostrar filtros");
        expect(adminGuests.portraitCardGrid).toContain("grid-cols-2");
        expect(adminGuests.mobileCardGrid).toContain("grid-cols-1");
        expect(adminGuests.mobileStatGrid).toContain("grid-cols-2");
        expect(adminCopy.familiesList.statTotalLong).toBe("Total familias");
        expect(adminCopy.familiesList.sortByPrefix).toBe("Ordenar por:");
        expect(familiesSortSelectOptions(true)[0]?.label).toBe(
            "Ordenar por: Familia ↑",
        );
        expect(adminCopy.familiesList.selectVisible(53)).toBe(
            "Seleccionar las 53",
        );
        expect(adminCopy.batch.copyLinks).toBe("Copiar enlaces");
        expect(adminCopy.batch.copyLinks).not.toBe("Crear selección");
    });

    it("maps family cards to slug, bus, seats, and pending status — not guest roles", () => {
        expect(familyCardBusLabel(true, true)).toBe("Sí, Dieta: Sí");
        expect(familyCardBusLabel(true, false)).toBe("Sí");
        expect(familyCardBusLabel(false, true)).toBe("No, Dieta: Sí");
        expect(familyCardBusLabel(false, false)).toBe("No");
        expect(familyCardConfirmedLabel(2)).toBe("2");
        expect(familyCardConfirmedLabel(null)).toBe("—");
        expect(adminCopy.familiesList.metaConfirmed).toBe("Confirmados:");
        expect(
            familyCardStatusDetail({
                status: "responded",
                isEnabled: true,
                lastOpenedAt: "2026-09-06T15:49:00.000Z",
                hasPendingName: false,
                usesBus: true,
                hasDietary: true,
            }),
        ).toBeNull();
        expect(
            familyCardStatusDetail({
                status: "pending",
                isEnabled: true,
                lastOpenedAt: "2026-09-06T15:49:00.000Z",
                hasPendingName: true,
                usesBus: false,
                hasDietary: false,
            }),
        ).toBe("Abrió, Nombre pendiente");
        expect(
            familyCardStatusDetail({
                status: "pending",
                isEnabled: true,
                lastOpenedAt: null,
                hasPendingName: false,
                usesBus: false,
                hasDietary: false,
            }),
        ).toBe("Sin abrir");
        expect(adminCopy.familiesList.metaStatus).toBe("Estado:");
        expect(adminCopy.familiesList.metaSeats).toBe("Cupos:");
        expect(FAMILIES_SORT_SELECT_OPTIONS[0]?.label).toBe("Familia ↑");
        expect(familiesSortSelectValue("", "asc")).toBe("displayName:asc");
        expect(parseFamiliesSortSelect("guestCount:desc")).toEqual({
            sort: "guestCount",
            dir: "desc",
        });
    });

    it("maps phone Figma 126:29 badges and meta without guest roles or Bus", () => {
        expect(
            familyCardBadge({
                status: "responded",
                isEnabled: true,
                willAttend: true,
            }),
        ).toEqual({label: "Confirmó", tone: "confirmed"});
        expect(
            familyCardBadge({
                status: "responded",
                isEnabled: true,
                willAttend: false,
            }),
        ).toEqual({label: "No asiste", tone: "declined"});
        expect(
            familyCardBadge({
                status: "pending",
                isEnabled: true,
                willAttend: null,
            }),
        ).toEqual({label: "Sin abrir", tone: "unopened"});
        expect(
            familyCardBadge({
                status: "disabled",
                isEnabled: false,
                willAttend: null,
            }),
        ).toEqual({label: "Desactivada", tone: "disabled"});
        expect(familyCardConfirmedCount(null)).toBe("0");
        expect(familyCardConfirmedCount(4)).toBe("4");
        expect(
            familyCardMobileMeta({
                status: "responded",
                isEnabled: true,
                lastOpenedAt: "2026-09-06T15:49:00.000Z",
                hasPendingName: false,
                usesBus: true,
                hasDietary: true,
                maximumGuests: 4,
                confirmedGuestCount: 4,
            }).map((row) => row.label),
        ).toEqual(["Cupos:", "Confirmados:"]);
        expect(
            familyCardMobileMeta({
                status: "pending",
                isEnabled: true,
                lastOpenedAt: "2026-09-06T15:49:00.000Z",
                hasPendingName: true,
                usesBus: false,
                hasDietary: false,
                maximumGuests: 1,
                confirmedGuestCount: null,
            }),
        ).toEqual([
            {label: "Estado:", value: "Abrió, Nombre pendiente"},
            {label: "Cupos:", value: "1"},
            {label: "Confirmados:", value: "0"},
        ]);
        expect(adminFamilies.cardBadgeUnopened).toContain("bg-[#e4e3da]");
        expect(adminCopy.guest.primaryContact).toBe("contacto principal");
        expect(adminCopy.familiesList.cardDeclined).toBe("No asiste");
    });
});
