/**
 * Shared visual tokens for the admin UI — aligned with invitation brand
 * (cream board, accent yellow, olive type, Times).
 */

export const admin = {
    page: "font-[family-name:var(--font-timer)] text-cover-cta-fg",
    eyebrow:
        "font-[family-name:var(--font-timer)] text-xs font-medium tracking-[0.18em] text-cover-cta-fg/70 uppercase",
    title:
        "font-[family-name:var(--font-timer)] text-[clamp(1.75rem,4vw,2.25rem)] leading-tight font-bold break-words text-cover-cta-fg",
    titleOnAccent:
        "font-[family-name:var(--font-timer)] text-[clamp(1.75rem,4vw,2.25rem)] leading-tight font-bold break-words text-cream-figma",
    body: "font-[family-name:var(--font-timer)] text-[clamp(1rem,1.8vw,1.125rem)] leading-7 text-cover-cta-fg",
    muted:
        "font-[family-name:var(--font-timer)] text-sm leading-6 text-cover-cta-fg/70",
    label:
        "font-[family-name:var(--font-timer)] text-sm font-bold text-cover-cta-fg",
    card:
        "rounded-2xl border-2 border-cover-cta-fg/15 bg-white/65 text-cover-cta-fg shadow-none",
    panel:
        "rounded-2xl border-2 border-cover-cta-fg/15 bg-cream-figma/80 text-cover-cta-fg",
    tableShell:
        "overflow-x-auto rounded-2xl border-2 border-cover-cta-fg/15 bg-white/65",
    tableHead:
        "border-b-2 border-cover-cta-fg/10 bg-cream-figma text-xs tracking-wide text-cover-cta-fg/70 uppercase font-[family-name:var(--font-timer)]",
    tableRow: "border-b border-cover-cta-fg/10 last:border-0",
    input:
        "min-h-11 w-full rounded-full border-2 border-cover-cta-fg/30 bg-white/85 px-4 font-[family-name:var(--font-timer)] text-cover-cta-fg outline-none transition-[border-color,box-shadow] placeholder:text-cover-cta-fg/40 focus-visible:border-cover-cta-fg focus-visible:ring-2 focus-visible:ring-accent",
    textarea:
        "w-full rounded-3xl border-2 border-cover-cta-fg/30 bg-white/85 px-4 py-3 font-[family-name:var(--font-timer)] text-cover-cta-fg outline-none transition-[border-color,box-shadow] placeholder:text-cover-cta-fg/40 focus-visible:border-cover-cta-fg focus-visible:ring-2 focus-visible:ring-accent",
    select:
        "min-h-11 w-full appearance-none rounded-2xl border-2 border-cover-cta-fg/30 bg-white/85 bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27none%27%3E%3Cpath d=%27M5 7.5 10 12.5 15 7.5%27 stroke=%27%23454411%27 stroke-width=%271.6%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-[length:1rem] bg-[position:right_0.9rem_center] bg-no-repeat py-2 pl-4 pr-10 font-[family-name:var(--font-timer)] text-cover-cta-fg outline-none transition-[border-color,box-shadow] focus-visible:border-cover-cta-fg focus-visible:ring-2 focus-visible:ring-accent",
    selectTrigger:
        "inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl border-2 border-cover-cta-fg/30 bg-white/85 px-4 font-[family-name:var(--font-timer)] text-left text-cover-cta-fg outline-none transition-[border-color,box-shadow] hover:border-cover-cta-fg/55 focus-visible:border-cover-cta-fg focus-visible:ring-2 focus-visible:ring-accent",
    selectMenu:
        "absolute top-[calc(100%+0.35rem)] z-20 m-0 max-h-[min(16rem,50vh)] w-full list-none overflow-y-auto rounded-2xl border-2 border-cover-cta-fg/20 bg-cream-figma py-1 font-[family-name:var(--font-timer)] text-cover-cta-fg shadow-[0_10px_24px_rgba(69,68,17,0.08)]",
    selectOption:
        "flex min-h-11 w-full items-center px-4 text-left font-[family-name:var(--font-timer)] text-cover-cta-fg outline-none transition-colors hover:bg-accent/25 focus-visible:bg-accent/25",
    btnPrimary:
        "inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-cover-cta-fg bg-accent px-5 font-[family-name:var(--font-timer)] text-sm font-medium text-cover-cta-fg transition-[transform,opacity] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto",
    btnSecondary:
        "inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-cover-cta-fg/40 bg-cream-figma/90 px-5 font-[family-name:var(--font-timer)] text-sm font-medium text-cover-cta-fg transition-[background-color,opacity] hover:bg-cream-figma focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 lg:w-auto",
    btnDanger:
        "inline-flex min-h-11 w-full items-center justify-center rounded-full border border-red-800 bg-red-100 px-4 font-[family-name:var(--font-timer)] text-sm font-bold text-red-800 transition-[transform,opacity] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-red-800/40 focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto",
    btnImmutable:
        "inline-flex min-h-9 w-full cursor-not-allowed items-center justify-center rounded-full bg-neutral-200 px-4 font-[family-name:var(--font-timer)] text-sm font-bold text-neutral-400 opacity-60 lg:w-auto",
    btnSecondarySoft:
        "inline-flex min-h-11 w-full items-center justify-center rounded-full border border-olive-muted bg-olive-wash px-4 font-[family-name:var(--font-timer)] text-sm font-bold text-olive-muted transition-[background-color,opacity] hover:bg-cream-figma focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 lg:w-auto",
    btnGhost:
        "inline-flex min-h-11 shrink-0 items-center justify-center rounded-full px-4 font-[family-name:var(--font-timer)] text-sm font-medium text-cream-figma/95 transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-cream-figma/60 focus-visible:outline-none",
    navScroller:
        "flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    navLink:
        "inline-flex min-h-11 shrink-0 items-center rounded-full px-4 font-[family-name:var(--font-timer)] text-sm font-medium text-cream-figma/95 transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-cream-figma/60 focus-visible:outline-none",
    navLinkActive:
        "inline-flex min-h-11 shrink-0 items-center rounded-full bg-cream-figma px-4 font-[family-name:var(--font-timer)] text-sm font-medium text-cover-cta-fg",
    link:
        "font-[family-name:var(--font-timer)] text-sm font-medium text-cover-cta-fg underline-offset-4 hover:underline",
    metricValue:
        "font-[family-name:var(--font-timer)] text-3xl font-bold tabular-nums text-cover-cta-fg",
    code:
        "rounded-xl border-2 border-cover-cta-fg/20 bg-cream-figma px-3 py-2 font-mono text-xs break-all text-cover-cta-fg sm:text-sm",
    alert:
        "rounded-2xl border-2 border-cover-cta-fg/20 bg-white/70 px-4 py-3 font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg",
    alertSuccess:
        "rounded-2xl border-2 border-accent/40 bg-accent/20 px-4 py-3 font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg",
    error: "font-[family-name:var(--font-timer)] text-sm text-red-800",
    chip:
        "inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-cover-cta-fg/20 bg-cream-figma px-3 font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg transition-colors hover:border-cover-cta-fg/45 hover:bg-white/80",
    badge:
        "inline-flex min-h-7 shrink-0 items-center whitespace-nowrap rounded-full px-2.5 text-xs font-medium",
    badgePending:
        "inline-flex min-h-7 shrink-0 items-center whitespace-nowrap rounded-full bg-status-pending-bg px-3 py-1 text-xs font-semibold text-status-pending-fg",
    badgeResponded:
        "inline-flex min-h-7 shrink-0 items-center whitespace-nowrap rounded-full bg-accent/40 px-2.5 text-xs font-medium text-cover-cta-fg",
    badgeActive:
        "inline-flex min-h-7 shrink-0 items-center whitespace-nowrap rounded-full bg-status-active-bg px-3 py-1 text-xs font-semibold text-status-active-fg",
    badgeYou:
        "inline-flex shrink-0 items-center rounded px-2 py-0.5 text-[11px] font-semibold tracking-wide text-cover-cta-fg uppercase bg-olive-border",
    badgeDisabled:
        "inline-flex min-h-7 shrink-0 items-center whitespace-nowrap rounded-full bg-red-800/10 px-2.5 text-xs font-medium text-red-800",
    sortButton:
        "inline-flex min-h-11 items-center gap-1.5 px-4 py-3 text-left font-[family-name:var(--font-timer)] text-xs font-medium tracking-wide text-cover-cta-fg/70 uppercase transition-colors hover:text-cover-cta-fg",
} as const;

/**
 * In-page alerts / inline field errors: Figma `161:151` desktop, `161:371`
 * tablet landscape, `161:560` tablet portrait, `161:738` mobile. Do not use
 * on the public invitation.
 */
export const adminAlert = {
    root: "flex w-full items-start justify-between gap-3 rounded-lg rounded-l-[4px] border-l-4 p-3 font-[family-name:var(--font-body)] shadow-[0_4px_12px_rgba(46,45,23,0.05)] min-[834px]:items-center min-[834px]:p-4",
    success:
        "border-admin-msg-success-accent bg-admin-msg-success text-admin-msg-success-fg",
    warning:
        "border-admin-msg-warning-accent bg-admin-msg-warning text-admin-msg-warning-fg",
    error: "border-admin-msg-error-accent bg-admin-msg-error text-admin-msg-error-fg",
    info: "border-admin-msg-info-accent bg-admin-msg-info text-admin-msg-info-fg",
    body: "flex min-w-0 flex-1 items-start gap-2.5 min-[834px]:gap-3",
    icon: "relative size-5 shrink-0 overflow-clip",
    text: "flex min-w-0 flex-1 flex-col gap-0.5 min-[834px]:gap-1",
    title: "text-[13px] font-semibold leading-normal min-[834px]:text-[14px]",
    description:
        "text-[12px] font-normal leading-[1.35] min-[834px]:text-[14px] min-[834px]:leading-[1.4]",
    close:
        "inline-flex size-11 shrink-0 items-center justify-center rounded-[14px] hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-current/30 focus-visible:outline-none",
    closeIcon: "relative size-5 shrink-0 overflow-clip",
    fieldInvalid:
        "user-invalid:border-2 user-invalid:border-admin-msg-error-accent",
    fieldError:
        "font-[family-name:var(--font-body)] text-[11px] font-medium text-admin-msg-error-accent min-[834px]:text-[13px] xl:text-[12px]",
} as const;

/**
 * Admin Figma chrome + Resumen workspace: mobile `94:414`, portrait `94:232`
 * from 834px, landscape `94:34` from `lg`, desktop `91:40` from `xl`.
 * The white header / left drawer tokens are the standard admin navbar.
 * Sans UI + Times metrics. Do not use these on the public invitation.
 */
