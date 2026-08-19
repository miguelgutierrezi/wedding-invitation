import {describe, expect, it} from "vitest";

import {isPlaceholderGuestName} from "@/lib/invitation/placeholder-guest-name";

describe("isPlaceholderGuestName", () => {
    it("matches Acompañante variants", () => {
        expect(isPlaceholderGuestName("Acompañante")).toBe(true);
        expect(isPlaceholderGuestName("acompanante")).toBe(true);
        expect(isPlaceholderGuestName("  Acompañante 2  ")).toBe(true);
        expect(isPlaceholderGuestName("plus one")).toBe(true);
        expect(isPlaceholderGuestName("Plus-One")).toBe(true);
    });

    it("does not match real names", () => {
        expect(isPlaceholderGuestName("Ana Pérez")).toBe(false);
        expect(isPlaceholderGuestName("Acompañante Pérez")).toBe(false);
        expect(isPlaceholderGuestName("")).toBe(false);
    });
});
