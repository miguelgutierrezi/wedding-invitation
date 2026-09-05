import {describe, expect, it} from "vitest";

import {isAdminNavActive, ADMIN_DESKTOP_NAV_MIN_PX, ADMIN_FAB_HIDE_MIN_PX, showAdminBackToFamilies, showAdminNewFamilyFab,} from "@/lib/admin/admin-chrome";

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

    it("keeps the hamburger below desktop xl so iPad 11\" landscape still has it", () => {
        expect(ADMIN_DESKTOP_NAV_MIN_PX).toBe(1280);
    });

    it("shows the back arrow on create and family detail", () => {
        expect(showAdminBackToFamilies("/admin/families/new")).toBe(true);
        expect(showAdminBackToFamilies("/admin/families/abc-123")).toBe(true);
        expect(showAdminBackToFamilies("/admin/families")).toBe(false);
    });
});