export const adminResumen = {
    sans: "font-[family-name:var(--font-body)]",
    serif: "font-[family-name:var(--font-timer)]",
    header:
        "flex w-full items-center justify-between gap-3 border-b border-admin-border bg-white px-4 py-3.5 pt-[max(0.875rem,env(safe-area-inset-top))] min-[834px]:px-8 xl:gap-6 xl:pb-4 2xl:px-12",
    brand: "font-[family-name:var(--font-timer)] text-base font-bold whitespace-nowrap text-admin-olive min-[834px]:text-lg lg:text-xl xl:text-2xl",
    brandBadge:
        "rounded-md bg-admin-wash px-1.5 py-0.5 font-[family-name:var(--font-body)] text-[9px] font-semibold tracking-wide text-admin-olive uppercase min-[834px]:px-2 min-[834px]:text-[10px] xl:text-[11px]",
    navLink:
        "inline-flex min-h-11 shrink-0 items-center rounded-[20px] px-3 font-[family-name:var(--font-body)] text-[13px] font-medium text-admin-muted transition-colors hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none xl:px-4 xl:text-sm",
    navLinkActive:
        "inline-flex min-h-11 shrink-0 items-center rounded-[20px] bg-admin-olive px-3 font-[family-name:var(--font-body)] text-[13px] font-semibold text-white xl:px-4 xl:text-sm",
    user: "max-w-[7.5rem] truncate font-[family-name:var(--font-body)] text-xs font-semibold text-admin-ink min-[834px]:max-w-36 min-[834px]:text-[13px] min-[834px]:font-medium xl:max-w-48 xl:text-sm",
    signOut:
        "hidden min-h-11 shrink-0 items-center rounded-full px-3 font-[family-name:var(--font-body)] text-[13px] font-medium text-admin-muted transition-colors hover:text-admin-ink focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none lg:inline-flex xl:text-sm",
    headerNav:
        "hidden min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto lg:flex xl:gap-1",
    menuButton:
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-admin-olive hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none lg:hidden",
    newFamilyFabLayer: "admin-new-family-fab-layer",
    newFamilyFab:
        "admin-new-family-fab pointer-events-auto inline-flex size-14 items-center justify-center rounded-full bg-admin-olive font-[family-name:var(--font-timer)] text-3xl leading-none text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none active:scale-[0.98]",
    banner:
        "flex flex-col gap-4 bg-[linear-gradient(34deg,var(--admin-olive)_25%,var(--admin-olive-end)_75%)] px-[18px] py-[18px] min-[834px]:gap-5 min-[834px]:bg-[linear-gradient(13.5deg,var(--admin-olive)_25%,var(--admin-olive-end)_75%)] min-[834px]:px-8 min-[834px]:py-7 lg:flex-row lg:items-center lg:justify-between lg:bg-[linear-gradient(8.5deg,var(--admin-olive)_25%,var(--admin-olive-end)_75%)] xl:gap-6 xl:bg-[linear-gradient(6.7deg,var(--admin-olive)_25%,var(--admin-olive-end)_75%)] xl:py-10 2xl:px-12",
    overline:
        "font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.08em] text-accent uppercase min-[834px]:text-[11px] xl:text-xs",
    bannerTitle:
        "font-[family-name:var(--font-timer)] text-2xl leading-tight font-bold text-white min-[834px]:text-[28px] xl:text-[clamp(1.75rem,2.4vw,2.25rem)]",
    bannerBody:
        "font-[family-name:var(--font-body)] text-xs leading-[1.4] text-admin-wash min-[834px]:text-[13px] xl:text-sm",
    bannerActions:
        "flex w-full flex-col gap-2.5 min-[834px]:flex-row min-[834px]:gap-3 lg:w-auto lg:shrink-0 xl:gap-4",
    deadlineChip:
        "inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-center font-[family-name:var(--font-body)] text-xs font-semibold text-white min-[834px]:w-auto min-[834px]:flex-1 min-[834px]:rounded-[10px] lg:flex-none xl:rounded-xl xl:px-4 xl:py-2.5 xl:text-sm",
    downloadCta:
        "inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-ink shadow-[0_4px_4px_rgba(0,0,0,0.06)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none min-[834px]:w-auto min-[834px]:flex-1 min-[834px]:rounded-[10px] lg:flex-none xl:gap-2 xl:rounded-xl xl:px-5 xl:py-3 xl:text-sm",
    workspace:
        "flex flex-col gap-4 px-4 pb-6 pt-4 min-[834px]:gap-6 min-[834px]:px-8 min-[834px]:pb-8 min-[834px]:pt-6 xl:gap-8 xl:pb-16 xl:pt-8 2xl:px-12",
    actionStack:
        "flex w-full flex-col gap-5 lg:flex-row lg:items-start xl:gap-6",
    actionMain:
        "flex min-w-0 w-full flex-1 flex-col gap-5 xl:gap-6",
    kpiGrid: "grid grid-cols-1 gap-4 min-[834px]:grid-cols-2 xl:grid-cols-4 xl:gap-6",
    statsGrid:
        "grid w-full grid-cols-1 gap-3 min-[834px]:grid-cols-2 min-[834px]:gap-4 lg:grid-cols-3 xl:gap-6",
    busGrid: "grid w-full grid-cols-1 gap-3 min-[834px]:grid-cols-2 min-[834px]:gap-4 xl:gap-6",
    busCard:
        "flex min-w-0 w-full flex-col gap-2.5 rounded-xl border border-admin-border bg-admin-canvas p-4 transition-opacity hover:opacity-90 min-[834px]:gap-3 min-[834px]:rounded-2xl min-[834px]:p-6 xl:rounded-[16px]",
    busValue:
        "font-[family-name:var(--font-timer)] text-[32px] leading-none font-bold tabular-nums text-admin-ink min-[834px]:text-[36px] xl:text-[48px]",
    statsValue:
        "font-[family-name:var(--font-timer)] text-[32px] leading-none font-bold tabular-nums text-admin-ink min-[834px]:text-[36px] xl:text-[40px]",
    statsGaugeValue:
        "font-[family-name:var(--font-timer)] text-[22px] leading-none font-bold tabular-nums text-admin-olive min-[834px]:text-[24px] xl:text-[28px]",
    analyticsOverlineStacked: "flex flex-col gap-1 lg:hidden",
    analyticsOverlineInline: "hidden flex-wrap items-center gap-2 lg:flex",
    analyticsBannerLead: "flex min-w-0 flex-col gap-2.5 min-[834px]:gap-2",
    analyticsBannerTitle:
        "font-[family-name:var(--font-timer)] text-[26px] leading-tight font-bold text-white min-[834px]:text-[28px] xl:text-[clamp(1.75rem,2.4vw,2.25rem)]",
    analyticsBannerBody:
        "font-[family-name:var(--font-body)] text-[13px] leading-[1.4] text-admin-wash xl:text-sm",
    analyticsRateStack:
        "flex w-full flex-col gap-4 min-[834px]:gap-5 xl:gap-6",
    analyticsRateRow: "flex min-w-0 flex-col gap-2 min-[834px]:gap-3",
    analyticsRateHead:
        "flex min-w-0 flex-col gap-1 min-[834px]:flex-row min-[834px]:items-baseline min-[834px]:justify-between min-[834px]:gap-4",
    analyticsRateTitle:
        "font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-ink min-[834px]:text-[14px] xl:text-[15px]",
    analyticsRateHint:
        "font-[family-name:var(--font-body)] text-[11px] text-admin-muted min-[834px]:text-xs xl:text-[13px]",
    analyticsCardLabel:
        "font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.06em] text-admin-muted uppercase lg:text-xs",
    kpiCard:
        "flex min-w-0 flex-1 flex-col gap-2 rounded-[14px] border border-admin-border bg-white p-4 shadow-[0_4px_6px_rgba(95,100,70,0.02)] transition-opacity hover:opacity-90 min-[834px]:gap-2.5 min-[834px]:rounded-2xl min-[834px]:p-5 xl:gap-3 xl:rounded-[20px] xl:p-6",
    kpiLabel:
        "font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.06em] text-admin-muted uppercase min-[834px]:text-[11px] lg:text-xs",
    kpiValue:
        "font-[family-name:var(--font-timer)] text-[32px] leading-none font-bold tabular-nums text-admin-ink xl:text-[40px]",
    kpiPill:
        "rounded-full bg-admin-wash px-2 py-1 font-[family-name:var(--font-body)] text-[10px] font-semibold text-admin-olive min-[834px]:text-[11px] xl:text-xs",
    kpiFootnote:
        "font-[family-name:var(--font-body)] text-[11px] text-admin-muted min-[834px]:text-xs xl:text-[13px]",
    panel:
        "flex w-full flex-col gap-4 rounded-2xl border border-admin-border bg-white p-[18px] min-[834px]:gap-5 min-[834px]:rounded-[20px] min-[834px]:p-6 xl:gap-7 xl:rounded-3xl xl:p-8",
    eyebrow:
        "font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.06em] text-admin-olive uppercase min-[834px]:text-[11px] xl:text-xs",
    panelTitle:
        "font-[family-name:var(--font-timer)] text-base leading-tight font-bold text-admin-ink min-[834px]:text-lg xl:text-[22px]",
    muted: "font-[family-name:var(--font-body)] text-[11px] text-admin-muted min-[834px]:text-xs xl:text-sm",
    tagWarn:
        "rounded-md bg-admin-tag px-2 py-1 font-[family-name:var(--font-body)] text-[10px] font-semibold text-admin-tag-fg min-[834px]:px-2.5 min-[834px]:text-[11px] xl:text-xs",
    tagReady:
        "rounded-md bg-admin-wash px-2 py-1 font-[family-name:var(--font-body)] text-[10px] font-semibold text-admin-olive min-[834px]:px-2.5 min-[834px]:text-[11px] xl:text-xs",
    gaugeValue:
        "font-[family-name:var(--font-timer)] text-[18px] leading-none font-bold tabular-nums text-admin-olive min-[834px]:text-[22px] xl:text-[28px]",
    row:
        "flex min-h-11 items-center gap-2.5 border-b border-admin-canvas px-3 py-3 last:border-0 min-[834px]:gap-3.5 min-[834px]:px-4 xl:gap-4 xl:py-3.5",
    rowList: "overflow-hidden rounded-[10px] border border-admin-border bg-white min-[834px]:rounded-2xl",
    countBadge:
        "rounded-md bg-admin-wash px-1.5 py-1 font-[family-name:var(--font-body)] text-[9px] font-semibold whitespace-nowrap text-admin-olive min-[834px]:px-2 min-[834px]:text-[11px] xl:px-2.5 xl:text-xs",
    attentionCard:
        "flex items-center gap-2.5 rounded-xl border border-admin-alert-border bg-admin-alert p-3 min-[834px]:gap-3 min-[834px]:rounded-[14px] min-[834px]:p-3.5 xl:gap-4 xl:rounded-2xl xl:p-[18px]",
    attentionCta:
        "inline-flex min-h-11 shrink-0 items-center rounded-md border border-admin-alert-border bg-white px-2 font-[family-name:var(--font-body)] text-[10px] font-semibold text-admin-alert-cta min-[834px]:px-2.5 min-[834px]:text-[11px] xl:rounded-lg xl:px-3 xl:text-xs",
    summaryBox:
        "flex flex-col gap-1.5 rounded-[10px] bg-admin-wash p-3 min-[834px]:gap-2 min-[834px]:rounded-xl min-[834px]:p-4 xl:gap-3 xl:rounded-2xl xl:p-5",
    drawerScrim:
        "absolute inset-0 touch-none bg-admin-ink/65 transition-opacity duration-300 ease-out motion-reduce:transition-none",
    drawerPanel:
        "absolute inset-y-0 left-0 flex w-[290px] max-w-[85vw] flex-col justify-between border-r border-admin-border bg-admin-canvas px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[4px_0_12px_rgba(48,48,38,0.15)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    drawerBrand:
        "font-[family-name:var(--font-timer)] text-lg font-bold whitespace-nowrap text-admin-olive",
    drawerClose:
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-admin-olive hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
    drawerCloseGlyph:
        "inline-flex size-8 items-center justify-center rounded-2xl bg-admin-wash",
    drawerNavItem:
        "flex min-h-11 w-full items-center gap-3 rounded-[10px] px-4 py-3 font-[family-name:var(--font-body)] text-[15px] font-medium text-admin-ink transition-colors hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
    drawerNavItemActive:
        "flex min-h-11 w-full items-center gap-3 rounded-[10px] bg-admin-olive px-4 py-3 font-[family-name:var(--font-body)] text-[15px] font-semibold text-white",
    drawerBadge:
        "rounded-full bg-admin-border px-1.5 py-0.5 font-[family-name:var(--font-body)] text-[10px] font-semibold text-admin-muted",
    drawerSectionLabel:
        "font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-wide text-admin-muted uppercase",
    drawerQuickAction:
        "inline-flex min-h-11 w-full items-center gap-2.5 px-4 py-1 font-[family-name:var(--font-body)] text-sm font-medium text-admin-ink hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
    drawerQuickActionPrimary:
        "inline-flex min-h-11 w-full items-center gap-2.5 px-4 py-1 font-[family-name:var(--font-body)] text-sm font-semibold text-admin-olive hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
    drawerUserName:
        "font-[family-name:var(--font-body)] text-sm font-bold text-admin-ink",
    drawerUserEmail:
        "max-w-[9.5rem] truncate font-[family-name:var(--font-body)] text-[11px] text-admin-muted",
    drawerLogout:
        "inline-flex min-h-11 shrink-0 items-center gap-1 px-1 font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-logout hover:opacity-80 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
} as const;

