import { describe, expect, it } from "vitest";

import {
  mapCreateFamilyRpcError,
  mapDeleteFamilyRpcError,
  mapUpdateFamilyRpcError,
} from "@/services/admin/admin-family-rpc-errors";

describe("admin family RPC error mapping", () => {
  it("maps shared codes for update", () => {
    expect(mapUpdateFamilyRpcError("FAMILY_NOT_FOUND")).toContain("familia");
    expect(mapUpdateFamilyRpcError("GUEST_LIMIT_EXCEEDED")).toContain("cupos");
    expect(mapUpdateFamilyRpcError("SLUG_IN_USE")).toContain("enlace");
    expect(mapUpdateFamilyRpcError("INVALID_SLUG")).toContain("válida");
    expect(mapUpdateFamilyRpcError("INVALID_GUEST_GENDERS")).toContain("género");
    expect(mapUpdateFamilyRpcError("INVALID_GUEST_IDS")).toContain("asociar");
  });

  it("maps create-specific and shared codes", () => {
    expect(mapCreateFamilyRpcError("EVENT_NOT_FOUND")).toContain("evento");
    expect(mapCreateFamilyRpcError("SLUG_IN_USE")).toContain("enlace");
    expect(mapCreateFamilyRpcError("something else")).toBe(
      "No se pudo crear la familia.",
    );
  });

  it("falls back for unknown update errors", () => {
    expect(mapUpdateFamilyRpcError("something else")).toBe(
      "No se pudo actualizar la familia.",
    );
  });

  it("maps delete errors", () => {
    expect(mapDeleteFamilyRpcError("FAMILY_NOT_FOUND")).toContain("familia");
  });
});
