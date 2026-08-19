"use client";

import {admin} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import type {PaginatedList} from "@/lib/admin/list-view";

type AdminPaginationProps = {
    list: PaginatedList<unknown>;
    onPageChange: (page: number) => void;
};

export function AdminPagination({list, onPageChange}: AdminPaginationProps) {
    if (list.total === 0 || list.totalPages <= 1) {
        return null;
    }

    return (
        <div className="mt-4 flex flex-col gap-3 pr-16 lg:pr-0">
            <p className={`${admin.muted} text-center sm:text-left`}>
                {adminCopy.list.showing(list.from, list.to, list.total)}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
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