/**
 * Admin Invitados: mobile Figma `109:372` below 834px, portrait `109:36` from 834px,
 * landscape `103:33` from `lg`, desktop `100:38` from `xl`. Do not use on the public invitation.
 */
export const adminGuests = {
    summaryStrip:
        "flex w-full items-center rounded-xl border border-admin-border bg-white p-3.5 font-[family-name:var(--font-body)] text-[13px] text-admin-muted xl:rounded-[14px] xl:p-4 xl:text-sm",
    /**
     * Filter / dropdown / chip chrome: mobile `161:29`, portrait `158:469`,
     * landscape `158:355`, desktop `158:228`. Phone in-page tabs stay a row of
     * equal pills (`mobileSubTab`), not the stacked `161:29` nav. Chevrons stay
     * the desktop 12px glyph. Control border is `--admin-control` (#d1cfc7).
     */
    filterCard:
        "relative z-10 flex w-full flex-col gap-3 overflow-visible rounded-2xl border border-admin-control bg-white p-4 min-[834px]:gap-4 min-[834px]:rounded-[20px] min-[834px]:p-6 lg:rounded-2xl lg:p-5 xl:rounded-[20px] xl:p-6",
    filterGrid: "grid gap-4 lg:grid-cols-4",
    filterCellLead: "lg:col-span-2 xl:col-span-1",
    nameFilter: "hidden xl:contents",
    filterSearch: "grid gap-1.5",
    filterSearchCompact: "relative min-w-0 flex-1",
    filterLabel:
        "font-[family-name:var(--font-body)] text-[11px] font-bold uppercase text-admin-muted",
    filterTrigger:
        "inline-flex min-h-11 w-full items-center justify-between gap-2 rounded-[10px] border border-admin-control bg-white px-[14px] py-[10px] font-[family-name:var(--font-body)] text-left text-[14px] font-medium text-admin-ink outline-none transition-[border-color,box-shadow] hover:border-admin-olive/40 focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40",
    filterTriggerOpen: "border-2 border-admin-olive hover:border-admin-olive",
    selectMenu:
        "absolute top-[calc(100%+4px)] z-20 m-0 flex max-h-[min(16rem,50vh)] w-full list-none flex-col gap-0.5 overflow-y-auto rounded-xl border border-admin-control bg-white p-1.5 font-[family-name:var(--font-body)] text-admin-ink shadow-[0_8px_20px_rgba(46,45,23,0.1)] min-[834px]:rounded-[14px] min-[834px]:p-2 min-[834px]:shadow-[0_8px_24px_rgba(46,45,23,0.1)] lg:gap-1 lg:rounded-xl xl:gap-0.5 xl:rounded-[14px]",
    selectOption:
        "flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-[14px] py-[10px] text-left font-[family-name:var(--font-body)] text-[14px] font-medium text-admin-ink outline-none transition-colors",
    selectOptionHover: "bg-admin-wash",
    selectOptionSelected: "bg-admin-select font-semibold",
    selectCheck:
        "relative size-3 shrink-0 overflow-clip min-[834px]:size-[14px]",
    selectChevron: "size-3 max-w-none shrink-0 text-admin-muted",
    filterChipRow: "flex flex-wrap items-center gap-2 pl-1 min-[834px]:gap-3 lg:pl-2 xl:pl-3",
    filterChip:
        "inline-flex min-h-11 items-center gap-1.5 rounded-full bg-admin-olive px-3 py-1.5 font-[family-name:var(--font-body)] text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none min-[834px]:gap-2 min-[834px]:text-[13px]",
    filterChipClear:
        "inline-flex min-h-11 items-center py-2 font-[family-name:var(--font-body)] text-xs font-semibold text-admin-muted underline decoration-solid underline-offset-2 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none min-[834px]:text-[13px]",
    filterChipX: "relative size-2.5 shrink-0 overflow-clip min-[834px]:size-3",
    /**
     * Search input with a leading magnifying glass. Do not use `px-*` here:
     * Tailwind `xl:px-*` would override `pl-9` and the icon would sit on the
     * placeholder (landscape + desktop).
     */
    searchBox:
        "min-h-11 w-full min-w-0 appearance-none rounded-[10px] border border-admin-control bg-white py-[10px] pr-[14px] pl-9 font-[family-name:var(--font-body)] text-[14px] font-medium text-admin-ink outline-none transition-colors placeholder:text-admin-muted focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
    searchIcon:
        "pointer-events-none absolute top-1/2 left-[14px] size-[14px] max-w-none -translate-y-1/2 text-admin-muted",
    tabBar:
        "flex w-full flex-row items-center gap-3 rounded-[20px] border border-admin-control bg-white p-3 lg:gap-2 lg:rounded-full lg:p-2 xl:gap-3 xl:rounded-[20px] xl:p-3",
    subTab:
        "inline-flex min-h-11 flex-1 items-center justify-center overflow-hidden rounded-full border border-admin-control bg-white px-5 py-2 font-[family-name:var(--font-body)] text-[13px] font-semibold text-ellipsis whitespace-nowrap text-admin-muted transition-colors hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none lg:flex-none lg:px-6 xl:flex-1 xl:px-5",
    subTabActive:
        "inline-flex min-h-11 flex-1 items-center justify-center overflow-hidden rounded-full bg-admin-olive px-5 py-2 font-[family-name:var(--font-body)] text-[13px] font-semibold text-ellipsis whitespace-nowrap text-white lg:px-6 xl:px-5",
    tableCard:
        "flex w-full flex-col overflow-hidden rounded-2xl border border-admin-border bg-white xl:rounded-[20px]",
    tableHead:
        "border-b border-admin-border bg-admin-canvas font-[family-name:var(--font-body)] text-xs font-bold tracking-wide text-admin-olive uppercase",
    sortButton:
        "inline-flex min-h-11 w-full items-center gap-1.5 px-0 py-3 text-left font-[family-name:var(--font-body)] text-xs font-bold tracking-wide text-admin-olive uppercase transition-colors hover:text-admin-ink",
    tableRow: "border-b border-admin-border last:border-0",
    tableRowSelected: "bg-accent/10",
    /**
     * List checkbox (Figma `100:38`): olive fill + white check, 18px.
     * Radius is 6px — a bit rounder than the 4px mock. Do not use accent yellow.
     */
    checkbox:
        "size-[18px] shrink-0 cursor-pointer appearance-none rounded-md border border-admin-checkbox-border bg-white bg-center bg-no-repeat checked:border-admin-olive checked:bg-admin-olive checked:[background-image:url('/admin/checkbox-check.svg')] checked:bg-[length:10px_10px] indeterminate:border-admin-olive indeterminate:bg-white indeterminate:[background-image:linear-gradient(var(--admin-olive),var(--admin-olive))] indeterminate:bg-[length:10px_2px] focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
    roleBadge:
        "rounded bg-admin-canvas px-1.5 py-0.5 font-[family-name:var(--font-body)] text-[9px] font-medium text-admin-olive uppercase xl:text-[10px]",
    cellName:
        "truncate font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-ink xl:text-sm",
    cellMuted:
        "truncate font-[family-name:var(--font-body)] text-[13px] text-admin-muted",
    cellBus:
        "font-[family-name:var(--font-body)] text-[13px] font-medium text-admin-olive",
    cellBusEmpty: "font-[family-name:var(--font-body)] text-[13px] text-admin-muted",
    familyLink:
        "font-[family-name:var(--font-body)] text-xs font-semibold text-admin-olive underline underline-offset-2 hover:opacity-80 xl:text-[13px]",
    tableFooter:
        "flex flex-wrap items-center justify-between gap-3 bg-white p-4 xl:p-5",
    pagePrev:
        "inline-flex min-h-11 items-center rounded-lg border border-admin-border bg-white px-4 py-2 font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-muted transition-colors hover:text-admin-ink focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:opacity-45",
    pageNext:
        "inline-flex min-h-11 items-center rounded-lg bg-admin-olive px-4 py-2 font-[family-name:var(--font-body)] text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:opacity-45",
    statusAttend:
        "inline-flex items-center rounded-md bg-[#eaf6ef] px-2 py-1 font-[family-name:var(--font-body)] text-xs font-semibold text-[#2e7d32] xl:px-2.5",
    statusPending:
        "inline-flex items-center rounded-md bg-[#fef3c7] px-2 py-1 font-[family-name:var(--font-body)] text-xs font-semibold text-[#d97706] xl:px-2.5",
    statusDecline:
        "inline-flex items-center rounded-md bg-[#fee2e2] px-2 py-1 font-[family-name:var(--font-body)] text-xs font-semibold text-[#b91c1c] xl:px-2.5",
    batchBar:
        "pointer-events-auto flex flex-col gap-3 rounded-2xl bg-admin-olive p-4 text-white shadow-[0_8px_12px_rgba(95,100,70,0.2)] lg:flex-row lg:items-center lg:justify-between xl:p-5",
    batchGhost:
        "inline-flex min-h-11 items-center rounded-lg border border-white/20 px-3 py-2 font-[family-name:var(--font-body)] text-[13px] font-medium text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none disabled:opacity-45 xl:px-3.5",
    batchClear:
        "inline-flex min-h-11 items-center rounded-lg bg-white px-3 py-2 font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-olive transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none xl:px-3.5",
    portraitBannerTitle:
        "font-[family-name:var(--font-timer)] text-[36px] leading-tight font-bold text-white",
    portraitStatGrid: "grid w-full grid-cols-4 gap-2.5",
    portraitStatCard:
        "flex min-w-0 flex-col gap-1 rounded-xl border border-admin-border bg-white p-3",
    portraitStatLabel:
        "font-[family-name:var(--font-body)] text-[10px] font-bold tracking-wide text-admin-muted uppercase",
    portraitStatValue:
        "font-[family-name:var(--font-timer)] text-2xl leading-none font-bold tabular-nums",
    portraitToolbar: "flex w-full items-center gap-3",
    portraitSort:
        "w-[11.25rem] shrink-0 gap-0",
    portraitFilterToggle:
        "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg border border-admin-olive bg-white px-4 py-2 font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-olive transition-colors hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
    portraitFilterGrid: "grid grid-cols-2 gap-4",
    mobileFilterStack: "grid gap-3",
    portraitCardGrid: "grid grid-cols-2 gap-4",
    portraitCard:
        "flex flex-col gap-3 rounded-2xl border border-admin-border bg-white p-4",
    portraitCardSelected: "bg-accent/10",
    portraitName:
        "truncate font-[family-name:var(--font-body)] text-[15px] font-bold text-admin-ink",
    portraitMeta:
        "flex min-w-0 items-baseline gap-1.5 font-[family-name:var(--font-body)] text-xs",
    portraitMetaLabel: "shrink-0 font-semibold text-admin-muted",
    portraitMetaValue: "min-w-0 truncate text-admin-ink",
    portraitFamilyBtn:
        "inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-admin-wash py-2 font-[family-name:var(--font-body)] text-xs font-semibold text-admin-olive transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
    portraitFooter:
        "flex flex-wrap items-center justify-between gap-3 py-4",
    mobileStatGrid: "grid w-full grid-cols-2 gap-2",
    mobileStatCard:
        "flex min-w-0 flex-col gap-0.5 rounded-[10px] border border-admin-border bg-white p-2.5",
    mobileStatLabel:
        "font-[family-name:var(--font-body)] text-[9px] font-bold tracking-wide text-admin-muted uppercase",
    mobileStatValue:
        "font-[family-name:var(--font-timer)] text-xl leading-none font-bold tabular-nums",
    mobileToolbar: "flex w-full flex-col gap-3",
    mobileTabRow: "flex w-full gap-1.5",
    mobileFilterToggle:
        "inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-admin-olive bg-white px-4 py-2 font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-olive transition-colors hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
    mobileSubTab:
        "inline-flex min-h-11 flex-1 items-center justify-center overflow-hidden rounded-full border border-admin-control bg-white px-3 py-2 font-[family-name:var(--font-body)] text-[11px] font-semibold text-ellipsis whitespace-nowrap text-admin-muted transition-colors hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
    mobileSubTabActive:
        "inline-flex min-h-11 flex-1 items-center justify-center overflow-hidden rounded-full border border-admin-olive bg-admin-olive px-3 py-2 font-[family-name:var(--font-body)] text-[11px] font-semibold text-ellipsis whitespace-nowrap text-white",
    mobileCardGrid: "grid grid-cols-1 gap-4",
    mobileFamilyBtn:
        "inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-admin-wash py-2 font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-olive transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
    mobileFooter: "flex flex-col items-center gap-3",
    mobilePageRow: "flex w-full gap-2",
    mobileBatchGhost:
        "inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-white/20 px-3 py-2.5 font-[family-name:var(--font-body)] text-xs font-medium text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none disabled:opacity-45",
    mobileBatchClear:
        "inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-white px-3 py-2.5 font-[family-name:var(--font-body)] text-xs font-semibold text-admin-olive transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none",
    /** Sticky batch bar sits above the shared + FAB on every viewport. */
    batchAnchor:
        "pointer-events-none sticky bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))] z-[45]",
} as const;

