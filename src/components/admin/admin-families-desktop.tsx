"use client";

import Link from "next/link";
import type {ReactNode} from "react";

import {AdminAlertMessage} from "@/components/admin/admin-alert";
import {ResumenDownloadIcon} from "@/components/admin/admin-resumen-icons";
import {adminFamilies, adminGuests, adminResumen} from "@/components/admin/admin-ui";
import {AdminListSearchField} from "@/components/admin/admin-list-search-field";
import {AdminListSubnav} from "@/components/admin/admin-list-subnav";
import {AdminRowCheckbox} from "@/components/admin/admin-row-checkbox";
import {AdminSelect} from "@/components/admin/admin-select";
import {AdminSortHeader} from "@/components/admin/admin-sort-header";
import {FamilyStatusBadge} from "@/components/admin/admin-status-badge";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    type AdminFamilyBrowserItem,
    FAMILIES_LIST_SUBNAV,
    familiesSummaryLine,
    familyInvitationPath,
    formatFamiliesDeadlineChip,
} from "@/lib/admin/admin-families-layout";
import {familyOperationChips, familyOpsChipIsAlert} from "@/lib/admin/family-ops";
import {formatEventDateTimeNarrow, formatEventDateTimeShort} from "@/lib/datetime/event-timezone";
import {nextSortDir, type PaginatedList} from "@/lib/admin/list-view";
import type {AdminFamiliesFilters} from "@/lib/validation/admin-filters";
import {cn} from "@/lib/utils";

type AdminFamiliesDesktopProps = {
    deadlineLead: string | null;
    filters: AdminFamiliesFilters;
    sort: string;
    familiesEmpty: boolean;
    page: PaginatedList<AdminFamilyBrowserItem>;
    pageState: "none" | "some" | "all";
    selected: ReadonlySet<string>;
    visibleCount: number;
    notice: string | null;
    batchPending: boolean;
    chips: ReactNode;
    onChangeFilters: (patch: Partial<AdminFamiliesFilters>) => void;
    onToggle: (id: string) => void;
    onTogglePage: (checked: boolean) => void;
    onSelectVisible: () => void;
    onClearSelection: () => void;
    onCopyLinks: () => void;
    onExportSelected: () => void;
    onDisableSelected: () => void;
    onEnableSelected: () => void;
    onDismissNotice: () => void;
};

