import "server-only";

import {randomBytes} from "node:crypto";

import {hashInvitationToken} from "@/lib/security/invitation-token";

const TOKEN_BYTE_LENGTH = 32;

export function generateInvitationToken(): {
    token: string;
    tokenHash: string;
    tokenPreview: string;
} {
    const token = randomBytes(TOKEN_BYTE_LENGTH).toString("base64url");
    const tokenHash = hashInvitationToken(token);
    const tokenPreview = token.slice(0, 4);

    return {token, tokenHash, tokenPreview};
}

export function buildInvitationUrl(token: string): string {
    const base =
        process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
        "http://localhost:3000";

    return `${base}/i/${token}`;
}