/**
 * Admin Familias: mobile Figma `126:29`, portrait `123:268` from 834px, landscape `117:29` from `lg`, desktop `109:645` from `xl`.
 * Reuses Invitados table/batch/card tokens; do not use on the public invitation.
 */
export const adminFamilies = {
    filterGrid: "grid gap-4 lg:grid-cols-6 xl:grid-cols-5",
    filterCellLead: "lg:col-span-3 xl:col-span-1",
    filterCellRest: "lg:col-span-2 xl:col-span-1",
    tag: "inline-flex items-center rounded px-1.5 py-0.5 font-[family-name:var(--font-body)] text-[10px] font-medium tracking-wide text-admin-olive uppercase bg-admin-wash",
    tagAlert:
        "inline-flex items-center rounded px-1.5 py-0.5 font-[family-name:var(--font-body)] text-[10px] font-medium tracking-wide text-[#b91c1c] uppercase bg-[#fee2e2]",
    slug: "truncate font-[family-name:var(--font-body)] text-xs text-admin-muted",
    statusDisabled:
        "inline-flex items-center rounded-md bg-admin-wash px-2 py-1 font-[family-name:var(--font-body)] text-xs font-semibold text-admin-olive xl:px-2.5",
    /** Figma `126:29` pending badge — gray, not the red Sin confirmar table chip. */
    cardBadge:
        "inline-flex shrink-0 items-center rounded-md px-2.5 py-1 font-[family-name:var(--font-body)] text-[11px] font-semibold",
    cardBadgeConfirmed: "bg-[#eaf6ef] text-[#2e7d32]",
    cardBadgeDeclined: "bg-[#fee2e2] text-[#b91c1c]",
    cardBadgeUnopened: "bg-[#e4e3da] text-admin-muted",
    cardBadgeDisabled: "bg-admin-wash text-admin-olive",
} as const;

/**
 * Admin Fotos: mobile Figma `128:528` below 834px, portrait `128:364` from 834px,
 * landscape `128:201` from `lg`, desktop `128:34` from `xl`.
 * Reuses Invitados batch/checkbox tokens. Do not use on the public invitation.
 */
export const adminPhotos = {
    bannerTitle:
        "font-[family-name:var(--font-timer)] text-[32px] leading-tight font-bold text-white xl:text-[clamp(1.75rem,2.4vw,2.25rem)]",
    kpiGrid: "grid w-full grid-cols-4 gap-3 xl:gap-4",
    kpiCard:
        "flex min-w-0 flex-col gap-1.5 rounded-xl border border-admin-border bg-white p-4 xl:gap-2 xl:rounded-2xl xl:p-5",
    kpiLabel:
        "font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.5px] text-admin-olive uppercase",
    kpiValue:
        "font-[family-name:var(--font-timer)] text-[28px] leading-none font-bold tabular-nums text-admin-ink xl:text-[32px]",
    kpiHint:
        "truncate font-[family-name:var(--font-body)] text-xs text-admin-muted",
    sources:
        "font-[family-name:var(--font-body)] text-[13px] font-medium text-admin-muted xl:pl-2",
    sourcesValue: "font-bold text-admin-ink",
    qrCard:
        "flex w-full flex-col gap-5 rounded-[20px] border border-admin-border bg-white p-6 xl:gap-6 xl:rounded-[24px] xl:p-8",
    qrTitle:
        "font-[family-name:var(--font-timer)] text-2xl leading-tight font-bold text-admin-ink xl:text-[28px] xl:leading-normal",
    qrBody:
        "font-[family-name:var(--font-body)] text-[13px] leading-[18px] text-admin-muted xl:text-sm xl:leading-5",
    qrMeta:
        "flex flex-row flex-wrap items-center gap-x-6 gap-y-1.5 font-[family-name:var(--font-body)] text-[13px] text-admin-ink xl:flex-col xl:items-start xl:gap-1.5 xl:text-sm",
    qrMetaValue: "font-bold text-admin-olive",
    qrPreview:
        "font-[family-name:var(--font-timer)] font-bold text-admin-ink",
    dateLabel:
        "font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-ink xl:text-xs",
    dateInput:
        "min-h-11 w-full rounded-lg border border-admin-border bg-white px-2.5 py-2.5 font-[family-name:var(--font-body)] text-[13px] text-admin-ink outline-none transition-colors placeholder:text-admin-muted focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40 xl:rounded-[10px] xl:px-3 xl:py-3 xl:text-sm",
    btnSoft:
        "inline-flex min-h-11 items-center justify-center rounded-lg border border-admin-olive bg-admin-wash px-4 py-2 font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-olive transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45 xl:rounded-[10px] xl:px-5 xl:py-2.5 xl:text-sm",
    btnOutline:
        "inline-flex min-h-11 items-center justify-center rounded-lg border border-admin-olive bg-transparent px-4 py-2 font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-olive transition-colors hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45 xl:rounded-[10px] xl:px-5 xl:py-2.5 xl:text-sm",
    btnPrimary:
        "inline-flex min-h-11 items-center justify-center rounded-lg bg-admin-olive px-4 py-2.5 font-[family-name:var(--font-body)] text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45 xl:rounded-[10px] xl:px-5 xl:py-3 xl:text-sm",
    urlBox:
        "w-full overflow-hidden rounded-lg bg-admin-wash p-3 font-[family-name:var(--font-body)] text-xs text-ellipsis whitespace-nowrap text-admin-olive xl:rounded-[10px] xl:p-3.5 xl:text-[13px]",
    qrRow: "flex w-full items-center gap-4 xl:gap-6",
    qrFrame:
        "size-[110px] shrink-0 overflow-hidden rounded-lg border border-admin-border bg-white xl:size-[180px] xl:rounded-xl",
    qrImage: "size-full object-cover",
    toast:
        "rounded-md border border-admin-alert-border bg-admin-alert p-2.5 font-[family-name:var(--font-body)] text-xs text-admin-alert-cta xl:rounded-lg xl:px-3 xl:py-3 xl:text-[13px]",
    tableCard:
        "flex w-full flex-col overflow-hidden rounded-[20px] border border-admin-border bg-white xl:rounded-[24px]",
    tableHead:
        "bg-admin-canvas font-[family-name:var(--font-body)] text-xs font-bold tracking-wide text-admin-olive uppercase",
    tableRow: "border-b border-admin-border last:border-0 even:bg-[#fafbf9]",
    colCheck: "w-[30px] p-3.5 xl:w-10 xl:p-4",
    colPreview: "w-[100px] p-3.5 xl:w-[120px] xl:p-4",
    colFile: "p-3.5 xl:p-4",
    colSource: "w-[180px] p-3.5 xl:w-[220px] xl:p-4",
    colStatus: "w-[100px] p-3.5 xl:w-[120px] xl:p-4",
    colSize: "w-[80px] p-3.5 xl:w-[100px] xl:p-4",
    colActions: "w-[220px] p-3.5 text-right xl:w-[300px] xl:p-4",
    cellPad: "p-3.5 xl:p-4",
    thumb: "h-[52px] w-[70px] rounded-md object-cover xl:h-[60px] xl:w-[80px] xl:rounded-lg",
    fileName:
        "truncate font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-ink xl:text-sm",
    fileMime: "font-[family-name:var(--font-body)] text-[11px] text-admin-muted",
    cell: "font-[family-name:var(--font-body)] text-[13px] text-admin-ink xl:text-sm",
    statusBadge: "uppercase xl:normal-case",
    statusUploaded:
        "inline-flex items-center rounded-md bg-admin-wash px-2 py-1 font-[family-name:var(--font-body)] text-[11px] font-semibold text-admin-olive uppercase xl:text-xs xl:normal-case",
    rowApprove:
        "inline-flex min-h-11 items-center justify-center rounded-md bg-admin-olive px-2.5 py-1.5 font-[family-name:var(--font-body)] text-[11px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45 xl:rounded-lg xl:px-3.5 xl:py-2 xl:text-xs",
    rowReject:
        "inline-flex min-h-11 items-center justify-center rounded-md border border-admin-olive px-2.5 py-1.5 font-[family-name:var(--font-body)] text-[11px] font-semibold text-admin-olive transition-colors hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45 xl:rounded-lg xl:px-3.5 xl:py-2 xl:text-xs",
    rowDelete:
        "inline-flex min-h-11 items-center justify-center rounded-md border border-[#d92d20] px-2.5 py-1.5 font-[family-name:var(--font-body)] text-[11px] font-semibold text-[#d92d20] transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#d92d20]/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45 xl:rounded-lg xl:px-3.5 xl:py-2 xl:text-xs",
    emptyFooter:
        "p-3 text-center font-[family-name:var(--font-body)] text-[13px] text-admin-muted italic xl:p-5 xl:text-sm",
    actionsRow: "flex justify-end gap-1 xl:gap-2",
    portraitBannerTitle:
        "font-[family-name:var(--font-timer)] text-[36px] leading-tight font-bold text-white",
    portraitKpiGrid: "grid w-full grid-cols-4 gap-3",
    portraitKpiCard:
        "flex min-w-0 flex-col gap-1.5 rounded-xl border border-admin-border bg-white p-3.5",
    portraitKpiLabel:
        "font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.5px] text-admin-olive uppercase",
    portraitKpiValue:
        "font-[family-name:var(--font-timer)] text-2xl leading-none font-bold tabular-nums text-admin-ink",
    portraitKpiHint:
        "truncate font-[family-name:var(--font-body)] text-[11px] text-admin-muted",
    portraitSectionTitle:
        "font-[family-name:var(--font-timer)] text-[22px] leading-tight font-bold text-admin-ink",
    portraitCardGrid: "grid grid-cols-2 gap-4",
    portraitCard:
        "flex flex-col gap-4 rounded-2xl border border-admin-border bg-white p-4",
    portraitCardSelected: "bg-accent/10",
    portraitThumb: "h-[180px] w-full rounded-lg object-cover",
    portraitFileName:
        "min-w-0 truncate font-[family-name:var(--font-body)] text-[15px] font-bold text-admin-ink",
    portraitMeta:
        "font-[family-name:var(--font-body)] text-[11px] text-admin-muted",
    portraitSource:
        "flex min-w-0 flex-wrap items-baseline gap-1 font-[family-name:var(--font-body)] text-xs",
    portraitSourceLabel: "shrink-0 font-semibold text-admin-muted",
    portraitSourceValue: "min-w-0 text-admin-ink",
    portraitActionRow: "flex w-full gap-2",
    portraitApprove:
        "inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-admin-olive px-3 py-2 font-[family-name:var(--font-body)] text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    portraitReject:
        "inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-admin-olive px-3 py-2 font-[family-name:var(--font-body)] text-xs font-semibold text-admin-olive transition-colors hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    portraitDelete:
        "inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[#d92d20] px-3 py-2 font-[family-name:var(--font-body)] text-xs font-semibold text-[#d92d20] transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#d92d20]/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    mobileBannerTitle:
        "font-[family-name:var(--font-timer)] text-[28px] leading-tight font-bold text-white",
    mobileKpiGrid: "grid w-full grid-cols-2 gap-2",
    mobileKpiCard:
        "flex min-w-0 flex-col gap-1 rounded-xl border border-admin-border bg-white p-3",
    mobileKpiLabel:
        "font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.5px] text-admin-olive uppercase",
    mobileKpiValue:
        "font-[family-name:var(--font-timer)] text-[22px] leading-none font-bold tabular-nums text-admin-ink",
    mobileKpiHint:
        "truncate font-[family-name:var(--font-body)] text-[11px] text-admin-muted",
    mobileSources:
        "font-[family-name:var(--font-body)] text-xs font-medium text-admin-muted",
    mobileQrCard:
        "flex w-full flex-col gap-5 rounded-[20px] border border-admin-border bg-white p-5",
    mobileQrTitle:
        "font-[family-name:var(--font-timer)] text-[20px] leading-tight font-bold text-admin-ink",
    mobileQrSection: "flex w-full flex-col items-center gap-3",
    mobileQrFrame:
        "size-[160px] shrink-0 overflow-hidden rounded-lg border border-admin-border bg-white",
    mobileQrHint:
        "text-center font-[family-name:var(--font-body)] text-xs leading-4 text-admin-muted",
    mobileSectionTitle:
        "font-[family-name:var(--font-timer)] text-[20px] leading-tight font-bold text-admin-ink",
    mobileCardGrid: "grid grid-cols-1 gap-4",
    mobileCard:
        "flex flex-col gap-3 rounded-2xl border border-admin-border bg-white p-3",
    mobileThumb: "h-[200px] w-full rounded-lg object-cover",
    mobileFileName:
        "min-w-0 truncate font-[family-name:var(--font-body)] text-sm font-bold text-admin-ink",
    mobileApprove:
        "inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-admin-olive px-3 py-2.5 font-[family-name:var(--font-body)] text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    mobileReject:
        "inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-admin-olive px-3 py-2.5 font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-olive transition-colors hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    mobileDelete:
        "inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[#d92d20] px-3 py-2.5 font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#d92d20] transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#d92d20]/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
} as const;

