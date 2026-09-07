import {describe, expect, it} from "vitest";

import {
    actionQueueCtaLabel,
    buildActionQueueItems,
    buildDashboardKpiCards,
    buildPendingSummary,
    clampPercent,
    countPhrase,
    familyProgressHint,
    followUpCountBadge,
    formatResumenDeadlineOverline,
    guestProgressHint,
    rsvpDeadlineLead,
    selectResumenFollowUps,
} from "@/lib/admin/dashboard-resumen";
import {buildCloseFollowUpItems} from "@/lib/admin/rsvp-close-checklist";

describe("clampPercent", () => {
    it("rounds and clamps to 0–100", () => {
        expect(clampPercent(86.6)).toBe(87);
        expect(clampPercent(-4)).toBe(0);
        expect(clampPercent(140)).toBe(100);
        expect(clampPercent(Number.NaN)).toBe(0);
    });
});

describe("rsvpDeadlineLead", () => {
    it("covers remaining, today, and past deadlines", () => {
        expect(rsvpDeadlineLead(9)).toBe("Quedan 9 días para confirmar");
        expect(rsvpDeadlineLead(1)).toBe("Queda 1 día para confirmar");
        expect(rsvpDeadlineLead(0)).toBe("Hoy vence el plazo para confirmar");
        expect(rsvpDeadlineLead(-2)).toBe(
            "La fecha límite para confirmar ya pasó",
        );
        expect(rsvpDeadlineLead(null)).toBeNull();
    });
});

describe("formatResumenDeadlineOverline", () => {
    it("uses the stacked mobile Límite label and the tablet Fecha Límite label", () => {
        expect(
            formatResumenDeadlineOverline("15/09/2026, 11:59 p. m.", true),
        ).toBe("⏰ Límite: 15/09/2026, 11:59 p. m.");
        expect(
            formatResumenDeadlineOverline("15/09/2026, 11:59 p. m.", false),
        ).toBe("Fecha Límite: 15/09/2026, 11:59 p. m.");
    });
});

describe("progress and badge copy", () => {
    it("pluralizes family and guest progress hints", () => {
        expect(familyProgressHint(46, 7)).toBe(
            "46 confirmadas • 7 pendientes",
        );
        expect(familyProgressHint(1, 1)).toBe("1 confirmada • 1 pendiente");
        expect(guestProgressHint(79, 14)).toBe(
            "79 respondieron • 14 sin responder",
        );
        expect(guestProgressHint(1, 1)).toBe("1 respondió • 1 sin responder");
    });

    it("builds Figma-style follow-up badges", () => {
        expect(
            followUpCountBadge({
                key: "rsvp",
                label: "Confirmaciones",
                hint: "",
                count: 7,
                href: "/",
                done: false,
            }),
        ).toBe("7 familias restantes");
        expect(
            followUpCountBadge({
                key: "names",
                label: "Nombres",
                hint: "",
                count: 1,
                href: "/",
                done: false,
            }),
        ).toBe("1 nombre faltante");
        expect(
            followUpCountBadge({
                key: "diet",
                label: "Dieta",
                hint: "",
                count: 5,
                href: "/",
                done: true,
            }),
        ).toBe("5 requerimientos");
        expect(
            followUpCountBadge({
                key: "photos",
                label: "Fotos",
                hint: "",
                count: 0,
                href: "/",
                done: true,
            }),
        ).toBe("Listo");
        expect(
            followUpCountBadge(
                {
                    key: "rsvp",
                    label: "Confirmaciones",
                    hint: "",
                    count: 7,
                    href: "/",
                    done: false,
                },
                true,
            ),
        ).toBe("7 restantes");
        expect(
            followUpCountBadge(
                {
                    key: "names",
                    label: "Nombres",
                    hint: "",
                    count: 4,
                    href: "/",
                    done: false,
                },
                true,
            ),
        ).toBe("4 faltantes");
    });
});

describe("selectResumenFollowUps", () => {
    it("keeps the desktop rows and only inserts boarding when it is open", () => {
        const readyBoarding = buildCloseFollowUpItems({
            familiesPending: 2,
            familiesPendingHref: "/p",
            guestsPendingNameConfirmation: 1,
            guestsPendingNameHref: "/n",
            guestsNeedingTransport: 8,
            guestsTransportHref: "/t",
            guestsBusMissingPoint: 0,
            guestsBusMissingHref: "/b",
            guestsWithDietary: 3,
            guestsDietaryHref: "/d",
            photosAwaitingReview: 0,
            photosHref: "/photos",
        });
        expect(selectResumenFollowUps(readyBoarding).map((item) => item.key)).toEqual(
            ["rsvp", "names", "diet", "transport", "photos"],
        );

        const openBoarding = buildCloseFollowUpItems({
            familiesPending: 2,
            familiesPendingHref: "/p",
            guestsPendingNameConfirmation: 1,
            guestsPendingNameHref: "/n",
            guestsNeedingTransport: 8,
            guestsTransportHref: "/t",
            guestsBusMissingPoint: 1,
            guestsBusMissingHref: "/b",
            guestsWithDietary: 3,
            guestsDietaryHref: "/d",
            photosAwaitingReview: 2,
            photosHref: "/photos",
        });
        expect(selectResumenFollowUps(openBoarding).map((item) => item.key)).toEqual(
            ["rsvp", "names", "diet", "transport", "boarding", "photos"],
        );
    });
});

describe("dashboard KPIs and queue", () => {
    it("maps live metrics onto the four desktop KPI cards", () => {
        const cards = buildDashboardKpiCards({
            familyCount: 53,
            familyResponseRate: 87,
            assignedSeats: 93,
            guestConfirmRate: 85,
            guestsAttending: 68,
            guestsNeedingTransport: 37,
        });
        expect(cards.map((card) => card.key)).toEqual([
            "families",
            "seats",
            "attending",
            "bus",
        ]);
        expect(cards[0]?.footnote).toBe("87% ya confirmaron asistencia");
        expect(cards[1]?.footnote).toBe("85% confirmados o rechazados");
        expect(cards[2]?.href).toContain("/admin/guests");
    });

    it("orders attention cards and uses Asignar only for names", () => {
        const items = buildActionQueueItems({
            familiesPending: 7,
            familiesOpenedPending: 6,
            guestsNeedsName: 4,
            guestsBusMissingPoint: 0,
            photosAwaitingReview: 0,
            familiesDisabledPending: 0,
        });
        expect(items.map((item) => item.key)).toEqual([
            "familiesPending",
            "needsName",
            "openedPending",
        ]);
        expect(actionQueueCtaLabel("needsName")).toBe("Asignar");
        expect(actionQueueCtaLabel("openedPending")).toBe("Ver lista");
        expect(actionQueueCtaLabel("familiesPending")).toBe("Ver lista");
    });

    it("builds the pending-summary lines", () => {
        expect(
            buildPendingSummary({
                familiesPending: 7,
                guestsPending: 14,
                guestsPendingNameConfirmation: 4,
            }),
        ).toEqual({
            totalsLabel: "Pendientes Totales:",
            totalsValue: "7 familias • 14 invitados",
            compactTotalsValue: "7 fam. • 14 inv.",
            namesLabel: "Nombres Incompletos:",
            namesValue: "4 acompañantes",
        });
        expect(countPhrase(1, "familia", "familias")).toBe("1 familia");
    });
});
