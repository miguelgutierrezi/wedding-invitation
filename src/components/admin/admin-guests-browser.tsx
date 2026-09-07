"use client";

import {useMemo, useState, useTransition} from "react";

import {AdminGuestsDesktop} from "@/components/admin/admin-guests-desktop";
import {
    AdminGuestsMobile,
    AdminGuestsPortrait,
} from "@/components/admin/admin-guests-portrait";
import {AdminFilterChips} from "@/components/admin/admin-filter-chips";
import {useAdminListFilters} from "@/hooks/use-admin-list-filters";
import {useAdminSelection} from "@/hooks/use-admin-selection";
import {useScrollOnPageChange} from "@/hooks/use-scroll-on-page-change";
import {adminCopy} from "@/lib/admin/admin-copy";
import {joinGuestContactLines} from "@/lib/admin/batch-clipboard";
import {copyPlainText, downloadAdminExport} from "@/lib/admin/download-export";
import {pageSelectionState} from "@/lib/admin/selection";
import {
    type AdminGuestBrowserItem,
    summarizeGuestsView,
} from "@/lib/admin/admin-guests-layout";
import {formatTransportBoardingPoint} from "@/config/transport";
import {paginateItems, sortItems} from "@/lib/admin/list-view";
import {
    type AdminGuestsFilters,
    buildAdminGuestsFilterQuery,
    DEFAULT_ADMIN_GUESTS_FILTERS,
    guestMatchesFilters,
    guestsFilterChips,
} from "@/lib/validation/admin-filters";

export type {AdminGuestBrowserItem} from "@/lib/admin/admin-guests-layout";

type AdminGuestsBrowserProps = {
    guests: AdminGuestBrowserItem[];
    initialFilters: AdminGuestsFilters;
    deadlineLead: string | null;
};

function statusLabel(status: string): string {
    if (status === "attending") {
        return "Asiste";
    }
    if (status === "not_attending") {
        return "No asiste";
    }
    return "Pendiente";
}

function guestSortValue(guest: AdminGuestBrowserItem, column: string): unknown {
    switch (column) {
        case "familyName":
            return guest.familyName;
        case "attendanceStatus":
            return statusLabel(guest.attendanceStatus);
        case "needsTransport":
            return guest.needsTransport;
        case "transportBoardingPoint":
            return guest.needsTransport
                ? formatTransportBoardingPoint(guest.transportBoardingPoint)
                : null;
        case "dietaryRestrictions":
            return guest.dietaryRestrictions?.trim() || null;
        case "phone":
            return guest.phone;
        case "email":
            return guest.email;
        default:
            return guest.fullName;
    }
}

export function AdminGuestsBrowser({
    guests,
    initialFilters,
    deadlineLead,
}: AdminGuestsBrowserProps) {
    const {filters, updateFilters} = useAdminListFilters({
        pathname: "/admin/guests",
        initialFilters,
        buildQuery: buildAdminGuestsFilterQuery,
    });
    const [notice, setNotice] = useState<string | null>(null);
    const [batchPending, startTransition] = useTransition();
    const selection = useAdminSelection();
    const listTopRef = useScrollOnPageChange(filters.page);
    const chips = guestsFilterChips(filters);
    const sort = filters.sort || "fullName";
    const visibleGuests = useMemo(() => {
        const matched = guests.filter((guest) => guestMatchesFilters(guest, filters));
        return sortItems(
            matched,
            (guest) => guestSortValue(guest, sort),
            filters.dir,
        );
    }, [filters, guests, sort]);
    const page = paginateItems(visibleGuests, filters.page);
    const pageIds = page.items.map((guest) => guest.id);
    const pageState = pageSelectionState(pageIds, selection.selected);
    const visibleIds = visibleGuests.map((guest) => guest.id);

    function selectedGuests() {
        const ids = new Set(selection.selectedIds);
        return guests.filter((guest) => ids.has(guest.id));
    }

    function reportCopy(text: string, ok: boolean) {
        if (text.length === 0) {
            setNotice(adminCopy.batch.noneCopied);
            return;
        }
        setNotice(ok ? adminCopy.batch.copied : adminCopy.batch.copyEmpty);
    }
    const counts = useMemo(
        () => summarizeGuestsView(visibleGuests),
        [visibleGuests],
    );

    function changeFilters(patch: Partial<AdminGuestsFilters>) {
        updateFilters({...filters, ...patch, page: 1});
    }

    function removeChip(id: string) {
        if (id === "query") {
            changeFilters({query: ""});
            return;
        }

        changeFilters({[id]: "all"} as Partial<AdminGuestsFilters>);
    }

    const filterChips = (
        <AdminFilterChips
            chips={chips}
            onRemove={removeChip}
            onClearAll={() =>
                updateFilters({
                    ...DEFAULT_ADMIN_GUESTS_FILTERS,
                    sort: filters.sort,
                    dir: filters.dir,
                })
            }
        />
    );

    function onChangeFigmaFilters(patch: Partial<AdminGuestsFilters>) {
        if (patch.page !== undefined) {
            updateFilters({...filters, ...patch});
            return;
        }
        changeFilters(patch);
    }

    function onCopyPhones() {
        void (async () => {
            const text = joinGuestContactLines(selectedGuests(), "phone");
            const ok = await copyPlainText(text);
            reportCopy(text, ok);
        })();
    }

    function onCopyEmails() {
        void (async () => {
            const text = joinGuestContactLines(selectedGuests(), "email");
            const ok = await copyPlainText(text);
            reportCopy(text, ok);
        })();
    }

    function onExportSelected() {
        startTransition(async () => {
            const result = await downloadAdminExport({
                guestIds: selection.selectedIds,
            });
            setNotice(result.ok ? adminCopy.batch.downloaded : result.error);
        });
    }

    const cardListProps = {
        deadlineLead,
        filters,
        sort,
        counts,
        guestsEmpty: guests.length === 0,
        page,
        selected: selection.selected,
        visibleCount: visibleIds.length,
        notice,
        batchPending,
        chips: filterChips,
        onChangeFilters: onChangeFigmaFilters,
        onToggle: selection.toggle,
        onSelectVisible: () => selection.setMany(visibleIds, true),
        onClearSelection: selection.clear,
        onCopyPhones,
        onCopyEmails,
    };

    return (
        <>
            <AdminGuestsDesktop
                deadlineLead={deadlineLead}
                filters={filters}
                sort={sort}
                counts={counts}
                guestsEmpty={guests.length === 0}
                page={page}
                pageState={pageState}
                selected={selection.selected}
                visibleCount={visibleIds.length}
                notice={notice}
                batchPending={batchPending}
                chips={filterChips}
                onChangeFilters={onChangeFigmaFilters}
                onToggle={selection.toggle}
                onTogglePage={(checked) => selection.setMany(pageIds, checked)}
                onSelectVisible={() => selection.setMany(visibleIds, true)}
                onClearSelection={selection.clear}
                onCopyPhones={onCopyPhones}
                onCopyEmails={onCopyEmails}
                onExportSelected={onExportSelected}
            />
            <div ref={listTopRef} className="scroll-mt-32">
                <AdminGuestsMobile
                    {...cardListProps}
                    onExportSelected={onExportSelected}
                />
                <AdminGuestsPortrait {...cardListProps} />
            </div>
        </>
    );
}
