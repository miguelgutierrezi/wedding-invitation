import {beforeEach, describe, expect, it, vi} from "vitest";
import {authorizeMediaUpload, completeMediaUpload,} from "@/services/media/uploads";

const {
    getInvitationBySlug,
    resolveEventMediaQrAccess,
    assertMediaAuthorizeRateLimit,
    assertGuestMediaQuotas,
    getOrCreateGuestMediaSessionId,
    getRequestClientIp,
    createAdminClient,
    getMediaStorageProvider,
} = vi.hoisted(() => ({
    getInvitationBySlug: vi.fn(),
    resolveEventMediaQrAccess: vi.fn(),
    assertMediaAuthorizeRateLimit: vi.fn(),
    assertGuestMediaQuotas: vi.fn(),
    getOrCreateGuestMediaSessionId: vi.fn(),
    getRequestClientIp: vi.fn(),
    createAdminClient: vi.fn(),
    getMediaStorageProvider: vi.fn(),
}));

vi.mock("@/services/invitations/get-invitation-by-token", () => ({
    getInvitationBySlug,
}));
vi.mock("@/services/media/qr-access", () => ({
    resolveEventMediaQrAccess,
}));
vi.mock("@/lib/security/media-rate-limit", () => ({
    assertMediaAuthorizeRateLimit,
}));
vi.mock("@/services/media/quota", () => ({
    assertGuestMediaQuotas,
}));
vi.mock("@/lib/media/session", () => ({
    getOrCreateGuestMediaSessionId,
}));
vi.mock("@/lib/security/client-ip", () => ({
    getRequestClientIp,
}));
vi.mock("@/lib/supabase/admin", () => ({
    createAdminClient,
}));
vi.mock("@/services/media/supabase-storage-provider", () => ({
    getMediaStorageProvider,
}));
vi.mock("@/lib/logging/server-log", () => ({
    serverLog: vi.fn(),
}));

function mockSupabaseChain(result: {
    data?: unknown;
    error?: { message: string } | null;
}) {
    const handler: ProxyHandler<object> = {
        get(_target, prop) {
            if (prop === "then") {
                return (
                    onFulfilled: (value: unknown) => unknown,
                    onRejected?: (reason: unknown) => unknown,
                ) => Promise.resolve(result).then(onFulfilled, onRejected);
            }
            if (prop === "single" || prop === "maybeSingle") {
                return () => Promise.resolve(result);
            }
            return () => new Proxy({}, handler);
        },
    };
    return new Proxy({}, handler);
}

describe("authorizeMediaUpload", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        assertMediaAuthorizeRateLimit.mockResolvedValue({ok: true});
        assertGuestMediaQuotas.mockResolvedValue({ok: true});
        getOrCreateGuestMediaSessionId.mockResolvedValue("session-1");
        getRequestClientIp.mockResolvedValue("1.2.3.4");
    });

    it("rejects honeypot", async () => {
        const result = await authorizeMediaUpload({
            source: "invitation",
            invitationSlug: "familia-ejemplo",
            originalFilename: "a.jpg",
            mimeType: "image/jpeg",
            sizeBytes: 100,
            website: "x",
        });
        expect(result.ok).toBe(false);
    });

    it("rejects invalid or disabled invitation slug", async () => {
        getInvitationBySlug.mockResolvedValue(null);
        const result = await authorizeMediaUpload({
            source: "invitation",
            invitationSlug: "no-existe",
            originalFilename: "a.jpg",
            mimeType: "image/jpeg",
            sizeBytes: 100,
            website: "",
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toContain("invitación");
        }
    });

    it("rejects unavailable qr token", async () => {
        resolveEventMediaQrAccess.mockResolvedValue(null);
        const result = await authorizeMediaUpload({
            source: "event_qr",
            eventQrCode: "a".repeat(32),
            originalFilename: "a.jpg",
            mimeType: "image/jpeg",
            sizeBytes: 100,
            website: "",
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toContain("fotos");
        }
    });

    it("binds family from invitation lookup and authorizes upload", async () => {
        getInvitationBySlug.mockResolvedValue({
            familyId: "family-1",
            event: {id: "event-1"},
        });

        const chain = mockSupabaseChain({
            data: {id: "upload-1"},
            error: null,
        });
        createAdminClient.mockReturnValue(chain);
        getMediaStorageProvider.mockReturnValue({
            createSignedUpload: vi.fn().mockResolvedValue({
                objectKey: "obj/key.jpg",
                token: "tok",
                signedUrl: "https://example.test/signed",
                tusEndpoint: "https://example.test/tus",
                bucketName: "guest-media",
            }),
        });

        const result = await authorizeMediaUpload({
            source: "invitation",
            invitationSlug: "familia-ejemplo",
            originalFilename: "a.jpg",
            mimeType: "image/jpeg",
            sizeBytes: 100,
            website: "",
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.data.uploadId).toBe("upload-1");
            expect(result.data.token).toBe("tok");
        }
        expect(getInvitationBySlug).toHaveBeenCalledWith("familia-ejemplo");
    });

    it("stores null family for event_qr source", async () => {
        resolveEventMediaQrAccess.mockResolvedValue({
            eventId: "event-1",
            eventName: "Boda",
        });
        const chain = mockSupabaseChain({
            data: {id: "upload-2"},
            error: null,
        });
        createAdminClient.mockReturnValue(chain);
        getMediaStorageProvider.mockReturnValue({
            createSignedUpload: vi.fn().mockResolvedValue({
                objectKey: "obj/key.jpg",
                token: "tok",
                signedUrl: "https://example.test/signed",
                tusEndpoint: "https://example.test/tus",
                bucketName: "guest-media",
            }),
        });

        const result = await authorizeMediaUpload({
            source: "event_qr",
            eventQrCode: "a".repeat(32),
            originalFilename: "a.jpg",
            mimeType: "image/jpeg",
            sizeBytes: 100,
            uploaderName: "Ana",
            website: "",
        });

        expect(result.ok).toBe(true);
        expect(resolveEventMediaQrAccess).toHaveBeenCalled();
    });
});

