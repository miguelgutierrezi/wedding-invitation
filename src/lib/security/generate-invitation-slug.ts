import "server-only";

import {createHash} from "node:crypto";

import {
    displayNameForInvitationSlug,
    isValidInvitationSlug,
    slugifyInvitationLabel,
} from "@/lib/security/invitation-slug";

export function hashInvitationSlug(slug: string): string {
    return createHash("sha256").update(slug, "utf8").digest("hex");
}

export function buildInvitationUrl(slug: string): string {
    const base =
        process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
        "http://localhost:3000";

    return `${base}/i/${encodeURIComponent(slug)}`;
}

/** Derive and normalize a candidate slug from a display name. */
export function slugFromDisplayName(displayName: string): string {
    const base = slugifyInvitationLabel(displayNameForInvitationSlug(displayName));
    return base.length >= 2 ? base : "familia";
}

export function normalizeInvitationSlug(raw: string): string {
    const normalized = raw.trim().toLowerCase();

    if (isValidInvitationSlug(normalized)) {
        return normalized;
    }

    return slugFromDisplayName(normalized);
}
