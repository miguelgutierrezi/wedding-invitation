export type FamilyGuestSignalSource = {
  needsNameConfirmation?: boolean;
  needsTransport: boolean;
  dietaryRestrictions?: string | null;
};

export type FamilyGuestSignals = {
  hasPendingName: boolean;
  usesBus: boolean;
  hasDietary: boolean;
};

export function familyGuestSignals(
  guests: FamilyGuestSignalSource[],
): FamilyGuestSignals {
  return {
    hasPendingName: guests.some((guest) => Boolean(guest.needsNameConfirmation)),
    usesBus: guests.some((guest) => guest.needsTransport),
    hasDietary: guests.some((guest) =>
      Boolean(guest.dietaryRestrictions?.trim()),
    ),
  };
}

export type FamilyOpsChipTone = "pending" | "ok" | "warn";

export type FamilyOpsChip = {
  key: string;
  label: string;
  tone: FamilyOpsChipTone;
};

export function familyOperationChips(input: {
  status: "pending" | "responded" | "disabled";
  isEnabled: boolean;
  lastOpenedAt: string | null;
  hasPendingName: boolean;
  usesBus: boolean;
  hasDietary: boolean;
}): FamilyOpsChip[] {
  const chips: FamilyOpsChip[] = [];
  const opened = Boolean(input.lastOpenedAt);
  const disabled = !input.isEnabled || input.status === "disabled";

  if (!disabled && input.status === "pending" && !opened) {
    chips.push({key: "not-opened", label: "Sin abrir", tone: "pending"});
  } else if (!disabled && input.status === "pending" && opened) {
    chips.push({key: "opened", label: "Abrió", tone: "pending"});
  }

  if (input.hasPendingName) {
    chips.push({
      key: "name",
      label: "Nombre pendiente",
      tone: "warn",
    });
  }

  if (input.usesBus) {
    chips.push({key: "bus", label: "Bus", tone: "ok"});
  }

  if (input.hasDietary) {
    chips.push({key: "diet", label: "Dieta", tone: "ok"});
  }

  return chips;
}
