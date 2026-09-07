import {describe, expect, it} from "vitest";

import {mediaStatusBadgeClass} from "@/components/admin/admin-status-badge";
import {adminPhotos, adminResumen} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    ADMIN_PHOTOS_DESKTOP_MIN_PX,
    ADMIN_PHOTOS_LANDSCAPE_MIN_PX,
    ADMIN_PHOTOS_MOBILE_MAX_PX,
    ADMIN_PHOTOS_PORTRAIT_MIN_PX,
    formatMediaBytes,
    formatPhotosDeadlineChip,
    isPhotosQrFreshNotice,
    photosBannerShowsDeadline,
    photosBannerShowsExport,
    photosCompactChrome,
    photosDesktopWorkspace,
    photosFigmaWorkspace,
    photosFileMetaLine,
    photosKpiCards,
    photosKpiHint,
    photosMediaBadgeTone,
    photosMobileCardStack,
    photosMobileWorkspace,
    photosPortraitCardGrid,
    photosPortraitWorkspace,
    photosQrReferenceLabel,
    photosQrWindowHint,
    photosQuotaAlertText,
    photosShowsPersistedQrUrl,
    photosSourceLabel,
    photosSourceStats,
    photosSourcesLine,
} from "@/lib/admin/admin-photos-layout";
import {rsvpDeadlineLead} from "@/lib/admin/dashboard-resumen";

const sampleStats = {
    totalFiles: 2,
    totalBytes: Math.round(3.2 * 1024 ** 2),
    imageCount: 2,
    videoCount: 0,
    uploadedCount: 2,
    pendingCount: 0,
    failedCount: 0,
    quotaUsedPercent: 0,
    invitationSourceCount: 0,
    qrSourceCount: 2,
    approvedCount: 0,
    rejectedCount: 0,
};

