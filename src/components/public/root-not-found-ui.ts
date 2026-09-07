import {adminResumen} from "@/components/admin/admin-ui";

/**
 * Public `/` + unmatched-route landing. Desktop Figma `158:168` from `xl`,
 * landscape `158:183` from `lg`, portrait `158:198` from 834px, mobile
 * `158:213` below 834px.
 */
export const rootNotFound = {
    desktopRoot:
        `relative hidden min-h-full w-full flex-1 flex-col items-center justify-between bg-admin-canvas px-16 pt-12 pb-10 xl:flex ${adminResumen.sans} text-admin-ink`,
    landscapeRoot:
        `relative hidden min-h-full w-full flex-1 flex-col items-center justify-between bg-admin-canvas px-16 pt-12 pb-10 lg:flex xl:hidden ${adminResumen.sans} text-admin-ink`,
    portraitRoot:
        `relative hidden min-h-full w-full flex-1 flex-col items-center justify-between bg-admin-canvas px-10 pt-16 pb-12 min-[834px]:flex lg:hidden ${adminResumen.sans} text-admin-ink`,
    mobileRoot:
        `flex min-h-full w-full min-w-0 flex-1 flex-col items-center justify-between bg-admin-canvas px-4 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] min-[834px]:hidden ${adminResumen.sans} text-admin-ink`,
    brand: "flex w-full items-center gap-2",
    portraitBrand: "flex w-full flex-col items-center gap-2 text-center",
    mobileBrand: "flex w-full items-center justify-center gap-2",
    brandNames:
        "font-[family-name:var(--font-timer)] text-[20px] font-bold whitespace-nowrap text-admin-olive",
    portraitBrandNames:
        "font-[family-name:var(--font-timer)] w-full text-[24px] font-bold text-admin-olive",
    mobileBrandNames:
        "font-[family-name:var(--font-timer)] text-[20px] font-bold whitespace-nowrap text-admin-olive",
    brandBadge:
        "font-[family-name:var(--font-body)] text-[14px] font-medium whitespace-nowrap text-admin-muted",
    portraitBrandBadge:
        "font-[family-name:var(--font-body)] w-full text-[14px] font-medium text-admin-muted",
    mobileBrandBadge:
        "font-[family-name:var(--font-body)] text-[13px] font-medium whitespace-nowrap text-admin-muted",
    card: "flex w-[480px] max-w-full flex-col rounded-[24px] bg-white px-12 py-14 shadow-[0_16px_16px_rgba(95,100,70,0.08)]",
    mobileCard:
        "flex w-full flex-col rounded-[20px] bg-white px-6 py-10 shadow-[0_16px_16px_rgba(95,100,70,0.08)]",
    info: "flex w-full flex-col items-center gap-4 text-center",
    mobileInfo: "flex w-full flex-col items-center gap-3 text-center",
    code: "w-full font-[family-name:var(--font-timer)] text-[96px] leading-[0.9] font-bold text-admin-olive",
    mobileCode:
        "w-full font-[family-name:var(--font-timer)] text-[80px] leading-[0.9] font-bold text-admin-olive",
    title: "w-full font-[family-name:var(--font-timer)] text-[32px] leading-[1.2] font-bold text-admin-ink",
    mobileTitle:
        "w-full font-[family-name:var(--font-timer)] text-[26px] leading-[1.2] font-bold text-admin-ink",
    body: "w-full font-[family-name:var(--font-body)] text-sm leading-[1.6] text-admin-muted",
    mobileBody:
        "w-full font-[family-name:var(--font-body)] text-[13px] leading-[1.5] text-admin-muted",
    footer:
        "w-full text-center font-[family-name:var(--font-body)] text-sm text-admin-muted",
    mobileFooter:
        "w-full text-center font-[family-name:var(--font-body)] text-xs text-admin-muted",
} as const;
