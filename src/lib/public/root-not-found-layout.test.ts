import {describe, expect, it} from "vitest";

import {rootNotFound} from "@/components/public/root-not-found-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    loginCopyright,
    loginCoupleBrand,
} from "@/lib/admin/admin-login-layout";
import {
    ROOT_NOT_FOUND_CARD_WIDTH_PX,
    ROOT_NOT_FOUND_DESKTOP_MIN_PX,
    ROOT_NOT_FOUND_HOME_HREF,
    ROOT_NOT_FOUND_LANDSCAPE_MIN_PX,
    ROOT_NOT_FOUND_MOBILE_MAX_PX,
    ROOT_NOT_FOUND_PORTRAIT_MIN_PX,
    rootNotFoundCardWidthPx,
    rootNotFoundCopy,
    rootNotFoundDesktopWorkspace,
    rootNotFoundLandscapeWorkspace,
    rootNotFoundMobileWorkspace,
    rootNotFoundPortraitWorkspace,
    unknownRouteRedirectPath,
} from "@/lib/public/root-not-found-layout";

describe("public root not-found Figma helpers", () => {
    it("uses mobile below 834, portrait from 834, landscape from 1024, desktop from 1280", () => {
        expect(ROOT_NOT_FOUND_MOBILE_MAX_PX).toBe(833);
        expect(ROOT_NOT_FOUND_PORTRAIT_MIN_PX).toBe(834);
        expect(ROOT_NOT_FOUND_LANDSCAPE_MIN_PX).toBe(1024);
        expect(ROOT_NOT_FOUND_DESKTOP_MIN_PX).toBe(1280);
        expect(ROOT_NOT_FOUND_CARD_WIDTH_PX).toBe(480);
        expect(rootNotFoundMobileWorkspace(390)).toBe(true);
        expect(rootNotFoundMobileWorkspace(833)).toBe(true);
        expect(rootNotFoundMobileWorkspace(834)).toBe(false);
        expect(rootNotFoundPortraitWorkspace(833)).toBe(false);
        expect(rootNotFoundPortraitWorkspace(834)).toBe(true);
        expect(rootNotFoundPortraitWorkspace(1023)).toBe(true);
        expect(rootNotFoundPortraitWorkspace(1024)).toBe(false);
        expect(rootNotFoundLandscapeWorkspace(1023)).toBe(false);
        expect(rootNotFoundLandscapeWorkspace(1024)).toBe(true);
        expect(rootNotFoundLandscapeWorkspace(1279)).toBe(true);
        expect(rootNotFoundLandscapeWorkspace(1280)).toBe(false);
        expect(rootNotFoundDesktopWorkspace(1279)).toBe(false);
        expect(rootNotFoundDesktopWorkspace(1280)).toBe(true);
        expect(rootNotFoundCardWidthPx(390)).toBe("full");
        expect(rootNotFoundCardWidthPx(833)).toBe("full");
        expect(rootNotFoundCardWidthPx(834)).toBe(480);
        expect(rootNotFoundCardWidthPx(1024)).toBe(480);
        expect(rootNotFoundCardWidthPx(1280)).toBe(480);
        expect(rootNotFound.desktopRoot).toContain("xl:flex");
        expect(rootNotFound.desktopRoot).toContain("hidden");
        expect(rootNotFound.desktopRoot).toContain("px-16");
        expect(rootNotFound.desktopRoot).toContain("pt-12");
        expect(rootNotFound.desktopRoot).toContain("pb-10");
        expect(rootNotFound.desktopRoot).toContain("justify-between");
        expect(rootNotFound.landscapeRoot).toContain("lg:flex");
        expect(rootNotFound.landscapeRoot).toContain("xl:hidden");
        expect(rootNotFound.landscapeRoot).toContain("px-16");
        expect(rootNotFound.portraitRoot).toContain("min-[834px]:flex");
        expect(rootNotFound.portraitRoot).toContain("lg:hidden");
        expect(rootNotFound.portraitRoot).toContain("px-10");
        expect(rootNotFound.portraitRoot).toContain("pt-16");
        expect(rootNotFound.portraitRoot).toContain("pb-12");
        expect(rootNotFound.portraitBrand).toContain("flex-col");
        expect(rootNotFound.portraitBrand).toContain("text-center");
        expect(rootNotFound.portraitBrand).toContain("gap-2");
        expect(rootNotFound.portraitBrandNames).toContain("text-[24px]");
        expect(rootNotFound.portraitBrandBadge).toContain("text-[14px]");
        expect(rootNotFound.brand).toContain("gap-2");
        expect(rootNotFound.brandNames).toContain("text-[20px]");
        expect(rootNotFound.brandBadge).toContain("text-[14px]");
        expect(rootNotFound.card).toContain("w-[480px]");
        expect(rootNotFound.card).toContain("rounded-[24px]");
        expect(rootNotFound.card).toContain("px-12");
        expect(rootNotFound.card).toContain("py-14");
        expect(rootNotFound.card).not.toContain("gap-8");
        expect(rootNotFound.info).toContain("gap-4");
        expect(rootNotFound.info).toContain("text-center");
        expect(rootNotFound.code).toContain("text-[96px]");
        expect(rootNotFound.code).toContain("leading-[0.9]");
        expect(rootNotFound.title).toContain("text-[32px]");
        expect(rootNotFound.body).toContain("text-sm");
        expect(rootNotFound.body).toContain("leading-[1.6]");
        expect(rootNotFound).not.toHaveProperty("cta");
        expect(rootNotFound.footer).toContain("text-sm");
        expect(rootNotFound.mobileRoot).toContain("min-[834px]:hidden");
        expect(rootNotFound.mobileRoot).toContain("px-4");
        expect(rootNotFound.mobileRoot).toContain("justify-between");
        expect(rootNotFound.mobileBrand).toContain("justify-center");
        expect(rootNotFound.mobileBrand).toContain("gap-2");
        expect(rootNotFound.mobileBrand).not.toContain("flex-col");
        expect(rootNotFound.mobileBrandNames).toContain("text-[20px]");
        expect(rootNotFound.mobileBrandBadge).toContain("text-[13px]");
        expect(rootNotFound.mobileCard).toContain("w-full");
        expect(rootNotFound.mobileCard).toContain("rounded-[20px]");
        expect(rootNotFound.mobileCard).not.toContain("gap-7");
        expect(rootNotFound.mobileCard).toContain("px-6");
        expect(rootNotFound.mobileCard).toContain("py-10");
        expect(rootNotFound.mobileInfo).toContain("gap-3");
        expect(rootNotFound.mobileCode).toContain("text-[80px]");
        expect(rootNotFound.mobileTitle).toContain("text-[26px]");
        expect(rootNotFound.mobileBody).toContain("text-[13px]");
        expect(rootNotFound.mobileBody).toContain("leading-[1.5]");
        expect(rootNotFound.mobileFooter).toContain("text-xs");
    });

    it("keeps Figma copy and sends unknown routes to /", () => {
        expect(rootNotFoundCopy.code).toBe("404");
        expect(rootNotFoundCopy.title).toBe("Página no encontrada");
        expect(rootNotFoundCopy.body).toContain("enlace ha expirado");
        expect(rootNotFoundCopy.body).toContain("panel de administración");
        expect(rootNotFoundCopy).not.toHaveProperty("cta");
        expect(ROOT_NOT_FOUND_HOME_HREF).toBe("/");
        expect(unknownRouteRedirectPath()).toBe("/");
        expect(adminCopy.login.brandBadge).toBe("• Admin Panel");
        expect(loginCoupleBrand("Nychol", "Miguel")).toBe("Nychol & Miguel");
        expect(loginCopyright(2026, "Nychol", "Miguel")).toBe(
            "© 2026 Nychol & Miguel. Todos los derechos reservados.",
        );
    });
});
