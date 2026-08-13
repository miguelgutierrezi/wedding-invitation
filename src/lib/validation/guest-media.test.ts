import { describe, expect, it } from "vitest";

import { guestMediaConfig } from "@/config/guest-media";
import { generateGuestMediaObjectKey } from "@/lib/media/object-key";
import { canTransitionMediaStatus } from "@/lib/media/status";
import { hashOpaqueToken } from "@/lib/media/token-hash";
import {
  assertFileWithinPolicy,
  maxBytesForMediaType,
} from "@/lib/validation/guest-media";

describe("guest media policy", () => {
  it("allows jpeg under 50 MB", () => {
    const result = assertFileWithinPolicy({
      mimeType: "image/jpeg",
      sizeBytes: 40 * 1024 * 1024,
      originalFilename: "foto.jpg",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.mediaType).toBe("image");
    }
  });

  it("rejects images over 50 MB", () => {
    const result = assertFileWithinPolicy({
      mimeType: "image/png",
      sizeBytes: guestMediaConfig.image.maxBytes + 1,
      originalFilename: "grande.png",
    });
    expect(result.ok).toBe(false);
  });

  it("allows videos up to 3 GB", () => {
    const result = assertFileWithinPolicy({
      mimeType: "video/mp4",
      sizeBytes: maxBytesForMediaType("video"),
      originalFilename: "clip.mp4",
    });
    expect(result.ok).toBe(true);
  });

  it("rejects videos over 3 GB", () => {
    const result = assertFileWithinPolicy({
      mimeType: "video/mp4",
      sizeBytes: guestMediaConfig.video.maxBytes + 1,
      originalFilename: "clip.mp4",
    });
    expect(result.ok).toBe(false);
  });

  it("rejects heic by default", () => {
    const result = assertFileWithinPolicy({
      mimeType: "image/heic",
      sizeBytes: 1024,
      originalFilename: "foto.heic",
    });
    expect(result.ok).toBe(false);
  });

  it("rejects mime/extension mismatch", () => {
    const result = assertFileWithinPolicy({
      mimeType: "image/jpeg",
      sizeBytes: 1024,
      originalFilename: "clip.mp4",
    });
    expect(result.ok).toBe(false);
  });

  it("does not impose a selection count limit in policy helpers", () => {
    // Selection quantity is unconstrained in assertFileWithinPolicy;
    // queue processes each file independently.
    const many = Array.from({ length: 200 }, (_, i) =>
      assertFileWithinPolicy({
        mimeType: "image/webp",
        sizeBytes: 1024,
        originalFilename: `n${i}.webp`,
      }),
    );
    expect(many.every((r) => r.ok)).toBe(true);
  });
});

describe("guest media object keys", () => {
  it("generates unique random keys without event ids", () => {
    const a = generateGuestMediaObjectKey("a.jpg");
    const b = generateGuestMediaObjectKey("a.jpg");
    expect(a).not.toEqual(b);
    expect(a).toMatch(/\.jpg$/);
    expect(a.includes("event")).toBe(false);
  });
});

describe("guest media status transitions", () => {
  it("allows pending -> uploading -> uploaded", () => {
    expect(canTransitionMediaStatus("pending", "uploading")).toBe(true);
    expect(canTransitionMediaStatus("uploading", "uploaded")).toBe(true);
    expect(canTransitionMediaStatus("pending", "uploaded")).toBe(false);
  });

  it("allows review from uploaded", () => {
    expect(canTransitionMediaStatus("uploaded", "approved")).toBe(true);
    expect(canTransitionMediaStatus("uploaded", "rejected")).toBe(true);
  });
});

describe("qr token hashing", () => {
  it("hashes stably and does not equal plaintext", () => {
    const token = "super-secret-opaque-token-value-123456";
    const hash = hashOpaqueToken(token);
    expect(hash).toHaveLength(64);
    expect(hash).not.toEqual(token);
    expect(hashOpaqueToken(token)).toEqual(hash);
  });
});

describe("session quota math", () => {
  it("uses configured 20 GB session and 50 GB IP budgets", () => {
    expect(guestMediaConfig.quotas.sessionMaxBytes).toBe(20 * 1024 ** 3);
    expect(guestMediaConfig.quotas.tokenOrIpMaxBytes24h).toBe(50 * 1024 ** 3);
  });
});
