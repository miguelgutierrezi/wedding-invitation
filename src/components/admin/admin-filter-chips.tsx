"use client";

import {AdminControlChipXIcon} from "@/components/admin/admin-control-icons";
import {adminGuests} from "@/components/admin/admin-ui";

export type AdminFilterChip = {
    id: string;
    label: string;
};

type AdminFilterChipsProps = {
    chips: AdminFilterChip[];
    onRemove: (id: string) => void;
    onClearAll: () => void;
};

export function AdminFilterChips({
    chips,
    onRemove,
    onClearAll,
}: AdminFilterChipsProps) {
    if (chips.length === 0) {
        return null;
    }

    return (
        <div className={adminGuests.filterChipRow}>
            {chips.map((chip) => (
                <button
                    key={chip.id}
                    type="button"
                    className={adminGuests.filterChip}
                    onClick={() => onRemove(chip.id)}
                    aria-label={`Quitar filtro ${chip.label}`}
                >
                    <span>{chip.label}</span>
                    <AdminControlChipXIcon />
                </button>
            ))}
            <button
                type="button"
                className={adminGuests.filterChipClear}
                onClick={onClearAll}
            >
                Limpiar todo
            </button>
        </div>
    );
}
