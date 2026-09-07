/**
 * Invite email + submit stay stacked on the unused `tone="legacy"` fallback.
 * Phone Figma `136:29` and portrait `134:207` use `adminAdmins.portraitInviteRow`
 * (mobile also uses `mobileInput` / `mobileInviteBtn`). Landscape + desktop
 * (`134:121` / `134:35`) use `adminAdmins.inviteRow`.
 */
export const adminInviteFieldsRowClass =
    "flex flex-col gap-2 md:gap-3 lg:flex-row lg:items-center lg:gap-4";
