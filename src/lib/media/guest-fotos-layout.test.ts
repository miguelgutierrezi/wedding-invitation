import {readFileSync} from "node:fs";
import {join} from "node:path";

import {describe, expect, it} from "vitest";

import {guestFotos} from "@/components/media/guest-fotos-ui";
import {
    formatFotosFileBytes,
    fotosCanStartUpload,
    fotosDropzoneHint,
    fotosFileMimeLabel,
    fotosHidesCompletedStatusLabel,
    fotosProgressCounts,
    fotosQueueStatusLabel,
    fotosShowsProgress,
    fotosShowsSuccessBanner,
    fotosStatusTone,
    fotosSuccessMessage,
    fotosUploadButtonLabel,
    GUEST_FOTOS_DESKTOP_MIN_PX,
    GUEST_FOTOS_ICONS,
    GUEST_FOTOS_LANDSCAPE_MIN_PX,
    GUEST_FOTOS_MOBILE_MAX_PX,
    GUEST_FOTOS_PORTRAIT_MIN_PX,
    guestFotosBannerTitlePx,
    guestFotosChromePadXPx,
    guestFotosCopy,
    guestFotosCopyright,
    guestFotosCoupleBrand,
    guestFotosDesktopWorkspace,
    guestFotosLandscapeWorkspace,
    guestFotosMobileWorkspace,
    guestFotosPortraitWorkspace,
    hasFileDragTypes,
} from "@/lib/media/guest-fotos-layout";

