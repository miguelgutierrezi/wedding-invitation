import { describe, expect, it } from "vitest";

import {
  mapCreateFamilyRpcError,
  mapUpdateFamilyRpcError,
} from "@/services/admin/admin-family-rpc-errors";

describe("admin family RPC error mapping", () => {
  it("maps shared codes for update", () => {
    expect(mapUpdateFamilyRpcError("FAMILY_NOT_FOUND")).toContain("familia");
    expect(mapUpdateFamilyRpcError("GUEST_LIMIT_EXCEEDED")).toContain("cupos");
    expect(mapUpdateFamilyRpcError("SLUG_IN_USE")).toContain("slug");
    expect(mapUpdateFamilyRpcError("INVALID_SLUG")).toContain("válido");
    expect(mapUpdateFamilyRpcError("INVALID_GUEST_GENDERS")).toContain("género");
    expect(mapUpdateFamilyRpcError("INVALID_GUEST_IDS")).toContain("asociar");
  });

  it("maps create-specific and shared codes", () => {
    expect(mapCreateFamilyRpcError("EVENT_NOT_FOUND")).toContain("evento");
    expect(mapCreateFamilyRpcError("SLUG_IN_USE")).toContain("slug");
    expect(mapCreateFamilyRpcError("something else")).toBe(
      "No se pudo crear la familia.",
    );
  });

  it("falls back for unknown update errors", () => {
    expect(mapUpdateFamilyRpcError("something else")).toBe(
      "No se pudo actualizar la familia.",
    );
  });
});
