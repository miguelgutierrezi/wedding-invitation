import {describe, expect, it} from "vitest";

import {
    SCROLL_LOCK_SCROLLER_ATTR,
    lockedBodyInlineStyles,
    restoreScrollYFromLockedTop,
    scrollerCanScroll,
    shouldAllowTouchMoveWhileLocked,
} from "@/lib/admin/lock-body-scroll";

describe("lockedBodyInlineStyles", () => {
    it("pins the body with the current scroll offset", () => {
        expect(lockedBodyInlineStyles(240)).toEqual({
            position: "fixed",
            top: "-240px",
            left: "0",
            right: "0",
            width: "100%",
        });
    });

    it("does not use a negative offset for a negative scrollY", () => {
        expect(lockedBodyInlineStyles(-12).top).toBe("-0px");
    });
});

describe("restoreScrollYFromLockedTop", () => {
    it("reads the pixel offset back out of the locked top", () => {
        expect(restoreScrollYFromLockedTop("-240px")).toBe(240);
    });

    it("is zero when top was not a pixel offset", () => {
        expect(restoreScrollYFromLockedTop("")).toBe(0);
        expect(restoreScrollYFromLockedTop("auto")).toBe(0);
    });
});

describe("scrollerCanScroll", () => {
    it("is false when the scroller fits its content", () => {
        expect(scrollerCanScroll({scrollHeight: 200, clientHeight: 200})).toBe(
            false,
        );
    });

    it("is true when the scroller overflows", () => {
        expect(scrollerCanScroll({scrollHeight: 480, clientHeight: 200})).toBe(
            true,
        );
    });
});

describe("shouldAllowTouchMoveWhileLocked", () => {
    it("blocks gestures that are not inside the overlay scroller", () => {
        const overlay = {contains: () => false};
        const outside = {
            closest: () => null,
        };

        expect(
            shouldAllowTouchMoveWhileLocked(
                outside as unknown as EventTarget,
                overlay as unknown as ParentNode,
            ),
        ).toBe(false);
        expect(shouldAllowTouchMoveWhileLocked(null, overlay as unknown as ParentNode)).toBe(
            false,
        );
        expect(
            shouldAllowTouchMoveWhileLocked(
                outside as unknown as EventTarget,
                null,
            ),
        ).toBe(false);
    });

    it("allows scrolling only when the marked scroller actually overflows", () => {
        const scroller = {
            scrollHeight: 200,
            clientHeight: 200,
            closest() {
                return this;
            },
        };
        const overlay = {
            contains: (node: unknown) => node === scroller,
        };
        const child = {
            closest: (selector: string) =>
                selector === `[${SCROLL_LOCK_SCROLLER_ATTR}]` ? scroller : null,
        };

        expect(
            shouldAllowTouchMoveWhileLocked(
                child as unknown as EventTarget,
                overlay as unknown as ParentNode,
            ),
        ).toBe(false);

        scroller.scrollHeight = 480;
        expect(
            shouldAllowTouchMoveWhileLocked(
                child as unknown as EventTarget,
                overlay as unknown as ParentNode,
            ),
        ).toBe(true);
    });
});
