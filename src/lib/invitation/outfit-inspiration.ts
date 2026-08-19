import {weddingConfig} from "@/config/wedding";

export const INSPIRATION_AUDIENCES = ["ellos", "ellas"] as const;

export type InspirationAudience = (typeof INSPIRATION_AUDIENCES)[number];

export function isInspirationAudience(
    value: string,
): value is InspirationAudience {
    return (INSPIRATION_AUDIENCES as readonly string[]).includes(value);
}

export type OutfitInspirationPageData = {
    audience: InspirationAudience;
    title: string;
    imageAlt: string;
    imageSrc: string;
    desktopImageSrc: string;
};

/**
 * Resolves config for `/inspiracion/[audience]`.
 * Returns null for unknown audiences or missing assets.
 */
export function getOutfitInspirationPage(
    audience: string,
): OutfitInspirationPageData | null {
    if (!isInspirationAudience(audience)) {
        return null;
    }

    const {dressCode, assets} = weddingConfig;
    const page = dressCode.inspirationPages[audience];
    const imageSrc =
        audience === "ellos"
            ? assets.menOutfitInspiration
            : assets.womenOutfitInspiration;
    const desktopImageSrc =
        audience === "ellos"
            ? assets.menOutfitInspirationDesktop
            : assets.womenOutfitInspirationDesktop;

    if (!imageSrc || !desktopImageSrc) {
        return null;
    }

    return {
        audience,
        title: page.title,
        imageAlt: page.imageAlt,
        imageSrc,
        desktopImageSrc,
    };
}
