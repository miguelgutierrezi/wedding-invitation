import { z } from "zod";

import { isPlaceholderGuestName } from "@/lib/invitation/placeholder-guest-name";
import {
  isTransportBoardingPointId,
  TRANSPORT_BOARDING_POINT_IDS,
} from "@/config/transport";

export const transportBoardingPointSchema = z.enum(TRANSPORT_BOARDING_POINT_IDS);

export const rsvpGuestInputSchema = z.object({
  guestId: z.string().uuid(),
  willAttend: z.boolean(),
  needsTransport: z.boolean(),
  /** Empty string in the form maps to null when not using the bus. */
  transportBoardingPoint: z.union([
    transportBoardingPointSchema,
    z.literal(""),
  ]),
  dietaryRestrictions: z.string().trim().max(500),
  menuOption: z.string().trim().max(120),
  fullName: z.string().trim().max(120),
  needsNameConfirmation: z.boolean(),
});

export const submitRsvpSchema = z
  .object({
    /** Public invitation path segment (family slug). */
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(2)
      .max(80)
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    willAttend: z.boolean(),
    guests: z.array(rsvpGuestInputSchema).min(1),
    contactEmail: z
      .string()
      .trim()
      .max(200)
      .refine(
        (value) => value.length === 0 || z.email().safeParse(value).success,
        "Correo inválido",
      ),
    contactPhone: z
      .string()
      .trim()
      .min(1, "Indica un teléfono de contacto.")
      .max(200),
    message: z.string().trim().max(1000),
    website: z.string().max(0),
  })
  .superRefine((value, ctx) => {
    if (value.website) {
      ctx.addIssue({
        code: "custom",
        message: "Envío rechazado.",
        path: ["website"],
      });
    }

    if (value.willAttend) {
      const attendingCount = value.guests.filter((guest) => guest.willAttend)
        .length;

      if (attendingCount < 1) {
        ctx.addIssue({
          code: "custom",
          message: "Selecciona al menos un invitado si confirman asistencia.",
          path: ["guests"],
        });
      }
    }

    value.guests.forEach((guest, index) => {
      if (guest.needsNameConfirmation) {
        if (!guest.fullName) {
          ctx.addIssue({
            code: "custom",
            message: "Indica el nombre de esta persona.",
            path: ["guests", index, "fullName"],
          });
        } else if (isPlaceholderGuestName(guest.fullName)) {
          ctx.addIssue({
            code: "custom",
            message: "Usa el nombre real, no “Acompañante”.",
            path: ["guests", index, "fullName"],
          });
        }
      }

      if (guest.needsTransport && (!value.willAttend || !guest.willAttend)) {
        ctx.addIssue({
          code: "custom",
          message: "El transporte solo aplica si el invitado asiste.",
          path: ["guests", index, "needsTransport"],
        });
      }

      const usesBus =
        value.willAttend && guest.willAttend && guest.needsTransport;

      if (usesBus) {
        if (
          !guest.transportBoardingPoint ||
          !isTransportBoardingPointId(guest.transportBoardingPoint)
        ) {
          ctx.addIssue({
            code: "custom",
            message: "Indica desde qué punto de encuentro saldrá.",
            path: ["guests", index, "transportBoardingPoint"],
          });
        }
      }
    });
  });

export type SubmitRsvpInput = z.infer<typeof submitRsvpSchema>;
export type RsvpGuestInput = z.infer<typeof rsvpGuestInputSchema>;
