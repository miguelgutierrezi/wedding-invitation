"use server";

import {
  authorizeMediaUploadSchema,
  completeMediaUploadSchema,
  failMediaUploadSchema,
} from "@/lib/validation/guest-media";
import {
  authorizeMediaUpload,
  completeMediaUpload,
  failMediaUpload,
} from "@/services/media/uploads";

export async function authorizeMediaUploadAction(input: unknown) {
  const parsed = authorizeMediaUploadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  return authorizeMediaUpload(parsed.data);
}

export async function completeMediaUploadAction(input: unknown) {
  const parsed = completeMediaUploadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  return completeMediaUpload(parsed.data.uploadId, parsed.data.website);
}

export async function failMediaUploadAction(input: unknown) {
  const parsed = failMediaUploadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  return failMediaUpload(
    parsed.data.uploadId,
    parsed.data.errorCode,
    parsed.data.website,
  );
}
