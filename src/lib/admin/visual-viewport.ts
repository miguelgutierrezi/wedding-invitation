/**
 * How much of the layout viewport is covered below the visual viewport
 * (browser toolbars). `position:fixed; bottom` is relative to the layout
 * viewport; this inset can lift UI into the visible area.
 *
 * iPad Chrome reports `window.innerHeight` ≈ 2× `visualViewport.height`, which
 * would push a bottom-fixed control to the middle of the screen. Gaps larger
 * than a real toolbar are treated as 0.
 */
export const ADMIN_VV_BOTTOM_MAX_PX = 128;

const SCALE_SLACK = 0.02;

type VisualViewportSize = {
    height: number;
    offsetTop: number;
    scale?: number;
};

export function visualViewportBottomCover(
    innerHeight: number,
    visual: VisualViewportSize | null | undefined,
): number {
    if (!visual) {
        return 0;
    }

    if (
        visual.scale != null &&
        Math.abs(visual.scale - 1) > SCALE_SLACK
    ) {
        return 0;
    }

    const raw = Math.max(0, innerHeight - visual.height - visual.offsetTop);

    if (raw > ADMIN_VV_BOTTOM_MAX_PX) {
        return 0;
    }

    return raw;
}
