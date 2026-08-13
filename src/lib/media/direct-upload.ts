import * as tus from "tus-js-client";

import { guestMediaConfig } from "@/config/guest-media";
import type { AuthorizedMediaUploadClient } from "@/types/guest-media";

export type DirectUploadHandlers = {
  onProgress?: (ratio: number) => void;
  signal?: AbortSignal;
};

/**
 * Upload bytes directly to Storage. Videos / large files use TUS;
 * smaller images use the signed PUT URL. Never routes through Vercel.
 */
export async function uploadFileToAuthorizedTarget(
  file: File,
  auth: AuthorizedMediaUploadClient,
  handlers: DirectUploadHandlers = {},
): Promise<void> {
  const useTus =
    auth.mediaType === "video" || file.size > guestMediaConfig.tus.chunkSizeBytes;

  if (useTus) {
    await uploadWithTus(file, auth, handlers);
    return;
  }

  await uploadWithSignedPut(file, auth, handlers);
}

async function uploadWithSignedPut(
  file: File,
  auth: AuthorizedMediaUploadClient,
  handlers: DirectUploadHandlers,
): Promise<void> {
  if (handlers.signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const response = await fetch(auth.signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
    signal: handlers.signal,
  });

  if (!response.ok) {
    throw new Error(`Upload HTTP ${response.status}`);
  }

  handlers.onProgress?.(1);
}

function uploadWithTus(
  file: File,
  auth: AuthorizedMediaUploadClient,
  handlers: DirectUploadHandlers,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: auth.tusEndpoint,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        "x-signature": auth.token,
        "x-upsert": guestMediaConfig.signedUrl.allowOverwrite ? "true" : "false",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      chunkSize: auth.chunkSizeBytes || guestMediaConfig.tus.chunkSizeBytes,
      metadata: {
        bucketName: auth.bucketName,
        objectName: auth.objectKey,
        contentType: file.type || "application/octet-stream",
        cacheControl: "3600",
      },
      onError(error) {
        reject(error);
      },
      onProgress(bytesUploaded, bytesTotal) {
        if (bytesTotal > 0) {
          handlers.onProgress?.(bytesUploaded / bytesTotal);
        }
      },
      onSuccess() {
        handlers.onProgress?.(1);
        resolve();
      },
    });

    const abort = () => {
      void upload.abort(true).catch(() => undefined);
      reject(new DOMException("Aborted", "AbortError"));
    };

    if (handlers.signal) {
      if (handlers.signal.aborted) {
        abort();
        return;
      }
      handlers.signal.addEventListener("abort", abort, { once: true });
    }

    void upload.findPreviousUploads().then((previous) => {
      if (previous.length > 0) {
        upload.resumeFromPreviousUpload(previous[0]!);
      }
      upload.start();
    });
  });
}
