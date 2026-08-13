import { beforeEach, describe, expect, it, vi } from "vitest";

const { assertMediaQrLookupRateLimit, createAdminClient } = vi.hoisted(() => ({
  assertMediaQrLookupRateLimit: vi.fn(),
  createAdminClient: vi.fn(),
}));

vi.mock("@/lib/security/media-rate-limit", () => ({
  assertMediaQrLookupRateLimit,
}));
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient,
}));
vi.mock("@/lib/logging/server-log", () => ({
  serverLog: vi.fn(),
}));

import { hashOpaqueToken } from "@/lib/media/token-hash";
import {
  resolveEventMediaQrAccess,
  updateEventMediaQrWindow,
} from "@/services/media/qr-access";

describe("resolveEventMediaQrAccess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    assertMediaQrLookupRateLimit.mockResolvedValue(true);
  });

  it("returns null for short codes", async () => {
    await expect(resolveEventMediaQrAccess("short")).resolves.toBeNull();
  });

  it("returns null when rate limited", async () => {
    assertMediaQrLookupRateLimit.mockResolvedValue(false);
    await expect(resolveEventMediaQrAccess("a".repeat(32))).resolves.toBeNull();
  });

  it("returns null for unknown token", async () => {
    createAdminClient.mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: null, error: null }),
          }),
        }),
      }),
    });
    await expect(resolveEventMediaQrAccess("a".repeat(32))).resolves.toBeNull();
  });

  it("returns null when disabled", async () => {
    const token = "b".repeat(32);
    createAdminClient.mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: {
                event_id: "event-1",
                token_hash: hashOpaqueToken(token),
                token_preview: "bbbbbbbb",
                is_enabled: false,
                opens_at: null,
                closes_at: null,
              },
              error: null,
            }),
          }),
        }),
      }),
    });
    await expect(resolveEventMediaQrAccess(token)).resolves.toBeNull();
  });

  it("returns null when window closed", async () => {
    const token = "c".repeat(32);
    createAdminClient.mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: {
                event_id: "event-1",
                token_hash: hashOpaqueToken(token),
                token_preview: "cccccccc",
                is_enabled: true,
                opens_at: null,
                closes_at: "2020-01-01T00:00:00.000Z",
              },
              error: null,
            }),
          }),
        }),
      }),
    });
    await expect(resolveEventMediaQrAccess(token)).resolves.toBeNull();
  });

  it("returns event when token is valid and open", async () => {
    const token = "d".repeat(32);
    createAdminClient.mockReturnValue({
      from: (table: string) => {
        if (table === "event_guest_media_access") {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: {
                    event_id: "event-1",
                    token_hash: hashOpaqueToken(token),
                    token_preview: "dddddddd",
                    is_enabled: true,
                    opens_at: null,
                    closes_at: null,
                  },
                  error: null,
                }),
              }),
            }),
          };
        }
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: { id: "event-1", name: "Matrimonio" },
                error: null,
              }),
            }),
          }),
        };
      },
    });

    await expect(resolveEventMediaQrAccess(token)).resolves.toEqual({
      eventId: "event-1",
      eventName: "Matrimonio",
    });
  });
});

describe("updateEventMediaQrWindow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid dates before updating", async () => {
    const result = await updateEventMediaQrWindow({
      eventId: "11111111-1111-4111-8111-111111111111",
      opensAt: "not-a-date",
      closesAt: null,
    });
    expect(result.ok).toBe(false);
    expect(createAdminClient).not.toHaveBeenCalled();
  });

  it("rejects when no access row is updated", async () => {
    createAdminClient.mockReturnValue({
      from: () => ({
        update: () => ({
          eq: () => ({
            select: () => ({
              maybeSingle: async () => ({ data: null, error: null }),
            }),
          }),
        }),
      }),
    });

    const result = await updateEventMediaQrWindow({
      eventId: "11111111-1111-4111-8111-111111111111",
      opensAt: null,
      closesAt: null,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("acceso QR");
    }
  });

  it("returns ok when a row is updated", async () => {
    createAdminClient.mockReturnValue({
      from: () => ({
        update: () => ({
          eq: () => ({
            select: () => ({
              maybeSingle: async () => ({
                data: { event_id: "11111111-1111-4111-8111-111111111111" },
                error: null,
              }),
            }),
          }),
        }),
      }),
    });

    const result = await updateEventMediaQrWindow({
      eventId: "11111111-1111-4111-8111-111111111111",
      opensAt: "2026-08-10T12:00:00.000Z",
      closesAt: "2026-08-20T12:00:00.000Z",
    });
    expect(result.ok).toBe(true);
  });
});
