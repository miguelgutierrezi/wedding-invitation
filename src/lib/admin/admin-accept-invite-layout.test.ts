import {describe, expect, it} from "vitest";

import {adminAcceptInvite} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    ADMIN_ACCEPT_INVITE_CARD_WIDTH_PX,
    ADMIN_ACCEPT_INVITE_DESKTOP_MIN_PX,
    ADMIN_ACCEPT_INVITE_LANDSCAPE_MIN_PX,
    ADMIN_ACCEPT_INVITE_MOBILE_MAX_PX,
    ADMIN_ACCEPT_INVITE_PORTRAIT_CARD_WIDTH_PX,
    ADMIN_ACCEPT_INVITE_PORTRAIT_MIN_PX,
    acceptInviteCardWidthPx,
    acceptInviteDesktopWorkspace,
    acceptInviteLandscapeWorkspace,
    acceptInviteMobileWorkspace,
    acceptInvitePortraitWorkspace,
    acceptInviteStatusMessage,
} from "@/lib/admin/admin-accept-invite-layout";
import {
    loginCopyright,
    loginCoupleBrand,
} from "@/lib/admin/admin-login-layout";

describe("admin accept-invite Figma helpers", () => {
    it("uses mobile below 834, portrait from 834, landscape from 1024, and desktop from 1280", () => {
        expect(ADMIN_ACCEPT_INVITE_MOBILE_MAX_PX).toBe(833);
        expect(ADMIN_ACCEPT_INVITE_PORTRAIT_MIN_PX).toBe(834);
        expect(ADMIN_ACCEPT_INVITE_LANDSCAPE_MIN_PX).toBe(1024);
        expect(ADMIN_ACCEPT_INVITE_DESKTOP_MIN_PX).toBe(1280);
        expect(ADMIN_ACCEPT_INVITE_PORTRAIT_CARD_WIDTH_PX).toBe(440);
        expect(ADMIN_ACCEPT_INVITE_CARD_WIDTH_PX).toBe(460);
        expect(acceptInviteMobileWorkspace(390)).toBe(true);
        expect(acceptInviteMobileWorkspace(833)).toBe(true);
        expect(acceptInviteMobileWorkspace(834)).toBe(false);
        expect(acceptInvitePortraitWorkspace(833)).toBe(false);
        expect(acceptInvitePortraitWorkspace(834)).toBe(true);
        expect(acceptInvitePortraitWorkspace(1023)).toBe(true);
        expect(acceptInvitePortraitWorkspace(1024)).toBe(false);
        expect(acceptInviteLandscapeWorkspace(1023)).toBe(false);
        expect(acceptInviteLandscapeWorkspace(1024)).toBe(true);
        expect(acceptInviteLandscapeWorkspace(1279)).toBe(true);
        expect(acceptInviteLandscapeWorkspace(1280)).toBe(false);
        expect(acceptInviteDesktopWorkspace(1279)).toBe(false);
        expect(acceptInviteDesktopWorkspace(1280)).toBe(true);
        expect(acceptInviteCardWidthPx(390)).toBe("full");
        expect(acceptInviteCardWidthPx(833)).toBe("full");
        expect(acceptInviteCardWidthPx(834)).toBe(440);
        expect(acceptInviteCardWidthPx(1024)).toBe(460);
        expect(acceptInviteCardWidthPx(1280)).toBe(460);
        expect(adminAcceptInvite.mobileRoot).toContain("min-[834px]:hidden");
        expect(adminAcceptInvite.mobileRoot).toContain("px-4");
        expect(adminAcceptInvite.mobileRoot).toContain("justify-between");
        expect(adminAcceptInvite.mobileStack).toContain("gap-8");
        expect(adminAcceptInvite.mobileBrand).toContain("flex-col");
        expect(adminAcceptInvite.mobileBrandNames).toContain("text-[22px]");
        expect(adminAcceptInvite.mobileBrandBadge).toContain("text-[13px]");
        expect(adminAcceptInvite.mobileCard).toContain("w-full");
        expect(adminAcceptInvite.mobileCard).toContain("rounded-[20px]");
        expect(adminAcceptInvite.mobileCard).toContain("gap-6");
        expect(adminAcceptInvite.mobileCard).toContain("p-6");
        expect(adminAcceptInvite.mobileHeader).toContain("gap-2");
        expect(adminAcceptInvite.mobileEyebrow).toContain("text-[11px]");
        expect(adminAcceptInvite.mobileTitle).toContain("text-[28px]");
        expect(adminAcceptInvite.mobileLead).toContain("text-[13px]");
        expect(adminAcceptInvite.mobileLead).toContain("leading-[1.4]");
        expect(adminAcceptInvite.mobileAccountRow).toContain("text-[13px]");
        expect(adminAcceptInvite.mobileFields).toContain("gap-4");
        expect(adminAcceptInvite.mobileField).toContain("gap-1.5");
        expect(adminAcceptInvite.mobileLabel).toContain("text-xs");
        expect(adminAcceptInvite.mobilePasswordInput).toContain("h-11");
        expect(adminAcceptInvite.mobilePasswordInput).toContain("rounded-[10px]");
        expect(adminAcceptInvite.mobileSubmit).toContain("h-11");
        expect(adminAcceptInvite.mobileSubmit).toContain("rounded-[10px]");
        expect(adminAcceptInvite.mobileSubmit).toContain("text-sm");
        expect(adminAcceptInvite.mobileFooter).toContain("text-[11px]");
        expect(adminAcceptInvite.mobileFooter).toContain("pt-8");
        expect(adminAcceptInvite.portraitRoot).toContain("min-[834px]:flex");
        expect(adminAcceptInvite.portraitRoot).toContain("lg:hidden");
        expect(adminAcceptInvite.portraitCard).toContain("w-[440px]");
        expect(adminAcceptInvite.desktopRoot).toContain("lg:flex");
        expect(adminAcceptInvite.card).toContain("w-[460px]");
        expect(adminAcceptInvite.card).not.toContain("lg:w-");
    });

    it("keeps Figma copy, brand, and copyright aligned with login chrome", () => {
        expect(adminCopy.acceptInvite.eyebrow).toBe("Panel privado");
        expect(adminCopy.acceptInvite.title).toBe("Crear contraseña");
        expect(adminCopy.acceptInvite.lead).toContain("Aceptaste la invitación");
        expect(adminCopy.acceptInvite.accountLabel).toBe("Cuenta:");
        expect(adminCopy.acceptInvite.passwordLabel).toBe("Nueva contraseña");
        expect(adminCopy.acceptInvite.confirmLabel).toBe("Confirmar contraseña");
        expect(adminCopy.acceptInvite.submit).toBe("Guardar y entrar al panel");
        expect(adminCopy.login.brandBadge).toBe("• Admin Panel");
        expect(loginCoupleBrand("Nychol", "Miguel")).toBe("Nychol & Miguel");
        expect(loginCopyright(2026, "Nychol", "Miguel")).toBe(
            "© 2026 Nychol & Miguel. Todos los derechos reservados.",
        );
        expect(acceptInviteStatusMessage(null)).toBe(
            adminCopy.acceptInvite.missingLink,
        );
        expect(acceptInviteStatusMessage("El enlace ya expiró.")).toBe(
            "El enlace ya expiró.",
        );
    });
});
