import {ADMIN_RESUMEN_LANDSCAPE_MIN_PX, ADMIN_RESUMEN_WIDE_MIN_PX} from "@/lib/admin/admin-chrome";
import {adminCopy} from "@/lib/admin/admin-copy";
import {formatGuestsDeadlineChip} from "@/lib/admin/admin-guests-layout";

/** Figma Fotos phone `128:528` (below iPad 11" / 834px). */
export const ADMIN_PHOTOS_MOBILE_MAX_PX = ADMIN_RESUMEN_WIDE_MIN_PX - 1;

/** Figma Fotos tablet portrait `128:364` (iPad 11" / 834px). */
export const ADMIN_PHOTOS_PORTRAIT_MIN_PX = ADMIN_RESUMEN_WIDE_MIN_PX;

/** Figma Fotos tablet landscape `128:201` (`lg` / 1024). */
export const ADMIN_PHOTOS_LANDSCAPE_MIN_PX = ADMIN_RESUMEN_LANDSCAPE_MIN_PX;

/** Figma Fotos desktop `128:34` (matches Resumen / Invitados / Familias `xl`). */
export const ADMIN_PHOTOS_DESKTOP_MIN_PX = 1280;

export type PhotosKpiInput = {
    totalFiles: number;
    totalBytes: number;
    imageCount: number;
    videoCount: number;
    uploadedCount: number;
    pendingCount: number;
    failedCount: number;
    quotaUsedPercent: number;
};

export type PhotosKpiCard = {
    key: string;
    label: string;
    value: string;
    hint: string;
    hintCompact: string;
};

export type PhotosSourceStat = {
    key: "invitation" | "qr" | "approved" | "rejected";
    label: string;
    value: number;
};

export type PhotosMediaBadgeTone =
    | "uploaded"
    | "approved"
    | "rejected"
    | "failed"
    | "pending";

export function photosMobileWorkspace(viewportPx: number): boolean {
    return viewportPx < ADMIN_PHOTOS_PORTRAIT_MIN_PX;
}

export function photosPortraitWorkspace(viewportPx: number): boolean {
    return (
        viewportPx >= ADMIN_PHOTOS_PORTRAIT_MIN_PX &&
        viewportPx < ADMIN_PHOTOS_LANDSCAPE_MIN_PX
    );
}

export function photosFigmaWorkspace(viewportPx: number): boolean {
    return viewportPx >= ADMIN_PHOTOS_LANDSCAPE_MIN_PX;
}

export function photosDesktopWorkspace(viewportPx: number): boolean {
    return viewportPx >= ADMIN_PHOTOS_DESKTOP_MIN_PX;
}

/** Landscape `128:201` shortens KPI hints, QR, and table chrome; desktop `128:34` uses full copy. */
export function photosCompactChrome(viewportPx: number): boolean {
    return (
        viewportPx >= ADMIN_PHOTOS_LANDSCAPE_MIN_PX &&
        viewportPx < ADMIN_PHOTOS_DESKTOP_MIN_PX
    );
}

export function photosKpiHint(card: PhotosKpiCard, compact: boolean): string {
    return compact ? card.hintCompact : card.hint;
}

export function photosPortraitCardGrid(viewportPx: number): boolean {
    return photosPortraitWorkspace(viewportPx);
}

export function photosMobileCardStack(viewportPx: number): boolean {
    return photosMobileWorkspace(viewportPx);
}

export function formatPhotosDeadlineChip(
    deadlineLead: string | null,
): string | null {
    return formatGuestsDeadlineChip(deadlineLead);
}

export function photosFileMetaLine(mimeType: string, sizeBytes: number): string {
    return `${mimeType} • ${formatMediaBytes(sizeBytes)}`;
}

export function photosSourceLabel(source: "invitation" | "event_qr"): string {
    return source === "invitation"
        ? adminCopy.media.sourceInvitation
        : adminCopy.media.sourceQr;
}

export function photosQrReferenceLabel(compact: boolean): string {
    return compact
        ? adminCopy.media.qrReferenceShort
        : adminCopy.media.qrReference;
}

/** Phone `128:528` and portrait `128:364` show the remaining-days chip; landscape/desktop omit it. */
export function photosBannerShowsDeadline(viewportPx: number): boolean {
    return viewportPx < ADMIN_PHOTOS_LANDSCAPE_MIN_PX;
}