const adminAdminsCard =
    "flex w-full flex-col rounded-[20px] border border-admin-border bg-white p-6 shadow-[0_4px_6px_rgba(95,100,70,0.06)] xl:rounded-3xl xl:p-8 xl:shadow-[0_4px_6px_rgba(95,100,70,0.02)]";

/**
 * Admin Admins: mobile Figma `136:29` below 834px, portrait `134:207` from 834px,
 * landscape `134:121` from `lg`, desktop `134:35` from `xl`.
 * Reuses Resumen banner/workspace. Do not use on the public invitation.
 */
export const adminAdmins = {
    bannerTitle:
        "font-[family-name:var(--font-timer)] text-[32px] leading-tight font-bold text-white xl:text-[36px]",
    card: `${adminAdminsCard} gap-5`,
    listCard: `${adminAdminsCard} gap-5 xl:gap-6`,
    pendingCard: `${adminAdminsCard} gap-4 xl:gap-5`,
    sectionLabel:
        "font-[family-name:var(--font-body)] text-[11px] font-bold tracking-wide text-admin-olive uppercase",
    inviteTitle:
        "font-[family-name:var(--font-timer)] text-[22px] leading-tight font-bold text-admin-ink xl:text-2xl",
    inviteLead:
        "font-[family-name:var(--font-body)] text-[13px] leading-normal text-admin-muted xl:text-sm",
    inviteRow: "flex w-full items-center gap-4",
    input:
        "min-h-11 w-full min-w-0 rounded-xl border border-admin-border bg-[#fdfdf8] px-4 py-3 font-[family-name:var(--font-body)] text-sm text-admin-ink outline-none transition-colors placeholder:text-admin-muted focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40 user-invalid:border-2 user-invalid:border-admin-msg-error-accent",
    inviteBtn:
        "inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-admin-olive px-6 py-3 font-[family-name:var(--font-body)] text-sm font-semibold text-white shadow-[0_2px_2px_rgba(95,100,70,0.08)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    empty: "py-2 font-[family-name:var(--font-body)] text-sm text-admin-muted xl:py-4",
    row: "flex w-full items-center border-b border-admin-border p-4 last:border-0",
    emailCol: "flex min-w-0 flex-1 items-center gap-2",
    email:
        "min-w-0 truncate font-[family-name:var(--font-body)] text-sm font-semibold text-admin-ink xl:overflow-visible xl:text-clip xl:whitespace-normal xl:break-all",
    youBadge:
        "inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-[family-name:var(--font-body)] text-[10px] font-bold text-admin-olive uppercase bg-admin-wash",
    accessCol: "flex w-[240px] shrink-0 items-center xl:w-[320px]",
    access:
        "font-[family-name:var(--font-body)] text-[13px] leading-normal text-admin-muted",
    accessValue: "font-medium text-admin-ink xl:text-admin-muted",
    statusCol: "flex w-[100px] shrink-0 items-center",
    statusActive:
        "inline-flex items-center rounded-full bg-status-active-bg px-2.5 py-1 font-[family-name:var(--font-body)] text-xs font-semibold text-status-active-fg",
    statusPending:
        "inline-flex items-center rounded-full bg-status-pending-bg px-2.5 py-1 font-[family-name:var(--font-body)] text-xs font-semibold text-status-pending-fg",
    statusExpired:
        "inline-flex items-center rounded-full bg-admin-tag px-2.5 py-1 font-[family-name:var(--font-body)] text-xs font-semibold text-admin-tag-fg",
    actionCol: "flex w-[140px] shrink-0 items-center justify-end",
    pendingActionCol:
        "flex min-w-[140px] shrink-0 items-center justify-end gap-2",
    deleteBtn:
        "inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-[#f1bfa8] bg-[#fdede6] px-3.5 py-2 font-[family-name:var(--font-body)] text-xs font-semibold text-[#9f3804] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#9f3804]/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
    disabledBtn:
        "inline-flex min-h-11 shrink-0 cursor-not-allowed items-center justify-center rounded-lg bg-[#efefe9] px-3.5 py-2 font-[family-name:var(--font-body)] text-xs font-medium text-[#9c9c8f]",
    resendBtn:
        "inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-admin-olive px-3.5 py-2 font-[family-name:var(--font-body)] text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    cancelBtn:
        "inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-admin-border bg-admin-wash px-3.5 py-2 font-[family-name:var(--font-body)] text-xs font-semibold text-admin-muted transition-colors hover:bg-admin-canvas focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    notice: "font-[family-name:var(--font-body)] text-sm text-admin-muted",
    error: "font-[family-name:var(--font-body)] text-sm text-red-800",
    portraitInviteRow: "flex w-full flex-col gap-3",
    portraitInviteBtn:
        "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-admin-olive px-6 py-3 font-[family-name:var(--font-body)] text-sm font-semibold text-white shadow-[0_2px_2px_rgba(95,100,70,0.08)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    portraitList: "flex w-full flex-col gap-4",
    portraitRow:
        "flex w-full flex-col gap-3 rounded-xl border border-admin-border p-4",
    portraitRowHeader: "flex w-full min-w-0 items-center justify-between gap-3",
    portraitEmailGroup: "flex min-w-0 flex-1 items-center gap-2",
    portraitDeleteBtn:
        "inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[#f1bfa8] bg-[#fdede6] px-3.5 py-2 font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#9f3804] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#9f3804]/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
    portraitDisabledBtn:
        "inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-lg bg-[#efefe9] px-3.5 py-2 font-[family-name:var(--font-body)] text-[13px] font-medium text-[#9c9c8f]",
    portraitPendingActions: "flex w-full flex-col gap-2",
    portraitResendBtn:
        "inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-admin-olive px-3.5 py-2 font-[family-name:var(--font-body)] text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    portraitCancelBtn:
        "inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-admin-border bg-admin-wash px-3.5 py-2 font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-muted transition-colors hover:bg-admin-canvas focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    mobileBannerTitle:
        "font-[family-name:var(--font-timer)] text-[28px] leading-tight font-bold text-white",
    mobileCard:
        "flex w-full flex-col gap-4 rounded-2xl border border-admin-border bg-white p-5 shadow-[0_4px_6px_rgba(95,100,70,0.06)]",
    mobilePendingCard:
        "flex w-full flex-col gap-3 rounded-2xl border border-admin-border bg-white p-5 shadow-[0_4px_6px_rgba(95,100,70,0.06)]",
    mobileInviteTitle:
        "font-[family-name:var(--font-timer)] text-[20px] leading-tight font-bold text-admin-ink",
    mobileInput:
        "min-h-11 w-full min-w-0 rounded-[10px] border border-admin-border bg-[#fdfdf8] px-4 py-3 font-[family-name:var(--font-body)] text-sm text-admin-ink outline-none transition-colors placeholder:text-admin-muted focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40 user-invalid:border-2 user-invalid:border-admin-msg-error-accent",
    mobileInviteBtn:
        "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-admin-olive py-3 font-[family-name:var(--font-body)] text-sm font-semibold text-white shadow-[0_2px_2px_rgba(95,100,70,0.08)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    mobileList: "flex w-full flex-col gap-3",
    mobileRow:
        "flex w-full flex-col gap-3 rounded-xl border border-admin-border bg-white p-3.5",
    mobileEmailGroup:
        "flex min-w-0 max-w-[220px] flex-1 items-center gap-2",
    mobileEmail:
        "min-w-0 truncate font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-ink",
    mobileYouBadge:
        "inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-[family-name:var(--font-body)] text-[9px] font-bold text-admin-olive uppercase bg-admin-wash",
    mobileAccess:
        "font-[family-name:var(--font-body)] text-xs leading-normal text-admin-muted",
    mobileStatusActive:
        "inline-flex items-center rounded-full bg-status-active-bg px-2.5 py-1 font-[family-name:var(--font-body)] text-[11px] font-semibold text-status-active-fg",
    mobileStatusPending:
        "inline-flex items-center rounded-full bg-status-pending-bg px-2.5 py-1 font-[family-name:var(--font-body)] text-[11px] font-semibold text-status-pending-fg",
    mobileStatusExpired:
        "inline-flex items-center rounded-full bg-admin-tag px-2.5 py-1 font-[family-name:var(--font-body)] text-[11px] font-semibold text-admin-tag-fg",
    mobileDisabledBtn:
        "inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-lg bg-[#efefe9] py-2.5 font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#9c9c8f]",
    mobileDeleteBtn:
        "inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[#f1bfa8] bg-[#fdede6] py-2.5 font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#9f3804] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#9f3804]/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
    mobileEmpty: "py-2 font-[family-name:var(--font-body)] text-[13px] text-admin-muted",
} as const;