export function AdminFamiliesDesktop({
    deadlineLead,
    filters,
    sort,
    familiesEmpty,
    page,
    pageState,
    selected,
    visibleCount,
    notice,
    batchPending,
    chips,
    onChangeFilters,
    onToggle,
    onTogglePage,
    onSelectVisible,
    onClearSelection,
    onCopyLinks,
    onExportSelected,
    onDisableSelected,
    onEnableSelected,
    onDismissNotice,
}: AdminFamiliesDesktopProps) {
    const copy = adminCopy.familiesList;
    const resumen = adminCopy.resumen;

    function onSort(column: string) {
        onChangeFilters({
            sort: column,
            dir: nextSortDir(sort, filters.dir, column),
        });
    }

    const deadlineChip = formatFamiliesDeadlineChip(deadlineLead);

    return (
        <div className={`hidden lg:block ${adminResumen.sans} text-admin-ink`}>
            <section className={adminResumen.banner}>
                <div className="flex min-w-0 flex-col gap-2">
                    <p
                        className={`flex flex-wrap items-center gap-2 ${adminResumen.overline}`}
                    >
                        <span>{copy.overlineAdmin}</span>
                        <span
                            className="size-1 shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                        />
                        <span>{copy.overlineSection}</span>
                    </p>
                    <h1 className={adminResumen.bannerTitle}>{copy.bannerTitle}</h1>
                    <p className={adminResumen.bannerBody}>{copy.bannerBody}</p>
                </div>
                <div className={adminResumen.bannerActions}>
                    {deadlineChip ? (
                        <p className={adminResumen.deadlineChip}>{deadlineChip}</p>
                    ) : null}
                    <a
                        href="/api/admin/export"
                        className={adminResumen.downloadCta}
                        download
                    >
                        <ResumenDownloadIcon />
                        {resumen.downloadCta}
                    </a>
                </div>
            </section>

            <div className={adminResumen.workspace}>
                <p className={adminGuests.summaryStrip}>
                    <span>{familiesSummaryLine(page.total, page)}</span>
                </p>

                <div className={adminGuests.filterCard}>
                    <div className={adminFamilies.filterGrid}>
                        <AdminListSearchField
                            value={filters.query}
                            onChange={(query) => onChangeFilters({query})}
                            placeholder={copy.searchPlaceholder}
                            className={adminFamilies.filterCellLead}
                        />
                        <FigmaSelect
                            label="Estado"
                            value={filters.status}
                            onChange={(status) => onChangeFilters({status})}
                            className={adminFamilies.filterCellLead}
                            options={[
                                {value: "all", label: "Todos"},
                                {value: "pending", label: adminCopy.family.status.pending},
                                {value: "responded", label: adminCopy.family.status.responded},
                                {value: "disabled", label: adminCopy.family.status.disabled},
                            ]}
                        />
                        <FigmaSelect
                            label="Invitación"
                            value={filters.enabled}
                            onChange={(enabled) => onChangeFilters({enabled})}
                            className={adminFamilies.filterCellRest}
                            options={[
                                {value: "all", label: "Todas"},
                                {value: "enabled", label: "Activa"},
                                {value: "disabled", label: "Desactivada"},
                            ]}
                        />
                        <FigmaSelect
                            label="Vió invitación"
                            value={filters.opened}
                            onChange={(opened) => onChangeFilters({opened})}
                            className={adminFamilies.filterCellRest}
                            options={[
                                {value: "all", label: "Todas"},
                                {value: "opened", label: adminCopy.invitation.opened},
                                {value: "not_opened", label: adminCopy.invitation.notOpened},
                            ]}
                        />
                        <FigmaSelect
                            label={copy.confirmationFilter}
                            value={filters.response}
                            onChange={(response) => onChangeFilters({response})}
                            className={adminFamilies.filterCellRest}
                            options={[
                                {value: "all", label: "Todos"},
                                {value: "pending", label: adminCopy.rsvp.noResponse},
                                {value: "responded", label: adminCopy.rsvp.responded},
                                {value: "attending", label: "Asistirá"},
                                {value: "not_attending", label: "No asistirá"},
                            ]}
                        />
                    </div>
                    {chips}
                </div>

                <AdminListSubnav items={FAMILIES_LIST_SUBNAV} />

                {notice ? (
                    <AdminAlertMessage
                        message={notice}
                        onDismiss={onDismissNotice}
                    />
                ) : null}

                {page.total === 0 ? (
                    <p className={adminResumen.muted}>
                        {familiesEmpty
                            ? "Aún no hay familias. Crea la primera para generar un enlace."
                            : "No hay familias que coincidan con los filtros actuales."}
                    </p>
                ) : (
                    <div className={adminGuests.tableCard}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead className={adminGuests.tableHead}>
                                    <tr>
                                        <th className="w-12 px-4 py-3">
                                            <AdminRowCheckbox
                                                checked={pageState === "all"}
                                                indeterminate={pageState === "some"}
                                                label="Seleccionar esta página"
                                                onChange={onTogglePage}
                                            />
                                        </th>
                                        <AdminSortHeader
                                            label="Familia"
                                            column="displayName"
                                            sort={sort}
                                            dir={filters.dir}
                                            onSort={onSort}
                                            className={adminGuests.sortButton}
                                        />
                                        <AdminSortHeader
                                            label="Cupos"
                                            column="guestCount"
                                            sort={sort}
                                            dir={filters.dir}
                                            onSort={onSort}
                                            className={adminGuests.sortButton}
                                        />
                                        <AdminSortHeader
                                            label="Confirmados"
                                            column="confirmedGuestCount"
                                            sort={sort}
                                            dir={filters.dir}
                                            onSort={onSort}
                                            className={adminGuests.sortButton}
                                        />
                                        <AdminSortHeader
                                            label="Estado"
                                            column="status"
                                            sort={sort}
                                            dir={filters.dir}
                                            onSort={onSort}
                                            className={adminGuests.sortButton}
                                        />
                                        <AdminSortHeader
                                            label={copy.colOpened}
                                            compactLabel={copy.colOpenedCompact}
                                            column="lastOpenedAt"
                                            sort={sort}
                                            dir={filters.dir}
                                            onSort={onSort}
                                            className={adminGuests.sortButton}
                                        />
                                        <AdminSortHeader
                                            label={adminCopy.rsvp.submitted}
                                            compactLabel={copy.colSubmittedCompact}
                                            column="submittedAt"
                                            sort={sort}
                                            dir={filters.dir}
                                            onSort={onSort}
                                            className={adminGuests.sortButton}
                                        />
                                        <AdminSortHeader
                                            label={copy.colUpdated}
                                            compactLabel={copy.colUpdatedCompact}
                                            column="updatedAt"
                                            sort={sort}
                                            dir={filters.dir}
                                            onSort={onSort}
                                            className={adminGuests.sortButton}
                                        />
                                        <th className="px-4 py-3 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {page.items.map((family) => {
                                        const isSelected = selected.has(family.id);
                                        const opsChips = familyOperationChips(family);
                                        return (
                                            <tr
                                                key={family.id}
                                                className={cn(
                                                    adminGuests.tableRow,
                                                    isSelected && adminGuests.tableRowSelected,
                                                )}
                                            >
                                                <td className="px-4 py-3.5">
                                                    <AdminRowCheckbox
                                                        checked={isSelected}
                                                        label={`Seleccionar ${family.displayName}`}
                                                        onChange={() => onToggle(family.id)}
                                                    />
                                                </td>
                                                <td className="min-w-[12.5rem] px-2 py-3.5 xl:min-w-[16rem]">
                                                    <p className={adminGuests.cellName}>
                                                        {family.displayName}
                                                    </p>
                                                    <div className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5">
                                                        <p className={adminFamilies.slug}>
                                                            {familyInvitationPath(
                                                                family.invitationSlug,
                                                            )}
                                                        </p>
                                                        {opsChips.map((chip) => (
                                                            <span
                                                                key={chip.key}
                                                                className={
                                                                    familyOpsChipIsAlert(chip.key)
                                                                        ? adminFamilies.tagAlert
                                                                        : adminFamilies.tag
                                                                }
                                                            >
                                                                {chip.label}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className={`px-2 py-3.5 ${adminGuests.cellMuted}`}>
                                                    {family.guestCount}/{family.maximumGuests}
                                                </td>
                                                <td className={`px-2 py-3.5 ${adminGuests.cellMuted}`}>
                                                    {family.confirmedGuestCount ?? "—"}
                                                </td>
                                                <td className="px-2 py-3.5">
                                                    <FamilyStatusBadge
                                                        status={family.status}
                                                        tone="figma"
                                                    />
                                                </td>
                                                <td
                                                    className={`whitespace-nowrap px-2 py-3.5 ${adminGuests.cellMuted}`}
                                                >
                                                    <span className="xl:hidden">
                                                        {formatEventDateTimeNarrow(
                                                            family.lastOpenedAt,
                                                        )}
                                                    </span>
                                                    <span className="hidden xl:inline">
                                                        {formatEventDateTimeShort(
                                                            family.lastOpenedAt,
                                                        )}
                                                    </span>
                                                </td>
                                                <td
                                                    className={`whitespace-nowrap px-2 py-3.5 ${adminGuests.cellMuted}`}
                                                >
                                                    <span className="xl:hidden">
                                                        {formatEventDateTimeNarrow(
                                                            family.submittedAt,
                                                        )}
                                                    </span>
                                                    <span className="hidden xl:inline">
                                                        {formatEventDateTimeShort(
                                                            family.submittedAt,
                                                        )}
                                                    </span>
                                                </td>
                                                <td
                                                    className={`whitespace-nowrap px-2 py-3.5 ${adminGuests.cellMuted}`}
                                                >
                                                    <span className="xl:hidden">
                                                        {formatEventDateTimeNarrow(
                                                            family.updatedAt,
                                                        )}
                                                    </span>
                                                    <span className="hidden xl:inline">
                                                        {formatEventDateTimeShort(
                                                            family.updatedAt,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-right">
                                                    <Link
                                                        href={`/admin/families/${family.id}`}
                                                        className={adminGuests.familyLink}
                                                    >
                                                        {copy.viewFamily}
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className={adminGuests.tableFooter}>
                            <p className="font-[family-name:var(--font-body)] text-[13px] text-admin-muted">
                                {copy.showing(page.from, page.to, page.total)}
                            </p>
                            {page.totalPages > 1 ? (
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        className={adminGuests.pagePrev}
                                        disabled={page.page <= 1}
                                        onClick={() =>
                                            onChangeFilters({page: page.page - 1})
                                        }
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        type="button"
                                        className={adminGuests.pageNext}
                                        disabled={page.page >= page.totalPages}
                                        onClick={() =>
                                            onChangeFilters({page: page.page + 1})
                                        }
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                {selected.size > 0 ? (
                    <div className={adminGuests.batchAnchor}>
                        <div className={adminGuests.batchBar}>
                            <p className="flex items-center gap-2 font-[family-name:var(--font-body)] text-[15px] font-semibold">
                                <span
                                    className="size-2 shrink-0 rounded-full bg-accent"
                                    aria-hidden="true"
                                />
                                {copy.selected(selected.size)}
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                                {visibleCount > 0 ? (
                                    <button
                                        type="button"
                                        className={adminGuests.batchGhost}
                                        onClick={onSelectVisible}
                                    >
                                        {copy.selectVisible(visibleCount)}
                                    </button>
                                ) : null}
                                <button
                                    type="button"
                                    className={adminGuests.batchGhost}
                                    disabled={batchPending}
                                    onClick={onCopyLinks}
                                >
                                    {adminCopy.batch.copyLinks}
                                </button>
                                <button
                                    type="button"
                                    className={adminGuests.batchGhost}
                                    disabled={batchPending}
                                    onClick={onExportSelected}
                                >
                                    {adminCopy.batch.exportSelected}
                                </button>
                                <button
                                    type="button"
                                    className={adminGuests.batchGhost}
                                    disabled={batchPending}
                                    onClick={onDisableSelected}
                                >
                                    {adminCopy.batch.disable}
                                </button>
                                <button
                                    type="button"
                                    className={adminGuests.batchGhost}
                                    disabled={batchPending}
                                    onClick={onEnableSelected}
                                >
                                    {adminCopy.batch.enable}
                                </button>
                                <button
                                    type="button"
                                    className={adminGuests.batchClear}
                                    onClick={onClearSelection}
                                >
                                    {adminCopy.batch.clear}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function FigmaSelect<T extends string>({
    label,
    value,
    options,
    onChange,
    className,
}: {
    label: string;
    value: T;
    options: readonly {value: T; label: string}[];
    onChange: (value: T) => void;
    className?: string;
}) {
    return (
        <AdminSelect
            label={label}
            value={value}
            onChange={onChange}
            options={options}
            className={className}
            labelClassName={adminGuests.filterLabel}
            triggerClassName={adminGuests.filterTrigger}
        />
    );
}
