import {describe, expect, it} from "vitest";

import {adminResumen} from "@/components/admin/admin-ui";
import {isAdminNavActive, ADMIN_DESKTOP_NAV_MIN_PX, ADMIN_FAB_HIDE_MIN_PX, ADMIN_RESUMEN_LANDSCAPE_MIN_PX, ADMIN_RESUMEN_WIDE_MIN_PX, RESUMEN_DRAWER_NAV, adminDrawerDisplayName, resumenDrawerBadgeCount, showAdminBackToFamilies, showAdminNewFamilyFab,} from "@/lib/admin/admin-chrome";

describe("isAdminNavActive", () => {
    it("marks only the dashboard for /admin", () => {
        expect(isAdminNavActive("/admin", "/admin")).toBe(true);
        expect(isAdminNavActive("/admin/families", "/admin")).toBe(false);
    });

    it("marks nested family routes under Familias", () => {
        expect(isAdminNavActive("/admin/families", "/admin/families")).toBe(true);
        expect(isAdminNavActive("/admin/families/new", "/admin/families")).toBe(
            true,
        );
        expect(isAdminNavActive("/admin/guests", "/admin/families")).toBe(false);
    });

    it("marks the admins section as a dedicated menu route", () => {
        expect(isAdminNavActive("/admin/admins", "/admin/admins")).toBe(true);
        expect(isAdminNavActive("/admin/admins/new", "/admin/admins")).toBe(
            true,
        );
        expect(isAdminNavActive("/admin", "/admin/admins")).toBe(false);
    });
});

describe("compact admin chrome paths", () => {
    it("keeps the FAB as a phone-only control (iPad 11\" and up hide it)", () => {
        expect(ADMIN_FAB_HIDE_MIN_PX).toBe(834);
        expect(showAdminNewFamilyFab("/admin/families")).toBe(true);
        expect(showAdminNewFamilyFab("/admin/families/new")).toBe(false);
    });

    it("keeps the hamburger below desktop xl so iPad 11\" landscape still has it on other admin pages", () => {
        expect(ADMIN_DESKTOP_NAV_MIN_PX).toBe(1280);
    });

    it("uses Figma Resumen portrait density from iPad 11\" (834); mobile is below that", () => {
        expect(ADMIN_RESUMEN_WIDE_MIN_PX).toBe(834);
        expect(ADMIN_RESUMEN_WIDE_MIN_PX).toBe(ADMIN_FAB_HIDE_MIN_PX);
    });

    it("uses inline Resumen nav from tablet landscape (lg / 1024)", () => {
        expect(ADMIN_RESUMEN_LANDSCAPE_MIN_PX).toBe(1024);
        expect(ADMIN_RESUMEN_LANDSCAPE_MIN_PX).toBeLessThan(ADMIN_DESKTOP_NAV_MIN_PX);
    });

    it("lets stacked close panels fill the portrait width", () => {
        expect(adminResumen.actionStack).toContain("w-full");
        expect(adminResumen.actionMain).toContain("w-full");
        expect(adminResumen.panel).toContain("w-full");
        expect(adminResumen.actionStack).not.toMatch(/(?:^|\s)items-start(?:\s|$)/);
        expect(adminResumen.actionStack).toContain("lg:items-start");
    });

    it("shows the back arrow on create and family detail", () => {
        expect(showAdminBackToFamilies("/admin/families/new")).toBe(true);
        expect(showAdminBackToFamilies("/admin/families/abc-123")).toBe(true);
        expect(showAdminBackToFamilies("/admin/families")).toBe(false);
    });
});

describe("Resumen Figma drawer", () => {
    it("keeps existing admin routes and omits Figma-only items", () => {
        const hrefs = RESUMEN_DRAWER_NAV.map((item) => item.href);
        expect(hrefs).toEqual([
            "/admin",
            "/admin/families",
            "/admin/guests",
            "/admin/analytics",
            "/admin/photos",
            "/admin/admins",
        ]);
        expect(hrefs.join(" ")).not.toMatch(/transporte|mensajes|config/i);
    });

    it("shows live family and guest badges", () => {
        expect(
            resumenDrawerBadgeCount("families", {familyCount: 53, guestCount: 93}),
        ).toBe(53);
        expect(
            resumenDrawerBadgeCount("guests", {familyCount: 53, guestCount: 93}),
        ).toBe(93);
        expect(resumenDrawerBadgeCount("families", undefined)).toBeUndefined();
    });

    it("formats a display name from the email local part", () => {
        expect(adminDrawerDisplayName("wedding.planner@example.com")).toBe(
            "Wedding Planner",
        );
        expect(adminDrawerDisplayName("admin@planner.com")).toBe("Admin");
        expect(adminDrawerDisplayName("@example.com")).toBe("Administrador");
    });
});