describe("guest fotos Figma chrome helpers", () => {
    it("uses mobile below 834, portrait from 834, landscape from lg / 1024, desktop from xl / 1280", () => {
        expect(GUEST_FOTOS_MOBILE_MAX_PX).toBe(833);
        expect(GUEST_FOTOS_PORTRAIT_MIN_PX).toBe(834);
        expect(GUEST_FOTOS_LANDSCAPE_MIN_PX).toBe(1024);
        expect(GUEST_FOTOS_DESKTOP_MIN_PX).toBe(1280);
        expect(guestFotosMobileWorkspace(390)).toBe(true);
        expect(guestFotosMobileWorkspace(833)).toBe(true);
        expect(guestFotosMobileWorkspace(834)).toBe(false);
        expect(guestFotosPortraitWorkspace(833)).toBe(false);
        expect(guestFotosPortraitWorkspace(834)).toBe(true);
        expect(guestFotosPortraitWorkspace(1023)).toBe(true);
        expect(guestFotosPortraitWorkspace(1024)).toBe(false);
        expect(guestFotosLandscapeWorkspace(1023)).toBe(false);
        expect(guestFotosLandscapeWorkspace(1024)).toBe(true);
        expect(guestFotosLandscapeWorkspace(1279)).toBe(true);
        expect(guestFotosLandscapeWorkspace(1280)).toBe(false);
        expect(guestFotosDesktopWorkspace(1279)).toBe(false);
        expect(guestFotosDesktopWorkspace(1280)).toBe(true);
        expect(guestFotosBannerTitlePx(390)).toBe(36);
        expect(guestFotosBannerTitlePx(833)).toBe(36);
        expect(guestFotosBannerTitlePx(834)).toBe(42);
        expect(guestFotosBannerTitlePx(1024)).toBe(48);
        expect(guestFotosBannerTitlePx(1280)).toBe(56);
        expect(guestFotosChromePadXPx(390)).toBe(20);
        expect(guestFotosChromePadXPx(833)).toBe(20);
        expect(guestFotosChromePadXPx(834)).toBe(48);
        expect(guestFotosChromePadXPx(1024)).toBe(64);
        expect(guestFotosChromePadXPx(1280)).toBe(120);
        expect(guestFotos.banner).toContain("flex");
        expect(guestFotos.banner).not.toContain("hidden");
        expect(guestFotos.banner).toContain("px-5");
        expect(guestFotos.banner).toContain("linear-gradient(30deg");
        expect(guestFotos.banner).toContain("min-[834px]:px-12");
        expect(guestFotos.banner).toContain("lg:p-16");
        expect(guestFotos.banner).toContain("xl:px-[120px]");
        expect(guestFotos.banner).toContain("min-[834px]:bg-[linear-gradient(19deg");
        expect(guestFotos.banner).toContain("lg:bg-[linear-gradient(15deg");
        expect(guestFotos.banner).toContain("xl:bg-[linear-gradient(12deg");
        expect(guestFotos.banner).toContain("var(--admin-olive)");
        expect(guestFotos.title).toContain("text-[36px]");
        expect(guestFotos.title).toContain("min-[834px]:text-[42px]");
        expect(guestFotos.title).toContain("lg:text-[48px]");
        expect(guestFotos.title).toContain("xl:text-[56px]");
        expect(guestFotos.brandNames).toContain("text-[20px]");
        expect(guestFotos.brandNames).toContain("min-[834px]:text-[22px]");
        expect(guestFotos.form).toContain("min-[834px]:max-w-[640px]");
        expect(guestFotos.card).toContain("rounded-[20px]");
        expect(guestFotos.card).toContain("lg:rounded-[24px]");
        expect(guestFotos.dropzoneHintMobile).toContain("min-[834px]:hidden");
        expect(guestFotos.dropzoneHintWide).toContain("hidden min-[834px]:block");
        expect(guestFotos.actionsRow).toContain("flex-col");
        expect(guestFotos.submit).toContain("bg-admin-olive");
        expect(guestFotos.submit).toContain("w-full");
        expect(guestFotos.addMore).toContain("w-full");
        expect(guestFotos.addMore).toContain("min-[834px]:w-[140px]");
        expect(guestFotos.addMore).toContain("lg:w-[180px]");
        expect(guestFotos.success).toContain("flex");
        expect(guestFotos.footer).toContain("flex");
        expect(guestFotos.footer).toContain("px-5");
        expect(guestFotos.footer).toContain("min-[834px]:px-12");
        expect(guestFotos.footer).toContain("lg:px-16");
        expect(guestFotos.footer).toContain("xl:px-[120px]");
        expect(guestFotos.main).toContain("px-4");
        expect(guestFotos.main).toContain("min-[834px]:px-12");
        expect(guestFotos.main).toContain("lg:px-16");
        expect(guestFotos.main).toContain("xl:px-0");
        expect(guestFotos).not.toHaveProperty("compactHeader");
        expect(guestFotos.statusCompletedLabel).toContain("hidden min-[834px]:block");
    });

    it("builds couple brand and copyright like the Figma footer", () => {
        expect(guestFotosCoupleBrand("Nychol", "Miguel")).toBe("Nychol & Miguel");
        expect(guestFotosCopyright(2026, "Nychol", "Miguel")).toBe(
            "© 2026 Nychol & Miguel. Todos los derechos reservados.",
        );
        expect(guestFotosCopy.brandBadge).toBe("• Wedding Gallery");
        expect(guestFotosCopy.dropzoneHintMobile).toBe(
            "Haz clic para buscar en tu dispositivo",
        );
        expect(fotosDropzoneHint(390)).toBe(guestFotosCopy.dropzoneHintMobile);
        expect(fotosDropzoneHint(834)).toBe(guestFotosCopy.dropzoneHint);
        expect(fotosHidesCompletedStatusLabel("completed")).toBe(true);
        expect(fotosHidesCompletedStatusLabel("failed")).toBe(false);
        expect(fotosHidesCompletedStatusLabel("waiting")).toBe(false);
    });

    it("formats file sizes, mime fallback, and queue copy", () => {
        expect(formatFotosFileBytes(290)).toBe("290 B");
        expect(formatFotosFileBytes(297062)).toBe("290.1 KB");
        expect(formatFotosFileBytes(1024 ** 2)).toBe("1.0 MB");
        expect(fotosFileMimeLabel("image/png")).toBe("image/png");
        expect(fotosFileMimeLabel("")).toBe("archivo");
        expect(fotosQueueStatusLabel("completed")).toBe("Completado");
        expect(fotosQueueStatusLabel("failed")).toBe("Fallido");
        expect(fotosQueueStatusLabel("waiting")).toBe("Esperando");
        expect(fotosProgressCounts(1, 0, 0)).toBe(
            "Completados 1 · Fallidos 0 · Pendientes 0",
        );
        expect(fotosSuccessMessage(1, 0)).toBe("Gracias. Recibimos 1 archivo.");
        expect(fotosSuccessMessage(2, 1)).toBe(
            "Gracias. Recibimos 2 archivos · 1 no se pudieron subir.",
        );
        expect(fotosUploadButtonLabel(false)).toBe("Subir archivos");
        expect(fotosUploadButtonLabel(true)).toBe("Subiendo…");
        expect(fotosCanStartUpload(false, 1)).toBe(true);
        expect(fotosCanStartUpload(true, 1)).toBe(false);
        expect(fotosCanStartUpload(false, 0)).toBe(false);
        expect(fotosShowsProgress(0)).toBe(false);
        expect(fotosShowsProgress(1)).toBe(true);
        expect(
            fotosShowsSuccessBanner({completed: 1, pending: 0, isRunning: false}),
        ).toBe(true);
        expect(
            fotosShowsSuccessBanner({completed: 1, pending: 1, isRunning: false}),
        ).toBe(false);
        expect(
            fotosShowsSuccessBanner({completed: 1, pending: 0, isRunning: true}),
        ).toBe(false);
        expect(fotosStatusTone("completed")).toBe("success");
        expect(fotosStatusTone("failed")).toBe("danger");
        expect(fotosStatusTone("uploading")).toBe("muted");
    });

    it("detects file drags from dataTransfer types", () => {
        expect(hasFileDragTypes(["Files"])).toBe(true);
        expect(hasFileDragTypes(["text/plain"])).toBe(false);
        expect(hasFileDragTypes([])).toBe(false);
    });

    it("commits the Figma lucide glyphs as local assets", () => {
        for (const src of Object.values(GUEST_FOTOS_ICONS)) {
            const absolute = join(process.cwd(), "public", src.replace(/^\//, ""));
            const svg = readFileSync(absolute, "utf8");
            expect(svg).toContain("<svg");
        }
        expect(GUEST_FOTOS_ICONS.user).toBe("/fotos/user.svg");
        expect(GUEST_FOTOS_ICONS.uploadCloud).toBe("/fotos/upload-cloud.svg");
    });
});
