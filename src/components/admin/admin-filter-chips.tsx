"use client";

import { admin } from "@/components/admin/admin-ui";

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
    <div className="flex flex-wrap items-center gap-2 sm:col-span-2 xl:col-span-5">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          className={admin.chip}
          onClick={() => onRemove(chip.id)}
          aria-label={`Quitar filtro ${chip.label}`}
        >
          <span>{chip.label}</span>
          <span aria-hidden="true" className="text-cover-cta-fg/55">
            ×
          </span>
        </button>
      ))}
      <button type="button" className={admin.link} onClick={onClearAll}>
        Limpiar todo
      </button>
    </div>
  );
}
