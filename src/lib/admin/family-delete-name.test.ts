import {describe, expect, it} from "vitest";

import {familyDeleteNameMatches} from "@/lib/admin/family-delete-name";

describe("familyDeleteNameMatches", () => {
    it("matches the saved family name ignoring case and spaces", () => {
        expect(
            familyDeleteNameMatches("  familia garcía  ", "Familia García"),
        ).toBe(true);
    });

    it("matches an unsaved draft name so delete is not blocked by pending edits", () => {
        expect(
            familyDeleteNameMatches("Familia Pérez", "Familia García", "Familia Pérez"),
        ).toBe(true);
    });

    it("rejects an empty or unrelated name", () => {
        expect(familyDeleteNameMatches("", "Familia García")).toBe(false);
        expect(
            familyDeleteNameMatches("Otra", "Familia García", "Familia Pérez"),
        ).toBe(false);
    });
});
