/**
 * Freeze document scroll while a modal overlay is open.
 *
 * Do not set `overflow: hidden` on `<html>`: that creates a scrollport and
 * iPad Safari/Chrome then treat `position: fixed` as absolute (see
 * `globals.css`). `overflow: hidden` on `body` alone also fails — the page
 * still scrolls on `html`, which is why the hamburger drawer leaked scroll.
 */

export const SCROLL_LOCK_SCROLLER_ATTR = "data-scroll-lock-scroller";

export type LockedBodyInlineStyles = {
    position: string;
    top: string;
    left: string;
    right: string;
    width: string;
};

export type ScrollMetrics = {
    scrollHeight: number;
    clientHeight: number;
};

export function lockedBodyInlineStyles(scrollY: number): LockedBodyInlineStyles {
    return {
        position: "fixed",
        top: `-${Math.max(0, scrollY)}px`,
        left: "0",
        right: "0",
        width: "100%",
    };
}

export function restoreScrollYFromLockedTop(top: string): number {
    const parsed = Number.parseInt(top, 10);
    if (!Number.isFinite(parsed)) {
        return 0;
    }
    return Math.abs(parsed);
}

export function scrollerCanScroll(scroller: ScrollMetrics): boolean {
    return scroller.scrollHeight > scroller.clientHeight + 1;
}

function hasClosest(value: EventTarget | null): value is Element {
    return (
        typeof value === "object" &&
        value !== null &&
        "closest" in value &&
        typeof (value as Element).closest === "function"
    );
}

export function shouldAllowTouchMoveWhileLocked(
    target: EventTarget | null,
    overlay: ParentNode | null,
): boolean {
    if (!hasClosest(target) || !overlay || typeof overlay.contains !== "function") {
        return false;
    }

    const scroller = target.closest(`[${SCROLL_LOCK_SCROLLER_ATTR}]`);
    if (!scroller || !overlay.contains(scroller)) {
        return false;
    }

    return scrollerCanScroll(scroller);
}
