import {describe, expect, it} from "vitest";

import {isAdminNavActive, showAdminBackToFamilies, showAdminNewFamilyFab,} from "@/lib/admin/admin-chrome";

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
});

describe("compact admin chrome paths", () => {
    it("hides the new-family FAB on the create page", () => {
        expect(showAdminNewFamilyFab("/admin/families")).toBe(true);
        expect(showAdminNewFamilyFab("/admin/families/new")).toBe(false);
    });

    it("shows the back arrow on create and family detail", () => {
        expect(showAdminBackToFamilies("/admin/families/new")).toBe(true);
        expect(showAdminBackToFamilies("/admin/families/abc-123")).toBe(true);
        expect(showAdminBackToFamilies("/admin/families")).toBe(false);
    });
});