describe("completeMediaUpload", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        getOrCreateGuestMediaSessionId.mockResolvedValue("session-1");
    });

    it("fails when object is missing", async () => {
        const chain = mockSupabaseChain({
            data: {
                id: "upload-1",
                object_key: "obj/key.jpg",
                status: "uploading",
                session_id: "session-1",
                size_bytes: 100,
                media_type: "image",
            },
            error: null,
        });
        createAdminClient.mockReturnValue(chain);
        getMediaStorageProvider.mockReturnValue({
            objectExists: vi.fn().mockResolvedValue({
                objectKey: "obj/key.jpg",
                exists: false,
                sizeBytes: null,
            }),
            deleteObject: vi.fn(),
        });

        const result = await completeMediaUpload("upload-1");
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.code).toBe("object_missing");
        }
    });

    it("completes only when object exists and size matches", async () => {
        const chain = mockSupabaseChain({
            data: {
                id: "upload-1",
                object_key: "obj/key.jpg",
                status: "uploading",
                session_id: "session-1",
                size_bytes: 100,
                media_type: "image",
            },
            error: null,
        });
        createAdminClient.mockReturnValue(chain);
        getMediaStorageProvider.mockReturnValue({
            objectExists: vi.fn().mockResolvedValue({
                objectKey: "obj/key.jpg",
                exists: true,
                sizeBytes: 100,
            }),
            deleteObject: vi.fn(),
        });

        const result = await completeMediaUpload("upload-1");
        expect(result.ok).toBe(true);
    });

    it("rejects when actual size exceeds declared size", async () => {
        const chain = mockSupabaseChain({
            data: {
                id: "upload-1",
                object_key: "obj/key.jpg",
                status: "uploading",
                session_id: "session-1",
                size_bytes: 100,
                media_type: "image",
            },
            error: null,
        });
        createAdminClient.mockReturnValue(chain);
        getMediaStorageProvider.mockReturnValue({
            objectExists: vi.fn().mockResolvedValue({
                objectKey: "obj/key.jpg",
                exists: true,
                sizeBytes: 5000,
            }),
            deleteObject: vi.fn().mockResolvedValue(undefined),
        });

        const result = await completeMediaUpload("upload-1");
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.code).toBe("size_mismatch");
        }
    });

    it("rejects completion from another session", async () => {
        const chain = mockSupabaseChain({
            data: {
                id: "upload-1",
                object_key: "obj/key.jpg",
                status: "uploading",
                session_id: "other-session",
                size_bytes: 100,
                media_type: "image",
            },
            error: null,
        });
        createAdminClient.mockReturnValue(chain);

        const result = await completeMediaUpload("upload-1");
        expect(result.ok).toBe(false);
    });

    it("returns status_changed when the uploading row was already transitioned", async () => {
        const row = {
            id: "upload-1",
            object_key: "obj/key.jpg",
            status: "uploading",
            session_id: "session-1",
            size_bytes: 100,
            media_type: "image",
        };
        let maybeSingleCalls = 0;
        const handler: ProxyHandler<object> = {
            get(_target, prop) {
                if (prop === "single" || prop === "maybeSingle") {
                    return () => {
                        maybeSingleCalls += 1;
                        if (maybeSingleCalls === 1) {
                            return Promise.resolve({data: row, error: null});
                        }
                        return Promise.resolve({data: null, error: null});
                    };
                }
                return () => new Proxy({}, handler);
            },
        };
        createAdminClient.mockReturnValue(new Proxy({}, handler));
        getMediaStorageProvider.mockReturnValue({
            objectExists: vi.fn().mockResolvedValue({
                objectKey: "obj/key.jpg",
                exists: true,
                sizeBytes: 100,
            }),
            deleteObject: vi.fn(),
        });

        const result = await completeMediaUpload("upload-1");
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.code).toBe("status_changed");
        }
    });
});
