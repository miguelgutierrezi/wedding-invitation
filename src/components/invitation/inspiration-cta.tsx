"use client";

import Link from "next/link";
import type {ReactNode} from "react";

import {weddingConfig} from "@/config/wedding";
import {continueInvitationMusicIfNeeded} from "@/lib/invitation-audio";

type InspirationCtaProps = {
    href: string;
    children: ReactNode;
    className: string;
};

/**
 * Dress-code CTA to outfit boards. Keeps soundtrack playing across navigation
 * by re-asserting play on the same user gesture as the click (unless muted).
 */
export function InspirationCta({href, children, className}: InspirationCtaProps) {
    const musicSrc = weddingConfig.assets.music;
    const musicEnabled = weddingConfig.features.music && Boolean(musicSrc);

    const keepMusicPlaying = () => {
        if (musicEnabled && musicSrc) {
            void continueInvitationMusicIfNeeded(musicSrc);
        }
    };

    if (href.startsWith("/")) {
        return (
            <Link href={href} className={className} onClick={keepMusicPlaying}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                onClick={keepMusicPlaying}
            >
                {children}
            </a>
        );
    }

    return (
        <span
            className={`${className} cursor-not-allowed opacity-80`}
            aria-disabled="true"
        >
      {children}
    </span>
    );
}
