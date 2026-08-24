import {describe, expect, it} from "vitest";

import {
    isExampleFamilyName,
    omitExampleFamilies,
    omitGuestsOfExampleFamilies,
} from "@/lib/admin/example-family";

describe("isExampleFamilyName", () => {
    it("matches the word ejemplo ignoring case and accents", () => {
        expect(isExampleFamilyName("Familia Ejemplo")).toBe(true);
        expect(isExampleFamilyName("  EJEMPLO  ")).toBe(true);
        expect(isExampleFamilyName("Familia Éjemplo")).toBe(true);
    });

    it("does not match ordinary names or similar words", () => {
        expect(isExampleFamilyName("Familia García")).toBe(false);
        expect(isExampleFamilyName("Familia Ejemplar")).toBe(false);
        expect(isExampleFamilyName("")).toBe(false);
    });
});

describe("omitExampleFamilies", () => {
    it("drops example families and their guests from planning rows", () => {
        const families = [
            {id: "real", displayName: "Familia García"},
            {id: "demo", displayName: "Familia Ejemplo"},
        ];
        const guests = [
            {familyId: "real", name: "Ana"},
            {familyId: "demo", name: "Test"},
        ];

        expect(omitExampleFamilies(families)).toEqual([families[0]]);
        expect(omitGuestsOfExampleFamilies(guests, families)).toEqual([
            guests[0],
        ]);
    });
});