/**
 * Admin family detail: mobile Figma `144:245` below 834px, portrait `144:29`
 * from 834px, landscape `143:29` from `lg`, desktop `137:34` from `xl`.
 * Reuses Resumen banner. Do not use on the public invitation.
 */
export const adminFamilyDetail = {
    mobileRoot: "min-[834px]:hidden",
    mobileWorkspace: "flex w-full flex-col gap-4 px-4 pb-4 pt-4",
    mobileBannerTitle:
        "min-w-0 font-[family-name:var(--font-timer)] text-[22px] leading-tight font-bold text-white",
    mobileBackBtn:
        "inline-flex size-7 shrink-0 items-center justify-center rounded-[14px] bg-white/15 text-white transition-colors hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none",
    mobileOverline:
        "font-[family-name:var(--font-body)] text-[9px] font-semibold tracking-[0.08em] text-accent uppercase",
    mobileCard:
        "flex w-full flex-col gap-4 rounded-[12px] bg-white p-5 shadow-[0_2px_4px_rgba(0,0,0,0.06)]",
    mobileCardCompact:
        "flex w-full flex-col gap-3.5 rounded-[12px] bg-white p-5 shadow-[0_2px_4px_rgba(0,0,0,0.06)]",
    mobileCardDanger:
        "flex w-full flex-col gap-4 rounded-[12px] bg-[#fdede6] p-5",
    mobileStatusGrid: "flex w-full flex-col gap-3",
    mobileStatusPair: "flex w-full items-start gap-3",
    mobileStatusCell: "flex min-w-0 flex-1 flex-col gap-1",
    mobileStatusLabel:
        "font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-wide text-admin-muted uppercase",
    mobileStatusValue:
        "font-[family-name:var(--font-body)] text-[13px] font-medium text-admin-ink",
    mobileLinkActions: "flex w-full flex-col gap-2",
    mobileBtn: "rounded-lg text-[13px]",
    mobileFieldLabel:
        "font-[family-name:var(--font-body)] text-xs font-semibold text-admin-ink",
    mobileGuestFieldLabel:
        "font-[family-name:var(--font-body)] text-[11px] font-semibold text-admin-ink",
    mobileGuestContact:
        "flex w-full min-w-0 items-start gap-2",
    mobileRegenerateTitle:
        "font-[family-name:var(--font-timer)] text-base font-bold text-admin-ink",
    mobileDangerTitle:
        "font-[family-name:var(--font-timer)] text-base font-bold text-[#9f3804]",
    portraitRoot: "hidden min-[834px]:block lg:hidden",
    portraitWorkspace:
        "flex w-full flex-col gap-6 px-6 pb-12 pt-6",
    portraitBannerTitle:
        "min-w-0 font-[family-name:var(--font-timer)] text-[30px] leading-tight font-bold text-white",
    portraitBackBtn:
        "inline-flex size-9 shrink-0 items-center justify-center rounded-[18px] bg-white/15 text-white transition-colors hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none",
    portraitBannerBottom:
        "flex w-full flex-wrap items-center justify-between gap-3",
    portraitCard:
        "flex w-full flex-col gap-5 rounded-[12px] bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.06)]",
    portraitCardCompact:
        "flex w-full flex-col gap-4 rounded-[12px] bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.06)]",
    portraitCardDanger:
        "flex w-full flex-col gap-5 rounded-[12px] bg-[#fdede6] p-6 shadow-[0_2px_4px_rgba(0,0,0,0.06)]",
    portraitStatusRow: "flex w-full flex-wrap items-start gap-4",
    portraitStatusCell:
        "flex min-w-[140px] flex-1 flex-col gap-1.5",
    portraitStatusCellWide:
        "flex min-w-[180px] flex-1 flex-col gap-1.5",
    portraitStatusDivider: "h-px w-full bg-admin-border",
    portraitLinkActions: "flex w-full flex-wrap items-start gap-3",
    portraitLinkBtn: "min-w-[12rem] flex-1 rounded-lg",
    portraitGuestFormRow:
        "flex w-full items-start gap-3",
    portraitGenderCol: "grid w-[150px] shrink-0 gap-2",
    portraitGuestContact: "flex w-full min-w-0 flex-wrap items-start gap-4",
    portraitTimelineDetail:
        "font-[family-name:var(--font-body)] text-[13px] text-admin-muted",
    portraitDangerTitle:
        "font-[family-name:var(--font-timer)] text-xl font-bold text-[#9f3804]",
    bannerTitle:
        "min-w-0 font-[family-name:var(--font-timer)] text-[28px] leading-tight font-bold text-white xl:text-[36px]",
    backBtn:
        "inline-flex size-8 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white transition-colors hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none xl:size-9 xl:rounded-[18px]",
    deadlinePill:
        "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white px-3.5 py-2 font-[family-name:var(--font-body)] text-xs font-semibold text-white xl:gap-2 xl:px-4 xl:py-2.5 xl:text-[13px]",
    deadlineWrap:
        "flex w-[16.25rem] shrink-0 items-center justify-end xl:w-[20rem]",
    columns:
        "flex w-full flex-col gap-6 lg:flex-row lg:items-start xl:gap-8",
    leftCol: "flex min-w-0 w-full flex-col gap-6 lg:flex-1",
    rightCol: "flex w-full flex-col gap-6 lg:w-[22.25rem] lg:shrink-0 xl:w-[28rem]",
    card:
        "flex w-full flex-col gap-5 rounded-[20px] bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.06)] xl:gap-6 xl:rounded-[24px] xl:p-8",
    cardCompact:
        "flex w-full flex-col gap-3 rounded-[20px] bg-white p-5 shadow-[0_2px_4px_rgba(0,0,0,0.06)] xl:gap-4 xl:rounded-[24px] xl:p-6",
    cardDanger:
        "flex w-full flex-col gap-4 rounded-[20px] bg-[#fdede6] p-6 shadow-[0_2px_4px_rgba(0,0,0,0.06)] xl:gap-5 xl:rounded-[24px] xl:p-8",
    sectionLabel:
        "font-[family-name:var(--font-body)] text-[11px] font-bold tracking-wide text-admin-olive uppercase",
    guestsSectionLabel:
        "font-[family-name:var(--font-body)] text-[11px] font-bold tracking-wide text-admin-olive uppercase xl:text-xs",
    statusGrid: "grid w-full grid-cols-3 gap-4",
    statusLabel:
        "font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-wide text-admin-muted uppercase",
    statusValue:
        "font-[family-name:var(--font-body)] text-sm font-medium text-admin-ink",
    fieldLabel:
        "font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-ink",
    input:
        "min-h-11 w-full min-w-0 rounded-lg border border-[#d1cfc7] bg-[#fdfdf8] px-4 py-3 font-[family-name:var(--font-body)] text-sm text-admin-ink outline-none transition-colors placeholder:text-admin-muted focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40 user-invalid:border-2 user-invalid:border-admin-msg-error-accent",
    textarea:
        "h-20 w-full min-w-0 resize-none rounded-lg border border-[#d1cfc7] bg-[#fdfdf8] px-4 py-3 font-[family-name:var(--font-body)] text-sm text-admin-ink outline-none transition-colors placeholder:text-admin-muted focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40 user-invalid:border-2 user-invalid:border-admin-msg-error-accent",
    select:
        "min-h-11 w-full appearance-none rounded-lg border border-[#d1cfc7] bg-[#fdfdf8] bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27none%27%3E%3Cpath d=%27M5 7.5 10 12.5 15 7.5%27 stroke=%27%235f6446%27 stroke-width=%271.6%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-[length:1rem] bg-[position:right_0.9rem_center] bg-no-repeat py-3 pl-4 pr-10 font-[family-name:var(--font-body)] text-sm text-admin-ink outline-none transition-colors focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40 user-invalid:border-2 user-invalid:border-admin-msg-error-accent",
    hint: "font-[family-name:var(--font-body)] text-xs leading-[1.4] text-admin-muted",
    checkbox:
        "size-5 shrink-0 cursor-pointer appearance-none rounded-[6px] border border-admin-border bg-white bg-center bg-no-repeat checked:border-admin-olive checked:bg-admin-olive checked:[background-image:url('/admin/checkbox-check.svg')] checked:bg-[length:10px_10px] focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
    checkboxLabel:
        "font-[family-name:var(--font-body)] text-sm font-medium text-admin-ink",
    guestRow: "grid w-full grid-cols-2 gap-3",
    btnPrimary:
        "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-admin-olive px-4 py-3 font-[family-name:var(--font-body)] text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45 xl:px-6 xl:py-3.5",
    btnSecondary:
        "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#d1cfc7] bg-white px-4 py-3 font-[family-name:var(--font-body)] text-sm font-semibold text-admin-olive transition-colors hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45 xl:px-5",
    urlBox:
        "w-full overflow-hidden rounded-lg border border-[#d1cfc7] bg-admin-canvas p-3 font-[family-name:var(--font-body)] text-xs text-ellipsis whitespace-nowrap text-admin-ink xl:text-[13px]",
    regenerateTitle:
        "font-[family-name:var(--font-timer)] text-lg font-bold text-admin-ink",
    pill:
        "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 font-[family-name:var(--font-body)] text-xs font-semibold xl:gap-1.5",
    guestPill:
        "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 font-[family-name:var(--font-body)] text-[10px] font-semibold xl:gap-1.5 xl:px-2.5 xl:py-1 xl:text-xs",
    pillConfirmed: "border-[#166500] bg-[#ebfee6] text-[#166500]",
    pillDeclined: "border-[#b91c1c] bg-[#fee2e2] text-[#b91c1c]",
    pillPending: "border-admin-border bg-admin-wash text-admin-muted",
    pillDisabled: "border-admin-olive/30 bg-admin-wash text-admin-olive",
    pillBus: "border-admin-olive bg-admin-wash text-admin-olive",
    guestName:
        "font-[family-name:var(--font-timer)] text-[15px] font-bold text-admin-ink xl:text-base",
    guestMeta: "font-[family-name:var(--font-body)] text-xs text-admin-muted xl:text-[13px]",
    guestContact:
        "hidden w-full max-w-[15rem] flex-col items-end gap-1 text-right xl:flex sm:w-[15rem]",
    guestPhone:
        "font-[family-name:var(--font-body)] text-[13px] font-medium text-admin-ink",
    guestEmail:
        "truncate font-[family-name:var(--font-body)] text-[13px] text-admin-muted",
    timelineTitle:
        "font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-ink xl:text-sm",
    timelineDetail:
        "hidden font-[family-name:var(--font-body)] text-[13px] text-admin-muted xl:block",
    timelineDate:
        "font-[family-name:var(--font-body)] text-[11px] text-admin-muted xl:w-[9.5rem] xl:shrink-0 xl:text-right xl:text-xs",
    dangerTitle:
        "font-[family-name:var(--font-timer)] text-lg font-bold text-[#9f3804] xl:text-xl",
    dangerBody:
        "font-[family-name:var(--font-body)] text-xs leading-[1.4] text-[#9f3804]/80 xl:text-[13px] xl:leading-[1.45]",
    dangerLabel:
        "font-[family-name:var(--font-body)] text-xs font-semibold text-[#9f3804]",
    dangerInput:
        "min-h-11 w-full min-w-0 rounded-lg border border-[#d1cfc7] bg-[#fdfdf8] px-4 py-3 font-[family-name:var(--font-body)] text-sm text-admin-ink outline-none transition-colors placeholder:text-admin-muted focus-visible:border-[#9f3804] focus-visible:ring-2 focus-visible:ring-[#9f3804]/30 xl:bg-white",
    dangerBtn:
        "inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#9f3804] px-4 py-3 font-[family-name:var(--font-body)] text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#9f3804]/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45 xl:px-5",
    error: "font-[family-name:var(--font-body)] text-sm text-red-800",
    success:
        "rounded-lg border border-accent/40 bg-accent/20 px-4 py-3 font-[family-name:var(--font-body)] text-sm text-admin-ink",
} as const;

