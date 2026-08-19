import {describe, expect, it} from "vitest";

import {
    adminMediaPreviewUrlsSchema,
    authorizeMediaUploadSchema,
    completeMediaUploadSchema,
    updateMediaQrWindowSchema,
} from "@/lib/validation/guest-media";

describe("authorizeMediaUploadSchema", () => {
    const baseInvitation = {
        source: "invitation" as const,
        invitationSlug: "familia-ejemplo",
        originalFilename: "foto.jpg",
        mimeType: "image/jpeg",
        sizeBytes: 1024,
        website: "",
    };

    it("accepts invitation payload", () => {
        expect(authorizeMediaUploadSchema.safeParse(baseInvitation).success).toBe(
            true,
        );
    });

    it("requires invitation slug for invitation source", () => {
        const parsed = authorizeMediaUploadSchema.safeParse({
            ...baseInvitation,
            invitationSlug: undefined,
        });
        expect(parsed.success).toBe(false);
    });

    it("requires event qr code for qr source", () => {
        const parsed = authorizeMediaUploadSchema.safeParse({
            source: "event_qr",
            originalFilename: "foto.jpg",
            mimeType: "image/jpeg",
            sizeBytes: 1024,
            website: "",
        });
        expect(parsed.success).toBe(false);
    });

    it("rejects short qr codes", () => {
        const parsed = authorizeMediaUploadSchema.safeParse({
            source: "event_qr",
            eventQrCode: "too-short",
            originalFilename: "foto.jpg",
            mimeType: "image/jpeg",
            sizeBytes: 1024,
            website: "",
        });
        expect(parsed.success).toBe(false);
    });

    it("rejects oversize video via schema", () => {
        const parsed = authorizeMediaUploadSchema.safeParse({
            ...baseInvitation,
            originalFilename: "clip.mp4",
            mimeType: "video/mp4",
            sizeBytes: 3 * 1024 ** 3 + 1,
        });
        expect(parsed.success).toBe(false);
    });

    it("rejects honeypot website field", () => {
        const parsed = authorizeMediaUploadSchema.safeParse({
            ...baseInvitation,
            website: "http://spam.test",
        });
        expect(parsed.success).toBe(false);
    });
});

describe("completeMediaUploadSchema", () => {
    it("requires uuid", () => {
        expect(
            completeMediaUploadSchema.safeParse({uploadId: "not-a-uuid"}).success,
        ).toBe(false);
        expect(
            completeMediaUploadSchema.safeParse({
                uploadId: "11111111-1111-4111-8111-111111111111",
                website: "",
            }).success,
        ).toBe(true);
    });
});

describe("updateMediaQrWindowSchema", () => {
    const eventId = "11111111-1111-4111-8111-111111111111";

    it("accepts null window bounds", () => {
        const parsed = updateMediaQrWindowSchema.safeParse({
            eventId,
            opensAt: null,
            closesAt: null,
        });
        expect(parsed.success).toBe(true);
    });

    it("requires a uuid eventId", () => {
        const parsed = updateMediaQrWindowSchema.safeParse({
            eventId: "not-a-uuid",
            opensAt: null,
            closesAt: null,
        });
        expect(parsed.success).toBe(false);
    });

    it("rejects invalid dates", () => {
        const parsed = updateMediaQrWindowSchema.safeParse({
            eventId,
            opensAt: "not-a-date",
            closesAt: null,
        });
        expect(parsed.success).toBe(false);
    });

    it("rejects opensAt after closesAt", () => {
        const parsed = updateMediaQrWindowSchema.safeParse({
            eventId,
            opensAt: "2026-08-20T12:00:00.000Z",
            closesAt: "2026-08-10T12:00:00.000Z",
        });
        expect(parsed.success).toBe(false);
    });

    it("normalizes valid ISO dates", () => {
        const parsed = updateMediaQrWindowSchema.safeParse({
            eventId,
            opensAt: "2026-08-10T12:00:00.000Z",
            closesAt: "2026-08-20T12:00:00.000Z",
        });
        expect(parsed.success).toBe(true);
        if (parsed.success) {
            expect(parsed.data.opensAt).toBe("2026-08-10T12:00:00.000Z");
            expect(parsed.data.closesAt).toBe("2026-08-20T12:00:00.000Z");
        }
    });
});

describe("adminMediaPreviewUrlsSchema", () => {
    it("accepts uuid arrays", () => {
        expect(
            adminMediaPreviewUrlsSchema.safeParse({
                uploadIds: ["11111111-1111-4111-8111-111111111111"],
            }).success,
        ).toBe(true);
    });

    it("rejects non-uuid ids", () => {
        expect(
            adminMediaPreviewUrlsSchema.safeParse({
                uploadIds: ["bad"],
            }).success,
        ).toBe(false);
    });
});
