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
    loginResetCardWidthPx,
    loginScreenLead,
    loginScreenTitle,
    loginShowsResetExplanation,
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
        expect(adminLogin.mobileResetBrand).toContain("justify-center");
        expect(adminLogin.mobileResetBrand).not.toContain("flex-col");
        expect(adminLogin.mobileResetBrandNames).toContain("text-[20px]");
        expect(adminLogin.resetBrandBadge).not.toContain("w-full");
        expect(adminLogin.mobileResetCard).toContain("py-10");
        expect(adminLogin.mobileResetHeader).toContain("gap-2.5");
        expect(adminLogin.mobileResetLead).toContain("text-sm");
        expect(adminLogin.mobileResetFields).toContain("gap-5");
        expect(adminLogin.mobileResetFooter).toContain("text-xs");
        expect(adminLogin.mobileResetFooter).toContain("pt-8");
        expect(adminLogin.portraitBrandNames).toContain("text-[22px]");
        expect(adminLogin.portraitResetRoot).toContain("min-[834px]:flex");
        expect(adminLogin.portraitResetRoot).toContain("lg:hidden");
        expect(adminLogin.portraitResetRoot).toContain("items-center");
        expect(adminLogin.portraitResetBrand).toContain("top-12");
        expect(adminLogin.portraitResetBrand).toContain("left-12");
        expect(adminLogin.portraitResetBrandNames).toContain("text-[20px]");
        expect(adminLogin.portraitResetFooter).toContain("bottom-12");
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
        expect(adminLogin.resetFields).toContain("gap-6");
        expect(adminLogin.resetFields).toContain("lg:gap-5");
        expect(adminLogin.resetFields).toContain("xl:gap-6");
        expect(adminLogin.resetExplanation).toContain("leading-[1.6]");
        expect(adminLogin.resetExplanation).not.toContain("lg:text-[13px]");
        expect(adminLogin.resetActions).toContain("gap-5");
        expect(adminLogin.resetActions).not.toContain("lg:gap-4");
        expect(adminLogin.resetCard).toContain("lg:w-[440px]");
        expect(adminLogin.resetCard).toContain("lg:rounded-[24px]");
        expect(adminLogin.resetCard).toContain("lg:px-10");
        expect(adminLogin.resetCard).toContain("lg:py-[52px]");
        expect(adminLogin.resetCard).toContain("xl:w-[460px]");
        expect(adminLogin.resetHeader).toContain("gap-3");
        expect(adminLogin.resetEyebrow).toContain("lg:tracking-[1.5px]");
        expect(adminLogin.resetLead).toContain("text-sm");
        expect(adminLogin.resetBrand).toContain("top-9");
        expect(adminLogin.resetBrandNames).toContain("text-[20px]");
        expect(adminLogin.resetBrandBadge).toContain("text-[14px]");
        expect(adminLogin.resetFooter).toContain("bottom-9");
        expect(loginResetCardWidthPx(390)).toBe("full");
        expect(loginResetCardWidthPx(834)).toBe(460);
        expect(loginResetCardWidthPx(1024)).toBe(440);
        expect(loginResetCardWidthPx(1279)).toBe(440);
        expect(loginResetCardWidthPx(1280)).toBe(460);
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
        expect(adminCopy.login.resetTitle).toBe("Recuperar contraseña");
        expect(loginScreenTitle("login")).toBe("Iniciar sesión");
        expect(loginScreenTitle("reset")).toBe("Recuperar contraseña");
        expect(loginScreenLead()).toBe(
            "Solo cuentas de administración pueden acceder.",
        );
        expect(loginShowsResetExplanation("login")).toBe(false);
        expect(loginShowsResetExplanation("reset")).toBe(true);
        expect(adminCopy.login.resetLead).toContain("enlace para crear");
        expect(adminCopy.login.resetSubmit).toBe("Enviar enlace");
        expect(adminCopy.login.resetBack).toBe("Volver a iniciar sesión");
    });
});
