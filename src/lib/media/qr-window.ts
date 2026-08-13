/**
 * Pure QR access window checks (no DB).
 */
export type MediaQrWindow = {
  isEnabled: boolean;
  opensAt: string | null;
  closesAt: string | null;
};

export function isEventMediaQrAccessOpen(
  access: MediaQrWindow,
  now: Date = new Date(),
): boolean {
  if (!access.isEnabled) {
    return false;
  }
  if (access.opensAt && new Date(access.opensAt) > now) {
    return false;
  }
  if (access.closesAt && new Date(access.closesAt) < now) {
    return false;
  }
  return true;
}
