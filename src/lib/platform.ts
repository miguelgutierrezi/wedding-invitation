/**
 * Detect Apple desktop/mobile OSes for showing Apple Maps only there.
 * Uses user agent; ok for this optional deep-link (not security-sensitive).
 */
export function isApplePlatformUserAgent(
    userAgent: string | null | undefined,
): boolean {
    if (!userAgent) {
        return false;
    }

    // iPhone, iPad (classic), iPod
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
        return true;
    }

    // macOS Safari/Chrome, and iPadOS 13+ which reports as Macintosh
    if (/Macintosh|Mac OS X/i.test(userAgent)) {
        return true;
    }

    return false;
}

export function isApplePlatform(): boolean {
    if (typeof navigator === "undefined") {
        return false;
    }
    return isApplePlatformUserAgent(navigator.userAgent);
}
