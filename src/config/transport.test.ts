import { describe, expect, it } from "vitest";

import {
  formatTransportBoardingPoint,
  isTransportBoardingPointId,
  TRANSPORT_BOARDING_POINT_IDS,
} from "@/config/transport";
import { weddingConfig } from "@/config/wedding";

describe("transport boarding helpers", () => {
  it("keeps config meeting point ids in sync with TRANSPORT_BOARDING_POINT_IDS", () => {
    const configIds = weddingConfig.transport.meetingPoints.map(
      (point) => point.id,
    );
    expect([...configIds].sort()).toEqual(
      [...TRANSPORT_BOARDING_POINT_IDS].sort(),
    );
  });

  it("accepts known boarding ids", () => {
    expect(isTransportBoardingPointId("modelia")).toBe(true);
    expect(isTransportBoardingPointId("villa_sonia")).toBe(true);
  });

  it("rejects unknown boarding ids", () => {
    expect(isTransportBoardingPointId("")).toBe(false);
    expect(isTransportBoardingPointId("otro")).toBe(false);
  });

  it("formats boarding place labels for admin", () => {
    expect(formatTransportBoardingPoint("modelia")).toContain("Modelia");
    expect(formatTransportBoardingPoint(null)).toBe("—");
    expect(formatTransportBoardingPoint("desconocido")).toBe("—");
  });
});
