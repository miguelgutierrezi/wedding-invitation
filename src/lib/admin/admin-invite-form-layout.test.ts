import {describe, expect, it} from "vitest";

import {adminInviteFieldsRowClass} from "@/lib/admin/admin-invite-form-layout";

describe("adminInviteFieldsRowClass", () => {
    it("stacks until lg so a full-width secondary button cannot crush the email input", () => {
        expect(adminInviteFieldsRowClass).toContain("flex-col");
        expect(adminInviteFieldsRowClass).toContain("lg:flex-row");
        expect(adminInviteFieldsRowClass).not.toContain("sm:flex-row");
    });
});
