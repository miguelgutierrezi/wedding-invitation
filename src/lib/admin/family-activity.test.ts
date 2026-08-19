import {describe, expect, it} from "vitest";

import {buildFamilyActivityTimeline} from "@/lib/admin/family-activity";

describe("buildFamilyActivityTimeline", () => {
  it("collapses consecutive invitation opens and labels RSVP", () => {
    const items = buildFamilyActivityTimeline([
      {
        id: "1",
        createdAt: "2026-08-19T10:00:00.000Z",
        action: "rsvp_submitted",
        metadata: {will_attend: true, confirmed_guest_count: 2},
      },
      {
        id: "2",
        createdAt: "2026-08-18T12:00:00.000Z",
        action: "invitation_opened",
        metadata: {source: "invitation_page"},
      },
      {
        id: "3",
        createdAt: "2026-08-18T11:00:00.000Z",
        action: "invitation_opened",
        metadata: {source: "invitation_page"},
      },
      {
        id: "4",
        createdAt: "2026-08-01T09:00:00.000Z",
        action: "family_created",
        metadata: {source: "admin"},
      },
    ]);

    expect(items.map((item) => item.title)).toEqual([
      "Envió la confirmación",
      "Abrió la invitación (2 veces)",
      "Se creó la familia",
    ]);
    expect(items[0]?.detail).toContain("Asisten");
    expect(items[2]?.detail).toBe("Desde el panel");
  });

  it("labels slug regeneration", () => {
    const [item] = buildFamilyActivityTimeline([
      {
        id: "r",
        createdAt: "2026-08-19T10:00:00.000Z",
        action: "invitation_token_regenerated",
        metadata: {source: "admin", invitation_slug: "familia-perez"},
      },
    ]);
    expect(item?.title).toBe("Se generó un enlace nuevo");
    expect(item?.detail).toContain("/i/familia-perez");
  });
});
