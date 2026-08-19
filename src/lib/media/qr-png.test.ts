import {describe, expect, it} from "vitest";
import QRCode from "qrcode";

describe("admin media QR PNG generation", () => {
    it("generates a png data url for the fotos link", async () => {
        const url =
            "http://localhost:3000/fotos?code=abcdefghijklmnopqrstuvwxyz012345";
        const dataUrl = await QRCode.toDataURL(url, {
            errorCorrectionLevel: "M",
            width: 256,
        });

        expect(dataUrl.startsWith("data:image/png;base64,")).toBe(true);
        expect(dataUrl.length).toBeGreaterThan(100);
    });
});
