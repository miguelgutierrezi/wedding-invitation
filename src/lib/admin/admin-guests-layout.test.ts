import {describe, expect, it} from "vitest";

import {adminCopy} from "@/lib/admin/admin-copy";
import {rsvpDeadlineLead} from "@/lib/admin/dashboard-resumen";
import {adminGuests} from "@/components/admin/admin-ui";
import {
    ADMIN_GUESTS_DESKTOP_MIN_PX,
    ADMIN_GUESTS_LANDSCAPE_MIN_PX,
    ADMIN_GUESTS_PORTRAIT_MIN_PX,
    formatGuestsDeadlineChip,
    guestBusLabel,
    guestRoleLabel,
    guestsFilterFieldCount,
    guestsMobileCardStack,
    guestsPortraitCardGrid,
    guestsSortSelectOptions,
    guestsSortSelectValue,
    GUESTS_LIST_SUBNAV,
    GUESTS_SORT_SELECT_OPTIONS,
    parseGuestsSortSelect,
    summarizeGuestsView,
} from "@/lib/admin/admin-guests-layout";

describe("admin guests Figma helpers", () => {
    it("counts filtered-view attendance and bus totals", () => {
        expect(
            summarizeGuestsView([
                {attendanceStatus: "attending", needsTransport: true},
                {attendanceStatus: "attending", needsTransport: false},
                {attendanceStatus: "not_attending", needsTransport: false},
                {attendanceStatus: "pending", needsTransport: true},
            ]),
        ).toEqual({
            total: 4,
            attending: 2,
            notAttending: 1,
            pending: 1,
            bus: 2,
        });
    });

    it("labels primary vs companion the way Figma does", () => {
        expect(guestRoleLabel(true)).toBe("contacto principal");
        expect(guestRoleLabel(false)).toBe("acompañante");
    });

    it("uses remaining-days copy on the banner chip, not Figma date labels", () => {
        expect(formatGuestsDeadlineChip(rsvpDeadlineLead(9))).toBe(
            "⏳ Quedan 9 días para confirmar",
        );
        expect(formatGuestsDeadlineChip(rsvpDeadlineLead(1))).toBe(
            "⏳ Queda 1 día para confirmar",
        );
        expect(formatGuestsDeadlineChip(null)).toBeNull();
    });

    it("keeps in-page tabs on real admin routes (no Mensajes)", () => {
        expect(GUESTS_LIST_SUBNAV.map((item) => item.href)).toEqual([
            "/admin/analytics",
            "/admin/families",
            "/admin/guests",
        ]);
        expect(GUESTS_LIST_SUBNAV.some((item) => item.current)).toBe(true);
        expect(GUESTS_LIST_SUBNAV.map((item) => item.href).join(" ")).not.toMatch(
            /mensajes|transporte|configuraci/i,
        );
    });

    it("uses landscape 1024 then desktop 1280 density", () => {
        expect(ADMIN_GUESTS_LANDSCAPE_MIN_PX).toBe(1024);
        expect(ADMIN_GUESTS_DESKTOP_MIN_PX).toBe(1280);
        expect(guestsFilterFieldCount(1024)).toBe(6);
        expect(guestsFilterFieldCount(1279)).toBe(6);
        expect(guestsFilterFieldCount(1280)).toBe(7);
        expect(adminGuests.filterGrid).toContain("lg:grid-cols-3");
        expect(adminGuests.filterGrid).toContain("xl:grid-cols-4");
        expect(adminGuests.nameFilter).toContain("hidden");
        expect(adminGuests.nameFilter).toContain("xl:contents");
        expect(adminGuests.filterCard).toContain("rounded-2xl");
        expect(adminGuests.filterCard).toContain("xl:rounded-[20px]");
        expect(adminGuests.tableCard).toContain("rounded-2xl");
        expect(adminGuests.tableCard).toContain("xl:rounded-[20px]");
        expect(adminGuests.subTabActive).toContain("bg-admin-olive");
        expect(adminGuests.tableHead).toContain("text-admin-olive");
        expect(adminGuests.tableRowSelected).toContain("bg-accent/10");
        expect(adminGuests.pageNext).toContain("bg-admin-olive");
        expect(adminGuests.batchBar).toContain("bg-admin-olive");
        expect(adminGuests.batchBar).toContain("lg:flex-row");
        expect(adminGuests.batchAnchor).toContain("5.5rem");
        expect(adminGuests.batchAnchor).not.toContain("bottom-4");
        expect(adminGuests.familyLink).toContain("underline");
        expect(adminGuests.checkbox).toContain("checked:bg-admin-olive");
        expect(adminGuests.checkbox).toContain("rounded-md");
        expect(adminGuests.checkbox).toContain("appearance-none");
        expect(adminGuests.checkbox).not.toContain("accent-accent");
        expect(adminGuests.searchBox).toContain("pl-9");
        expect(adminGuests.searchBox).toContain("xl:pl-10");
        expect(adminGuests.searchBox).toContain("pr-3");
        expect(adminGuests.searchBox).toContain("xl:pr-3.5");
        expect(adminGuests.searchBox).not.toContain("xl:px-");
        expect(adminGuests.searchBox).not.toMatch(/(?:^|\s)px-/);
        expect(adminGuests.searchIcon).toContain("left-3");
        expect(adminGuests.searchIcon).toContain("xl:left-3.5");
    });

    it("keeps compact batch copy for landscape", () => {
        expect(adminCopy.guestsList.selectVisibleCompact(93)).toBe("Seleccionar 93");
        expect(adminCopy.guestsList.copyPhonesCompact).toBe("Copiar tels");
        expect(adminCopy.guestsList.exportCompact).toBe("Descargar");
        expect(adminCopy.guestsList.searchPlaceholderCompact).toBe(
            "Nombre, familia, email...",
        );
    });

    it("uses mobile stacked cards below 834 with 2×2 stats", () => {
        expect(guestsMobileCardStack(390)).toBe(true);
        expect(guestsMobileCardStack(833)).toBe(true);
        expect(guestsMobileCardStack(834)).toBe(false);
        expect(guestBusLabel(true)).toBe("Sí");
        expect(guestBusLabel(false)).toBe("No");
        expect(guestBusLabel(false, true)).toBe("Sin bus");
        expect(guestsSortSelectOptions(true)[0]?.label).toBe(
            "Ordenar por: Invitado ↑",
        );
        expect(adminGuests.mobileStatGrid).toContain("grid-cols-2");
        expect(adminGuests.mobileCardGrid).toContain("grid-cols-1");
        expect(adminGuests.mobileSubTabActive).toContain("flex-1");
        expect(adminCopy.guestsList.sortByPrefix).toBe("Ordenar por:");
        expect(adminCopy.guestsList.selectVisible(93)).toBe("Seleccionar los 93");
    });

    it("uses portrait 834 card grid until landscape table", () => {
        expect(ADMIN_GUESTS_PORTRAIT_MIN_PX).toBe(834);
        expect(guestsPortraitCardGrid(833)).toBe(false);
        expect(guestsPortraitCardGrid(834)).toBe(true);
        expect(guestsPortraitCardGrid(1023)).toBe(true);
        expect(guestsPortraitCardGrid(1024)).toBe(false);
        expect(adminGuests.portraitCardGrid).toContain("grid-cols-2");
        expect(adminGuests.portraitStatGrid).toContain("grid-cols-4");
        expect(adminGuests.portraitFamilyBtn).toContain("bg-admin-wash");
        expect(adminCopy.guestsList.summaryTotal(93)).toBe(
            "Resumen total. En esta vista: 93 invitados",
        );
        expect(adminCopy.guestsList.searchPlaceholderPortrait).toBe("Buscar...");
        expect(adminCopy.guestsList.metaPhone).toBe("Telf:");
        expect(parseGuestsSortSelect("familyName:desc")).toEqual({
            sort: "familyName",
            dir: "desc",
        });
        expect(guestsSortSelectValue("", "asc")).toBe("fullName:asc");
        expect(GUESTS_SORT_SELECT_OPTIONS[0]?.label).toBe("Invitado ↑");
    });
});
