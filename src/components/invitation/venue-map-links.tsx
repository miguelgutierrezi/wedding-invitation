"use client";

import {useSyncExternalStore} from "react";

import {weddingConfig} from "@/config/wedding";
import {isApplePlatform} from "@/lib/platform";
import {cn} from "@/lib/utils";

const linkClassName =
    "inline-flex min-h-11 items-center justify-center rounded-full border-2 border-cover-cta-fg bg-accent px-5 py-3 font-[family-name:var(--font-timer)] text-[clamp(1rem,2.4vw,1.25rem)] leading-none text-cover-cta-fg transition-[transform,opacity] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none active:scale-[0.98]";

function subscribeNoop() {
    return () => undefined;
}

function getAppleSnapshot() {
    return isApplePlatform();
}

function getServerAppleSnapshot() {
    return false;
}

type VenueMapLinksProps = {
    mapsUrl: string;
    wazeUrl: string;
    appleMapsUrl: string;
};

/**
 * External map app deep-links. Apple Maps only when the device is Apple OS.
 */
export function VenueMapLinks({
                                  mapsUrl,
                                  wazeUrl,
                                  appleMapsUrl,
                              }: VenueMapLinksProps) {
    const isApple = useSyncExternalStore(
        subscribeNoop,
        getAppleSnapshot,
        getServerAppleSnapshot,
    );
    const {venue} = weddingConfig;

    const links = [
        mapsUrl
            ? {href: mapsUrl, label: venue.mapsCtaLabel, key: "google"}
            : null,
        wazeUrl
            ? {href: wazeUrl, label: venue.wazeCtaLabel, key: "waze"}
            : null,
        isApple && appleMapsUrl
            ? {href: appleMapsUrl, label: venue.appleMapsCtaLabel, key: "apple"}
            : null,
    ].filter(Boolean) as Array<{ href: string; label: string; key: string }>;

    if (links.length === 0) {
        return null;
    }

    return (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {links.map((link) => (
                <a
                    key={link.key}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(linkClassName)}
                >
                    {link.label}
                </a>
            ))}
        </div>
    );
}
