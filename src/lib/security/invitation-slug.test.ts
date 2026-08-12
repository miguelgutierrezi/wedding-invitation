import { describe, expect, it } from "vitest";

import {
  isValidInvitationSlug,
  slugifyInvitationLabel,
} from "@/lib/security/invitation-slug";

describe("invitation slug helpers", () => {
  it("slugifies display names with accents and spaces", () => {
    expect(slugifyInvitationLabel("Familia Gutiérrez Panqueva")).toBe(
      "familia-gutierrez-panqueva",
    );
  });

  it("trims leading and trailing separators", () => {
    expect(slugifyInvitationLabel("  --Familia Demo--  ")).toBe("familia-demo");
  });

  it("validates public slug shape", () => {
    expect(isValidInvitationSlug("familia-ejemplo")).toBe(true);
    expect(isValidInvitationSlug("a")).toBe(false);
    expect(isValidInvitationSlug("Familia")).toBe(false);
    expect(isValidInvitationSlug("familia--doble")).toBe(false);
  });
});
