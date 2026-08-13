import { describe, expect, it } from "vitest";

import {
  EVENT_TIMEZONE,
  formatEventDateTime,
  formatEventLongDate,
  resolveEventTimezone,
} from "@/lib/datetime/event-timezone";

describe("event timezone", () => {
  it("defaults to America/Bogota (UTC−5, no DST)", () => {
    expect(EVENT_TIMEZONE).toBe("America/Bogota");
    expect(resolveEventTimezone(null)).toBe("America/Bogota");
    expect(resolveEventTimezone("")).toBe("America/Bogota");
  });

  it("formats UTC noon as morning in Bogota", () => {
    // 2026-10-24T17:00:00.000Z == 12:00 in America/Bogota
    const stamped = formatEventDateTime(
      "2026-10-24T17:00:00.000Z",
      "—",
      "America/Bogota",
    );
    expect(stamped).toContain("24");
    expect(stamped).toContain("2026");
    expect(stamped).toMatch(/12:00/);
    expect(
      formatEventLongDate("2026-10-24T16:00:00-05:00", "America/Bogota"),
    ).toMatch(/24.*octubre.*2026/i);
  });

  it("keeps the same calendar day for end-of-day Bogota deadline", () => {
    // Stored with -05:00; must not roll to 16 Sep when formatted in UTC.
    const label = formatEventDateTime(
      "2026-09-15T23:59:59-05:00",
      "—",
      "America/Bogota",
    );
    expect(label).toMatch(/^15\//);
    expect(label).not.toMatch(/^16\//);
  });
});
