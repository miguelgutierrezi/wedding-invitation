import {describe, expect, it} from "vitest";

import {weddingConfig} from "@/config/wedding";
import {
    getOutfitInspirationPage,
    INSPIRATION_AUDIENCES,
    isInspirationAudience,
} from "@/lib/invitation/outfit-inspiration";

describe("outfit inspiration helpers", () => {
    it("accepts only ellos and ellas", () => {
        expect(isInspirationAudience("ellos")).toBe(true);
        expect(isInspirationAudience("ellas")).toBe(true);
        expect(isInspirationAudience("otros")).toBe(false);
        expect(isInspirationAudience("")).toBe(false);
    });

    it("resolves page data for both audiences", () => {
        for (const audience of INSPIRATION_AUDIENCES) {
            const page = getOutfitInspirationPage(audience);
            expect(page).not.toBeNull();
            expect(page?.audience).toBe(audience);
            expect(page?.imageSrc.length).toBeGreaterThan(0);
            expect(page?.imageAlt.length).toBeGreaterThan(0);
            expect(page?.title.length).toBeGreaterThan(0);
        }
    });

    it("returns null for unknown audience", () => {
        expect(getOutfitInspirationPage("xyz")).toBeNull();
    });

    it("keeps dress-code CTAs aligned with inspiration routes and assets", () => {
        expect(weddingConfig.dressCode.inspirationUrls.men).toBe(
            "/inspiracion/ellos",
        );
        expect(weddingConfig.dressCode.inspirationUrls.women).toBe(
            "/inspiracion/ellas",
        );

        const men = getOutfitInspirationPage("ellos");
        const women = getOutfitInspirationPage("ellas");

        expect(men?.imageSrc).toBe(weddingConfig.assets.menOutfitInspiration);
        expect(men?.desktopImageSrc).toBe(
            weddingConfig.assets.menOutfitInspirationDesktop,
        );
        expect(women?.imageSrc).toBe(weddingConfig.assets.womenOutfitInspiration);
        expect(women?.desktopImageSrc).toBe(
            weddingConfig.assets.womenOutfitInspirationDesktop,
        );
        expect(men?.imageSrc).toContain("hombre");
        expect(women?.imageSrc).toContain("mujer");
    });
});
