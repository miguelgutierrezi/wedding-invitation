import {describe, expect, it} from "vitest";

import {pageSelectionState, selectIds, toggleId, uniqueIds} from "@/lib/admin/selection";

describe("admin row selection", () => {
    it("toggles and de-duplicates ids", () => {
        const once = toggleId(new Set(), "a");
        expect([...once]).toEqual(["a"]);
        expect([...toggleId(once, "a")]).toEqual([]);
        expect(uniqueIds(["a", "a", "b"])).toEqual(["a", "b"]);
    });

    it("adds or removes a page of ids", () => {
        const selected = selectIds(new Set(["keep"]), ["a", "b"], true);
        expect(selected.has("keep")).toBe(true);
        expect(selected.has("a")).toBe(true);
        expect(selectIds(selected, ["a"], false).has("a")).toBe(false);
    });

    it("reports none / some / all for the current page", () => {
        const selected = new Set(["a", "b"]);
        expect(pageSelectionState(["a", "b"], selected)).toBe("all");
        expect(pageSelectionState(["a", "c"], selected)).toBe("some");
        expect(pageSelectionState(["c"], selected)).toBe("none");
        expect(pageSelectionState([], selected)).toBe("none");
    });
});
