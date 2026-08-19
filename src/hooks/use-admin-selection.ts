"use client";

import {useCallback, useMemo, useState} from "react";

import {selectIds, toggleId} from "@/lib/admin/selection";

export function useAdminSelection() {
    const [selected, setSelected] = useState<Set<string>>(() => new Set());

    const selectedIds = useMemo(() => [...selected], [selected]);

    const toggle = useCallback((id: string) => {
        setSelected((current) => toggleId(current, id));
    }, []);

    const setMany = useCallback((ids: string[], selectedOn: boolean) => {
        setSelected((current) => selectIds(current, ids, selectedOn));
    }, []);

    const clear = useCallback(() => {
        setSelected(new Set());
    }, []);

    const isSelected = useCallback(
        (id: string) => selected.has(id),
        [selected],
    );

    return {
        selected,
        selectedIds,
        count: selected.size,
        toggle,
        setMany,
        clear,
        isSelected,
    };
}
