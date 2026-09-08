"use client";

import Link from "next/link";
import type {ReactNode} from "react";

import type {AdminGuestBrowserItem} from "@/lib/admin/admin-guests-layout";
import {AdminAlertMessage} from "@/components/admin/admin-alert";
import {ResumenDownloadIcon} from "@/components/admin/admin-resumen-icons";
import {adminGuests, adminResumen} from "@/components/admin/admin-ui";
import {AdminListSearchField} from "@/components/admin/admin-list-search-field";
import {AdminListSubnav} from "@/components/admin/admin-list-subnav";
import {AdminRowCheckbox} from "@/components/admin/admin-row-checkbox";
import {AdminSelect} from "@/components/admin/admin-select";
import {AdminSortHeader} from "@/components/admin/admin-sort-header";
import {GuestAttendanceBadge} from "@/components/admin/admin-status-badge";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    formatGuestsDeadlineChip,
    guestRoleLabel,
    GUESTS_LIST_SUBNAV,
    type GuestsViewCounts,
} from "@/lib/admin/admin-guests-layout";
import {formatTransportBoardingPoint} from "@/config/transport";
import {nextSortDir, type PaginatedList} from "@/lib/admin/list-view";
import type {AdminGuestsFilters} from "@/lib/validation/admin-filters";
import {cn} from "@/lib/utils";

type AdminGuestsDesktopProps = {
    deadlineLead: string | null;
    filters: AdminGuestsFilters;
    sort: string;
    counts: GuestsViewCounts;
    guestsEmpty: boolean;
    page: PaginatedList<AdminGuestBrowserItem>;
    pageState: "none" | "some" | "all";
    selected: ReadonlySet<string>;
    visibleCount: number;
    notice: string | null;
    batchPending: boolean;
    chips: ReactNode;
    onChangeFilters: (patch: Partial<AdminGuestsFilters>) => void;
    onToggle: (id: string) => void;
    onTogglePage: (checked: boolean) => void;
    onSelectVisible: () => void;
    onClearSelection: () => void;
    onCopyPhones: () => void;
    onCopyEmails: () => void;
    onExportSelected: () => void;
    onDismissNotice: () => void;
};