/**
 * Admin nueva familia: mobile Figma `145:298` below 834px, portrait `145:228`
 * from 834px, landscape `145:151` from `lg`, desktop `145:68` from `xl`.
 * Reuses Resumen banner. Do not use on the public invitation.
 */
export const adminNewFamily = {
    desktopRoot: `hidden lg:block ${adminResumen.sans} text-admin-ink`,
    portraitRoot: `hidden min-[834px]:block lg:hidden ${adminResumen.sans} text-admin-ink`,
    mobileRoot: `min-[834px]:hidden ${adminResumen.sans} text-admin-ink`,
    bannerTitle:
        "min-w-0 font-[family-name:var(--font-timer)] text-[32px] leading-tight font-bold text-white xl:text-[36px]",
    mobileBannerTitle:
        "min-w-0 font-[family-name:var(--font-timer)] text-[28px] leading-tight font-bold text-white",
    backBtn:
        "inline-flex size-9 shrink-0 items-center justify-center rounded-[18px] bg-white/15 text-white transition-colors hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none [&_svg]:size-[18px]",
    mobileBackBtn:
        "inline-flex size-8 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white transition-colors hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none",
    mobileBannerBody:
        "font-[family-name:var(--font-body)] text-[13px] leading-[1.4] text-white/85",
    workspace:
        "flex w-full flex-col items-center px-8 pb-12 pt-8 xl:pb-16 xl:pt-12 2xl:px-12",
    portraitWorkspace:
        "flex w-full flex-col items-center px-8 pb-16 pt-8",
    mobileWorkspace: "flex w-full flex-col items-start px-4 pb-12 pt-6",
    card: "flex w-full max-w-[640px] flex-col gap-6 rounded-[12px] bg-white p-8 shadow-[0_8px_12px_rgba(0,0,0,0.06)] xl:gap-7 xl:p-10",
    portraitCard:
        "flex w-full flex-col gap-6 rounded-[12px] bg-white p-8 shadow-[0_8px_12px_rgba(0,0,0,0.06)]",
    mobileCard:
        "flex w-full flex-col gap-6 rounded-[12px] bg-white p-5 shadow-[0_8px_8px_rgba(48,48,38,0.08)]",
    fieldLabel:
        "font-[family-name:var(--font-body)] text-sm font-semibold text-admin-ink",
    guestLabel:
        "font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-ink",
    input: adminFamilyDetail.input,
    textarea:
        "h-20 w-full min-w-0 resize-none rounded-lg border border-[#d1cfc7] bg-[#fdfdf8] px-4 py-3 font-[family-name:var(--font-body)] text-sm text-admin-ink outline-none transition-colors placeholder:text-admin-muted focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40 xl:h-[100px] user-invalid:border-2 user-invalid:border-admin-msg-error-accent",
    portraitTextarea:
        "h-[100px] w-full min-w-0 resize-none rounded-lg border border-[#d1cfc7] bg-[#fdfdf8] px-4 py-3 font-[family-name:var(--font-body)] text-sm text-admin-ink outline-none transition-colors placeholder:text-admin-muted focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40",
    mobileTextarea:
        "h-[90px] w-full min-w-0 resize-none rounded-lg border border-[#d1cfc7] bg-[#fdfdf8] px-4 py-3 font-[family-name:var(--font-body)] text-sm text-admin-ink outline-none transition-colors placeholder:text-admin-muted focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40",
    select: adminFamilyDetail.select,
    guestRow: "flex w-full items-start gap-4",
    guestNameCol: "grid min-w-0 flex-1 gap-2",
    guestGenderCol: "grid w-40 shrink-0 gap-2",
    mobileGuestRow: "flex w-full flex-col gap-3",
    mobileGuestGenderCol: "grid w-full gap-2",
    guestsDivider: "h-px w-full bg-admin-border",
    guestsTitle:
        "font-[family-name:var(--font-body)] text-base font-bold text-admin-olive",
    mobileGuestsTitle:
        "font-[family-name:var(--font-timer)] text-[20px] font-bold text-admin-olive",
    guestsHint:
        "font-[family-name:var(--font-body)] text-[13px] leading-[1.4] text-admin-muted xl:text-xs",
    mobileGuestsHint:
        "font-[family-name:var(--font-body)] text-xs leading-[1.4] text-admin-muted",
    messageOptional:
        "font-[family-name:var(--font-body)] text-sm font-normal italic text-admin-muted",
    btnPrimary:
        "inline-flex h-12 min-h-11 w-full items-center justify-center rounded-[12px] bg-admin-olive px-6 py-3.5 font-[family-name:var(--font-body)] text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    btnSecondary:
        "inline-flex h-12 min-h-11 w-full items-center justify-center rounded-[12px] border border-[#d1cfc7] bg-white px-6 py-3.5 font-[family-name:var(--font-body)] text-sm font-semibold text-admin-olive transition-colors hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    error: adminFamilyDetail.error,
    success: adminFamilyDetail.success,
} as const;

/**
 * Admin login: mobile Figma `152:29` below 834px, portrait `151:30` from 834px,
 * landscape `149:29` from `lg`, desktop `145:364` from `xl`.
 * Desktop recovery uses Figma `153:34` from `xl`; landscape recovery uses `153:57` from `lg`;
 * portrait recovery uses `153:80` from 834px; mobile recovery uses `153:103` below 834px.
 * Do not use on the public invitation.
 */
