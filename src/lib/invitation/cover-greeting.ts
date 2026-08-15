import { weddingConfig } from "@/config/wedding";
import type { GuestGender } from "@/types/guest";

export type CoverGreetingGuest = {
  fullName: string;
  gender: GuestGender | null;
};

type CoverGreetingInput = {
  displayName: string;
  guests: readonly CoverGreetingGuest[];
};

/**
 * Personalized cover greeting by guest count:
 * - 1 → Querido/Querida Nombre (by gender)
 * - 2 → Queridos Nombre1 y Nombre2
 * - 3+ → Querida Familia X (family display name)
 */
export function formatCoverGreeting({
  displayName,
  guests,
}: CoverGreetingInput): string {
  const { cover } = weddingConfig;
  const people = guests
    .map((guest) => ({
      fullName: guest.fullName.trim(),
      gender: guest.gender,
    }))
    .filter((guest) => guest.fullName.length > 0);

  if (people.length === 1) {
    const person = people[0];
    const prefix =
      person.gender === "male"
        ? cover.greetingPrefixSingularMale
        : person.gender === "female"
          ? cover.greetingPrefixSingularFemale
          : cover.greetingPrefixSingularUnspecified;
    return `${prefix} ${person.fullName}`;
  }

  if (people.length === 2) {
    return `${cover.greetingPrefixDual} ${people[0].fullName} y ${people[1].fullName}`;
  }

  const familyLabel = displayName.trim() || "familia";
  return `${cover.greetingPrefix} ${familyLabel}`;
}
