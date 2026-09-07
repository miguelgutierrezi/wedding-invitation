import {readFileSync} from "node:fs";
import {join} from "node:path";

import {describe, expect, it} from "vitest";

import {adminLogin} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    ADMIN_LOGIN_DESKTOP_MIN_PX,
    ADMIN_LOGIN_LANDSCAPE_MIN_PX,
    ADMIN_LOGIN_MOBILE_MAX_PX,
    ADMIN_LOGIN_PORTRAIT_MIN_PX,
    LOGIN_PASSWORD_EYE_SRC,
    loginCopyright,
    loginCoupleBrand,
    loginDesktopWorkspace,
    loginLandscapeWorkspace,
    loginMobileWorkspace,
    loginPasswordEyeSlashed,
    loginPasswordInputType,
    loginPasswordToggleLabel,
    loginPortraitWorkspace,
} from "@/lib/admin/admin-login-layout";

describe("admin login Figma helpers", () => {
    it("uses mobile below 834, portrait 834, landscape 1024, then desktop 1280", () => {
        expect(ADMIN_LOGIN_MOBILE_MAX_PX).toBe(833);
        expect(ADMIN_LOGIN_PORTRAIT_MIN_PX).toBe(834);
        expect(ADMIN_LOGIN_LANDSCAPE_MIN_PX).toBe(1024);
        expect(ADMIN_LOGIN_DESKTOP_MIN_PX).toBe(1280);
        expect(loginMobileWorkspace(390)).toBe(true);
        expect(loginMobileWorkspace(833)).toBe(true);
        expect(loginMobileWorkspace(834)).toBe(false);
        expect(loginPortraitWorkspace(833)).toBe(false);
        expect(loginPortraitWorkspace(834)).toBe(true);
        expect(loginPortraitWorkspace(1023)).toBe(true);
        expect(loginPortraitWorkspace(1024)).toBe(false);
        expect(loginLandscapeWorkspace(1023)).toBe(false);
        expect(loginLandscapeWorkspace(1024)).toBe(true);
        expect(loginLandscapeWorkspace(1279)).toBe(true);
        expect(loginLandscapeWorkspace(1280)).toBe(false);
        expect(loginDesktopWorkspace(1279)).toBe(false);
        expect(loginDesktopWorkspace(1280)).toBe(true);
        expect(adminLogin.desktopRoot).toContain("lg:flex");
        expect(adminLogin.portraitRoot).toContain("min-[834px]:flex");
        expect(adminLogin.portraitRoot).toContain("lg:hidden");
        expect(adminLogin.mobileRoot).toContain("min-[834px]:hidden");
        expect(adminLogin.mobileRoot).toContain("justify-between");
        expect(adminLogin.mobileRoot).toContain("px-4");
        expect(adminLogin.mobileBrand).toContain("flex-col");
        expect(adminLogin.mobileBrand).toContain("text-center");
        expect(adminLogin.mobileBrandNames).toContain("text-[24px]");
        expect(adminLogin.mobileBrandBadge).toContain("text-[14px]");
        expect(adminLogin.mobileCard).toContain("w-full");
        expect(adminLogin.mobileCard).toContain("gap-7");
        expect(adminLogin.mobileCard).toContain("px-6");
        expect(adminLogin.mobileCard).toContain("py-9");
        expect(adminLogin.mobileCard).toContain("rounded-[24px]");
        expect(adminLogin.mobileHeader).toContain("gap-2");
        expect(adminLogin.mobileEyebrow).toContain("text-[11px]");
        expect(adminLogin.mobileTitle).toContain("text-[28px]");
        expect(adminLogin.mobileLead).toContain("text-[13px]");
        expect(adminLogin.mobileLead).toContain("leading-[1.4]");
        expect(adminLogin.mobileFields).toContain("gap-4");
        expect(adminLogin.mobileField).toContain("gap-1.5");
        expect(adminLogin.mobileLabel).toContain("text-xs");
        expect(adminLogin.mobileInput).toContain("h-11");
        expect(adminLogin.mobileInput).toContain("px-3.5");
        expect(adminLogin.mobileSubmit).toContain("h-[46px]");
        expect(adminLogin.mobileFooter).toContain("text-[11px]");
        expect(adminLogin.portraitBrandNames).toContain("text-[22px]");
        expect(adminLogin.card).toContain("w-[460px]");
        expect(adminLogin.card).toContain("lg:w-[420px]");
        expect(adminLogin.card).toContain("xl:w-[460px]");
        expect(adminLogin.title).toContain("text-[36px]");
        expect(adminLogin.title).toContain("lg:text-[32px]");
        expect(adminLogin.submit).toContain("bg-admin-olive");
        expect(adminLogin.eyeButton).toContain("size-11");
        expect(adminLogin.eyeButton).toContain("z-10");
        expect(adminLogin.eyeImage).toContain("overflow-visible");
        expect(adminLogin.passwordInput).toContain("::-ms-reveal");
        expect(adminLogin.forgot).toContain("underline");
    });

    it("formats brand, copyright, and password visibility from couple names", () => {
        expect(loginCoupleBrand("Nychol", "Miguel")).toBe("Nychol & Miguel");
        expect(loginCopyright(2026, "Nychol", "Miguel")).toBe(
            "© 2026 Nychol & Miguel. Todos los derechos reservados.",
        );
        expect(loginPasswordInputType(false)).toBe("password");
        expect(loginPasswordInputType(true)).toBe("text");
        expect(loginPasswordToggleLabel(false)).toBe(adminCopy.login.showPassword);
        expect(loginPasswordToggleLabel(true)).toBe(adminCopy.login.hidePassword);
        expect(loginPasswordEyeSlashed(false)).toBe(false);
        expect(loginPasswordEyeSlashed(true)).toBe(true);
        expect(LOGIN_PASSWORD_EYE_SRC).toBe("/admin/login/eye.svg");
        const eyeSvg = readFileSync(
            join(process.cwd(), "public/admin/login/eye.svg"),
            "utf8",
        );
        expect(eyeSvg).toContain("<circle");
        expect(eyeSvg).toContain("#727263");
        expect(eyeSvg).not.toContain('preserveAspectRatio="none"');
        expect(adminCopy.login.emailLabelDesktop).toBe("Correo electrónico");
        expect(adminCopy.login.emailPlaceholder).toBe("ejemplo@correo.com");
        expect(adminCopy.login.brandBadge).toBe("• Admin Panel");
        expect(adminCopy.login.forgot).toBe("¿Olvidaste tu contraseña?");
        expect(adminCopy.login.title).toBe("Iniciar sesión");
    });
});
