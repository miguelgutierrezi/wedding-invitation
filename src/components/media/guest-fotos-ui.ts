/**
 * Guest “Comparte tus recuerdos” chrome:
 * Figma photo-upload-mobile `157:165` below 834px,
 * Figma photo-upload-tablet-portrait `157:97` from 834px,
 * Figma photo-upload-tablet-landscape `157:29` from `lg`,
 * Figma photo-upload-desktop `155:34` from `xl`.
 */

export const guestFotos = {
    root: "page-shell flex min-h-full flex-1 flex-col bg-[#f5f3eb] text-admin-ink",
    banner:
        "flex w-full shrink-0 flex-col gap-6 bg-[linear-gradient(30deg,var(--admin-olive)_25%,var(--admin-olive-end)_75%)] px-5 py-10 pt-[max(2.5rem,calc(env(safe-area-inset-top)+1.5rem))] min-[834px]:bg-[linear-gradient(19deg,var(--admin-olive)_25%,var(--admin-olive-end)_75%)] min-[834px]:px-12 min-[834px]:py-16 min-[834px]:pt-16 lg:bg-[linear-gradient(15deg,var(--admin-olive)_25%,var(--admin-olive-end)_75%)] lg:p-16 lg:pt-16 xl:gap-5 xl:bg-[linear-gradient(12deg,var(--admin-olive)_25%,var(--admin-olive-end)_75%)] xl:px-[120px] xl:py-20 xl:pt-20",
    brand: "flex items-center gap-2 whitespace-nowrap",
    brandNames:
        "font-[family-name:var(--font-display)] text-[20px] font-bold text-white min-[834px]:text-[22px] lg:text-2xl",
    brandBadge:
        "font-[family-name:var(--font-body)] text-xs font-medium text-[#eae8df] min-[834px]:text-[13px] lg:text-sm",
    titleBlock: "flex w-full flex-col gap-2.5 min-[834px]:gap-3",
    title: "font-[family-name:var(--font-display)] text-[36px] leading-[1.15] font-bold text-white min-[834px]:text-[42px] lg:text-[48px] lg:leading-[1.1] xl:text-[56px]",
    lead: "font-[family-name:var(--font-body)] text-sm leading-[1.5] text-[#eae8df] min-[834px]:text-[15px] lg:text-base",
    main: "flex w-full flex-1 flex-col px-4 pt-6 pb-16 min-[834px]:items-center min-[834px]:px-12 min-[834px]:pt-12 min-[834px]:pb-20 lg:px-16 xl:px-0 xl:pt-16 xl:pb-24",
    form: "flex w-full flex-col gap-6 min-[834px]:max-w-[640px] min-[834px]:gap-7 lg:gap-8",
    nameField: "flex w-full flex-col gap-2",
    nameLabelRow: "flex items-center justify-between gap-3",
    nameLabel:
        "font-[family-name:var(--font-body)] text-sm font-semibold text-admin-ink lg:text-[15px]",
    optionalBadge:
        "inline-flex rounded-full bg-[#d1cfc7] px-2 py-0.5 lg:px-2.5 lg:py-1 xl:px-2 xl:py-0.5",
    optionalBadgeText:
        "font-[family-name:var(--font-body)] text-[10px] font-medium tracking-wide text-admin-muted uppercase lg:text-[11px] lg:font-semibold xl:font-medium",
    nameInputWrap:
        "flex h-12 items-center gap-2.5 rounded-[12px] border border-[#d1cfc7] bg-white px-3.5 focus-within:border-admin-olive focus-within:ring-2 focus-within:ring-admin-olive/40 min-[834px]:px-4 xl:gap-2",
    nameIcon: "block size-4 max-w-none shrink-0 overflow-clip",
    nameInput:
        "h-auto min-h-0 w-full rounded-none border-0 bg-transparent px-0 py-0 font-[family-name:var(--font-body)] text-[13px] text-admin-ink placeholder:text-admin-muted outline-none focus-visible:ring-0 min-[834px]:text-sm",
    card: "flex flex-col gap-5 rounded-[20px] bg-white p-4 shadow-[0_16px_16px_rgba(95,100,70,0.06)] min-[834px]:gap-6 min-[834px]:p-6 min-[834px]:shadow-[0_12px_12px_rgba(95,100,70,0.08)] lg:rounded-[24px] lg:p-8 lg:shadow-[0_16px_16px_rgba(95,100,70,0.06)]",
    dropzone:
        "flex min-h-0 cursor-pointer flex-col items-center justify-center gap-3 rounded-[16px] border border-dashed border-admin-olive bg-[#f5f3eb] px-4 py-8 text-center font-[family-name:var(--font-body)] transition-colors hover:opacity-90 focus-within:ring-2 focus-within:ring-admin-olive/40 min-[834px]:gap-4 min-[834px]:px-6 lg:border-[1.5px] lg:py-10 xl:border",
    dropzoneActive: "border-solid bg-[rgba(95,100,70,0.12)]",
    dropzoneIconWrap:
        "flex size-11 items-center justify-center overflow-clip rounded-[22px] bg-[rgba(95,100,70,0.12)] min-[834px]:size-12 min-[834px]:rounded-[24px]",
    dropzoneIcon: "size-5 max-w-none min-[834px]:size-6",
    dropzoneText: "flex flex-col items-center gap-1",
    dropzoneTitle:
        "font-[family-name:var(--font-body)] text-[15px] font-semibold text-admin-ink min-[834px]:text-base",
    dropzoneHint:
        "font-[family-name:var(--font-body)] text-xs font-normal text-admin-muted min-[834px]:text-[13px]",
    dropzoneHintMobile: "min-[834px]:hidden",
    dropzoneHintWide: "hidden min-[834px]:block",
    helper:
        "flex items-start gap-2 font-[family-name:var(--font-body)] text-xs leading-[1.4] text-admin-muted min-[834px]:gap-2.5 min-[834px]:text-[13px] lg:gap-2",
    helperIcon:
        "mt-0.5 block size-3.5 max-w-none shrink-0 overflow-clip min-[834px]:size-4",
    progress: "flex w-full flex-col gap-2.5 lg:gap-3",
    progressHeader:
        "flex flex-col gap-1 min-[834px]:flex-row min-[834px]:items-center min-[834px]:justify-between",
    progressTitle:
        "font-[family-name:var(--font-body)] text-xs font-semibold text-admin-ink min-[834px]:text-[13px]",
    progressCountsDesktop:
        "font-[family-name:var(--font-body)] text-[11px] text-admin-muted min-[834px]:text-xs lg:text-[13px]",
    progressTrack:
        "h-1.5 overflow-hidden rounded-full bg-[#f5f3eb] min-[834px]:h-2",
    progressFill:
        "h-full rounded-full bg-admin-olive motion-safe:transition-[width] motion-safe:duration-300",
    fileList: "space-y-3",
    fileItem:
        "rounded-[10px] bg-[#f5f3eb] p-2.5 min-[834px]:rounded-[12px] min-[834px]:p-3 lg:p-4",
    fileRow: "flex items-center gap-3 lg:gap-4",
    thumb: "size-11 shrink-0 rounded-[6px] border border-[#d1cfc7] object-cover min-[834px]:size-[52px] min-[834px]:rounded-lg lg:size-14",
    thumbFallback:
        "flex size-11 shrink-0 items-center justify-center rounded-[6px] border border-[#d1cfc7] bg-[#f5f3eb] font-[family-name:var(--font-body)] text-xs text-admin-muted min-[834px]:size-[52px] min-[834px]:rounded-lg lg:size-14",
    fileMeta: "flex min-w-0 flex-1 flex-col gap-0.5 min-[834px]:gap-1",
    fileName:
        "truncate font-[family-name:var(--font-body)] text-[13px] font-semibold text-admin-ink lg:text-sm",
    fileDetailsDesktop:
        "flex items-center gap-1.5 font-[family-name:var(--font-body)] text-[11px] font-normal lg:gap-2 lg:text-xs",
    fileMime: "text-admin-muted",
    fileDot: "text-[#d1cfc7]",
    fileSize: "text-admin-muted",
    statusDesktop: "flex shrink-0 items-center gap-1",
    statusCompletedLabel: "hidden min-[834px]:block",
    statusSuccess:
        "font-[family-name:var(--font-body)] text-xs font-semibold text-[#456e3a] lg:text-[13px] xl:text-xs",
    statusDanger:
        "font-[family-name:var(--font-body)] text-xs font-semibold text-red-800 lg:text-[13px] xl:text-xs",
    statusMuted:
        "font-[family-name:var(--font-body)] text-xs font-semibold text-admin-muted lg:text-[13px] xl:text-xs",
    statusIcon: "size-[14px] max-w-none overflow-clip",
    fileProgress: "mt-2 h-1.5 overflow-hidden rounded-full bg-[#f5f3eb]",
    fileProgressFill:
        "h-full rounded-full bg-admin-olive motion-safe:transition-[width]",
    fileError:
        "mt-1 font-[family-name:var(--font-body)] text-xs text-red-800",
    fileActions: "mt-3 flex flex-wrap gap-2",
    fileAction:
        "min-h-11 rounded-full px-3 font-[family-name:var(--font-body)] text-sm text-admin-olive underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
    actions:
        "flex w-full flex-col gap-2.5 border-t border-[#d1cfc7] pt-5 min-[834px]:gap-3 min-[834px]:pt-6",
    actionsRow:
        "flex flex-col gap-2.5 min-[834px]:flex-row min-[834px]:flex-nowrap min-[834px]:items-start min-[834px]:gap-3",
    submit:
        "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-admin-olive px-4 py-3 font-[family-name:var(--font-body)] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none min-[834px]:min-h-[46px] min-[834px]:flex-1 min-[834px]:w-auto min-[834px]:py-3.5 lg:px-6 lg:text-[15px]",
    submitIcon: "block size-4 max-w-none overflow-clip",
    addMore:
        "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-admin-olive bg-transparent px-4 py-3 font-[family-name:var(--font-body)] text-sm font-semibold text-admin-olive focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none min-[834px]:min-h-[46px] min-[834px]:w-[140px] min-[834px]:shrink-0 min-[834px]:py-3.5 lg:w-[180px] lg:px-6 lg:text-[15px]",
    addMoreIcon: "block size-4 max-w-none overflow-clip",
    retry:
        "inline-flex min-h-11 w-full items-center justify-center rounded-[12px] border border-[#d1cfc7] px-4 font-[family-name:var(--font-body)] text-sm font-medium text-admin-ink focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none disabled:opacity-50",
    success:
        "flex w-full items-center gap-2.5 rounded-[12px] border border-[#9bc48f] bg-[#eaf2e8] px-4 py-3 min-[834px]:py-3.5 lg:gap-3 lg:px-5 lg:py-4",
    successIcon: "size-[18px] max-w-none shrink-0 overflow-clip lg:size-5",
    successText:
        "font-[family-name:var(--font-body)] text-[13px] font-medium text-[#456e3a] lg:text-sm",
    backLink:
        "mt-10 inline-flex min-h-11 items-center font-[family-name:var(--font-body)] text-sm text-admin-muted underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-admin-olive/40 focus-visible:outline-none",
    backWrap: "text-center",
    unavailable:
        "font-[family-name:var(--font-body)] text-base text-admin-muted",
    footer:
        "mt-auto flex w-full flex-col items-center border-t border-[#d1cfc7] px-5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] min-[834px]:px-12 min-[834px]:pb-8 lg:px-16 lg:py-10 xl:px-[120px]",
    footerText:
        "w-full text-center font-[family-name:var(--font-body)] text-xs text-admin-muted min-[834px]:text-[13px] lg:text-sm",
} as const;
