"use client";

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

import {rememberAdminFamiliesListHref} from "@/lib/admin/admin-list-return";
import {adminListHref} from "@/lib/validation/admin-filters";

/**
 * Keeps admin list filters in React state and in the Next.js URL so browser
 * back/forward restores the same filters (App Router-aware `router.replace`).
 * Also remembers the Familias list href for the in-app back chevron.
 */
export function useAdminListFilters<T>({
    pathname,
    initialFilters,
    buildQuery,
}: {
    pathname: string;
    initialFilters: T;
    buildQuery: (filters: T) => string;
}) {
    const router = useRouter();
    const syncKey = buildQuery(initialFilters);
    const [filters, setFilters] = useState(initialFilters);
    const [prevSyncKey, setPrevSyncKey] = useState(syncKey);

    const listHref = adminListHref(pathname, syncKey);

    useEffect(() => {
        if (pathname === "/admin/families") {
            rememberAdminFamiliesListHref(listHref);
        }
    }, [pathname, listHref]);

    // When App Router restores a different search string (back/forward), resync.
    if (syncKey !== prevSyncKey) {
        setPrevSyncKey(syncKey);
        setFilters(initialFilters);
    }

    function updateFilters(next: T) {
        const nextKey = buildQuery(next);
        const nextHref = adminListHref(pathname, nextKey);
        setFilters(next);
        setPrevSyncKey(nextKey);
        if (pathname === "/admin/families") {
            rememberAdminFamiliesListHref(nextHref);
        }
        router.replace(nextHref, {
            scroll: false,
        });
    }

    return {filters, updateFilters};
}
