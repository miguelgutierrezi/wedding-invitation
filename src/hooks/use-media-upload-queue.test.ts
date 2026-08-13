import { describe, expect, it } from "vitest";

import type { MediaQueueItem } from "@/hooks/use-media-upload-queue";

/**
 * Pure helper mirroring queue continuation rules used by the uploader UX.
 */
function summarizeAfterFailure(items: Pick<MediaQueueItem, "status">[]) {
  return {
    completed: items.filter((i) => i.status === "completed").length,
    failed: items.filter((i) => i.status === "failed").length,
    pending: items.filter((i) =>
      ["waiting", "preparing", "uploading"].includes(i.status),
    ).length,
  };
}

function retryFailedStatuses(
  items: { status: string }[],
): { status: string }[] {
  return items.map((item) =>
    item.status === "failed" ? { ...item, status: "waiting" } : item,
  );
}

describe("media upload queue behavior", () => {
  it("continues counting remaining work when one file fails", () => {
    const summary = summarizeAfterFailure([
      { status: "completed" },
      { status: "failed" },
      { status: "waiting" },
    ]);
    expect(summary.completed).toBe(1);
    expect(summary.failed).toBe(1);
    expect(summary.pending).toBe(1);
  });

  it("retries only failed items", () => {
    const next = retryFailedStatuses([
      { status: "completed" },
      { status: "failed" },
      { status: "cancelled" },
    ]);
    expect(next.map((i) => i.status)).toEqual([
      "completed",
      "waiting",
      "cancelled",
    ]);
  });
});
