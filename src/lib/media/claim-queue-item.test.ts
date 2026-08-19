import {describe, expect, it} from "vitest";

import type {MediaQueueItem} from "@/hooks/use-media-upload-queue";
import {claimNextWaitingItem} from "@/lib/media/claim-queue-item";

function item(
    localId: string,
    status: MediaQueueItem["status"],
    type = "image/jpeg",
): MediaQueueItem {
    return {
        localId,
        file: new File([""], `${localId}.jpg`, {type}),
        previewUrl: null,
        status,
        progress: 0,
        error: null,
        uploadId: null,
    };
}

describe("claimNextWaitingItem", () => {
    it("claims the first waiting item synchronously", () => {
        const claimedIds = new Set<string>();
        const first = claimNextWaitingItem(
            [item("a", "waiting"), item("b", "waiting")],
            {
                activeImages: 0,
                activeVideos: 0,
                imageSlots: 3,
                videoSlots: 1,
                claimedIds,
            },
        );

        expect(first?.item.localId).toBe("a");
        expect(first?.item.status).toBe("preparing");
        expect(claimedIds.has("a")).toBe(true);

        const second = claimNextWaitingItem(first!.nextItems, {
            activeImages: 1,
            activeVideos: 0,
            imageSlots: 3,
            videoSlots: 1,
            claimedIds,
        });
        expect(second?.item.localId).toBe("b");
    });

    it("does not allow two pumps to claim the same last item", () => {
        const claimedIds = new Set<string>();
        const items = [item("last", "waiting")];

        const one = claimNextWaitingItem(items, {
            activeImages: 0,
            activeVideos: 0,
            imageSlots: 3,
            videoSlots: 1,
            claimedIds,
        });
        const two = claimNextWaitingItem(items, {
            activeImages: 0,
            activeVideos: 0,
            imageSlots: 3,
            videoSlots: 1,
            claimedIds,
        });

        expect(one?.item.localId).toBe("last");
        expect(two).toBeNull();
    });
});
