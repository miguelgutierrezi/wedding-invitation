export function uniqueIds(ids: string[]): string[] {
    return [...new Set(ids)];
}

export function toggleId(
    selected: ReadonlySet<string>,
    id: string,
): Set<string> {
    const next = new Set(selected);
    if (next.has(id)) {
        next.delete(id);
    } else {
        next.add(id);
    }
    return next;
}

export function selectIds(
    selected: ReadonlySet<string>,
    ids: string[],
    selectedOn: boolean,
): Set<string> {
    const next = new Set(selected);
    for (const id of ids) {
        if (selectedOn) {
            next.add(id);
        } else {
            next.delete(id);
        }
    }
    return next;
}

export function pageSelectionState(
    pageIds: string[],
    selected: ReadonlySet<string>,
): "none" | "some" | "all" {
    if (pageIds.length === 0) {
        return "none";
    }

    let matched = 0;
    for (const id of pageIds) {
        if (selected.has(id)) {
            matched += 1;
        }
    }

    if (matched === 0) {
        return "none";
    }
    if (matched === pageIds.length) {
        return "all";
    }
    return "some";
}
