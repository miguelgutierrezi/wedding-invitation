export function familyDeleteNameMatches(
    typed: string,
    ...candidates: string[]
): boolean {
    const needle = typed.trim().toLocaleLowerCase();
    if (!needle) {
        return false;
    }

    return candidates.some(
        (name) => name.trim().toLocaleLowerCase() === needle,
    );
}
