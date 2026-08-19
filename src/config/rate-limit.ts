/**
 * Public invitation / RSVP / guest-media rate-limit budgets.
 * Tuned for ~90 guests sharing links (WhatsApp retries included).
 */
export const rateLimitConfig = {
    /** RSVP server action submissions per IP. */
    rsvp: {
        limit: 12,
        windowMs: 15 * 60 * 1000,
    },
    /** Invitation slug lookups per IP (cover + body pages). */
    invitationLookup: {
        limit: 120,
        windowMs: 5 * 60 * 1000,
    },
    /** Media authorize (create signed upload) per IP. */
    mediaAuthorize: {
        limit: 60,
        windowMs: 15 * 60 * 1000,
    },
    /** Event QR code validation attempts per IP. */
    mediaQrLookup: {
        limit: 40,
        windowMs: 15 * 60 * 1000,
    },
} as const;
