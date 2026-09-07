import {describe, expect, it} from "vitest";

import {adminFamilyDetail, adminResumen} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    ADMIN_FAMILY_DETAIL_DESKTOP_MIN_PX,
    ADMIN_FAMILY_DETAIL_LANDSCAPE_MIN_PX,
    ADMIN_FAMILY_DETAIL_MOBILE_MAX_PX,
    ADMIN_FAMILY_DETAIL_PORTRAIT_MIN_PX,
    FAMILY_DETAIL_PORTRAIT_CARD_ORDER,
    familyDetailCompactChrome,
    familyDetailConfirmationLabel,
    familyDetailDeleteTitle,
    familyDetailDesktopWorkspace,
    familyDetailFigmaWorkspace,
    familyDetailGuestAttendanceLabel,
    familyDetailGuestPickupLine,
    familyDetailGuestPills,
    familyDetailLandscapeWorkspace,
    familyDetailMobileWorkspace,
    familyDetailPortraitWorkspace,
    familyDetailStatusEmailLabel,
    familyDetailStatusPhoneLabel,
    familyDetailStatusPills,
    familyDetailStatusTransportLabel,
    familyDetailTransportLabel,
    formatFamilyDetailDeadlineChip,
    resizeGuestRows,
} from "@/lib/admin/admin-family-detail-layout";
import {rsvpDeadlineLead} from "@/lib/admin/dashboard-resumen";

