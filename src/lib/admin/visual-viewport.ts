/**
 * How much of the layout viewport is covered below the visual viewport
 * (iPad Chrome/Safari toolbars). `position:fixed; bottom` is relative to the
 * layout viewport; this inset lifts UI into the actually visible area.
 */
export function visualViewportBottomCover(
    innerHeight: number,
    visual: {height: number; offsetTop: number} | null | undefined,
): number {
    if (!visual) {
        return 0;
    }

    return Math.max(0, innerHeight - visual.height - visual.offsetTop);
}
