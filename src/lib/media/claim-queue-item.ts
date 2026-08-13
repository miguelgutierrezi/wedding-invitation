import type { MediaQueueItem } from "@/hooks/use-media-upload-queue";

type ClaimOptions = {
  activeImages: number;
  activeVideos: number;
  imageSlots: number;
  videoSlots: number;
  /** Synchronously claimed ids for this run (prevents duplicate pumps). */
  claimedIds: Set<string>;
};

/**
 * Picks the next waiting file and marks it preparing in a new array.
 * Claim is synchronous via `claimedIds` so concurrent pumps cannot grab the same item.
 */
export function claimNextWaitingItem(
  items: MediaQueueItem[],
  options: ClaimOptions,
): { item: MediaQueueItem; nextItems: MediaQueueItem[] } | null {
  const next = items.find((item) => {
    if (item.status !== "waiting") {
      return false;
    }
    if (options.claimedIds.has(item.localId)) {
      return false;
    }
    const isVideo = item.file.type.startsWith("video/");
    if (isVideo) {
      return options.activeVideos < options.videoSlots;
    }
    return options.activeImages < options.imageSlots;
  });

  if (!next) {
    return null;
  }

  options.claimedIds.add(next.localId);
  const claimed: MediaQueueItem = { ...next, status: "preparing" };
  const nextItems = items.map((item) =>
    item.localId === next.localId ? claimed : item,
  );

  return { item: claimed, nextItems };
}
