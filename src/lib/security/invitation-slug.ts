/**
 * Builds a URL-safe invitation slug from a family display name.
 * Example: "Familia Gutiérrez Panqueva" → "familia-gutierrez-panqueva"
 *
 * Plus-one suffixes like "& Acompañante" are ignored so the public path
 * stays `/i/abelardo-valdivieso` instead of `...-acompanante`.
 */
export function displayNameForInvitationSlug(displayName: string): string {
    const stripped = displayName
        .replace(/\s*&\s*acompa[nñ]ante(?:\s+\d+)?\s*$/i, "")
        .trim();

    return stripped.length > 0 ? stripped : displayName.trim();
}

export function slugifyInvitationLabel(value: string): string {
    const slug = value
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);

    return slug;
}

export const invitationSlugSchemaPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isValidInvitationSlug(value: string): boolean {
    return (
        invitationSlugSchemaPattern.test(value) &&
        value.length >= 2 &&
        value.length <= 80
    );
}