/** Phone `128:528` and portrait `128:364` show Excel on the banner; landscape/desktop omit it. */
export function photosBannerShowsExport(viewportPx: number): boolean {
    return viewportPx < ADMIN_PHOTOS_LANDSCAPE_MIN_PX;
}

/**
 * The plaintext QR URL is only available right after rotation. Do not invent a
 * stored public URL to match the Figma placeholder.
 */
export function photosShowsPersistedQrUrl(): boolean {
    return false;
}

export function formatMediaBytes(bytes: number): string {
    if (bytes < 1024 ** 2) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }
    if (bytes < 1024 ** 3) {
        return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    }
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export function photosKpiCards(stats: PhotosKpiInput): PhotosKpiCard[] {
    const copy = adminCopy.photosList;
    return [
        {
            key: "files",
            label: copy.kpiFiles,
            value: String(stats.totalFiles),
            hint: copy.kpiFilesHint,
            hintCompact: copy.kpiFilesHintCompact,
        },
        {
            key: "storage",
            label: copy.kpiStorage,
            value: formatMediaBytes(stats.totalBytes),
            hint: copy.kpiStorageHint,
            hintCompact: copy.kpiStorageHintCompact,
        },
        {
            key: "photos",
            label: copy.kpiPhotos,
            value: String(stats.imageCount),
            hint: copy.kpiPhotosHint,
            hintCompact: copy.kpiPhotosHintCompact,
        },
        {
            key: "videos",
            label: copy.kpiVideos,
            value: String(stats.videoCount),
            hint: copy.kpiVideosHint,
            hintCompact: copy.kpiVideosHintCompact,
        },
        {
            key: "completed",
            label: copy.kpiCompleted,
            value: String(stats.uploadedCount),
            hint: copy.kpiCompletedHint,
            hintCompact: copy.kpiCompletedHintCompact,
        },
        {
            key: "review",
            label: copy.kpiReview,
            value: String(stats.pendingCount),
            hint: copy.kpiReviewHint,
            hintCompact: copy.kpiReviewHintCompact,
        },
        {
            key: "failed",
            label: copy.kpiFailed,
            value: String(stats.failedCount),
            hint: copy.kpiFailedHint,
            hintCompact: copy.kpiFailedHintCompact,
        },
        {
            key: "quota",
            label: copy.kpiQuota,
            value: `${stats.quotaUsedPercent}%`,
            hint: copy.kpiQuotaHint,
            hintCompact: copy.kpiQuotaHintCompact,
        },
    ];
}

export function photosSourceStats(input: {
    invitationSourceCount: number;
    qrSourceCount: number;
    approvedCount: number;
    rejectedCount: number;
}): PhotosSourceStat[] {
    const media = adminCopy.media;
    const list = adminCopy.photosList;
    return [
        {
            key: "invitation",
            label: media.sourceInvitation,
            value: input.invitationSourceCount,
        },
        {
            key: "qr",
            label: media.sourceQr,
            value: input.qrSourceCount,
        },
        {
            key: "approved",
            label: list.sourceApproved,
            value: input.approvedCount,
        },
        {
            key: "rejected",
            label: list.sourceRejected,
            value: input.rejectedCount,
        },
    ];
}

export function photosSourcesLine(input: {
    invitationSourceCount: number;
    qrSourceCount: number;
    approvedCount: number;
    rejectedCount: number;
}): string {
    return photosSourceStats(input)
        .map((stat) => `${stat.label}: ${stat.value}`)
        .join("  •  ");
}

export function photosMediaBadgeTone(status: string): PhotosMediaBadgeTone {
    if (status === "approved") {
        return "approved";
    }
    if (status === "rejected") {
        return "rejected";
    }
    if (status === "failed") {
        return "failed";
    }
    if (status === "uploaded") {
        return "uploaded";
    }
    return "pending";
}

export function photosQuotaAlertText(
    percent: number,
    threshold: "60" | "80" | "90",
): string {
    return adminCopy.photosList.quotaAlert(percent, threshold);
}

export function isPhotosQrFreshNotice(message: string): boolean {
    return message.includes("Código nuevo generado");
}

export function photosQrWindowHint(hasWindow: boolean): string {
    return hasWindow
        ? adminCopy.media.qrWindowSet
        : adminCopy.media.qrWindowOpen;
}
