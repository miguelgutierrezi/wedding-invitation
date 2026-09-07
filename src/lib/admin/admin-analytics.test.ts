import {describe, expect, it} from "vitest";

import {adminResumen} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    buildAnalyticsBusPoints,
    buildAnalyticsRateRows,
    buildAnalyticsStatCards,
    formatAnalyticsBannerBody,
} from "@/lib/admin/admin-analytics";

const snapshot = {
    familyCount: 53,
    familyResponseRate: 86.6,
    familiesResponded: 46,
    familiesPending: 7,
    familiesOpened: 52,
    familiesDisabled: 0,
    totalGuests: 93,
    guestConfirmRate: 85,
    guestsAttending: 68,
    guestsNotAttending: 11,
    guestsPending: 14,
    guestsNeedingTransport: 37,
    guestsWithDietary: 7,
    guestsPendingNameConfirmation: 4,
};

describe("admin analytics Figma helpers", () => {
    it("builds the three confirmation rate rows with clamped percents", () => {
        const rows = buildAnalyticsRateRows({
            familyResponseRate: snapshot.familyResponseRate,
            guestConfirmRate: snapshot.guestConfirmRate,
            transportAmongAttendingRate: 54,
        });
        expect(rows.map((row) => row.key)).toEqual(["families", "guests", "bus"]);
        expect(rows[0]?.percent).toBe(87);
        expect(rows[0]?.hint).toContain("RSVP");
        expect(rows[2]?.title).toMatch(/bus/i);
    });

    it("maps live metrics onto the twelve desktop stat cards in Figma order", () => {
        const cards = buildAnalyticsStatCards(snapshot);
        expect(cards.map((card) => card.key)).toEqual([
            "families",
            "familiesResponded",
            "familiesPending",
            "familiesOpened",
            "familiesDisabled",
            "guests",
            "attending",
            "notAttending",
            "pending",
            "bus",
            "dietary",
            "names",
        ]);
        expect(cards[0]?.footnote).toBe("87% ya confirmaron asistencia");
        expect(cards[5]?.footnote).toBe("85% confirmados o rechazados");
        expect(cards[11]?.pill).toBe("Faltan datos");
        expect(cards[2]?.href).toContain("/admin/families");
        expect(cards[10]?.href).toContain("/admin/guests");
        expect(cards.map((card) => card.href).join(" ")).not.toMatch(
            /mensajes/i,
        );
    });

    it("builds boarding-point cards from config, not invented stops", () => {
        const points = buildAnalyticsBusPoints({
            modelia: 20,
            villa_sonia: 17,
        });
        expect(points.map((point) => point.id)).toEqual(["modelia", "villa_sonia"]);
        expect(points[0]?.count).toBe(20);
        expect(points[1]?.place).toMatch(/Villa Sonia/i);
        expect(points[0]?.href).toContain("boarding=modelia");
        expect(points[1]?.href).toContain("boarding=villa_sonia");
    });

    it("interpolates the live venue into the banner body", () => {
        expect(formatAnalyticsBannerBody("Hacienda Montecano")).toContain(
            "Hacienda Montecano",
        );
        expect(formatAnalyticsBannerBody("Hacienda Montecano")).toContain(
            "detallada",
        );
        expect(
            formatAnalyticsBannerBody("Hacienda Montecano", true),
        ).toContain("Hacienda Montecano");
        expect(
            formatAnalyticsBannerBody("Hacienda Montecano", true),
        ).not.toContain("detallada");
    });

    it("uses a 2-column portrait grid from 834px and 3 columns from landscape lg", () => {
        expect(adminResumen.statsGrid).toContain("min-[834px]:grid-cols-2");
        expect(adminResumen.statsGrid).toContain("lg:grid-cols-3");
        expect(adminResumen.statsGrid).not.toContain("xl:grid-cols-3");
        expect(adminResumen.busGrid).toContain("min-[834px]:grid-cols-2");
        expect(adminResumen.busCard).toContain("w-full");
        expect(adminResumen.statsValue).toContain("min-[834px]:text-[36px]");
        expect(adminResumen.statsGaugeValue).toContain("min-[834px]:text-[24px]");
        expect(adminResumen.busValue).toContain("min-[834px]:text-[36px]");
        expect(adminResumen.analyticsOverlineStacked).toContain("lg:hidden");
        expect(adminResumen.analyticsOverlineInline).toContain("lg:flex");
        expect(adminResumen.analyticsOverlineStacked).not.toContain(
            "min-[834px]:hidden",
        );
    });

    it("stacks phone Estadísticas (Figma 99:607): 1-col cards, rate % under labels, compact banner", () => {
        expect(adminResumen.statsGrid).toContain("grid-cols-1");
        expect(adminResumen.statsGrid).toContain("gap-3");
        expect(adminResumen.busGrid).toContain("grid-cols-1");
        expect(adminResumen.busGrid).toContain("min-[834px]:grid-cols-2");
        expect(adminResumen.busGrid).not.toContain("grid-cols-2 xl");
        expect(adminResumen.analyticsRateHead).toContain("flex-col");
        expect(adminResumen.analyticsRateHead).toContain(
            "min-[834px]:flex-row",
        );
        expect(adminResumen.analyticsRateHead).not.toContain(
            "min-[834px]:flex-col",
        );
        expect(adminResumen.statsGaugeValue).toContain("text-[22px]");
        expect(adminResumen.analyticsBannerTitle).toContain("text-[26px]");
        expect(adminResumen.bannerActions).toContain("flex-col");
        expect(adminResumen.bannerActions).toContain("min-[834px]:flex-row");
        expect(adminResumen.busCard).toContain("p-4");
        expect(adminCopy.analytics.bannerTitleCompact).toBe("Panel de Estadísticas");
        expect(adminCopy.analytics.guestRateHint).toContain("persona");
    });
});
