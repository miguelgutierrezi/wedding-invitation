import {describe, expect, it} from "vitest";

import {visualViewportBottomCover} from "@/lib/admin/visual-viewport";

describe("visualViewportBottomCover", () => {
    it("is zero when the visual viewport fills the layout viewport", () => {
        expect(
            visualViewportBottomCover(800, {height: 800, offsetTop: 0}),
        ).toBe(0);
    });

    it("returns the bottom overlay when the browser chrome shrinks the visual viewport", () => {
        expect(
            visualViewportBottomCover(800, {height: 740, offsetTop: 0}),
        ).toBe(60);
    });

    it("ignores top chrome already accounted for in offsetTop", () => {
        expect(
            visualViewportBottomCover(800, {height: 700, offsetTop: 50}),
        ).toBe(50);
    });

    it("is zero without a visual viewport API", () => {
        expect(visualViewportBottomCover(800, null)).toBe(0);
    });

    it("ignores iPad Chrome’s ~half-screen innerHeight vs visualViewport gap", () => {
        expect(
            visualViewportBottomCover(1180, {height: 590, offsetTop: 0}),
        ).toBe(0);
    });

    it("ignores pinch-zoom scale so the FAB is not shifted", () => {
        expect(
            visualViewportBottomCover(800, {
                height: 740,
                offsetTop: 0,
                scale: 2,
            }),
        ).toBe(0);
    });
});
