"use client";

import Link from "next/link";
import {useMemo, useState, useTransition} from "react";

import {AdminBatchBar} from "@/components/admin/admin-batch-bar";
import {AdminExpandableFilters} from "@/components/admin/admin-expandable-filters";
import {AdminFilterChips} from "@/components/admin/admin-filter-chips";
import {AdminPagination} from "@/components/admin/admin-pagination";
import {AdminRowCheckbox} from "@/components/admin/admin-row-checkbox";
import {GuestAttendanceBadge} from "@/components/admin/admin-status-badge";
import {AdminSelect} from "@/components/admin/admin-select";
import {AdminSortHeader} from "@/components/admin/admin-sort-header";
import {admin} from "@/components/admin/admin-ui";
import {useAdminListFilters} from "@/hooks/use-admin-list-filters";
import {useAdminSelection} from "@/hooks/use-admin-selection";
import {useScrollOnPageChange} from "@/hooks/use-scroll-on-page-change";
import {adminCopy} from "@/lib/admin/admin-copy";
import {joinGuestContactLines} from "@/lib/admin/batch-clipboard";
import {copyPlainText, downloadAdminExport} from "@/lib/admin/download-export";
import {pageSelectionState} from "@/lib/admin/selection";
import {formatTransportBoardingPoint} from "@/config/transport";
import {nextSortDir, paginateItems, sortItems} from "@/lib/admin/list-view";
import {
    type AdminGuestsFilters,
    buildAdminGuestsFilterQuery,
    DEFAULT_ADMIN_GUESTS_FILTERS,
    guestMatchesFilters,
    guestsFilterChips,
} from "@/lib/validation/admin-filters";

export type AdminGuestBrowserItem = {
    id: string;
    fullName: string;
    familyId: string;
    familyName: string;
    isPrimaryContact: boolean;
    attendanceStatus: "pending" | "attending" | "not_attending";
    needsTransport: boolean;
    transportBoardingPoint: string | null;
    dietaryRestrictions: string | null;
    email: string | null;
    phone: string | null;
    needsNameConfirmation: boolean;
};

