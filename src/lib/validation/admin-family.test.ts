import { describe, expect, it } from "vitest";

import {
  deleteFamilySchema,
  parseAdminGuestFormEntries,
  parseIsEnabledFormValue,
  updateFamilySchema,
} from "@/lib/validation/admin-family";

describe("parseAdminGuestFormEntries", () => {
  it("pairs names, genders, and ids by index and drops empty names", () => {
    const formData = new FormData();
    formData.append("guestIds", "11111111-1111-4111-8111-111111111111");
    formData.append("guestNames", "Ana");
    formData.append("guestGenders", "female");
    formData.append("guestIds", "");
    formData.append("guestNames", "  ");
    formData.append("guestGenders", "male");
    formData.append("guestIds", "");
    formData.append("guestNames", "Luis");
    formData.append("guestGenders", "male");

    expect(parseAdminGuestFormEntries(formData)).toEqual([
      {
        id: "11111111-1111-4111-8111-111111111111",
        name: "Ana",
        gender: "female",
      },
      {
        id: "",
        name: "Luis",
        gender: "male",
      },
    ]);
  });
});

describe("parseIsEnabledFormValue", () => {
  it("reads explicit true/false from a hidden field", () => {
    const enabled = new FormData();
    enabled.set("isEnabled", "true");
    expect(parseIsEnabledFormValue(enabled)).toBe(true);

    const disabled = new FormData();
    disabled.set("isEnabled", "false");
    expect(parseIsEnabledFormValue(disabled)).toBe(false);
  });

  it("treats a missing checkbox as disabled", () => {
    expect(parseIsEnabledFormValue(new FormData())).toBe(false);
  });
});

describe("updateFamilySchema guest ids", () => {
  const base = {
    familyId: "11111111-1111-4111-8111-111111111111",
    displayName: "Familia Prueba",
    maximumGuests: 2,
    customMessage: "",
    isEnabled: false,
    guestNames: ["Ana", "Luis"],
    guestGenders: ["female", "male"],
    invitationSlug: "familia-prueba",
  };

  it("accepts matching guest ids", () => {
    const parsed = updateFamilySchema.safeParse({
      ...base,
      guestIds: ["11111111-1111-4111-8111-111111111111", ""],
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects mismatched guest id counts", () => {
    const parsed = updateFamilySchema.safeParse({
      ...base,
      guestIds: ["11111111-1111-4111-8111-111111111111"],
    });

    expect(parsed.success).toBe(false);
  });
});

describe("deleteFamilySchema", () => {
  it("requires a confirmation name", () => {
    expect(
      deleteFamilySchema.safeParse({
        familyId: "11111111-1111-4111-8111-111111111111",
        confirmName: "  ",
      }).success,
    ).toBe(false);
    expect(
      deleteFamilySchema.safeParse({
        familyId: "11111111-1111-4111-8111-111111111111",
        confirmName: "Familia García",
      }).success,
    ).toBe(true);
  });
});
