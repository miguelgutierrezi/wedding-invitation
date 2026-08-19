export type InvitationActivity = {
  isEnabled: boolean;
  status: string;
};

export function isActiveInvitation(input: InvitationActivity): boolean {
  return input.isEnabled && input.status !== "disabled";
}

export function filterActiveFamilies<T extends InvitationActivity>(
  families: T[],
): T[] {
  return families.filter(isActiveInvitation);
}

export function activeFamilyIdSet<T extends InvitationActivity & { id: string }>(
  families: T[],
): Set<string> {
  return new Set(filterActiveFamilies(families).map((family) => family.id));
}

export function filterGuestsOfActiveFamilies<
  TGuest extends { familyId: string },
  TFamily extends InvitationActivity & { id: string },
>(guests: TGuest[], families: TFamily[]): TGuest[] {
  const activeIds = activeFamilyIdSet(families);
  return guests.filter((guest) => activeIds.has(guest.familyId));
}
