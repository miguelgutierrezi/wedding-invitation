import { describe, expect, it, beforeEach } from "vitest";

import {
  consumeRateLimit,
  resetRateLimitBuckets,
} from "@/lib/security/rate-limit";

describe("consumeRateLimit", () => {
  beforeEach(() => {
    resetRateLimitBuckets();
  });

  it("allows up to the limit inside the window", () => {
    const now = 1_000;
    const options = { limit: 3, windowMs: 1_000, now: () => now };

    expect(consumeRateLimit("k", options).ok).toBe(true);
    expect(consumeRateLimit("k", options).ok).toBe(true);
    expect(consumeRateLimit("k", options).ok).toBe(true);
    expect(consumeRateLimit("k", options).ok).toBe(false);
  });

  it("resets after the window elapses", () => {
    const clock = { now: 1_000 };
    const options = { limit: 1, windowMs: 500, now: () => clock.now };

    expect(consumeRateLimit("k", options).ok).toBe(true);
    expect(consumeRateLimit("k", options).ok).toBe(false);

    clock.now = 1_600;
    expect(consumeRateLimit("k", options).ok).toBe(true);
  });

  it("isolates keys", () => {
    const options = { limit: 1, windowMs: 10_000 };
    expect(consumeRateLimit("a", options).ok).toBe(true);
    expect(consumeRateLimit("b", options).ok).toBe(true);
    expect(consumeRateLimit("a", options).ok).toBe(false);
  });
});
