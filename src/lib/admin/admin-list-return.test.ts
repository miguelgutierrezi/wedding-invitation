import {describe, expect, it, beforeEach, afterEach, vi} from "vitest";

import {
    ADMIN_FAMILIES_LIST_RETURN_KEY,
    readAdminFamiliesListReturnHref,
    rememberAdminFamiliesListHref,
} from "@/lib/admin/admin-list-return";

describe("admin families list return href", () => {
    const store = new Map<string, string>();

    beforeEach(() => {
        store.clear();
        vi.stubGlobal("sessionStorage", {
            getItem: (key: string) => store.get(key) ?? null,
            setItem: (key: string, value: string) => {
                store.set(key, value);
            },
            removeItem: (key: string) => {
                store.delete(key);
            },
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("remembers a filtered families list and rejects detail paths", () => {
        rememberAdminFamiliesListHref("/admin/families?status=pending&page=2");
        expect(readAdminFamiliesListReturnHref()).toBe(
            "/admin/families?status=pending&page=2",
        );
        expect(store.get(ADMIN_FAMILIES_LIST_RETURN_KEY)).toContain("status=pending");

        rememberAdminFamiliesListHref("/admin/families/abc");
        expect(readAdminFamiliesListReturnHref()).toBe("/admin/families");
    });

    it("falls back when nothing was stored", () => {
        expect(readAdminFamiliesListReturnHref()).toBe("/admin/families");
    });
});
