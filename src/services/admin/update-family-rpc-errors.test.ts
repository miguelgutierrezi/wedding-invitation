import { describe, expect, it } from "vitest";

import { mapUpdateFamilyRpcError } from "@/services/admin/update-family-rpc-errors";

describe("mapUpdateFamilyRpcError", () => {
  it("maps known SQL exception codes to Spanish messages", () => {
    expect(mapUpdateFamilyRpcError("FAMILY_NOT_FOUND")).toContain("familia");
    expect(mapUpdateFamilyRpcError("GUEST_LIMIT_EXCEEDED")).toContain("cupos");
    expect(mapUpdateFamilyRpcError("SLUG_IN_USE")).toContain("slug");
    expect(mapUpdateFamilyRpcError("INVALID_SLUG")).toContain("válido");
    expect(mapUpdateFamilyRpcError("GUEST_DELETE_BLOCKED")).toContain("RSVP");
  });

  it("falls back for unknown errors", () => {
    expect(mapUpdateFamilyRpcError("something else")).toBe(
      "No se pudo actualizar la familia.",
    );
  });
});