type AdminGuestsBrowserProps = {
    guests: AdminGuestBrowserItem[];
    initialFilters: AdminGuestsFilters;
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
    const attending = visibleGuests.filter(
        (guest) => guest.attendanceStatus === "attending",
    );
    const notAttending = visibleGuests.filter(
        (guest) => guest.attendanceStatus === "not_attending",
    );
    const pending = visibleGuests.filter(
        (guest) => guest.attendanceStatus === "pending",
    );
    const withBus = visibleGuests.filter((guest) => guest.needsTransport);

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

    return (
        <>
            <div ref={listTopRef} className="scroll-mt-32 space-y-4">
                <p className={`hidden lg:block ${admin.muted}`}>
                    Resumen invitado por invitado. En esta vista: {visibleGuests.length} ·
                    Asisten {attending.length} · No asisten {notAttending.length} ·
                    Pendientes {pending.length} · Bus {withBus.length}
                    {page.totalPages > 1
                        ? ` · ${adminCopy.list.showing(page.from, page.to, page.total)}`
                        : ""}
                </p>
                <dl className="grid grid-cols-2 gap-2 lg:hidden">
                    <div className={`${admin.panel} col-span-2 px-3 py-2`}>
                        <dt className={admin.eyebrow}>En esta vista</dt>
                        <dd className="text-lg font-bold tabular-nums">
                            {page.totalPages > 1
                                ? adminCopy.list.showing(page.from, page.to, page.total)
                                : visibleGuests.length}
                        </dd>
                    </div>
                    <div className={`${admin.panel} px-3 py-2`}>
                        <dt className={admin.eyebrow}>Asisten</dt>
                        <dd className="text-lg font-bold tabular-nums">{attending.length}</dd>
                    </div>
                    <div className={`${admin.panel} px-3 py-2`}>
                        <dt className={admin.eyebrow}>No asisten</dt>
                        <dd className="text-lg font-bold tabular-nums">{notAttending.length}</dd>
                    </div>
                    <div className={`${admin.panel} px-3 py-2`}>
                        <dt className={admin.eyebrow}>Bus</dt>
                        <dd className="text-lg font-bold tabular-nums">{withBus.length}</dd>
                    </div>
                </dl>

                <AdminExpandableFilters
                    activeFilterCount={chips.length}
                    chips={
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
                    }
                >
                    <label className="grid gap-2 xl:col-span-2">
                        <span className={admin.label}>Buscar</span>
                        <input
                            type="search"
                            value={filters.query}
                            onChange={(event) => changeFilters({query: event.target.value})}
                            placeholder="Invitado, familia, email, teléfono…"
                            className={admin.input}
                        />
                    </label>

                    <AdminSelect
                        label="Estado"
                        value={filters.attendance}
                        onChange={(attendance) => changeFilters({attendance})}
                        options={[
                            {value: "all", label: "Todos"},
                            {value: "pending", label: "Pendiente"},
                            {value: "attending", label: "Asiste"},
                            {value: "not_attending", label: "No asiste"},
                        ]}
                    />

                    <AdminSelect
                        label="Bus"
                        value={filters.transport}
                        onChange={(transport) => changeFilters({transport})}
                        options={[
                            {value: "all", label: "Todos"},
                            {value: "with_bus", label: "Con bus"},
                            {value: "without_bus", label: "Sin bus"},
                        ]}
                    />

                    <AdminSelect
                        label="Punto de salida"
                        value={filters.boarding}
                        onChange={(boarding) => changeFilters({boarding})}
                        options={[
                            {value: "all", label: "Todos"},
                            {value: "modelia", label: "Modelia"},
                            {value: "villa_sonia", label: "Villa Sonia"},
                            {value: "none", label: "Sin punto"},
                        ]}
                    />

                    <AdminSelect
                        label="Dieta"
                        value={filters.dietary}
                        onChange={(dietary) => changeFilters({dietary})}
                        options={[
                            {value: "all", label: "Todas"},
                            {value: "with_dietary", label: "Con restricción"},
                            {value: "without_dietary", label: "Sin restricción"},
                        ]}
                    />

                    <AdminSelect
                        label="Tipo de invitado"
                        className="sm:col-span-2 xl:col-span-2"
                        value={filters.primary}
                        onChange={(primary) => changeFilters({primary})}
                        options={[
                            {value: "all", label: "Todos"},
                            {value: "primary", label: "Contacto principal"},
                            {value: "other", label: "Otros invitados"},
                        ]}
                    />
                    <AdminSelect
                        label="Nombre del acompañante"
                        value={filters.name}
                        onChange={(name) => changeFilters({name})}
                        options={[
                            {value: "all", label: "Todos"},
                            {value: "needs_name", label: "Falta el nombre"},
                        ]}
                    />
                </AdminExpandableFilters>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 lg:flex lg:flex-wrap">
                <Link href="/admin/analytics" className={admin.btnSecondary}>
                    {adminCopy.nav.statistics}
                </Link>
                <Link href="/admin/families" className={admin.btnSecondary}>
                    Familias
                </Link>
            </div>
            {notice ? (
                <p className={`mt-4 ${admin.muted}`} role="status">
                    {notice}
                </p>
            ) : null}

            {guests.length === 0 ? (
                <p className={`mt-8 ${admin.muted}`}>
                    Aún no hay invitados. Crea familias para empezar.
                </p>
            ) : visibleGuests.length === 0 ? (
                <p className={`mt-8 ${admin.muted}`}>
                    No hay invitados que coincidan con los filtros actuales.
                </p>
            ) : (
                <>
                    <ul className={`mt-6 grid gap-3 lg:hidden ${selection.count > 0 ? "pb-36" : ""}`}>
                        {page.items.map((guest) => (
                            <li key={guest.id} className={`${admin.card} flex items-start gap-1 p-2`}>
                                <AdminRowCheckbox
                                    checked={selection.isSelected(guest.id)}
                                    label={`Seleccionar ${guest.fullName}`}
                                    onChange={() => selection.toggle(guest.id)}
                                />
                                <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden p-2">
                                <div className="min-w-0">
                                    <p className="break-words font-bold text-cover-cta-fg">{guest.fullName}</p>
                                    <p className={`mt-0.5 ${admin.muted}`}>{guest.familyName}</p>
                                    {guest.isPrimaryContact ? (
                                        <p className="mt-1 text-xs text-cover-cta-fg/65">
                                            {adminCopy.guest.primaryContact}
                                        </p>
                                    ) : null}
                                    {guest.needsNameConfirmation ? (
                                        <p className="mt-1 text-xs text-cover-cta-fg/65">
                                            falta el nombre
                                        </p>
                                    ) : null}
                                    <div className="mt-2">
                                        <GuestAttendanceBadge status={guest.attendanceStatus}/>
                                    </div>
                                </div>
                                <p className={admin.muted}>
                                    {guest.needsTransport
                                        ? `Bus · ${formatTransportBoardingPoint(guest.transportBoardingPoint)}`
                                        : "Sin bus"}
                                    {guest.dietaryRestrictions?.trim()
                                        ? ` · ${guest.dietaryRestrictions}`
                                        : ""}
                                </p>
                                <p className={admin.muted}>
                                    {guest.phone ?? "Sin teléfono"}
                                    {guest.email ? ` · ${guest.email}` : ""}
                                </p>
                                <Link
                                    href={`/admin/families/${guest.familyId}`}
                                    className={admin.btnSecondary}
                                >
                                    Ver familia
                                </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className={`mt-8 hidden lg:block ${admin.tableShell} ${selection.count > 0 ? "mb-28" : ""}`}>
                        <table className="min-w-full text-left text-sm font-[family-name:var(--font-timer)]">
                            <thead className={admin.tableHead}>
                            <tr>
                                <th className="w-12 px-2 py-3">
                                    <AdminRowCheckbox
                                        checked={pageState === "all"}
                                        indeterminate={pageState === "some"}
                                        label="Seleccionar esta página"
                                        onChange={(checked) => selection.setMany(pageIds, checked)}
                                    />
                                </th>
                                <AdminSortHeader
                                    label="Invitado"
                                    column="fullName"
                                    sort={sort}
                                    dir={filters.dir}
                                    onSort={(column) =>
                                        changeFilters({
                                            sort: column,
                                            dir: nextSortDir(sort, filters.dir, column),
                                        })
                                    }
                                />
                                <AdminSortHeader
                                    label="Familia"
                                    column="familyName"
                                    sort={sort}
                                    dir={filters.dir}
                                    onSort={(column) =>
                                        changeFilters({
                                            sort: column,
                                            dir: nextSortDir(sort, filters.dir, column),
                                        })
                                    }
                                />
                                <AdminSortHeader
                                    label="Estado"
                                    column="attendanceStatus"
                                    sort={sort}
                                    dir={filters.dir}
                                    onSort={(column) =>
                                        changeFilters({
                                            sort: column,
                                            dir: nextSortDir(sort, filters.dir, column),
                                        })
                                    }
                                />
                                <AdminSortHeader
                                    label="Bus"
                                    column="needsTransport"
                                    sort={sort}
                                    dir={filters.dir}
                                    onSort={(column) =>
                                        changeFilters({
                                            sort: column,
                                            dir: nextSortDir(sort, filters.dir, column),
                                        })
                                    }
                                />
                                <AdminSortHeader
                                    label="Punto de salida"
                                    column="transportBoardingPoint"
                                    sort={sort}
                                    dir={filters.dir}
                                    onSort={(column) =>
                                        changeFilters({
                                            sort: column,
                                            dir: nextSortDir(sort, filters.dir, column),
                                        })
                                    }
                                />
                                <AdminSortHeader
                                    label="Dieta"
                                    column="dietaryRestrictions"
                                    sort={sort}
                                    dir={filters.dir}
                                    onSort={(column) =>
                                        changeFilters({
                                            sort: column,
                                            dir: nextSortDir(sort, filters.dir, column),
                                        })
                                    }
                                />
                                <AdminSortHeader
                                    label="Teléfono"
                                    column="phone"
                                    sort={sort}
                                    dir={filters.dir}
                                    onSort={(column) =>
                                        changeFilters({
                                            sort: column,
                                            dir: nextSortDir(sort, filters.dir, column),
                                        })
                                    }
                                />
                                <AdminSortHeader
                                    label="Correo"
                                    column="email"
                                    sort={sort}
                                    dir={filters.dir}
                                    onSort={(column) =>
                                        changeFilters({
                                            sort: column,
                                            dir: nextSortDir(sort, filters.dir, column),
                                        })
                                    }
                                />
                                <th className="px-4 py-3 font-medium"/>
                            </tr>
                            </thead>
                            <tbody>
                            {page.items.map((guest) => (
                                <tr key={guest.id} className={admin.tableRow}>
                                    <td className="px-2 py-3">
                                        <AdminRowCheckbox
                                            checked={selection.isSelected(guest.id)}
                                            label={`Seleccionar ${guest.fullName}`}
                                            onChange={() => selection.toggle(guest.id)}
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-medium text-cover-cta-fg">
                                        {guest.fullName}
                                        {guest.isPrimaryContact ? (
                                            <span className="ml-2 text-xs text-cover-cta-fg/65">
                        {adminCopy.guest.primaryContact}
                      </span>
                                        ) : null}
                                        {guest.needsNameConfirmation ? (
                                            <span className="ml-2 text-xs text-cover-cta-fg/65">
                        falta el nombre
                      </span>
                                        ) : null}
                                    </td>
                                    <td className="px-4 py-3 text-cover-cta-fg/75">
                                        {guest.familyName}
                                    </td>
                                    <td className="px-4 py-3 text-cover-cta-fg/75">
                                        <GuestAttendanceBadge status={guest.attendanceStatus}/>
                                    </td>
                                    <td className="px-4 py-3 text-cover-cta-fg/75">
                                        {guest.needsTransport ? "Sí" : "—"}
                                    </td>
                                    <td className="max-w-[12rem] px-4 py-3 text-cover-cta-fg/75">
                                        {guest.needsTransport
                                            ? formatTransportBoardingPoint(guest.transportBoardingPoint)
                                            : "—"}
                                    </td>
                                    <td className="max-w-[14rem] px-4 py-3 text-cover-cta-fg/75">
                                        {guest.dietaryRestrictions?.trim()
                                            ? guest.dietaryRestrictions
                                            : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-cover-cta-fg/75">
                                        {guest.phone ?? "—"}
                                    </td>
                                    <td className="px-4 py-3 text-cover-cta-fg/75">
                                        {guest.email ?? "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={`/admin/families/${guest.familyId}`}
                                            className={admin.link}
                                        >
                                            Familia
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <AdminPagination
                        list={page}
                        onPageChange={(nextPage) =>
                            updateFilters({...filters, page: nextPage})
                        }
                    />
                    <AdminBatchBar
                        count={selection.count}
                        visibleCount={visibleIds.length}
                        onClear={selection.clear}
                        onSelectVisible={() => selection.setMany(visibleIds, true)}
                    >
                        <button
                            type="button"
                            className={admin.btnSecondary}
                            disabled={batchPending}
                            onClick={() => {
                                void (async () => {
                                    const text = joinGuestContactLines(selectedGuests(), "phone");
                                    const ok = await copyPlainText(text);
                                    reportCopy(text, ok);
                                })();
                            }}
                        >
                            {adminCopy.batch.copyPhones}
                        </button>
                        <button
                            type="button"
                            className={admin.btnSecondary}
                            disabled={batchPending}
                            onClick={() => {
                                void (async () => {
                                    const text = joinGuestContactLines(selectedGuests(), "email");
                                    const ok = await copyPlainText(text);
                                    reportCopy(text, ok);
                                })();
                            }}
                        >
                            {adminCopy.batch.copyEmails}
                        </button>
                        <button
                            type="button"
                            className={admin.btnSecondary}
                            disabled={batchPending}
                            onClick={() => {
                                startTransition(async () => {
                                    const result = await downloadAdminExport({
                                        guestIds: selection.selectedIds,
                                    });
                                    setNotice(result.ok ? adminCopy.batch.downloaded : result.error);
                                });
                            }}
                        >
                            {adminCopy.batch.exportSelected}
                        </button>
                    </AdminBatchBar>
                </>
            )}
        </>
    );
}
