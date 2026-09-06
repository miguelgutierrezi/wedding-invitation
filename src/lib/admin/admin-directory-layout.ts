/**
 * Admin directory (`/admin/admins`) — Figma desktop `85:40`, tablet `85:133`,
 * mobile `85:220`.
 *
 * Breakpoints (content only; chrome unchanged):
 * - `< md` phone: nested entry cards (current admin wash fill)
 * - `md`–`lg` tablet portrait: left (email+meta) / right (badge+actions)
 * - `lg+` tablet landscape + desktop: single horizontal row (via `lg:contents`)
 */

export const adminDirectoryPageClass = "flex flex-col gap-5 md:gap-6 lg:gap-8";

export const adminDirectorySectionClass =
    "rounded-2xl border border-olive-border bg-white p-4 text-cover-cta-fg shadow-[0_4px_8px_rgba(69,68,17,0.03)] md:rounded-[20px] md:p-6 lg:rounded-3xl lg:p-8";

/** Phone: card stack (12px). From `md`: bordered list rows. */
export const adminDirectoryListClass =
    "mt-4 flex flex-col gap-3 md:mt-5 md:gap-0 md:divide-y md:divide-olive-border md:border-t md:border-olive-border lg:mt-6";

const adminDirectoryRowBaseClass =
    "flex flex-col gap-2.5 rounded-xl border border-olive-border p-3 md:flex-row md:items-center md:justify-between md:gap-4 md:rounded-none md:border-0 md:border-b md:border-olive-border md:bg-transparent md:px-2 md:py-4 md:last:border-b-0";

/** Other admins / pending — white nested card on phone (Figma `85:220`). */
export const adminDirectoryRowClass = `${adminDirectoryRowBaseClass} bg-white`;

/** Signed-in admin — olive-wash fill on phone only. */
export const adminDirectoryRowCurrentClass = `${adminDirectoryRowBaseClass} bg-olive-wash`;

/** Dissolves at `lg` so children join the desktop row. */
export const adminDirectoryLeftClusterClass =
    "flex min-w-0 flex-1 flex-col gap-0.5 md:gap-1 lg:contents";

export const adminDirectoryRightClusterClass =
    "flex w-full shrink-0 items-center justify-between gap-3 md:w-auto md:justify-end lg:contents";

/** Email + TÚ — mobile gap 6px, tablet/desktop 8px. */
export const adminDirectoryIdentityClass =
    "flex min-w-0 items-center gap-1.5 md:gap-2 lg:min-w-0 lg:flex-1";

export const adminDirectoryEmailClass =
    "min-w-0 font-[family-name:var(--font-timer)] text-sm font-semibold break-all text-cover-cta-fg md:text-[15px] lg:text-base";

export const adminDirectoryMetaClass =
    "font-[family-name:var(--font-timer)] text-xs leading-normal text-olive-muted md:text-[13px] lg:w-[16.25rem] lg:shrink-0 lg:text-sm";

export const adminDirectoryBadgeSlotClass = "shrink-0 lg:w-[7.5rem]";

export const adminDirectoryActionsClass =
    "flex shrink-0 flex-row flex-wrap items-center justify-end gap-1.5 md:gap-2 lg:min-w-[11.5rem]";

export const adminDirectoryYouBadgeClass =
    "inline-flex shrink-0 items-center rounded px-1.5 py-px text-[9px] font-semibold tracking-wide text-cover-cta-fg uppercase bg-olive-border md:px-2 md:py-0.5 md:text-[11px]";

export const adminDirectorySectionTitleClass =
    "font-[family-name:var(--font-timer)] text-base font-bold tracking-[0.06em] text-cover-cta-fg uppercase md:text-lg";

export const adminDirectoryEyebrowClass =
    "font-[family-name:var(--font-timer)] text-[11px] font-bold tracking-[0.08em] text-olive-muted uppercase md:text-xs";

export const adminDirectoryTitleClass =
    "font-[family-name:var(--font-timer)] text-xl font-bold text-cover-cta-fg md:text-2xl lg:text-[1.75rem]";

export const adminDirectoryLeadClass =
    "font-[family-name:var(--font-timer)] text-[13px] leading-[1.4] text-olive-muted md:text-sm lg:text-base";

export const adminDirectoryInputClass =
    "min-h-11 w-full rounded-full border border-olive-border bg-olive-wash px-4 font-[family-name:var(--font-timer)] text-sm text-olive-muted outline-none transition-[border-color,box-shadow] placeholder:text-olive-muted/70 focus-visible:border-cover-cta-fg focus-visible:ring-2 focus-visible:ring-accent md:border-[1.5px] md:px-5 md:text-[15px] lg:px-6 lg:text-base";

/** Compact row CTAs — mobile 11–12px, never full-bleed. */
export const adminDirectoryBtnPrimaryClass =
    "inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border border-cover-cta-fg bg-accent px-3 font-[family-name:var(--font-timer)] text-[11px] font-bold text-cover-cta-fg transition-[transform,opacity] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 md:border-2 md:px-4 md:text-[13px]";

export const adminDirectoryBtnDangerClass =
    "inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border border-red-800 bg-red-100 px-3 font-[family-name:var(--font-timer)] text-xs font-bold text-red-800 transition-[transform,opacity] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-red-800/40 focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 md:px-4 md:text-[13px]";

export const adminDirectoryBtnSecondaryClass =
    "inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border border-olive-muted bg-olive-wash px-3 font-[family-name:var(--font-timer)] text-[11px] font-bold text-olive-muted transition-[background-color,opacity] hover:bg-cream-figma focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 md:px-4 md:text-[13px]";

export const adminDirectoryBtnImmutableClass =
    "inline-flex min-h-9 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-neutral-200 px-3 font-[family-name:var(--font-timer)] text-xs font-bold text-neutral-400 opacity-60 md:px-4 md:text-[13px]";

export const adminDirectoryStatusActiveClass =
    "inline-flex min-h-7 shrink-0 items-center whitespace-nowrap rounded-full bg-status-active-bg px-2.5 py-1 text-[11px] font-semibold text-status-active-fg md:px-3 md:text-xs";

export const adminDirectoryStatusPendingClass =
    "inline-flex min-h-7 shrink-0 items-center whitespace-nowrap rounded-full bg-status-pending-bg px-2.5 py-1 text-[11px] font-semibold text-status-pending-fg md:px-3 md:text-xs";

/** Invite form stacks with 8px gap on phone (Figma `85:243`). */
export const adminDirectoryInviteFormGapClass = "gap-2 md:gap-3";
