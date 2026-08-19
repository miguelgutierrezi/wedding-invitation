import {describe, expect, it} from "vitest";

import {guestMediaConfig} from "@/config/guest-media";
import {evaluateGuestMediaQuota, sumUploadBytes,} from "@/lib/media/quota-policy";

describe("evaluateGuestMediaQuota", () => {
    it("allows usage under budgets", () => {
        const result = evaluateGuestMediaQuota({
            sessionBytes: 1024,
            ipOrTokenBytes24h: 2048,
            activeUploads: 1,
            nextFileBytes: 1024,
        });
        expect(result.ok).toBe(true);
    });

    it("blocks when session quota would be exceeded", () => {
        const result = evaluateGuestMediaQuota({
            sessionBytes: guestMediaConfig.quotas.sessionMaxBytes,
            ipOrTokenBytes24h: 0,
            activeUploads: 0,
            nextFileBytes: 1,
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.code).toBe("session_quota");
        }
    });

    it("blocks when IP/token 24h quota would be exceeded", () => {
        const result = evaluateGuestMediaQuota({
            sessionBytes: 0,
            ipOrTokenBytes24h: guestMediaConfig.quotas.tokenOrIpMaxBytes24h,
            activeUploads: 0,
            nextFileBytes: 1,
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.code).toBe("ip_quota");
        }
    });

    it("blocks when too many active uploads", () => {
        const result = evaluateGuestMediaQuota({
            sessionBytes: 0,
            ipOrTokenBytes24h: 0,
            activeUploads: guestMediaConfig.quotas.maxActiveUploadsPerSession,
            nextFileBytes: 1,
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.code).toBe("active_uploads");
        }
    });
});

describe("sumUploadBytes", () => {
    it("sums numeric and string sizes", () => {
        expect(
            sumUploadBytes([{size_bytes: 10}, {size_bytes: "20"}]),
        ).toBe(30);
    });

    it("handles null rows", () => {
        expect(sumUploadBytes(null)).toBe(0);
    });
});
