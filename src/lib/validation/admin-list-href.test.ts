import {describe, expect, it} from "vitest";

import {adminListHref} from "@/lib/validation/admin-filters";

describe("adminListHref", () => {
    it("omits the query string when empty so back navigation stays clean", () => {
        expect(adminListHref("/admin/families", "")).toBe("/admin/families");
        expect(adminListHref("/admin/guests", "status=pending&page=2")).toBe(
            "/admin/guests?status=pending&page=2",
        );
    });
});
