import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type SubmitFamilyRsvpResult = {
  responseId: string;
  familyId: string;
  action: "rsvp_submitted" | "rsvp_updated";
  confirmedGuestCount: number;
};

type RpcResult = {
  response_id: string;
  family_id: string;
  action: "rsvp_submitted" | "rsvp_updated";
  confirmed_guest_count: number;
};

function mapRpcError(message: string): string {
  if (message.includes("INVITATION_NOT_FOUND")) {
    return "No encontramos esta invitación.";
  }

  if (message.includes("RSVP_CLOSED")) {
    return "Las confirmaciones están cerradas.";
  }

  if (message.includes("RSVP_DEADLINE_PASSED")) {
    return "La fecha límite para confirmar ya pasó.";
  }

  if (message.includes("GUEST_LIMIT_EXCEEDED")) {
    return "El número de asistentes supera los cupos reservados.";
  }

  if (message.includes("ATTENDING_REQUIRES_GUESTS")) {
    return "Selecciona al menos un invitado si confirman asistencia.";
  }

  if (message.includes("INVALID_GUEST_PAYLOAD")) {
    return "Los invitados enviados no son válidos para esta familia.";
  }

  if (message.includes("TRANSPORT_BOARDING_REQUIRED")) {
    return "Indica el punto de encuentro del bus para cada invitado que lo use.";
  }

  if (message.includes("GUEST_NAME_REQUIRED")) {
    return "Indica el nombre real de cada acompañante.";
  }

  return "No se pudo guardar la confirmación. Inténtalo de nuevo.";
}

export async function submitFamilyRsvp(input: {
  slug: string;
  willAttend: boolean;
  guests: Array<{
    guestId: string;
    willAttend: boolean;
    needsTransport: boolean;
    transportBoardingPoint: string;
    dietaryRestrictions: string;
    menuOption: string;
    fullName: string;
    needsNameConfirmation: boolean;
  }>;
  contactEmail: string;
  contactPhone: string;
  message: string;
}): Promise<SubmitFamilyRsvpResult> {
  const supabase = createAdminClient();
  const invitationSlug = input.slug.trim().toLowerCase();

  const guestResponses = input.guests.map((guest) => {
    const willAttend = input.willAttend ? guest.willAttend : false;
    const needsTransport = willAttend ? guest.needsTransport : false;

    return {
      guest_id: guest.guestId,
      will_attend: willAttend,
      needs_transport: needsTransport,
      transport_boarding_point:
        needsTransport && guest.transportBoardingPoint
          ? guest.transportBoardingPoint
          : null,
      dietary_restrictions: guest.dietaryRestrictions || null,
      menu_option: guest.menuOption || null,
      full_name: guest.needsNameConfirmation ? guest.fullName : null,
      email: input.contactEmail || null,
      phone: input.contactPhone || null,
    };
  });

  const { data, error } = await supabase.rpc("submit_family_rsvp", {
    p_invitation_slug: invitationSlug,
    p_will_attend: input.willAttend,
    p_guest_responses: guestResponses,
    p_contact_email: input.contactEmail || null,
    p_contact_phone: input.contactPhone || null,
    p_message: input.message || null,
  });

  if (error) {
    throw new Error(mapRpcError(error.message));
  }

  const result = data as RpcResult | null;

  if (!result) {
    throw new Error("No se pudo guardar la confirmación. Inténtalo de nuevo.");
  }

  return {
    responseId: result.response_id,
    familyId: result.family_id,
    action: result.action,
    confirmedGuestCount: result.confirmed_guest_count,
  };
}
