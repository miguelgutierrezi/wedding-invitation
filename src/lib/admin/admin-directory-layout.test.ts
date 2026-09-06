import {describe, expect, it} from "vitest";

import {
    adminDirectoryEmailClass,
    adminDirectoryIdentityClass,
    adminDirectoryLeftClusterClass,
    adminDirectoryListClass,
    adminDirectoryRightClusterClass,
    adminDirectoryRowClass,
    adminDirectoryRowCurrentClass,
} from "@/lib/admin/admin-directory-layout";
import {adminInviteFieldsRowClass} from "@/lib/admin/admin-invite-form-layout";

describe("admin directory responsive layout", () => {
    it("uses phone nested cards, tablet clusters, and desktop contents dissolve", () => {
        expect(adminDirectoryRowClass).toContain("bg-white");
        expect(adminDirectoryRowCurrentClass).toContain("bg-olive-wash");
        expect(adminDirectoryRowClass).toContain("md:flex-row");
        expect(adminDirectoryRowClass).toContain("md:justify-between");
        expect(adminDirectoryLeftClusterClass).toContain("lg:contents");
        expect(adminDirectoryRightClusterClass).toContain("lg:contents");
        expect(adminDirectoryRightClusterClass).toContain("justify-between");
        expect(adminDirectoryIdentityClass).toContain("gap-1.5");
        expect(adminDirectoryIdentityClass).toContain("md:gap-2");
        expect(adminDirectoryIdentityClass).toContain("lg:flex-1");
        expect(adminDirectoryEmailClass).not.toMatch(/(?:^|\s)flex-1(?:\s|$)/);
        expect(adminDirectoryListClass).toContain("gap-3");
        expect(adminDirectoryListClass).toContain("md:divide-y");
    });

    it("keeps invite form stacked through phone and tablet portrait until lg", () => {
        expect(adminInviteFieldsRowClass).toContain("flex-col");
        expect(adminInviteFieldsRowClass).toContain("gap-2");
        expect(adminInviteFieldsRowClass).toContain("lg:flex-row");
        expect(adminInviteFieldsRowClass).not.toContain("md:flex-row");
        expect(adminInviteFieldsRowClass).not.toContain("sm:flex-row");
    });
});
