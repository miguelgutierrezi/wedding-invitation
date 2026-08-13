import { guestMediaConfig } from "@/config/guest-media";

/**
 * Allowed status transitions for guest_media_uploads.
 * `uploaded` requires Storage object verification (enforced in service).
 */
const ALLOWED: Record<string, readonly string[]> = {
  pending: ["uploading", "failed"],
  uploading: ["uploaded", "failed"],
  uploaded: ["approved", "rejected", "failed"],
  approved: ["rejected"],
  rejected: ["approved"],
  failed: [],
};

export function canTransitionMediaStatus(
  from: string,
  to: string,
): boolean {
  return (ALLOWED[from] ?? []).includes(to);
}

export function isTerminalFailureStatus(status: string): boolean {
  return status === "failed";
}

export function isReviewableStatus(status: string): boolean {
  return status === "uploaded" || status === "approved" || status === "rejected";
}

export { guestMediaConfig };
