"use client";

import {useEffect} from "react";

import {
    lockedBodyInlineStyles,
    restoreScrollYFromLockedTop,
    shouldAllowTouchMoveWhileLocked,
} from "@/lib/admin/lock-body-scroll";

/**
 * Locks page scroll (including iOS rubber-banding) while `locked` is true.
 * `overlayId` is the open overlay so the drawer nav can still scroll.
 */
export function useLockBodyScroll(locked: boolean, overlayId: string) {
    useEffect(() => {
        if (!locked) {
            return;
        }

        const html = document.documentElement;
        const body = document.body;
        const lock = lockedBodyInlineStyles(window.scrollY);
        const previous = {
            htmlOverscroll: html.style.overscrollBehavior,
            bodyPosition: body.style.position,
            bodyTop: body.style.top,
            bodyLeft: body.style.left,
            bodyRight: body.style.right,
            bodyWidth: body.style.width,
            bodyOverscroll: body.style.overscrollBehavior,
        };

        html.style.overscrollBehavior = "none";
        body.style.position = lock.position;
        body.style.top = lock.top;
        body.style.left = lock.left;
        body.style.right = lock.right;
        body.style.width = lock.width;
        body.style.overscrollBehavior = "none";

        function overlayRoot(): ParentNode | null {
            return document.getElementById(overlayId);
        }

        function onTouchMove(event: TouchEvent) {
            if (shouldAllowTouchMoveWhileLocked(event.target, overlayRoot())) {
                return;
            }
            event.preventDefault();
        }

        function onWheel(event: WheelEvent) {
            if (shouldAllowTouchMoveWhileLocked(event.target, overlayRoot())) {
                return;
            }
            event.preventDefault();
        }

        document.addEventListener("touchmove", onTouchMove, {passive: false});
        document.addEventListener("wheel", onWheel, {passive: false});

        return () => {
            html.style.overscrollBehavior = previous.htmlOverscroll;
            body.style.position = previous.bodyPosition;
            body.style.top = previous.bodyTop;
            body.style.left = previous.bodyLeft;
            body.style.right = previous.bodyRight;
            body.style.width = previous.bodyWidth;
            body.style.overscrollBehavior = previous.bodyOverscroll;
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("wheel", onWheel);
            window.scrollTo(0, restoreScrollYFromLockedTop(lock.top));
        };
    }, [locked, overlayId]);
}