export function AdminGuestsDesktop({
    deadlineLead,
    filters,
    sort,
    counts,
    guestsEmpty,
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
    onCopyPhones,
    onCopyEmails,
    onExportSelected,
    onDismissNotice,
}: AdminGuestsDesktopProps) {
    const copy = adminCopy.guestsList;
    const resumen = adminCopy.resumen;

    function onSort(column: string) {
        onChangeFilters({
            sort: column,
            dir: nextSortDir(sort, filters.dir, column),
        });
    }

    const deadlineChip = formatGuestsDeadlineChip(deadlineLead);

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
                    <span>
                        Resumen invitado por invitado. En esta vista:{" "}
                        <span className="font-bold text-admin-ink">{counts.total}</span>
                        {" · Asisten "}
                        <span className="font-bold text-[#2e7d32]">
                            {counts.attending}
                        </span>
                        {" · No asisten "}
                        <span className="font-bold text-[#b91c1c]">
                            {counts.notAttending}
                        </span>
                        {" · Pendientes "}
                        <span className="font-bold text-[#d97706]">{counts.pending}</span>
                        {" · Bus "}
                        <span className="font-bold text-admin-olive">{counts.bus}</span>
                        {page.total > 0 ? (
                            <>
                                {" · Mostrando "}
                                <span className="font-bold text-admin-ink">
                                    {page.from}–{page.to} de {page.total}
                                </span>
                            </>
                        ) : null}
                    </span>
                </p>

                <div className={adminGuests.filterCard}>
                    <div className={adminGuests.filterGrid}>
                        <AdminListSearchField
                            value={filters.query}
                            onChange={(query) => onChangeFilters({query})}
                            placeholder={copy.searchPlaceholderCompact}
                            ariaLabel={copy.searchPlaceholder}
                            className={adminGuests.filterCellLead}
                        />
                        <FigmaSelect
                            label="Estado"
                            value={filters.attendance}
                            onChange={(attendance) => onChangeFilters({attendance})}
                            className={adminGuests.filterCellLead}
                            options={[
                                {value: "all", label: "Todos"},
                                {value: "pending", label: "Pendiente"},
                                {value: "attending", label: "Asiste"},
                                {value: "not_attending", label: "No asiste"},
                            ]}
                        />
                        <FigmaSelect
                            label="Bus"
                            value={filters.transport}
                            onChange={(transport) => onChangeFilters({transport})}
                            options={[
                                {value: "all", label: "Todos"},
                                {value: "with_bus", label: "Con bus"},
                                {value: "without_bus", label: "Sin bus"},
                            ]}
                        />
                        <FigmaSelect
                            label="Punto de salida"
                            value={filters.boarding}
                            onChange={(boarding) => onChangeFilters({boarding})}
                            options={[
                                {value: "all", label: "Todos"},
                                {value: "modelia", label: "Modelia"},
                                {value: "villa_sonia", label: "Villa Sonia"},
                                {value: "none", label: "Sin punto"},
                            ]}
                        />
                        <FigmaSelect
                            label="Dieta"
                            value={filters.dietary}
                            onChange={(dietary) => onChangeFilters({dietary})}
                            options={[
                                {value: "all", label: "Todas"},
                                {value: "with_dietary", label: "Con restricción"},
                                {value: "without_dietary", label: "Sin restricción"},
                            ]}
                        />
                        <FigmaSelect
                            label="Tipo de invitado"
                            value={filters.primary}
                            onChange={(primary) => onChangeFilters({primary})}
                            options={[
                                {value: "all", label: "Todos"},
                                {value: "primary", label: "Contacto principal"},
                                {value: "other", label: "Otros invitados"},
                            ]}
                        />
                        <div className={adminGuests.nameFilter}>
                            <FigmaSelect
                                label="Nombre del acompañante"
                                value={filters.name}
                                onChange={(name) => onChangeFilters({name})}
                                options={[
                                    {value: "all", label: "Todos"},
                                    {value: "needs_name", label: "Falta el nombre"},
                                ]}
                            />
                        </div>
                    </div>
                    {chips}
                </div>

                <AdminListSubnav items={GUESTS_LIST_SUBNAV} />

                {notice ? (
                    <AdminAlertMessage
                        message={notice}
                        onDismiss={onDismissNotice}
                    />
                ) : null}

                {page.total === 0 ? (
                    <p className={adminResumen.muted}>
                        {guestsEmpty
                            ? "Aún no hay invitados. Crea familias para empezar."
                            : "No hay invitados que coincidan con los filtros actuales."}
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
                                            label="Invitado"
                                            column="fullName"
                                            sort={sort}
                                            dir={filters.dir}
                                            onSort={onSort}
                                            className={adminGuests.sortButton}
                                        />
                                        <AdminSortHeader
                                            label="Familia"
                                            column="familyName"
                                            sort={sort}
                                            dir={filters.dir}
                                            onSort={onSort}
                                            className={adminGuests.sortButton}
                                        />
                                        <AdminSortHeader
                                            label="Estado"
                                            column="attendanceStatus"
                                            sort={sort}
                                            dir={filters.dir}
                                            onSort={onSort}
                                            className={adminGuests.sortButton}
                                        />
                                        <AdminSortHeader
                                            label="Bus"
                                            column="needsTransport"
                                            sort={sort}
                                            dir={filters.dir}
                                            onSort={onSort}
                                            className={adminGuests.sortButton}
                                        />
                                        <AdminSortHeader
                                            label="Punto de salida"
                                            column="transportBoardingPoint"
                                            sort={sort}
                                            dir={filters.dir}
                                            onSort={onSort}
                                            className={adminGuests.sortButton}
                                        />
                                        <AdminSortHeader
                                            label="Dieta"
                                            column="dietaryRestrictions"
                                            sort={sort}
                                            dir={filters.dir}
                                            onSort={onSort}
                                            className={adminGuests.sortButton}
                                        />
                                        <AdminSortHeader
                                            label="Teléfono"
                                            column="phone"
                                            sort={sort}
                                            dir={filters.dir}
                                            onSort={onSort}
                                            className={adminGuests.sortButton}
                                        />
                                        <AdminSortHeader
                                            label="Correo"
                                            column="email"
                                            sort={sort}
                                            dir={filters.dir}
                                            onSort={onSort}
                                            className={adminGuests.sortButton}
                                        />
                                        <th className="px-4 py-3 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {page.items.map((guest) => {
                                        const isSelected = selected.has(guest.id);
                                        return (
                                            <tr
                                                key={guest.id}
                                                className={cn(
                                                    adminGuests.tableRow,
                                                    isSelected && adminGuests.tableRowSelected,
                                                )}
                                            >
                                                <td className="px-4 py-3.5">
                                                    <AdminRowCheckbox
                                                        checked={isSelected}
                                                        label={`Seleccionar ${guest.fullName}`}
                                                        onChange={() => onToggle(guest.id)}
                                                    />
                                                </td>
                                                <td className="min-w-[12rem] px-2 py-3.5">
                                                    <p className={adminGuests.cellName}>
                                                        {guest.fullName}
                                                    </p>
                                                    <p className="mt-1">
                                                        <span className={adminGuests.roleBadge}>
                                                            {guestRoleLabel(guest.isPrimaryContact)}
                                                        </span>
                                                    </p>
                                                </td>
                                                <td
                                                    className={`max-w-[11rem] px-2 py-3.5 ${adminGuests.cellMuted}`}
                                                >
                                                    {guest.familyName}
                                                </td>
                                                <td className="px-2 py-3.5">
                                                    <GuestAttendanceBadge
                                                        status={guest.attendanceStatus}
                                                        tone="figma"
                                                    />
                                                </td>
                                                <td className="px-2 py-3.5 text-center">
                                                    <span
                                                        className={
                                                            guest.needsTransport
                                                                ? adminGuests.cellBus
                                                                : adminGuests.cellBusEmpty
                                                        }
                                                    >
                                                        {guest.needsTransport ? "Sí" : "—"}
                                                    </span>
                                                </td>
                                                <td
                                                    className={`max-w-[14rem] px-2 py-3.5 ${adminGuests.cellMuted}`}
                                                >
                                                    {guest.needsTransport
                                                        ? formatTransportBoardingPoint(
                                                              guest.transportBoardingPoint,
                                                          )
                                                        : "—"}
                                                </td>
                                                <td
                                                    className={`px-2 py-3.5 text-center ${adminGuests.cellMuted}`}
                                                >
                                                    {guest.dietaryRestrictions?.trim()
                                                        ? guest.dietaryRestrictions
                                                        : "—"}
                                                </td>
                                                <td
                                                    className={`whitespace-nowrap px-2 py-3.5 ${adminGuests.cellMuted}`}
                                                >
                                                    {guest.phone ?? "—"}
                                                </td>
                                                <td
                                                    className={`max-w-[12rem] px-2 py-3.5 ${adminGuests.cellMuted}`}
                                                >
                                                    {guest.email ?? "—"}
                                                </td>
                                                <td className="px-4 py-3.5 text-right">
                                                    <Link
                                                        href={`/admin/families/${guest.familyId}`}
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
                                        <span className="xl:hidden">
                                            {copy.selectVisibleCompact(visibleCount)}
                                        </span>
                                        <span className="hidden xl:inline">
                                            {copy.selectVisible(visibleCount)}
                                        </span>
                                    </button>
                                ) : null}
                                <button
                                    type="button"
                                    className={adminGuests.batchGhost}
                                    disabled={batchPending}
                                    onClick={onCopyPhones}
                                >
                                    <span className="xl:hidden">
                                        {copy.copyPhonesCompact}
                                    </span>
                                    <span className="hidden xl:inline">
                                        {adminCopy.batch.copyPhones}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    className={adminGuests.batchGhost}
                                    disabled={batchPending}
                                    onClick={onCopyEmails}
                                >
                                    {adminCopy.batch.copyEmails}
                                </button>
                                <button
                                    type="button"
                                    className={adminGuests.batchGhost}
                                    disabled={batchPending}
                                    onClick={onExportSelected}
                                >
                                    <span className="xl:hidden">{copy.exportCompact}</span>
                                    <span className="hidden xl:inline">
                                        {adminCopy.batch.exportSelected}
                                    </span>
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
