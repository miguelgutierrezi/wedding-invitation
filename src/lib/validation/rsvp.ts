import { z } from "zod";

export const rsvpGuestInputSchema = z.object({
  guestId: z.string().uuid(),
  willAttend: z.boolean(),
  dietaryRestrictions: z.string().trim().max(500),
  menuOption: z.string().trim().max(120),
});

export const submitRsvpSchema = z
  .object({
    token: z.string().trim().min(8).max(200),
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
  });

export type SubmitRsvpInput = z.infer<typeof submitRsvpSchema>;
export type RsvpGuestInput = z.infer<typeof rsvpGuestInputSchema>;
