import { describe, expect, it } from "vitest";

import { isEventMediaQrAccessOpen } from "@/lib/media/qr-window";

describe("isEventMediaQrAccessOpen", () => {
  const now = new Date("2026-10-24T12:00:00.000Z");

  it("rejects disabled access", () => {
    expect(
      isEventMediaQrAccessOpen(
        { isEnabled: false, opensAt: null, closesAt: null },
        now,
      ),
    ).toBe(false);
  });

  it("rejects before opens_at", () => {
    expect(
      isEventMediaQrAccessOpen(
        {
          isEnabled: true,
          opensAt: "2026-10-24T18:00:00.000Z",
          closesAt: null,
        },
        now,
      ),
    ).toBe(false);
  });

  it("rejects after closes_at", () => {
    expect(
      isEventMediaQrAccessOpen(
        {
          isEnabled: true,
          opensAt: null,
          closesAt: "2026-10-24T10:00:00.000Z",
        },
        now,
      ),
    ).toBe(false);
  });

  it("allows enabled access within window", () => {
    expect(
      isEventMediaQrAccessOpen(
        {
          isEnabled: true,
          opensAt: "2026-10-24T08:00:00.000Z",
          closesAt: "2026-10-25T08:00:00.000Z",
        },
        now,
      ),
    ).toBe(true);
  });

  it("allows enabled access with open-ended window", () => {
    expect(
      isEventMediaQrAccessOpen(
        { isEnabled: true, opensAt: null, closesAt: null },
        now,
      ),
    ).toBe(true);
  });
});