export const adminLogin = {
    desktopRoot:
        `relative hidden min-h-full w-full flex-1 flex-col items-center justify-center bg-admin-canvas px-10 py-10 lg:flex ${adminResumen.sans} text-admin-ink`,
    portraitRoot:
        `hidden min-h-full w-full flex-1 flex-col justify-between bg-admin-canvas px-16 pt-12 pb-10 min-[834px]:flex lg:hidden ${adminResumen.sans} text-admin-ink`,
    portraitResetRoot:
        `relative hidden min-h-full w-full flex-1 flex-col items-center justify-center bg-admin-canvas min-[834px]:flex lg:hidden ${adminResumen.sans} text-admin-ink`,
    mobileRoot:
        `flex min-h-full w-full min-w-0 flex-1 flex-col items-center justify-between bg-admin-canvas px-4 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] min-[834px]:hidden ${adminResumen.sans} text-admin-ink`,
    brand: "absolute top-10 left-12 flex items-center gap-2 xl:top-12 xl:left-16",
    resetBrand:
        "absolute top-9 left-12 flex items-center gap-2 xl:top-12 xl:left-16",
    portraitBrand: "flex w-full items-center gap-2",
    portraitResetBrand: "absolute top-12 left-12 flex items-center gap-2",
    mobileBrand: "flex w-full flex-col items-center gap-1 text-center",
    mobileResetBrand:
        "flex w-full items-center justify-center gap-2 pb-6 text-center",
    brandNames:
        "font-[family-name:var(--font-timer)] text-[18px] font-bold whitespace-nowrap text-admin-olive xl:text-[20px]",
    resetBrandNames:
        "font-[family-name:var(--font-timer)] text-[20px] font-bold whitespace-nowrap text-admin-olive",
    portraitBrandNames:
        "font-[family-name:var(--font-timer)] text-[22px] font-bold whitespace-nowrap text-admin-olive",
    portraitResetBrandNames:
        "font-[family-name:var(--font-timer)] text-[20px] font-bold whitespace-nowrap text-admin-olive",
    mobileBrandNames:
        "font-[family-name:var(--font-timer)] w-full text-[24px] font-bold text-admin-olive",
    mobileResetBrandNames:
        "font-[family-name:var(--font-timer)] text-[20px] font-bold whitespace-nowrap text-admin-olive",
    brandBadge:
        "font-[family-name:var(--font-body)] text-[14px] font-medium whitespace-nowrap text-admin-muted xl:text-xs",
    resetBrandBadge:
        "font-[family-name:var(--font-body)] text-[14px] font-medium whitespace-nowrap text-admin-muted",
    mobileBrandBadge:
        "font-[family-name:var(--font-body)] w-full text-[14px] font-medium text-admin-muted",
    portraitCardWrap:
        "flex min-h-0 w-full flex-1 flex-col items-center justify-center",
    card: "flex w-[460px] max-w-full flex-col gap-8 rounded-[24px] bg-white px-12 py-14 shadow-[0_16px_16px_rgba(95,100,70,0.08)] lg:w-[420px] lg:gap-7 lg:rounded-[20px] lg:px-9 lg:py-12 xl:w-[460px] xl:gap-8 xl:rounded-[24px] xl:px-12 xl:py-14",
    resetCard:
        "flex w-[460px] max-w-full flex-col gap-8 rounded-[24px] bg-white px-12 py-14 shadow-[0_16px_16px_rgba(95,100,70,0.08)] lg:w-[440px] lg:gap-7 lg:rounded-[24px] lg:px-10 lg:py-[52px] xl:w-[460px] xl:gap-8 xl:rounded-[24px] xl:px-12 xl:py-14",
    mobileCard:
        "flex w-full flex-col gap-7 rounded-[24px] bg-white px-6 py-9 shadow-[0_16px_16px_rgba(95,100,70,0.08)]",
    mobileResetCard:
        "flex w-full flex-col gap-7 rounded-[24px] bg-white px-6 py-10 shadow-[0_16px_16px_rgba(95,100,70,0.08)]",
    header: "flex w-full flex-col gap-3 lg:gap-2.5 xl:gap-3",
    resetHeader: "flex w-full flex-col gap-3",
    mobileHeader: "flex w-full flex-col gap-2",
    mobileResetHeader: "flex w-full flex-col gap-2.5",
    eyebrow:
        "font-[family-name:var(--font-body)] text-xs font-bold tracking-[1.5px] text-admin-muted uppercase lg:tracking-normal xl:tracking-[1.5px]",
    resetEyebrow:
        "font-[family-name:var(--font-body)] text-xs font-bold text-admin-muted uppercase lg:tracking-[1.5px]",
    mobileEyebrow:
        "font-[family-name:var(--font-body)] text-[11px] font-bold text-admin-muted uppercase",
    title: "font-[family-name:var(--font-timer)] text-[36px] leading-[1.2] font-bold text-admin-ink lg:text-[32px] xl:text-[36px]",
    mobileTitle:
        "font-[family-name:var(--font-timer)] text-[28px] leading-[1.2] font-bold text-admin-ink",
    lead: "font-[family-name:var(--font-body)] text-sm leading-[1.5] text-admin-muted lg:text-[13px] xl:text-sm",
    resetLead:
        "font-[family-name:var(--font-body)] text-sm leading-[1.5] text-admin-muted",
    mobileLead:
        "font-[family-name:var(--font-body)] text-[13px] leading-[1.4] text-admin-muted",
    mobileResetLead:
        "font-[family-name:var(--font-body)] text-sm leading-[1.5] text-admin-muted",
    form: "flex w-full flex-col gap-5 lg:gap-4 xl:gap-5",
    fields: "flex w-full flex-col gap-5 lg:gap-4 xl:gap-5",
    resetFields: "flex w-full flex-col gap-6 lg:gap-5 xl:gap-6",
    resetExplanation:
        "font-[family-name:var(--font-body)] text-sm leading-[1.6] text-admin-muted",
    mobileFields: "flex w-full flex-col gap-4",
    mobileResetFields: "flex w-full flex-col gap-5",
    field: "flex w-full flex-col gap-2",
    mobileField: "flex w-full flex-col gap-1.5",
    label: "font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-ink",
    mobileLabel:
        "font-[family-name:var(--font-body)] text-xs font-semibold text-admin-ink",
    input: "h-[46px] min-h-11 w-full rounded-[12px] border border-[#d1cfc7] bg-white px-4 py-3 font-[family-name:var(--font-body)] text-sm text-admin-ink outline-none transition-colors placeholder:text-admin-muted focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40",
    mobileInput:
        "h-11 min-h-11 w-full rounded-[12px] border border-[#d1cfc7] bg-white px-3.5 py-3 font-[family-name:var(--font-body)] text-sm text-admin-ink outline-none transition-colors placeholder:text-admin-muted focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40",
    passwordWrap: "relative w-full overflow-visible",
    passwordInput:
        "h-[46px] min-h-11 w-full rounded-[12px] border border-[#d1cfc7] bg-white py-3 pr-12 pl-4 font-[family-name:var(--font-body)] text-sm text-admin-ink outline-none transition-colors placeholder:text-admin-muted focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40 [&::-ms-reveal]:hidden",
    mobilePasswordInput:
        "h-11 min-h-11 w-full rounded-[12px] border border-[#d1cfc7] bg-white py-3 pr-12 pl-3.5 font-[family-name:var(--font-body)] text-sm text-admin-ink outline-none transition-colors placeholder:text-admin-muted focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40 [&::-ms-reveal]:hidden",
    eyeButton:
        "absolute top-1/2 right-1 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-admin-muted transition-colors hover:bg-admin-wash focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
    eyeIcon: "pointer-events-none size-4 max-w-none overflow-visible",
    eyeImage: "size-full max-w-none overflow-visible",
    actions: "flex w-full flex-col items-center gap-4",
    resetActions: "flex w-full flex-col items-center gap-5",
    submit:
        "inline-flex h-12 min-h-11 w-full items-center justify-center rounded-[12px] bg-admin-olive py-3.5 font-[family-name:var(--font-body)] text-[15px] font-semibold text-white shadow-[0_4px_6px_rgba(95,100,70,0.14)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    mobileSubmit:
        "inline-flex h-[46px] min-h-11 w-full items-center justify-center rounded-[12px] bg-admin-olive py-3 font-[family-name:var(--font-body)] text-[15px] font-semibold text-white shadow-[0_4px_6px_rgba(95,100,70,0.14)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    forgot:
        "font-[family-name:var(--font-body)] text-[13px] font-medium text-admin-muted underline decoration-solid underline-offset-2 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
    footer:
        "absolute bottom-8 left-0 right-0 text-center font-[family-name:var(--font-body)] text-[13px] text-admin-muted xl:bottom-10 xl:text-xs",
    resetFooter:
        "absolute bottom-9 left-0 right-0 text-center font-[family-name:var(--font-body)] text-[13px] text-admin-muted xl:bottom-10",
    portraitFooter:
        "w-full text-center font-[family-name:var(--font-body)] text-[13px] text-admin-muted",
    portraitResetFooter:
        "absolute bottom-12 left-0 right-0 text-center font-[family-name:var(--font-body)] text-[13px] text-admin-muted",
    mobileFooter:
        "w-full text-center font-[family-name:var(--font-body)] text-[11px] text-admin-muted",
    mobileResetFooter:
        "w-full pt-8 text-center font-[family-name:var(--font-body)] text-xs text-admin-muted",
    error: "font-[family-name:var(--font-body)] text-sm text-red-800",
} as const;

/** Figma accept-invitation mobile `158:136` below 834px, portrait `158:103` from 834px, landscape `158:72` from `lg`, desktop `158:34` from `xl`. */
export const adminAcceptInvite = {
    desktopRoot:
        `relative hidden min-h-full w-full flex-1 flex-col items-center justify-center bg-admin-canvas px-10 py-10 lg:flex ${adminResumen.sans} text-admin-ink`,
    mobileRoot:
        `flex min-h-full w-full min-w-0 flex-1 flex-col items-center justify-between bg-admin-canvas px-4 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] min-[834px]:hidden ${adminResumen.sans} text-admin-ink`,
    mobileStack: "flex w-full flex-col items-center gap-8",
    brand: "absolute top-10 left-12 flex items-center gap-2 xl:top-12 xl:left-16",
    brandNames:
        "font-[family-name:var(--font-timer)] text-[20px] font-bold whitespace-nowrap text-admin-olive",
    brandBadge:
        "font-[family-name:var(--font-body)] text-[14px] font-medium whitespace-nowrap text-admin-muted",
    mobileBrand:
        "flex w-full flex-col items-center gap-1.5 text-center",
    mobileBrandNames:
        "font-[family-name:var(--font-timer)] w-full text-[22px] font-bold text-admin-olive",
    mobileBrandBadge:
        "font-[family-name:var(--font-body)] w-full text-[13px] font-medium text-admin-muted",
    portraitRoot:
        `hidden min-h-full w-full flex-1 flex-col justify-between bg-admin-canvas px-10 pt-16 pb-12 min-[834px]:flex lg:hidden ${adminResumen.sans} text-admin-ink`,
    portraitBrand:
        "flex w-full flex-col items-center gap-1.5 text-center",
    portraitBrandNames:
        "font-[family-name:var(--font-timer)] w-full text-[24px] font-bold text-admin-olive",
    portraitBrandBadge:
        "font-[family-name:var(--font-body)] w-full text-[13px] font-medium text-admin-muted",
    portraitCardWrap:
        "flex min-h-0 w-full flex-1 flex-col items-center justify-center",
    portraitCard:
        "flex w-[440px] max-w-full flex-col gap-7 rounded-[24px] bg-white py-12 pr-12 pl-9 shadow-[0_16px_16px_rgba(95,100,70,0.08)]",
    portraitHeader: "flex w-full flex-col gap-2.5",
    portraitTitle:
        "font-[family-name:var(--font-timer)] text-[32px] leading-[1.2] font-bold text-admin-ink",
    portraitFields: "flex w-full flex-col gap-4",
    portraitFooter:
        "w-full text-center font-[family-name:var(--font-body)] text-[13px] text-admin-muted",
    mobileCard:
        "flex w-full flex-col gap-6 rounded-[20px] bg-white p-6 shadow-[0_16px_16px_rgba(95,100,70,0.08)]",
    mobileHeader: "flex w-full flex-col gap-2",
    mobileEyebrow:
        "font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[1.5px] text-admin-muted uppercase",
    mobileTitle:
        "font-[family-name:var(--font-timer)] text-[28px] leading-[1.2] font-bold text-admin-ink",
    mobileLead:
        "font-[family-name:var(--font-body)] text-[13px] leading-[1.4] text-admin-muted",
    mobileAccountRow:
        "flex w-full min-w-0 items-center gap-1.5 font-[family-name:var(--font-body)] text-[13px] leading-normal",
    mobileFields: "flex w-full flex-col gap-4",
    mobileField: "flex w-full flex-col gap-1.5",
    mobileLabel:
        "font-[family-name:var(--font-body)] text-xs font-semibold text-admin-ink",
    mobilePasswordInput:
        "h-11 min-h-11 w-full rounded-[10px] border border-[#d1cfc7] bg-white py-2.5 pr-12 pl-3.5 font-[family-name:var(--font-body)] text-sm text-admin-ink outline-none transition-colors placeholder:text-admin-muted focus-visible:border-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40 [&::-ms-reveal]:hidden",
    mobileSubmit:
        "inline-flex h-11 min-h-11 w-full items-center justify-center rounded-[10px] bg-admin-olive py-3 font-[family-name:var(--font-body)] text-sm font-semibold text-white shadow-[0_4px_6px_rgba(95,100,70,0.14)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
    mobileFooter:
        "w-full pt-8 text-center font-[family-name:var(--font-body)] text-[11px] leading-[1.4] text-admin-muted",
    card: "flex w-[460px] max-w-full flex-col gap-8 rounded-[24px] bg-white px-12 py-14 shadow-[0_16px_16px_rgba(95,100,70,0.08)]",
    header: "flex w-full flex-col gap-3",
    eyebrow:
        "font-[family-name:var(--font-body)] text-xs font-bold tracking-[1.5px] text-admin-muted uppercase",
    title: "font-[family-name:var(--font-timer)] text-[36px] leading-[1.2] font-bold text-admin-ink",
    lead: "font-[family-name:var(--font-body)] text-sm leading-[1.5] text-admin-muted",
    form: "flex w-full flex-col gap-5",
    accountRow:
        "flex w-full min-w-0 items-center gap-1.5 font-[family-name:var(--font-body)] text-sm leading-normal",
    accountLabel: "shrink-0 font-normal text-admin-muted",
    accountEmail:
        "min-w-0 flex-1 overflow-hidden font-semibold text-ellipsis whitespace-nowrap text-admin-ink",
    fields: "flex w-full flex-col gap-5",
    field: "flex w-full flex-col gap-2",
    label: "font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-ink",
    actions: "flex w-full flex-col items-center",
    footer:
        "absolute bottom-10 left-0 right-0 text-center font-[family-name:var(--font-body)] text-sm text-admin-muted xl:text-xs",
} as const;