describe("admin family detail Figma helpers", () => {
    it("uses mobile below 834, portrait 834, landscape 1024, then desktop 1280", () => {
        expect(ADMIN_FAMILY_DETAIL_MOBILE_MAX_PX).toBe(833);
        expect(ADMIN_FAMILY_DETAIL_PORTRAIT_MIN_PX).toBe(834);
        expect(ADMIN_FAMILY_DETAIL_LANDSCAPE_MIN_PX).toBe(1024);
        expect(ADMIN_FAMILY_DETAIL_DESKTOP_MIN_PX).toBe(1280);
        expect(familyDetailMobileWorkspace(390)).toBe(true);
        expect(familyDetailMobileWorkspace(833)).toBe(true);
        expect(familyDetailMobileWorkspace(834)).toBe(false);
        expect(familyDetailPortraitWorkspace(833)).toBe(false);
        expect(familyDetailPortraitWorkspace(834)).toBe(true);
        expect(familyDetailPortraitWorkspace(1023)).toBe(true);
        expect(familyDetailPortraitWorkspace(1024)).toBe(false);
        expect(familyDetailLandscapeWorkspace(1023)).toBe(false);
        expect(familyDetailLandscapeWorkspace(1024)).toBe(true);
        expect(familyDetailLandscapeWorkspace(1279)).toBe(true);
        expect(familyDetailLandscapeWorkspace(1280)).toBe(false);
        expect(familyDetailDesktopWorkspace(1279)).toBe(false);
        expect(familyDetailDesktopWorkspace(1280)).toBe(true);
        expect(familyDetailFigmaWorkspace(390)).toBe(true);
        expect(familyDetailFigmaWorkspace(833)).toBe(true);
        expect(familyDetailFigmaWorkspace(834)).toBe(true);
        expect(familyDetailCompactChrome(1024)).toBe(true);
        expect(familyDetailCompactChrome(1280)).toBe(false);
        expect(FAMILY_DETAIL_PORTRAIT_CARD_ORDER).toEqual([
            "status",
            "link",
            "edit",
            "guests",
            "activity",
            "regenerate",
            "delete",
        ]);
        expect(formatFamilyDetailDeadlineChip(rsvpDeadlineLead(9))).toBe(
            "Quedan 9 días para confirmar",
        );
        expect(formatFamilyDetailDeadlineChip(rsvpDeadlineLead(1))).toBe(
            "Queda 1 día para confirmar",
        );
        expect(formatFamilyDetailDeadlineChip(null)).toBeNull();
        expect(adminCopy.familyDetail.overline).toBe(
            "Administración > Familias > Detalle",
        );
        expect(adminCopy.familyDetail.bannerBody).toContain("transporte");
        expect(adminResumen.banner).toContain("xl:py-10");
        expect(adminFamilyDetail.mobileRoot).toContain("min-[834px]:hidden");
        expect(adminFamilyDetail.mobileBannerTitle).toContain("text-[22px]");
        expect(adminFamilyDetail.mobileBackBtn).toContain("size-7");
        expect(adminFamilyDetail.mobileCard).toContain("rounded-[12px]");
        expect(adminFamilyDetail.mobileLinkActions).toContain("flex-col");
        expect(adminFamilyDetail.mobileStatusPair).toContain("gap-3");
        expect(adminFamilyDetail.portraitRoot).toContain("min-[834px]:block");
        expect(adminFamilyDetail.portraitRoot).toContain("lg:hidden");
        expect(adminFamilyDetail.portraitCard).toContain("rounded-[12px]");
        expect(adminFamilyDetail.portraitLinkActions).toContain("flex-wrap");
        expect(adminFamilyDetail.portraitGenderCol).toContain("w-[150px]");
        expect(adminFamilyDetail.portraitBannerTitle).toContain("text-[30px]");
        expect(adminFamilyDetail.bannerTitle).toContain("text-[28px]");
        expect(adminFamilyDetail.bannerTitle).toContain("xl:text-[36px]");
        expect(adminFamilyDetail.columns).toContain("lg:flex-row");
        expect(adminFamilyDetail.rightCol).toContain("lg:w-[22.25rem]");
        expect(adminFamilyDetail.rightCol).toContain("xl:w-[28rem]");
        expect(adminFamilyDetail.card).toContain("rounded-[20px]");
        expect(adminFamilyDetail.card).toContain("xl:rounded-[24px]");
        expect(adminFamilyDetail.btnPrimary).toContain("bg-admin-olive");
        expect(adminFamilyDetail.deadlinePill).toContain("rounded-full");
        expect(adminFamilyDetail.pillConfirmed).toContain("#ebfee6");
        expect(adminFamilyDetail.cardDanger).toContain("bg-[#fdede6]");
        expect(adminFamilyDetail.dangerBtn).toContain("bg-[#9f3804]");
        expect(adminFamilyDetail.guestContact).toContain("hidden");
        expect(adminFamilyDetail.guestContact).toContain("xl:flex");
        expect(adminFamilyDetail.timelineDetail).toContain("hidden");
        expect(adminFamilyDetail.timelineDetail).toContain("xl:block");
        expect(adminFamilyDetail.portraitTimelineDetail).not.toContain("hidden");
        expect(adminFamilyDetail.portraitGuestContact).toContain("flex-wrap");
    });

    it("formats confirmation, transport, and guest pickup from live data", () => {
        expect(familyDetailConfirmationLabel(null, null)).toBe("Sin confirmar");
        expect(familyDetailConfirmationLabel(false, 0)).toBe("No asisten");
        expect(familyDetailConfirmationLabel(true, 1)).toBe("Asisten (1 persona)");
        expect(familyDetailConfirmationLabel(true, 2)).toBe("Asisten (2 personas)");
        expect(familyDetailTransportLabel(1)).toBe("1 invitado en bus");
        expect(familyDetailTransportLabel(2)).toBe("2 invitados en bus");
        expect(familyDetailGuestAttendanceLabel("attending", true)).toBe("Asiste");
        expect(familyDetailGuestAttendanceLabel("not_attending")).toBe("no asiste");
        expect(familyDetailGuestAttendanceLabel("pending")).toBe("sin confirmar");
        expect(familyDetailGuestPickupLine(false, "modelia")).toBeNull();
        expect(familyDetailGuestPickupLine(true, "modelia")).toContain(
            "Calle 23B bis #75-48 Modelia",
        );
        expect(familyDetailGuestPickupLine(true, "modelia", "address")).toBe(
            "Dirección: Calle 23B bis #75-48 Modelia",
        );
        expect(familyDetailGuestPickupLine(true, "modelia", "pickup")).toBe(
            "Recogida: Calle 23B bis #75-48 Modelia",
        );
        expect(familyDetailGuestPickupLine(true, null)).toBe(
            "Bus · Sin punto de salida",
        );
        expect(familyDetailGuestPickupLine(true, null, "address")).toBe(
            "Sin punto de salida",
        );
        expect(familyDetailGuestPickupLine(true, null, "pickup")).toBe(
            "Recogida: Sin punto de salida",
        );
        expect(familyDetailStatusPhoneLabel(true)).toBe("Teléfono");
        expect(familyDetailStatusPhoneLabel(false)).toBe("Teléfono de contacto");
        expect(familyDetailStatusEmailLabel(true)).toBe("Correo");
        expect(familyDetailStatusTransportLabel(true)).toBe("Transporte");
        expect(familyDetailDeleteTitle(true)).toBe("Eliminar permanentemente");
        expect(familyDetailDeleteTitle(false)).toBe(
            "Eliminar familia permanentemente",
        );
    });

    it("builds status pills for confirmed, declined, pending, and disabled families", () => {
        expect(
            familyDetailStatusPills({
                status: "responded",
                isEnabled: true,
                willAttend: true,
                usesBus: true,
            }).map((pill) => pill.key),
        ).toEqual(["confirmed", "bus"]);
        expect(
            familyDetailStatusPills({
                status: "responded",
                isEnabled: true,
                willAttend: false,
                usesBus: false,
            })[0],
        ).toMatchObject({key: "declined", label: "No asiste"});
        expect(
            familyDetailStatusPills({
                status: "pending",
                isEnabled: true,
                willAttend: null,
                usesBus: false,
            })[0]?.key,
        ).toBe("pending");
        expect(
            familyDetailStatusPills({
                status: "pending",
                isEnabled: false,
                willAttend: null,
                usesBus: true,
            }).map((pill) => pill.key),
        ).toEqual(["disabled", "bus"]);
        expect(
            familyDetailGuestPills({
                attendanceStatus: "attending",
                needsTransport: true,
            }).map((pill) => pill.label),
        ).toEqual(["Asiste", "Bus"]);
        expect(
            familyDetailGuestPills({
                attendanceStatus: "not_attending",
                needsTransport: false,
            })[0]?.label,
        ).toBe("No asiste");
    });

    it("keeps delete confirmation by family name, not Figma ELIMINAR", () => {
        expect(adminCopy.family.deleteConfirmLabel).toMatch(/nombre de la familia/i);
        expect(adminCopy.family.deleteConfirmLabel).not.toMatch(/ELIMINAR/);
        expect(adminCopy.familyDetail.deleteTitle).toBe(
            "Eliminar familia permanentemente",
        );
        expect(adminCopy.familyDetail.deleteTitleCompact).toBe(
            "Eliminar permanentemente",
        );
    });

    it("grows and trims guest form rows from cupos", () => {
        const grown = resizeGuestRows(
            [{id: "a", name: "Ana", gender: "female"}],
            3,
        );
        expect(grown).toHaveLength(3);
        expect(grown[1]).toEqual({id: "", name: "", gender: ""});
        expect(resizeGuestRows(grown, 1)).toEqual([
            {id: "a", name: "Ana", gender: "female"},
        ]);
    });
});
