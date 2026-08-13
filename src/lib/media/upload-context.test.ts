import { describe, expect, it } from "vitest";

import {
  assertUploadContextBinding,
  assertUploadSessionOwnership,
  assertUploadedObjectSize,
  canCompleteUploadWhenObjectExists,
} from "@/lib/media/upload-context";

describe("assertUploadContextBinding", () => {
  it("requires family for invitation source", () => {
    expect(
      assertUploadContextBinding({
        eventId: "e1",
        familyId: null,
        source: "invitation",
      }).ok,
    ).toBe(false);
  });

  it("rejects family id on event_qr source", () => {
    expect(
      assertUploadContextBinding({
        eventId: "e1",
        familyId: "other-family",
        source: "event_qr",
      }).ok,
    ).toBe(false);
  });

  it("allows invitation with server-bound family", () => {
    expect(
      assertUploadContextBinding({
        eventId: "e1",
        familyId: "f1",
        source: "invitation",
      }).ok,
    ).toBe(true);
  });

  it("allows qr with null family", () => {
    expect(
      assertUploadContextBinding({
        eventId: "e1",
        familyId: null,
        source: "event_qr",
      }).ok,
    ).toBe(true);
  });
});

describe("assertUploadSessionOwnership", () => {
  it("rejects foreign session", () => {
    expect(
      assertUploadSessionOwnership({
        rowSessionId: "session-a",
        currentSessionId: "session-b",
      }),
    ).toBe(false);
  });

  it("allows matching session", () => {
    expect(
      assertUploadSessionOwnership({
        rowSessionId: "session-a",
        currentSessionId: "session-a",
      }),
    ).toBe(true);
  });
});

describe("canCompleteUploadWhenObjectExists", () => {
  it("requires object for uploading status", () => {
    const missing = canCompleteUploadWhenObjectExists({
      status: "uploading",
      objectExists: false,
    });
    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.code).toBe("object_missing");
    }
  });

  it("allows complete when object exists", () => {
    expect(
      canCompleteUploadWhenObjectExists({
        status: "uploading",
        objectExists: true,
      }).ok,
    ).toBe(true);
  });

  it("treats already uploaded as ok", () => {
    expect(
      canCompleteUploadWhenObjectExists({
        status: "uploaded",
        objectExists: false,
      }).ok,
    ).toBe(true);
  });

  it("rejects pending without transition", () => {
    const result = canCompleteUploadWhenObjectExists({
      status: "pending",
      objectExists: true,
    });
    expect(result.ok).toBe(false);
  });
});

describe("assertUploadedObjectSize", () => {
  it("rejects unknown actual size", () => {
    const result = assertUploadedObjectSize({
      declaredBytes: 1000,
      actualBytes: null,
      maxBytes: 50 * 1024 * 1024,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("size_unknown");
    }
  });

  it("rejects when actual exceeds declared (quota evasion)", () => {
    const result = assertUploadedObjectSize({
      declaredBytes: 1000,
      actualBytes: 5000,
      maxBytes: 50 * 1024 * 1024,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("size_mismatch");
    }
  });

  it("rejects when actual exceeds policy max", () => {
    const result = assertUploadedObjectSize({
      declaredBytes: 60 * 1024 * 1024,
      actualBytes: 55 * 1024 * 1024,
      maxBytes: 50 * 1024 * 1024,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("size_exceeded");
    }
  });

  it("accepts actual equal to declared", () => {
    const result = assertUploadedObjectSize({
      declaredBytes: 1000,
      actualBytes: 1000,
      maxBytes: 50 * 1024 * 1024,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.sizeBytes).toBe(1000);
    }
  });
});
