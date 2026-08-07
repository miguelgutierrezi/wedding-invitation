import { z } from "zod";

export const rsvpGuestInputSchema = z.object({
  guestId: z.string().uuid(),
  willAttend: z.boolean(),
  needsTransport: z.boolean(),
  dietaryRestrictions: z.string().trim().max(500),
  menuOption: z.string().trim().max(120),
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
    contactPhone: z.string().trim().max(200),
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
      if (guest.needsTransport && (!value.willAttend || !guest.willAttend)) {
        ctx.addIssue({
          code: "custom",
          message: "El transporte solo aplica si el invitado asiste.",
          path: ["guests", index, "needsTransport"],
        });
      }
    });
  });

export type SubmitRsvpInput = z.infer<typeof submitRsvpSchema>;
export type RsvpGuestInput = z.infer<typeof rsvpGuestInputSchema>;