describe("admin photos Figma helpers", () => {
    it("uses landscape 1024 then desktop 1280 density, without banner deadline or Excel", () => {
        expect(ADMIN_PHOTOS_LANDSCAPE_MIN_PX).toBe(1024);
        expect(ADMIN_PHOTOS_DESKTOP_MIN_PX).toBe(1280);
        expect(photosFigmaWorkspace(1023)).toBe(false);
        expect(photosFigmaWorkspace(1024)).toBe(true);
        expect(photosDesktopWorkspace(1279)).toBe(false);
        expect(photosDesktopWorkspace(1280)).toBe(true);
        expect(photosCompactChrome(1023)).toBe(false);
        expect(photosCompactChrome(1024)).toBe(true);
        expect(photosCompactChrome(1279)).toBe(true);
        expect(photosCompactChrome(1280)).toBe(false);
        expect(photosBannerShowsDeadline(1024)).toBe(false);
        expect(photosBannerShowsExport(1280)).toBe(false);
        expect(photosShowsPersistedQrUrl()).toBe(false);
        expect(adminCopy.photosList.bannerTitle).toBe("Fotos y videos");
        expect(adminResumen.banner).toContain("xl:py-10");
        expect(adminPhotos.kpiGrid).toContain("grid-cols-4");
        expect(adminPhotos.qrFrame).toContain("size-[110px]");
        expect(adminPhotos.qrFrame).toContain("xl:size-[180px]");
        expect(adminPhotos.tableCard).toContain("xl:rounded-[24px]");
        expect(mediaStatusBadgeClass("uploaded", "figma")).toContain("bg-admin-wash");
    });

    it("formats storage the way the KPI and table show it", () => {
        expect(formatMediaBytes(0)).toBe("0.0 KB");
        expect(formatMediaBytes(1100 * 1024)).toBe("1.1 MB");
        expect(formatMediaBytes(sampleStats.totalBytes)).toBe("3.2 MB");
        expect(formatMediaBytes(1024 ** 3)).toBe("1.00 GB");
    });

    it("builds eight live KPI cards in Figma order", () => {
        const cards = photosKpiCards(sampleStats);
        expect(cards.map((card) => card.key)).toEqual([
            "files",
            "storage",
            "photos",
            "videos",
            "completed",
            "review",
            "failed",
            "quota",
        ]);
        expect(cards[0]).toMatchObject({
            label: "Archivos",
            value: "2",
            hint: "Total de elementos cargados",
            hintCompact: "Total de elementos",
        });
        expect(cards[1]).toMatchObject({
            label: "Espacio Usado",
            value: "3.2 MB",
        });
        expect(cards[5]).toMatchObject({
            label: "En Revisión",
            value: "0",
        });
        expect(cards[7]).toMatchObject({
            label: "Cuota Storage",
            value: "0%",
            hintCompact: "Límite gratuito",
        });
        expect(photosKpiHint(cards[0], true)).toBe("Total de elementos");
        expect(photosKpiHint(cards[0], false)).toBe("Total de elementos cargados");
        expect(photosKpiHint(cards[4], true)).toBe("Procesados ok");
        expect(photosKpiHint(cards[6], true)).toBe("Carga corrupta");
    });

    it("joins origin counts with live numbers, not Figma placeholders", () => {
        expect(photosSourcesLine(sampleStats)).toBe(
            "Desde invitación: 0  •  Desde código del evento: 2  •  Aprobados: 0  •  Rechazados: 0",
        );
        expect(photosSourceStats(sampleStats).map((stat) => stat.value)).toEqual([
            0, 2, 0, 0,
        ]);
    });

    it("maps media statuses to Figma badge tones", () => {
        expect(photosMediaBadgeTone("uploaded")).toBe("uploaded");
        expect(photosMediaBadgeTone("approved")).toBe("approved");
        expect(photosMediaBadgeTone("rejected")).toBe("rejected");
        expect(photosMediaBadgeTone("failed")).toBe("failed");
        expect(photosMediaBadgeTone("pending")).toBe("pending");
        expect(photosMediaBadgeTone("uploading")).toBe("pending");
        expect(mediaStatusBadgeClass("uploaded", "figma")).toContain("bg-admin-wash");
        expect(mediaStatusBadgeClass("approved", "figma")).toContain("text-[#2e7d32]");
        expect(mediaStatusBadgeClass("rejected", "figma")).toContain("text-[#b91c1c]");
    });

    it("keeps QR window and quota copy in helpers", () => {
        expect(photosQrWindowHint(false)).toContain("cualquier momento");
        expect(photosQrWindowHint(true)).toContain("enlace con código");
        expect(photosQuotaAlertText(82, "80")).toContain("82%");
        expect(isPhotosQrFreshNotice("Código nuevo generado. Copia el enlace.")).toBe(
            true,
        );
        expect(isPhotosQrFreshNotice("Fechas de subida actualizadas.")).toBe(false);
    });

    it("uses portrait 834 until landscape, with banner chip, Excel, and a 2-column card grid", () => {
        expect(ADMIN_PHOTOS_PORTRAIT_MIN_PX).toBe(834);
        expect(photosPortraitWorkspace(833)).toBe(false);
        expect(photosPortraitWorkspace(834)).toBe(true);
        expect(photosPortraitWorkspace(1023)).toBe(true);
        expect(photosPortraitWorkspace(1024)).toBe(false);
        expect(photosPortraitCardGrid(834)).toBe(true);
        expect(photosPortraitCardGrid(1024)).toBe(false);
        expect(photosBannerShowsDeadline(833)).toBe(true);
        expect(photosBannerShowsDeadline(834)).toBe(true);
        expect(photosBannerShowsDeadline(1023)).toBe(true);
        expect(photosBannerShowsDeadline(1024)).toBe(false);
        expect(photosBannerShowsExport(834)).toBe(true);
        expect(photosBannerShowsExport(1023)).toBe(true);
        expect(photosBannerShowsExport(1024)).toBe(false);
        expect(formatPhotosDeadlineChip(rsvpDeadlineLead(9))).toBe(
            "⏳ Quedan 9 días para confirmar",
        );
        expect(photosFileMetaLine("image/jpeg", 1100 * 1024)).toBe(
            "image/jpeg • 1.1 MB",
        );
        expect(photosSourceLabel("event_qr")).toBe("Desde código del evento");
        expect(photosSourceLabel("invitation")).toBe("Desde invitación");
        expect(adminCopy.photosList.filesTitle).toBe("Archivos cargados");
        expect(adminCopy.photosList.sourceLabel).toBe("Origen:");
        expect(adminPhotos.portraitKpiGrid).toContain("grid-cols-4");
        expect(adminPhotos.portraitCardGrid).toContain("grid-cols-2");
        expect(adminPhotos.portraitThumb).toContain("h-[180px]");
        expect(adminPhotos.portraitBannerTitle).toContain("text-[36px]");
    });

    it("uses phone below 834 with stacked banner actions, 2-col KPIs, and a 1-column card stack", () => {
        expect(ADMIN_PHOTOS_MOBILE_MAX_PX).toBe(833);
        expect(photosMobileWorkspace(390)).toBe(true);
        expect(photosMobileWorkspace(833)).toBe(true);
        expect(photosMobileWorkspace(834)).toBe(false);
        expect(photosMobileCardStack(390)).toBe(true);
        expect(photosMobileCardStack(834)).toBe(false);
        expect(photosBannerShowsDeadline(390)).toBe(true);
        expect(photosBannerShowsExport(390)).toBe(true);
        expect(photosQrReferenceLabel(true)).toBe("Referencia");
        expect(photosQrReferenceLabel(false)).toBe("Referencia del código");
        expect(adminCopy.media.qrReferenceShort).toBe("Referencia");
        expect(adminPhotos.mobileBannerTitle).toContain("text-[28px]");
        expect(adminPhotos.mobileKpiGrid).toContain("grid-cols-2");
        expect(adminPhotos.mobileCardGrid).toContain("grid-cols-1");
        expect(adminPhotos.mobileThumb).toContain("h-[200px]");
        expect(adminPhotos.mobileQrFrame).toContain("size-[160px]");
        expect(adminPhotos.mobileSectionTitle).toContain("text-[20px]");
    });
});
