/**
 * Reference list of the couple's own emails.
 *
 * NOTE: this is NOT currently enforced. `requireAdmin` (src/lib/auth/require-admin.ts)
 * lets any signed-in Supabase Auth account reach `/admin`. Wire this list into
 * `isEmailAllowed` if you want to restrict access again.
 */
export const ADMIN_ALLOWED_EMAILS = [
    "migueangel97@hotmail.com",
    "nycholpg@gmail.com",
] as const;

/** Max rows in one admin batch mutation/export. Sized for reuse across events. */
export const ADMIN_BATCH_MAX_IDS = 200;
