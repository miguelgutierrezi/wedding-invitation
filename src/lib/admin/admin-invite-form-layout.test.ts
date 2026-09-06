import {describe, expect, it} from "vitest";

import {adminInviteFieldsRowClass} from "@/lib/admin/admin-invite-form-layout";

describe("adminInviteFieldsRowClass", () => {
    it("stacks until lg (tablet portrait included) then sits in one desktop row", () => {
        expect(adminInviteFieldsRowClass).toContain("flex-col");
        expect(adminInviteFieldsRowClass).toContain("lg:flex-row");
        expect(adminInviteFieldsRowClass).toContain("lg:items-center");
        expect(adminInviteFieldsRowClass).not.toContain("md:flex-row");
        expect(adminInviteFieldsRowClass).not.toContain("sm:flex-row");
    });
});
