import "server-only";

import { guestMediaConfig } from "@/config/guest-media";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  MediaStorageProvider,
  SignedUploadAuthorization,
  StorageObjectInfo,
} from "@/services/media/storage-provider";

function storageApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
  // Prefer direct storage host when using hosted Supabase.
  try {
    const url = new URL(raw);
    if (url.hostname.endsWith(".supabase.co")) {
      const projectRef = url.hostname.split(".")[0];
      return `https://${projectRef}.storage.supabase.co/storage/v1`;
    }
  } catch {
    // fall through
  }
  return `${raw}/storage/v1`;
}

export function createSupabaseMediaStorageProvider(): MediaStorageProvider {
  const bucket = guestMediaConfig.bucketName;

  return {
    async createSignedUpload({ objectKey, upsert = false }) {
      const supabase = createAdminClient();
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUploadUrl(objectKey, { upsert });

      if (error || !data) {
        throw new Error(
          error?.message ?? "No se pudo autorizar la carga al almacenamiento.",
        );
      }

      const auth: SignedUploadAuthorization = {
        objectKey: data.path || objectKey,
        token: data.token,
        signedUrl: data.signedUrl,
        tusEndpoint: `${storageApiBaseUrl()}/upload/resumable/sign`,
        bucketName: bucket,
      };
      return auth;
    },

    async objectExists(objectKey): Promise<StorageObjectInfo> {
      const supabase = createAdminClient();
      const folder = objectKey.includes("/")
        ? objectKey.slice(0, objectKey.lastIndexOf("/"))
        : "";
      const name = objectKey.includes("/")
        ? objectKey.slice(objectKey.lastIndexOf("/") + 1)
        : objectKey;

      const { data, error } = await supabase.storage.from(bucket).list(folder, {
        search: name,
        limit: 100,
      });

      if (error) {
        throw new Error(error.message);
      }

      const match = (data ?? []).find((item) => item.name === name);
      return {
        objectKey,
        exists: Boolean(match),
        sizeBytes:
          typeof match?.metadata?.size === "number"
            ? match.metadata.size
            : null,
      };
    },

    async createPreviewUrl({ objectKey, expiresInSeconds }) {
      const supabase = createAdminClient();
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(objectKey, expiresInSeconds);

      if (error || !data?.signedUrl) {
        throw new Error(error?.message ?? "No se pudo firmar la vista previa.");
      }

      return data.signedUrl;
    },

    async deleteObject(objectKey) {
      const supabase = createAdminClient();
      const { error } = await supabase.storage.from(bucket).remove([objectKey]);
      if (error) {
        throw new Error(error.message);
      }
    },
  };
}

let cachedProvider: MediaStorageProvider | null = null;

/** Default provider singleton for this deployment. */
export function getMediaStorageProvider(): MediaStorageProvider {
  if (!cachedProvider) {
    cachedProvider = createSupabaseMediaStorageProvider();
  }
  return cachedProvider;
}
