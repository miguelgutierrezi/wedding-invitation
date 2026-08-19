"use client";

import {useEffect, useRef} from "react";

/**
 * After the user changes list page, jump back to the list top.
 * Skips the first render so opening /admin/families does not jump.
 */
export function useScrollOnPageChange(page: number) {
    const targetRef = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const node = targetRef.current;
        if (!node) {
            return;
        }

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        node.scrollIntoView({
            block: "start",
            behavior: reduceMotion ? "auto" : "smooth",
        });
    }, [page]);

    return targetRef;
}
