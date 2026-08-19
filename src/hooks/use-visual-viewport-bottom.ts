"use client";

import {useEffect} from "react";

import {visualViewportBottomCover} from "@/lib/admin/visual-viewport";

const CSS_VAR = "--admin-vv-bottom";

/**
 * Publishes the visual-viewport bottom cover as a CSS variable on <html>.
 */
export function useVisualViewportBottom() {
    useEffect(() => {
        const root = document.documentElement;

        function sync() {
            const inset = visualViewportBottomCover(
                window.innerHeight,
                window.visualViewport,
            );
            root.style.setProperty(CSS_VAR, `${inset}px`);
        }

        sync();

        const visual = window.visualViewport;
        window.addEventListener("resize", sync);
        visual?.addEventListener("resize", sync);
        visual?.addEventListener("scroll", sync);

        return () => {
            window.removeEventListener("resize", sync);
            visual?.removeEventListener("resize", sync);
            visual?.removeEventListener("scroll", sync);
            root.style.removeProperty(CSS_VAR);
        };
    }, []);
}
