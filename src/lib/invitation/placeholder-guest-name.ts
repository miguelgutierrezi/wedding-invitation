/**
 * Detects placeholder companion labels used when the plus-one name is unknown.
 * Keep in sync with `public.is_placeholder_guest_name` in SQL migrations.
 */
export function normalizeGuestName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ");
}

export function isPlaceholderGuestName(name: string): boolean {
  const normalized = normalizeGuestName(name);
  return /^(acompanante( \d+)?|plus one|plus-one|plusone)$/.test(normalized);
}
