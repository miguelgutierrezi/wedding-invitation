import {describe, expect, it} from "vitest";

import {guestMediaConfig} from "@/config/guest-media";

describe("guest media concurrency config", () => {
    it("keeps centralized concurrency limits", () => {
        expect(guestMediaConfig.concurrency.images).toBe(3);
        expect(guestMediaConfig.concurrency.videos).toBe(1);
    });

    it("keeps tus chunk size at 6MB for Supabase", () => {
        expect(guestMediaConfig.tus.chunkSizeBytes).toBe(6 * 1024 * 1024);
    });
});
