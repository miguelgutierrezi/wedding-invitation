/** Test families whose display name includes the word “ejemplo”. */

export function isExampleFamilyName(name: string): boolean {
    const folded = name
        .trim()
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .toLocaleLowerCase();

    return /\bejemplo\b/.test(folded);
}

export function omitExampleFamilies<T extends { displayName: string }>(
    families: T[],
): T[] {
    return families.filter((family) => !isExampleFamilyName(family.displayName));
}

export function omitGuestsOfExampleFamilies<
    TGuest extends { familyId: string },
    TFamily extends { id: string; displayName: string },
>(guests: TGuest[], families: TFamily[]): TGuest[] {
    const skipIds = new Set(
        families
            .filter((family) => isExampleFamilyName(family.displayName))
            .map((family) => family.id),
    );

    return guests.filter((guest) => !skipIds.has(guest.familyId));
}
