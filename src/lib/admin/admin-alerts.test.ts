import {describe, expect, it} from "vitest";

import {adminAlert, adminFamilyDetail} from "@/components/admin/admin-ui";
import {
    ADMIN_ALERTS_DESKTOP_MIN_PX,
    ADMIN_ALERTS_FIGMA,
    ADMIN_ALERTS_LANDSCAPE_FIGMA,
    ADMIN_ALERTS_LANDSCAPE_MIN_PX,
    ADMIN_ALERTS_MOBILE_FIGMA,
    ADMIN_ALERTS_PORTRAIT_FIGMA,
    ADMIN_ALERTS_PORTRAIT_MIN_PX,
    ADMIN_ALERT_ERROR_ACCENT,
    ADMIN_ALERT_SUCCESS_BG,
    ADMIN_ALERT_TITLES,
    ADMIN_ALERT_WARNING_FG,
    adminAlertFieldErrorPx,
    adminAlertsFigmaNode,
    adminAlertTitle,
    adminAlertToneFromMessage,
    photosQuotaAlertTone,
} from "@/lib/admin/admin-alerts";

describe("admin alerts Figma 161:151 / 161:371 / 161:560 / 161:738", () => {
    it("keeps the spec nodes, palette, and structure", () => {
        expect(ADMIN_ALERTS_FIGMA).toBe("161:151");
        expect(ADMIN_ALERTS_LANDSCAPE_FIGMA).toBe("161:371");
        expect(ADMIN_ALERTS_PORTRAIT_FIGMA).toBe("161:560");
        expect(ADMIN_ALERTS_MOBILE_FIGMA).toBe("161:738");
        expect(ADMIN_ALERT_SUCCESS_BG).toBe("#edf2e8");
        expect(ADMIN_ALERT_ERROR_ACCENT).toBe("#db3737");
        expect(ADMIN_ALERT_WARNING_FG).toBe("#6e3f0f");
        expect(ADMIN_ALERT_TITLES.success).toBe("Operación exitosa");
        expect(adminAlert.root).toContain("border-l-4");
        expect(adminAlert.root).toContain("p-3");
        expect(adminAlert.root).toContain("min-[834px]:p-4");
        expect(adminAlert.root).toContain("rounded-lg");
        expect(adminAlert.root).toContain("shadow-[0_4px_12px_rgba(46,45,23,0.05)]");
        expect(adminAlert.icon).toContain("size-5");
        expect(adminAlert.title).toContain("text-[13px]");
        expect(adminAlert.description).toContain("text-[12px]");
        expect(adminAlert.title).toContain("min-[834px]:text-[14px]");
        expect(adminAlert.success).toContain("bg-admin-msg-success");
        expect(adminAlert.fieldInvalid).toContain("user-invalid:border-2");
        expect(adminAlert.fieldInvalid).not.toContain("min-[834px]:user-invalid");
        expect(adminAlert.fieldError).toContain("text-[11px]");
        expect(adminAlert.fieldError).toContain("min-[834px]:text-[13px]");
        expect(adminAlert.fieldError).toContain("xl:text-[12px]");
        expect(adminFamilyDetail.input).toContain("user-invalid:border-2");
    });

    it("maps viewport widths to the matching spec sheet and helper size", () => {
        expect(adminAlertsFigmaNode(390)).toBe(ADMIN_ALERTS_MOBILE_FIGMA);
        expect(adminAlertsFigmaNode(ADMIN_ALERTS_PORTRAIT_MIN_PX)).toBe(
            ADMIN_ALERTS_PORTRAIT_FIGMA,
        );
        expect(adminAlertsFigmaNode(ADMIN_ALERTS_LANDSCAPE_MIN_PX)).toBe(
            ADMIN_ALERTS_LANDSCAPE_FIGMA,
        );
        expect(adminAlertsFigmaNode(ADMIN_ALERTS_DESKTOP_MIN_PX)).toBe(
            ADMIN_ALERTS_FIGMA,
        );
        expect(adminAlertFieldErrorPx(390)).toBe(11);
        expect(adminAlertFieldErrorPx(900)).toBe(13);
        expect(adminAlertFieldErrorPx(1100)).toBe(13);
        expect(adminAlertFieldErrorPx(1280)).toBe(12);
    });

    it("maps notices to success, warning, error, and info", () => {
        expect(adminAlertToneFromMessage("Copiado")).toBe("success");
        expect(adminAlertToneFromMessage("Lista descargada.")).toBe("success");
        expect(adminAlertToneFromMessage("2 registros actualizados.")).toBe(
            "success",
        );
        expect(adminAlertToneFromMessage("Nada que copiar en la selección.")).toBe(
            "warning",
        );
        expect(
            adminAlertToneFromMessage("Alerta de cuota: uso estimado al 82%"),
        ).toBe("warning");
        expect(adminAlertToneFromMessage("No se pudo guardar la información.")).toBe(
            "error",
        );
        expect(
            adminAlertToneFromMessage("El nombre escrito no coincide con el de la familia."),
        ).toBe("error");
        expect(adminAlertToneFromMessage("Se han enviado 45 de 120 invitaciones.")).toBe(
            "info",
        );
    });

    it("uses a generic error title unless the copy is about saving", () => {
        expect(adminAlertTitle("success")).toBe("Operación exitosa");
        expect(adminAlertTitle("error", "No se pudo copiar.")).toBe("Error");
        expect(adminAlertTitle("error", "No se pudo guardar la familia.")).toBe(
            "Error al guardar",
        );
        expect(photosQuotaAlertTone("60")).toBe("warning");
        expect(photosQuotaAlertTone("80")).toBe("warning");
        expect(photosQuotaAlertTone("90")).toBe("error");
    });
});
