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
