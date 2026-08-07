"use server";

import { revalidatePath } from "next/cache";

import {
  submitRsvpSchema,
  type SubmitRsvpInput,
} from "@/lib/validation/rsvp";
import { submitFamilyRsvp } from "@/services/rsvp/submit-family-rsvp";

export type SubmitRsvpActionResult =
  | {
      ok: true;
      action: "rsvp_submitted" | "rsvp_updated";
      confirmedGuestCount: number;
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

export async function submitRsvpAction(
  input: SubmitRsvpInput,
): Promise<SubmitRsvpActionResult> {
  const parsed = submitRsvpSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (parsed.data.website) {
    return {
      ok: false,
      error: "No se pudo guardar la confirmación.",
    };
  }

  try {
    const result = await submitFamilyRsvp(parsed.data);

    revalidatePath(`/i/${parsed.data.slug}`);
    revalidatePath(`/i/${parsed.data.slug}/invitacion`);

    return {
      ok: true,
      action: result.action,
      confirmedGuestCount: result.confirmedGuestCount,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo guardar la confirmación. Inténtalo de nuevo.";

    return {
      ok: false,
      error: message,
    };
  }
}
