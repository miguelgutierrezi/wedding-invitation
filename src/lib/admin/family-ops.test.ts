import {describe, expect, it} from "vitest";

import {familyGuestSignals, familyOperationChips} from "@/lib/admin/family-ops";

describe("familyGuestSignals", () => {
  it("flags name, bus, and dietary from guests", () => {
    expect(
      familyGuestSignals([
        {
          needsNameConfirmation: true,
          needsTransport: false,
          dietaryRestrictions: null,
        },
        {
          needsNameConfirmation: false,
          needsTransport: true,
          dietaryRestrictions: "  Vegetariana  ",
        },
      ]),
    ).toEqual({
      hasPendingName: true,
      usesBus: true,
      hasDietary: true,
    });
  });
});

describe("familyOperationChips", () => {
  const base = {
    status: "pending" as const,
    isEnabled: true,
    lastOpenedAt: null as string | null,
    hasPendingName: false,
    usesBus: false,
    hasDietary: false,
  };

  it("marks pending families that never opened", () => {
    expect(familyOperationChips(base).map((chip) => chip.key)).toEqual([
      "not-opened",
    ]);
  });

  it("marks opened-but-unconfirmed and extra signals", () => {
    expect(
      familyOperationChips({
        ...base,
        lastOpenedAt: "2026-08-01T12:00:00.000Z",
        hasPendingName: true,
        usesBus: true,
        hasDietary: true,
      }).map((chip) => chip.key),
    ).toEqual(["opened", "name", "bus", "diet"]);
  });

  it("skips open/not-open chips after they confirmed", () => {
    expect(
      familyOperationChips({
        ...base,
        status: "responded",
        lastOpenedAt: "2026-08-01T12:00:00.000Z",
        usesBus: true,
      }).map((chip) => chip.key),
    ).toEqual(["bus"]);
  });
});
