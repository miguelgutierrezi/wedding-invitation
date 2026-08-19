/**
 * Emails allowed to access `/admin` after Supabase Auth sign-in.
 * Case-insensitive. Keep this list intentionally small.
 */
export const ADMIN_ALLOWED_EMAILS = [
    "migueangel97@hotmail.com",
    "nycholpg@gmail.com",
] as const;

/** Max rows in one admin batch mutation/export. Sized for reuse across events. */
export const ADMIN_BATCH_MAX_IDS = 200;
