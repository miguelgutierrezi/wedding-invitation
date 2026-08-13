/**
 * Central guest-media upload policy (images/videos).
 * Change limits here — UI and server validation import this module.
 */
export const guestMediaConfig = {
  bucketName: "guest-media",

  /** Storage quota budget used for admin alerts (bytes). Override via env. */
  storageQuotaBytes:
    Number(process.env.GUEST_MEDIA_STORAGE_QUOTA_BYTES) || 50 * 1024 ** 3,

  image: {
    maxBytes: 50 * 1024 * 1024,
    mimeTypes: ["image/jpeg", "image/png", "image/webp"] as const,
    extensions: [".jpg", ".jpeg", ".png", ".webp"] as const,
  },

  video: {
    maxBytes: 3 * 1024 ** 3,
    mimeTypes: ["video/mp4", "video/quicktime", "video/webm"] as const,
    extensions: [".mp4", ".mov", ".webm"] as const,
  },

  /** HEIC intentionally omitted until Safari/Android/Storage/admin are verified. */
  heicEnabled: false,

  concurrency: {
    images: 3,
    videos: 1,
  },

  quotas: {
    /** Soft abuse guard — not shown preventively in the UI. */
    sessionMaxBytes: 20 * 1024 ** 3,
    /** Soft abuse guard per token-or-IP key over rolling 24h. */
    tokenOrIpMaxBytes24h: 50 * 1024 ** 3,
    maxActiveUploadsPerSession: 8,
  },

  signedUrl: {
    /** Preview / download TTL for admin signed GET URLs (seconds). */
    previewTtlSeconds: 60 * 15,
    /** Prefer upsert:false so object keys cannot be overwritten. */
    allowOverwrite: false,
  },

  tus: {
    /** Required by Supabase Storage TUS today. */
    chunkSizeBytes: 6 * 1024 * 1024,
  },

  cleanup: {
    /** Abandon pending/uploading rows older than this. */
    staleUploadAfterMs: 24 * 60 * 60 * 1000,
  },

  uploaderNameMaxLength: 120,
  originalFilenameMaxLength: 180,
} as const;

export type GuestMediaImageMime =
  (typeof guestMediaConfig.image.mimeTypes)[number];
export type GuestMediaVideoMime =
  (typeof guestMediaConfig.video.mimeTypes)[number];
export type GuestMediaMime = GuestMediaImageMime | GuestMediaVideoMime;

export type GuestMediaType = "image" | "video";
export type GuestMediaSource = "invitation" | "event_qr";
export type GuestMediaStatus =
  | "pending"
  | "uploading"
  | "uploaded"
  | "approved"
  | "rejected"
  | "failed";
