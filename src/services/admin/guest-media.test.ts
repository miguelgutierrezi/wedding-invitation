import {beforeEach, describe, expect, it, vi} from "vitest";
import {ADMIN_MEDIA_PREVIEW_BATCH_MAX, createAdminMediaPreviewUrls,} from "@/services/admin/guest-media";

const {createAdminClient, getMediaStorageProvider} = vi.hoisted(() => ({
    createAdminClient: vi.fn(),
    getMediaStorageProvider: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({createAdminClient}));
vi.mock("@/services/media/supabase-storage-provider", () => ({
    getMediaStorageProvider,
}));

describe("createAdminMediaPreviewUrls", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns empty map for empty input", async () => {
        await expect(createAdminMediaPreviewUrls([])).resolves.toEqual({
            ok: true,
            data: {},
        });
        expect(createAdminClient).not.toHaveBeenCalled();
    });

    it("rejects oversized batches", async () => {
        const ids = Array.from(
            {length: ADMIN_MEDIA_PREVIEW_BATCH_MAX + 1},
            (_, index) =>
                `11111111-1111-4111-8111-${String(index).padStart(12, "0")}`,
        );
        const result = await createAdminMediaPreviewUrls(ids);
        expect(result.ok).toBe(false);
        expect(createAdminClient).not.toHaveBeenCalled();
    });

    it("signs reviewable rows in parallel and skips others", async () => {
        createAdminClient.mockReturnValue({
            from: () => ({
                select: () => ({
                    in: () => ({
                        returns: async () => ({
                            data: [
                                {
                                    id: "11111111-1111-4111-8111-111111111111",
                                    object_key: "a.jpg",
                                    status: "uploaded",
                                },
                                {
                                    id: "22222222-2222-4222-8222-222222222222",
                                    object_key: "b.jpg",
                                    status: "failed",
                                },
                                {
                                    id: "33333333-3333-4333-8333-333333333333",
                                    object_key: "c.mp4",
                                    status: "approved",
                                },
                            ],
                            error: null,
                        }),
                    }),
                }),
            }),
        });

        const createPreviewUrl = vi
            .fn()
            .mockResolvedValueOnce("https://example.test/a")
            .mockResolvedValueOnce("https://example.test/c");
        getMediaStorageProvider.mockReturnValue({createPreviewUrl});

        const result = await createAdminMediaPreviewUrls([
            "11111111-1111-4111-8111-111111111111",
            "22222222-2222-4222-8222-222222222222",
            "33333333-3333-4333-8333-333333333333",
        ]);

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.data).toEqual({
                "11111111-1111-4111-8111-111111111111": "https://example.test/a",
                "33333333-3333-4333-8333-333333333333": "https://example.test/c",
            });
        }
        expect(createPreviewUrl).toHaveBeenCalledTimes(2);
    });
});
