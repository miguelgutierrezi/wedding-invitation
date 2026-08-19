import {admin} from "@/components/admin/admin-ui";
import type {FamilyOpsChip} from "@/lib/admin/family-ops";

const toneClass: Record<FamilyOpsChip["tone"], string> = {
  pending: admin.badgePending,
  ok: admin.badgeResponded,
  warn: admin.badgeDisabled,
};

export function AdminFamilyOpsChips({chips}: {chips: FamilyOpsChip[]}) {
  if (chips.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <li key={chip.key}>
          <span className={toneClass[chip.tone]}>{chip.label}</span>
        </li>
      ))}
    </ul>
  );
}
