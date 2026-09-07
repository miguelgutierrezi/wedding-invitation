import {describe, expect, it} from "vitest";

import {adminAdmins, adminResumen} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    ADMIN_ADMINS_DESKTOP_MIN_PX,
    ADMIN_ADMINS_LANDSCAPE_MIN_PX,
    ADMIN_ADMINS_MOBILE_MAX_PX,
    ADMIN_ADMINS_PORTRAIT_MIN_PX,
    adminsCompactChrome,
    adminsDesktopWorkspace,
    adminsFigmaWorkspace,
    adminsInviteStacked,
    adminsLastAccessParts,
    adminsMobileCardStack,
    adminsMobileWorkspace,
    adminsPendingStatusLabel,
    adminsPortraitCardStack,
    adminsPortraitWorkspace,
} from "@/lib/admin/admin-admins-layout";

describe("admin Admins Figma helpers", () => {
    it("uses portrait 834, landscape 1024, then desktop 1280 density", () => {
        expect(ADMIN_ADMINS_MOBILE_MAX_PX).toBe(833);
        expect(ADMIN_ADMINS_PORTRAIT_MIN_PX).toBe(834);
        expect(ADMIN_ADMINS_LANDSCAPE_MIN_PX).toBe(1024);
        expect(ADMIN_ADMINS_DESKTOP_MIN_PX).toBe(1280);
        expect(adminsMobileWorkspace(833)).toBe(true);
        expect(adminsMobileWorkspace(834)).toBe(false);
        expect(adminsPortraitWorkspace(833)).toBe(false);
        expect(adminsPortraitWorkspace(834)).toBe(true);
        expect(adminsPortraitWorkspace(1023)).toBe(true);
        expect(adminsPortraitWorkspace(1024)).toBe(false);
        expect(adminsPortraitCardStack(834)).toBe(true);
        expect(adminsInviteStacked(320)).toBe(true);
        expect(adminsInviteStacked(834)).toBe(true);
        expect(adminsInviteStacked(1024)).toBe(false);
        expect(adminsFigmaWorkspace(320)).toBe(true);
        expect(adminsFigmaWorkspace(833)).toBe(true);
        expect(adminsFigmaWorkspace(834)).toBe(true);
        expect(adminsDesktopWorkspace(1279)).toBe(false);
        expect(adminsDesktopWorkspace(1280)).toBe(true);
        expect(adminsCompactChrome(1023)).toBe(false);
        expect(adminsCompactChrome(1024)).toBe(true);
        expect(adminsCompactChrome(1279)).toBe(true);
        expect(adminsCompactChrome(1280)).toBe(false);
        expect(adminCopy.adminsList.bannerTitle).toBe("Admins");
        expect(adminCopy.adminsList.bannerBody).toContain("coordinadores");
        expect(adminResumen.banner).toContain("xl:py-10");
        expect(adminAdmins.bannerTitle).toContain("text-[32px]");
        expect(adminAdmins.bannerTitle).toContain("xl:text-[36px]");
        expect(adminAdmins.card).toContain("rounded-[20px]");
        expect(adminAdmins.card).toContain("p-6");
        expect(adminAdmins.card).toContain("xl:rounded-3xl");
        expect(adminAdmins.card).toContain("xl:p-8");
        expect(adminAdmins.listCard).toContain("xl:gap-6");
        expect(adminAdmins.pendingCard).toContain("gap-4");
        expect(adminAdmins.inviteRow).toContain("flex");
        expect(adminAdmins.inviteRow).toContain("gap-4");
        expect(adminAdmins.inviteRow).not.toContain("flex-col");
        expect(adminAdmins.portraitInviteRow).toContain("flex-col");
        expect(adminAdmins.portraitInviteBtn).toContain("w-full");
        expect(adminAdmins.portraitInviteBtn).toContain("gap-2");
        expect(adminAdmins.portraitRow).toContain("rounded-xl");
        expect(adminAdmins.portraitRow).toContain("flex-col");
        expect(adminAdmins.portraitDeleteBtn).toContain("w-full");
        expect(adminAdmins.inviteBtn).toContain("bg-admin-olive");
        expect(adminAdmins.inviteBtn).toContain("rounded-xl");
        expect(adminAdmins.accessCol).toContain("w-[240px]");
        expect(adminAdmins.accessCol).toContain("xl:w-[320px]");
        expect(adminAdmins.statusCol).toContain("w-[100px]");
        expect(adminAdmins.actionCol).toContain("w-[140px]");
        expect(adminAdmins.email).toContain("truncate");
        expect(adminAdmins.email).toContain("xl:break-all");
        expect(adminAdmins.deleteBtn).toContain("bg-[#fdede6]");
        expect(adminAdmins.disabledBtn).toContain("bg-[#efefe9]");
        expect(adminAdmins.youBadge).toContain("bg-admin-wash");
        expect(adminAdmins.accessValue).toContain("text-admin-ink");
        expect(adminAdmins.accessValue).toContain("xl:text-admin-muted");
    });

    it("splits last-access copy so the date can be medium weight", () => {
        const empty = adminsLastAccessParts(null);
        expect(empty.prefix).toBe("Último acceso:");
        expect(empty.value).toBe("Sin registro");

        const stamped = adminsLastAccessParts("2026-09-07T16:45:00.000Z");
        expect(stamped.prefix).toBe("Último acceso:");
        expect(stamped.value).not.toBe("Sin registro");
        expect(stamped.value.length).toBeGreaterThan(8);
    });

    it("labels pending vs expired invitations", () => {
        expect(adminsPendingStatusLabel(false)).toBe("Pendiente");
        expect(adminsPendingStatusLabel(true)).toBe("Caducada");
        expect(adminAdmins.statusPending).toContain("bg-status-pending-bg");
        expect(adminAdmins.statusExpired).toContain("bg-admin-tag");
    });

    it("uses phone nested cards below 834px (Figma 136:29)", () => {
        expect(adminsMobileWorkspace(390)).toBe(true);
        expect(adminsMobileCardStack(390)).toBe(true);
        expect(adminsMobileCardStack(833)).toBe(true);
        expect(adminsMobileCardStack(834)).toBe(false);
        expect(adminAdmins.mobileBannerTitle).toContain("text-[28px]");
        expect(adminAdmins.mobileCard).toContain("rounded-2xl");
        expect(adminAdmins.mobileCard).toContain("p-5");
        expect(adminAdmins.mobilePendingCard).toContain("gap-3");
        expect(adminAdmins.mobileInviteTitle).toContain("text-[20px]");
        expect(adminAdmins.mobileInput).toContain("rounded-[10px]");
        expect(adminAdmins.mobileInviteBtn).toContain("rounded-[10px]");
        expect(adminAdmins.mobileInviteBtn).toContain("w-full");
        expect(adminAdmins.mobileEmail).toContain("text-[13px]");
        expect(adminAdmins.mobileEmailGroup).toContain("max-w-[220px]");
        expect(adminAdmins.mobileYouBadge).toContain("text-[9px]");
        expect(adminAdmins.mobileAccess).toContain("text-xs");
        expect(adminAdmins.mobileStatusActive).toContain("text-[11px]");
        expect(adminAdmins.mobileDisabledBtn).toContain("font-semibold");
        expect(adminAdmins.mobileEmpty).toContain("text-[13px]");
        expect(adminAdmins.mobileRow).toContain("p-3.5");
        expect(adminAdmins.mobileList).toContain("gap-3");
    });
});
