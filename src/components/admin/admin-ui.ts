/**
 * Shared visual tokens for the admin UI — aligned with invitation brand
 * (cream board, accent yellow, olive type, Times).
 */

export const admin = {
  page: "font-[family-name:var(--font-timer)] text-cover-cta-fg",
  eyebrow:
    "font-[family-name:var(--font-timer)] text-xs font-medium tracking-[0.18em] text-cover-cta-fg/70 uppercase",
  title:
    "font-[family-name:var(--font-timer)] text-[clamp(1.75rem,4vw,2.25rem)] leading-tight font-bold text-cover-cta-fg",
  titleOnAccent:
    "font-[family-name:var(--font-timer)] text-[clamp(1.75rem,4vw,2.25rem)] leading-tight font-bold text-cream-figma",
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
    "min-h-11 w-full rounded-full border-2 border-cover-cta-fg/30 bg-white/85 px-4 font-[family-name:var(--font-timer)] text-cover-cta-fg outline-none focus-visible:border-cover-cta-fg focus-visible:ring-2 focus-visible:ring-accent",
  btnPrimary:
    "inline-flex min-h-11 items-center justify-center rounded-full border-2 border-cover-cta-fg bg-accent px-5 font-[family-name:var(--font-timer)] text-sm font-medium text-cover-cta-fg transition-[transform,opacity] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
  btnSecondary:
    "inline-flex min-h-11 items-center justify-center rounded-full border-2 border-cover-cta-fg/40 bg-cream-figma/90 px-5 font-[family-name:var(--font-timer)] text-sm font-medium text-cover-cta-fg transition-[background-color,opacity] hover:bg-cream-figma focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none active:scale-[0.98]",
  btnGhost:
    "inline-flex min-h-11 items-center justify-center rounded-full px-4 font-[family-name:var(--font-timer)] text-sm font-medium text-cream-figma/95 transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-cream-figma/60 focus-visible:outline-none",
  navLink:
    "inline-flex min-h-11 items-center rounded-full px-4 font-[family-name:var(--font-timer)] text-sm font-medium text-cream-figma/95 transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-cream-figma/60 focus-visible:outline-none",
  navLinkActive:
    "inline-flex min-h-11 items-center rounded-full bg-cream-figma px-4 font-[family-name:var(--font-timer)] text-sm font-medium text-cover-cta-fg",
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
} as const;
