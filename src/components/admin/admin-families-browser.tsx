"use client";

import {useMemo, useState, useTransition} from "react";

import {setFamiliesEnabledBatchAction} from "@/actions/admin/families-batch";
import {AdminFamiliesDesktop} from "@/components/admin/admin-families-desktop";
import {
    AdminFamiliesMobile,
    AdminFamiliesPortrait,
} from "@/components/admin/admin-families-portrait";
import {AdminFilterChips} from "@/components/admin/admin-filter-chips";
import {useAdminListFilters} from "@/hooks/use-admin-list-filters";
import {useAdminSelection} from "@/hooks/use-admin-selection";
import {useScrollOnPageChange} from "@/hooks/use-scroll-on-page-change";
import {adminCopy, familyStatusLabel} from "@/lib/admin/admin-copy";
import {
    type AdminFamilyBrowserItem,
    summarizeFamiliesView,
} from "@/lib/admin/admin-families-layout";
import {joinInvitationLinks} from "@/lib/admin/batch-clipboard";
import {copyPlainText, downloadAdminExport} from "@/lib/admin/download-export";
import {pageSelectionState} from "@/lib/admin/selection";
import {paginateItems, sortItems} from "@/lib/admin/list-view";
import {
    type AdminFamiliesFilters,
    buildAdminFamiliesFilterQuery,
    DEFAULT_ADMIN_FAMILIES_FILTERS,
    familiesFilterChips,
    familyMatchesFilters,
} from "@/lib/validation/admin-filters";

export type {AdminFamilyBrowserItem} from "@/lib/admin/admin-families-layout";

type AdminFamiliesBrowserProps = {
    families: AdminFamilyBrowserItem[];
    initialFilters: AdminFamiliesFilters;
    deadlineLead: string | null;
};

function familySortValue(
    family: AdminFamilyBrowserItem,
    column: string,
): unknown {
    switch (column) {
        case "confirmedGuestCount":
            return family.confirmedGuestCount;
        case "guestCount":
            return family.guestCount;
        case "status":
            return familyStatusLabel(family.status);
        case "lastOpenedAt":
            return family.lastOpenedAt;
        case "submittedAt":
            return family.submittedAt;
        case "updatedAt":
            return family.updatedAt;
        default:
            return family.displayName;
    }
}

export function AdminFamiliesBrowser({
    families,
    initialFilters,
    deadlineLead,
}: AdminFamiliesBrowserProps) {
    const {filters, updateFilters} = useAdminListFilters({
        pathname: "/admin/families",
        initialFilters,
        buildQuery: buildAdminFamiliesFilterQuery,
    });
    const [notice, setNotice] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();
    const selection = useAdminSelection();
    const listTopRef = useScrollOnPageChange(filters.page);
    const chips = familiesFilterChips(filters);
    const sort = filters.sort || "displayName";
    const visibleFamilies = useMemo(() => {
        const matched = families.filter((family) =>
            familyMatchesFilters(family, filters),
        );
        return sortItems(matched, (family) => familySortValue(family, sort), filters.dir);
    }, [families, filters, sort]);
    const page = paginateItems(visibleFamilies, filters.page);
    const pageIds = page.items.map((family) => family.id);
    const pageState = pageSelectionState(pageIds, selection.selected);
    const visibleIds = visibleFamilies.map((family) => family.id);
    const counts = useMemo(
        () => summarizeFamiliesView(visibleFamilies),
        [visibleFamilies],
    );

    function selectedFamilies() {
        const ids = new Set(selection.selectedIds);
        return families.filter((family) => ids.has(family.id));
    }

    function reportCopy(ok: boolean, empty: boolean) {
        if (empty) {
            setNotice(adminCopy.batch.noneCopied);
            return;
        }
        setNotice(ok ? adminCopy.batch.copied : adminCopy.batch.copyEmpty);
    }

    function changeFilters(patch: Partial<AdminFamiliesFilters>) {
        updateFilters({...filters, ...patch, page: 1});
    }

    function removeChip(id: string) {
        changeFilters({[id]: id === "query" ? "" : "all"} as Partial<AdminFamiliesFilters>);
    }

    function onChangeFigmaFilters(patch: Partial<AdminFamiliesFilters>) {
        if (patch.page !== undefined) {
            updateFilters({...filters, ...patch});
            return;
        }
        changeFilters(patch);
    }

    const filterChips = (
        <AdminFilterChips
            chips={chips}
            onRemove={removeChip}
            onClearAll={() =>
                updateFilters({
                    ...DEFAULT_ADMIN_FAMILIES_FILTERS,
                    sort: filters.sort,
                    dir: filters.dir,
                })
            }
        />
    );

    function onCopyLinks() {
        void (async () => {
            const text = joinInvitationLinks(
                selectedFamilies().map((family) => family.invitationUrl),
            );
            const ok = await copyPlainText(text);
            reportCopy(ok, text.length === 0);
        })();
    }

    function onExportSelected() {
        startTransition(async () => {
            const result = await downloadAdminExport({
                familyIds: selection.selectedIds,
            });
            setNotice(result.ok ? adminCopy.batch.downloaded : result.error);
        });
    }

    function onDisableSelected() {
        if (!window.confirm(adminCopy.batch.disableConfirm(selection.count))) {
            return;
        }
        startTransition(async () => {
            const result = await setFamiliesEnabledBatchAction(
                selection.selectedIds,
                false,
            );
            if (!result.ok) {
                setNotice(result.error);
                return;
            }
            setNotice(adminCopy.batch.updated(result.updated));
            selection.clear();
        });
    }

    function onEnableSelected() {
        if (!window.confirm(adminCopy.batch.enableConfirm(selection.count))) {
            return;
        }
        startTransition(async () => {
            const result = await setFamiliesEnabledBatchAction(
                selection.selectedIds,
                true,
            );
            if (!result.ok) {
                setNotice(result.error);
                return;
            }
            setNotice(adminCopy.batch.updated(result.updated));
            selection.clear();
        });
    }

    const cardListProps = {
        deadlineLead,
        filters,
        sort,
        counts,
        familiesEmpty: families.length === 0,
        page,
        selected: selection.selected,
        visibleCount: visibleIds.length,
        notice,
        batchPending: pending,
        chips: filterChips,
        onChangeFilters: onChangeFigmaFilters,
        onToggle: selection.toggle,
        onSelectVisible: () => selection.setMany(visibleIds, true),
        onClearSelection: selection.clear,
        onCopyLinks,
        onExportSelected,
        onDisableSelected,
        onEnableSelected,
    };

    return (
        <>
            <AdminFamiliesDesktop
                deadlineLead={deadlineLead}
                filters={filters}
                sort={sort}
                familiesEmpty={families.length === 0}
                page={page}
                pageState={pageState}
                selected={selection.selected}
                visibleCount={visibleIds.length}
                notice={notice}
                batchPending={pending}
                chips={filterChips}
                onChangeFilters={onChangeFigmaFilters}
                onToggle={selection.toggle}
                onTogglePage={(checked) => selection.setMany(pageIds, checked)}
                onSelectVisible={() => selection.setMany(visibleIds, true)}
                onClearSelection={selection.clear}
                onCopyLinks={onCopyLinks}
                onExportSelected={onExportSelected}
                onDisableSelected={onDisableSelected}
                onEnableSelected={onEnableSelected}
            />

            <div ref={listTopRef} className="scroll-mt-32">
                <AdminFamiliesMobile {...cardListProps} />
                <AdminFamiliesPortrait {...cardListProps} />
            </div>
        </>
    );
}
