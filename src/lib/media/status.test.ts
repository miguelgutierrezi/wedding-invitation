import {describe, expect, it} from "vitest";

import {canTransitionMediaStatus} from "@/lib/media/status";

describe("guest media status matrix", () => {
    it("disallows jumping from pending to uploaded", () => {
        expect(canTransitionMediaStatus("pending", "uploaded")).toBe(false);
    });

    it("allows fail from pending, uploading, and uploaded", () => {
        expect(canTransitionMediaStatus("pending", "failed")).toBe(true);
        expect(canTransitionMediaStatus("uploading", "failed")).toBe(true);
        expect(canTransitionMediaStatus("uploaded", "failed")).toBe(true);
    });

    it("allows approved <-> rejected", () => {
        expect(canTransitionMediaStatus("approved", "rejected")).toBe(true);
        expect(canTransitionMediaStatus("rejected", "approved")).toBe(true);
    });

    it("does not allow leaving failed", () => {
        expect(canTransitionMediaStatus("failed", "uploaded")).toBe(false);
        expect(canTransitionMediaStatus("failed", "pending")).toBe(false);
    });
});
