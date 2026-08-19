"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AdminExpandableFilters } from "@/components/admin/admin-expandable-filters";
import { AdminFilterChips } from "@/components/admin/admin-filter-chips";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSelect } from "@/components/admin/admin-select";
import { AdminSortHeader } from "@/components/admin/admin-sort-header";
import { admin } from "@/components/admin/admin-ui";
import { adminCopy } from "@/lib/admin/admin-copy";
import { formatTransportBoardingPoint } from "@/config/transport";
import { nextSortDir, paginateItems, sortItems } from "@/lib/admin/list-view";
import {
  buildAdminGuestsFilterQuery,
  DEFAULT_ADMIN_GUESTS_FILTERS,
  guestMatchesFilters,
  guestsFilterChips,
  replaceQueryString,
  type AdminGuestsFilters,
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
  const [filters, setFilters] = useState(initialFilters);
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

  function updateFilters(next: AdminGuestsFilters) {
    setFilters(next);
    replaceQueryString("/admin/guests", buildAdminGuestsFilterQuery(next));
  }

  function changeFilters(patch: Partial<AdminGuestsFilters>) {
    updateFilters({ ...filters, ...patch, page: 1 });
  }

  function removeChip(id: string) {
    if (id === "query") {
      changeFilters({ query: "" });
      return;
    }

    changeFilters({ [id]: "all" } as Partial<AdminGuestsFilters>);
  }

  return (
    <>
      <div className="space-y-4">
        <p className={admin.muted}>
          Resumen invitado por invitado. En esta vista: {visibleGuests.length} ·
          Asisten {attending.length} · No asisten {notAttending.length} ·
          Pendientes {pending.length} · Bus {withBus.length}
        </p>

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
              onChange={(event) => changeFilters({ query: event.target.value })}
              placeholder="Invitado, familia, email, teléfono…"
              className={admin.input}
            />
          </label>

          <AdminSelect
            label="Estado"
            value={filters.attendance}
            onChange={(attendance) => changeFilters({ attendance })}
            options={[
              { value: "all", label: "Todos" },
              { value: "pending", label: "Pendiente" },
              { value: "attending", label: "Asiste" },
              { value: "not_attending", label: "No asiste" },
            ]}
          />

          <AdminSelect
            label="Bus"
            value={filters.transport}
            onChange={(transport) => changeFilters({ transport })}
            options={[
              { value: "all", label: "Todos" },
              { value: "with_bus", label: "Con bus" },
              { value: "without_bus", label: "Sin bus" },
            ]}
          />

          <AdminSelect
            label="Punto de salida"
            value={filters.boarding}
            onChange={(boarding) => changeFilters({ boarding })}
            options={[
              { value: "all", label: "Todos" },
              { value: "modelia", label: "Modelia" },
              { value: "villa_sonia", label: "Villa Sonia" },
              { value: "none", label: "Sin punto" },
            ]}
          />

          <AdminSelect
            label="Dieta"
            value={filters.dietary}
            onChange={(dietary) => changeFilters({ dietary })}
            options={[
              { value: "all", label: "Todas" },
              { value: "with_dietary", label: "Con restricción" },
              { value: "without_dietary", label: "Sin restricción" },
            ]}
          />

          <AdminSelect
            label="Tipo de invitado"
            className="sm:col-span-2 xl:col-span-2"
            value={filters.primary}
            onChange={(primary) => changeFilters({ primary })}
            options={[
              { value: "all", label: "Todos" },
              { value: "primary", label: "Contacto principal" },
              { value: "other", label: "Otros invitados" },
            ]}
          />
        </AdminExpandableFilters>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/analytics" className={admin.btnSecondary}>
          {adminCopy.nav.statistics}
        </Link>
        <Link href="/admin/families" className={admin.btnSecondary}>
          Familias
        </Link>
      </div>

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
          <div className={`mt-8 ${admin.tableShell}`}>
            <table className="min-w-full text-left text-sm font-[family-name:var(--font-timer)]">
              <thead className={admin.tableHead}>
                <tr>
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
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {page.items.map((guest) => (
                  <tr key={guest.id} className={admin.tableRow}>
                    <td className="px-4 py-3 font-medium text-cover-cta-fg">
                      {guest.fullName}
                      {guest.isPrimaryContact ? (
                        <span className="ml-2 text-xs text-cover-cta-fg/65">
                          {adminCopy.guest.primaryContact}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-cover-cta-fg/75">
                      {guest.familyName}
                    </td>
                    <td className="px-4 py-3 text-cover-cta-fg/75">
                      {statusLabel(guest.attendanceStatus)}
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
              updateFilters({ ...filters, page: nextPage })
            }
          />
        </>
      )}
    </>
  );
}
