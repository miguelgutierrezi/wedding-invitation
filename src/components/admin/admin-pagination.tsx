"use client";

import { admin } from "@/components/admin/admin-ui";
import type { PaginatedList } from "@/lib/admin/list-view";

type AdminPaginationProps = {
  list: PaginatedList<unknown>;
  onPageChange: (page: number) => void;
};

export function AdminPagination({ list, onPageChange }: AdminPaginationProps) {
  if (list.total === 0 || list.totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className={admin.muted}>
        Mostrando {list.from}–{list.to} de {list.total}
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={admin.btnSecondary}
          disabled={list.page <= 1}
          onClick={() => onPageChange(list.page - 1)}
        >
          Anterior
        </button>
        <button
          type="button"
          className={admin.btnSecondary}
          disabled={list.page >= list.totalPages}
          onClick={() => onPageChange(list.page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
