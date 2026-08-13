import { describe, expect, it } from "vitest";

import { formatCoverGreeting } from "@/lib/invitation/cover-greeting";

describe("formatCoverGreeting", () => {
  it("uses Querido for a single male guest", () => {
    expect(
      formatCoverGreeting({
        displayName: "Familia Pérez",
        guests: [{ fullName: "Luis Pérez", gender: "male" }],
      }),
    ).toBe("Querido Luis Pérez");
  });

  it("uses Querida for a single female guest", () => {
    expect(
      formatCoverGreeting({
        displayName: "Familia Pérez",
        guests: [{ fullName: "Ana Pérez", gender: "female" }],
      }),
    ).toBe("Querida Ana Pérez");
  });

  it("joins two guest names with y", () => {
    expect(
      formatCoverGreeting({
        displayName: "Familia Pérez",
        guests: [
          { fullName: "Ana Pérez", gender: "female" },
          { fullName: "Luis Pérez", gender: "male" },
        ],
      }),
    ).toBe("Queridos Ana Pérez y Luis Pérez");
  });

  it("uses the family display name for three or more guests", () => {
    expect(
      formatCoverGreeting({
        displayName: "Familia Pérez",
        guests: [
          { fullName: "Ana", gender: "female" },
          { fullName: "Luis", gender: "male" },
          { fullName: "Sofía", gender: "female" },
        ],
      }),
    ).toBe("Querida Familia Pérez");
  });

  it("falls back to family label when there are no guest names", () => {
    expect(
      formatCoverGreeting({
        displayName: "Familia Pérez",
        guests: [],
      }),
    ).toBe("Querida Familia Pérez");
  });
});
