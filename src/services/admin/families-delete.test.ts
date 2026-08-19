import { beforeEach, describe, expect, it, vi } from "vitest";

const rpc = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ rpc }),
}));
vi.mock("@/lib/logging/server-log", () => ({ serverLog: vi.fn() }));

import { deleteFamily } from "@/services/admin/families";

describe("deleteFamily", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls delete_family RPC", async () => {
    rpc.mockResolvedValue({ error: null });
    await deleteFamily("11111111-1111-4111-8111-111111111111");
    expect(rpc).toHaveBeenCalledWith("delete_family", {
      p_family_id: "11111111-1111-4111-8111-111111111111",
    });
  });

  it("maps missing-family RPC errors", async () => {
    rpc.mockResolvedValue({ error: { message: "FAMILY_NOT_FOUND" } });
    await expect(
      deleteFamily("11111111-1111-4111-8111-111111111111"),
    ).rejects.toThrow("No se encontró la familia.");
  });
});
