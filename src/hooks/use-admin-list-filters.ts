"use client";

import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";

import {rememberAdminFamiliesListHref} from "@/lib/admin/admin-list-return";
import {
    ADMIN_LIST_FILTER_URL_DEBOUNCE_MS,
    adminListHref,
    shouldApplyAdminListUrlFilters,
} from "@/lib/validation/admin-filters";

/**
 * Keeps admin list filters in React state and in the Next.js URL so browser
 * back/forward restores the same filters (App Router-aware `router.replace`).
 * Typing updates state immediately (in-memory filter); URL writes are debounced
 * so each keystroke does not refetch the Server Component page.
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
    const pendingHrefRef = useRef<string | null>(null);
    const skipNextUrlSyncRef = useRef(false);
    const syncKeyRef = useRef(syncKey);

    const listHref = adminListHref(pathname, syncKey);

    useEffect(() => {
        if (pathname === "/admin/families") {
            rememberAdminFamiliesListHref(listHref);
        }
    }, [pathname, listHref]);

    useEffect(() => {
        function onPopState() {
            skipNextUrlSyncRef.current = false;
        }

        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    useEffect(() => {
        if (syncKeyRef.current === syncKey) {
            return;
        }
        syncKeyRef.current = syncKey;
        if (!shouldApplyAdminListUrlFilters(skipNextUrlSyncRef.current)) {
            skipNextUrlSyncRef.current = false;
            return;
        }
        pendingHrefRef.current = null;
        setFilters(initialFilters);
    }, [initialFilters, syncKey]);

    useEffect(() => {
        const href = pendingHrefRef.current;
        if (!href) {
            return;
        }

        const timer = window.setTimeout(() => {
            pendingHrefRef.current = null;
            skipNextUrlSyncRef.current = true;
            router.replace(href, {scroll: false});
        }, ADMIN_LIST_FILTER_URL_DEBOUNCE_MS);

        return () => {
            window.clearTimeout(timer);
        };
    }, [filters, router]);

    useEffect(() => {
        return () => {
            const href = pendingHrefRef.current;
            if (!href) {
                return;
            }
            pendingHrefRef.current = null;
            skipNextUrlSyncRef.current = true;
            router.replace(href, {scroll: false});
        };
    }, [router]);

    function updateFilters(next: T) {
        const nextKey = buildQuery(next);
        const nextHref = adminListHref(pathname, nextKey);
        pendingHrefRef.current = nextHref;
        setFilters(next);
        if (pathname === "/admin/families") {
            rememberAdminFamiliesListHref(nextHref);
        }
    }

    return {filters, updateFilters};
}
