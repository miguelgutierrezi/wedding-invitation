/**
 * Admin Auth / directory policy.
 *
 * `ADMIN_ALLOWED_EMAILS` are the couple’s owner accounts: they can use `/admin`
 * and cannot be deleted by other admins (see `canDeleteActiveAdmin`).
 */

export const ADMIN_ALLOWED_EMAILS = [
    "migueangel97@hotmail.com",
    "nycholpg@gmail.com",
] as const;

/** Max rows in one admin batch mutation/export. Sized for reuse across events. */
export const ADMIN_BATCH_MAX_IDS = 200;

/**
 * Invite / recovery OTP lifetime in seconds.
 * Keep in sync with `supabase/config.toml` `auth.email.otp_expiry`
 * and hosted Dashboard → Authentication → Email → OTP expiry.
 */
export const ADMIN_INVITE_OTP_EXPIRY_SECONDS = 24 * 60 * 60;
