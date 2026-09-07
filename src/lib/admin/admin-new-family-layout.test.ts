import {describe, expect, it} from "vitest";

import {adminNewFamily, adminResumen} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    ADMIN_NEW_FAMILY_DESKTOP_MIN_PX,
    ADMIN_NEW_FAMILY_LANDSCAPE_MIN_PX,
    ADMIN_NEW_FAMILY_MOBILE_MAX_PX,
    ADMIN_NEW_FAMILY_PORTRAIT_MIN_PX,
    NEW_FAMILY_DEFAULT_GUEST_COUNT,
    NEW_FAMILY_MAX_GUESTS,
    NEW_FAMILY_MIN_GUESTS,
    clampNewFamilyGuestCount,
    newFamilyCompactChrome,
    newFamilyDesktopWorkspace,
    newFamilyGuestLabel,
    newFamilyLandscapeWorkspace,
    newFamilyMobileWorkspace,
    newFamilyOverline,
    newFamilyPortraitWorkspace,
} from "@/lib/admin/admin-new-family-layout";

describe("admin new family Figma helpers", () => {
    it("uses mobile below 834, portrait 834, landscape 1024, then desktop 1280", () => {
        expect(ADMIN_NEW_FAMILY_MOBILE_MAX_PX).toBe(833);
        expect(ADMIN_NEW_FAMILY_PORTRAIT_MIN_PX).toBe(834);
        expect(ADMIN_NEW_FAMILY_LANDSCAPE_MIN_PX).toBe(1024);
        expect(ADMIN_NEW_FAMILY_DESKTOP_MIN_PX).toBe(1280);
        expect(newFamilyMobileWorkspace(390)).toBe(true);
        expect(newFamilyMobileWorkspace(833)).toBe(true);
        expect(newFamilyMobileWorkspace(834)).toBe(false);
        expect(newFamilyPortraitWorkspace(833)).toBe(false);
        expect(newFamilyPortraitWorkspace(834)).toBe(true);
        expect(newFamilyPortraitWorkspace(1023)).toBe(true);
        expect(newFamilyPortraitWorkspace(1024)).toBe(false);
        expect(newFamilyLandscapeWorkspace(1023)).toBe(false);
        expect(newFamilyLandscapeWorkspace(1024)).toBe(true);
        expect(newFamilyLandscapeWorkspace(1279)).toBe(true);
        expect(newFamilyLandscapeWorkspace(1280)).toBe(false);
        expect(newFamilyDesktopWorkspace(1279)).toBe(false);
        expect(newFamilyDesktopWorkspace(1280)).toBe(true);
        expect(newFamilyCompactChrome(1024)).toBe(true);
        expect(newFamilyCompactChrome(834)).toBe(false);
        expect(newFamilyCompactChrome(1280)).toBe(false);
        expect(adminNewFamily.desktopRoot).toContain("hidden lg:block");
        expect(adminNewFamily.portraitRoot).toContain("min-[834px]:block");
        expect(adminNewFamily.portraitRoot).toContain("lg:hidden");
        expect(adminNewFamily.mobileRoot).toContain("min-[834px]:hidden");
        expect(adminNewFamily.bannerTitle).toContain("text-[32px]");
        expect(adminNewFamily.bannerTitle).toContain("xl:text-[36px]");
        expect(adminNewFamily.mobileBannerTitle).toContain("text-[28px]");
        expect(adminNewFamily.backBtn).toContain("size-9");
        expect(adminNewFamily.mobileBackBtn).toContain("size-8");
        expect(adminNewFamily.card).toContain("max-w-[640px]");
        expect(adminNewFamily.portraitCard).not.toContain("max-w-[640px]");
        expect(adminNewFamily.mobileCard).toContain("p-5");
        expect(adminNewFamily.mobileCard).toContain("gap-6");
        expect(adminNewFamily.mobileWorkspace).toContain("px-4");
        expect(adminNewFamily.mobileTextarea).toContain("h-[90px]");
        expect(adminNewFamily.mobileGuestRow).toContain("flex-col");
        expect(adminNewFamily.mobileGuestGenderCol).toContain("w-full");
        expect(adminNewFamily.mobileGuestsTitle).toContain("text-[20px]");
        expect(adminNewFamily.messageOptional).toContain("italic");
        expect(adminCopy.newFamily.messageOptional).toBe("(opcional)");
        expect(adminCopy.newFamily.messageLabelLead).toBe(
            "Mensaje personalizado",
        );
        expect(adminNewFamily.portraitCard).toContain("gap-6");
        expect(adminNewFamily.portraitCard).toContain("p-8");
        expect(adminNewFamily.portraitWorkspace).toContain("pb-16");
        expect(adminNewFamily.portraitTextarea).toContain("h-[100px]");
        expect(adminNewFamily.card).toContain("gap-6");
        expect(adminNewFamily.card).toContain("xl:gap-7");
        expect(adminNewFamily.card).toContain("p-8");
        expect(adminNewFamily.card).toContain("xl:p-10");
        expect(adminNewFamily.textarea).toContain("h-20");
        expect(adminNewFamily.textarea).toContain("xl:h-[100px]");
        expect(adminNewFamily.guestsHint).toContain("text-[13px]");
        expect(adminNewFamily.guestsHint).toContain("xl:text-xs");
        expect(adminNewFamily.guestGenderCol).toContain("w-40");
        expect(adminNewFamily.btnPrimary).toContain("rounded-[12px]");
        expect(adminResumen.banner).toContain("xl:py-10");
    });

    it("clamps guest rows to the create-family seat range", () => {
        expect(NEW_FAMILY_DEFAULT_GUEST_COUNT).toBe(2);
        expect(NEW_FAMILY_MIN_GUESTS).toBe(1);
        expect(NEW_FAMILY_MAX_GUESTS).toBe(30);
        expect(clampNewFamilyGuestCount(0)).toBe(1);
        expect(clampNewFamilyGuestCount(Number.NaN)).toBe(1);
        expect(clampNewFamilyGuestCount(2.8)).toBe(2);
        expect(clampNewFamilyGuestCount(30)).toBe(30);
        expect(clampNewFamilyGuestCount(31)).toBe(30);
    });

    it("labels the first guest as the primary contact and shortens the phone overline", () => {
        expect(newFamilyGuestLabel(0)).toBe(
            "Invitado 1 (contacto principal)",
        );
        expect(newFamilyGuestLabel(1)).toBe("Invitado 2");
        expect(newFamilyOverline(false)).toBe(
            "Administración > Familias > Nueva familia",
        );
        expect(newFamilyOverline(true)).toBe(
            "Administración > Familias > Nueva",
        );
        expect(adminCopy.newFamily.title).toBe("Nueva Familia");
        expect(adminCopy.newFamily.bannerBody).toContain("enlace de confirmación");
        expect(adminCopy.newFamily.submit).toBe(
            "Crear familia y generar enlace",
        );
    });
});
