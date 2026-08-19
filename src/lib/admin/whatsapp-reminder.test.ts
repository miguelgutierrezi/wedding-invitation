import { describe, expect, it } from "vitest";

import { formatWhatsAppReminderMessage } from "@/lib/admin/whatsapp-reminder";

describe("formatWhatsAppReminderMessage", () => {
  it("fills family, link, and couple placeholders", () => {
    const message = formatWhatsAppReminderMessage({
      familyName: "Familia Pérez",
      invitationUrl: "https://example.com/i/familia-perez",
    });

    expect(message).toContain("Familia Pérez");
    expect(message).toContain("https://example.com/i/familia-perez");
    expect(message).toContain("Nychol y Miguel");
    expect(message).not.toContain("{familia}");
    expect(message).not.toContain("{enlace}");
    expect(message).not.toContain("{pareja}");
  });
});
