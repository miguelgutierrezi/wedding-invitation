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
        "absolute inset-0 bg-admin-ink/65 transition-opacity duration-300 ease-out motion-reduce:transition-none",
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

