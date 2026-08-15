import { z } from "zod";

const guestNameSchema = z
  .string()
  .trim()
  .min(1, "El nombre del invitado es obligatorio.")
  .max(120);

export const guestGenderSchema = z.enum(["male", "female", "unspecified"], {
  message: "Selecciona el género de cada invitado.",
});

const guestsWithGendersRefine = <
  T extends { guestNames: string[]; guestGenders: string[] },
>(
  schema: z.ZodType<T>,
) =>
  schema.superRefine((value, ctx) => {
    if (value.guestNames.length !== value.guestGenders.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Indica el género de cada invitado.",
        path: ["guestGenders"],
      });
    }
  });

export const createFamilySchema = guestsWithGendersRefine(
  z.object({
    displayName: z
      .string()
      .trim()
      .min(1, "El nombre de la familia es obligatorio.")
      .max(160),
    maximumGuests: z.coerce
      .number()
      .int()
      .min(1, "Debe haber al menos un cupo.")
      .max(30),
    customMessage: z.string().trim().max(1000).optional().or(z.literal("")),
    guestNames: z
      .array(guestNameSchema)
      .min(1, "Agrega al menos un invitado.")
      .max(30),
    guestGenders: z.array(guestGenderSchema).min(1).max(30),
  }),
);

export type CreateFamilyInput = z.infer<typeof createFamilySchema>;

export const updateFamilySchema = guestsWithGendersRefine(
  z.object({
    familyId: z.string().uuid(),
    displayName: z
      .string()
      .trim()
      .min(1, "El nombre de la familia es obligatorio.")
      .max(160),
    maximumGuests: z.coerce.number().int().min(1).max(30),
    customMessage: z.string().trim().max(1000).optional().or(z.literal("")),
    isEnabled: z.boolean(),
    guestNames: z.array(guestNameSchema).min(1).max(30),
    guestGenders: z.array(guestGenderSchema).min(1).max(30),
    invitationSlug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(
        /^$|^[a-z0-9]+(-[a-z0-9]+)*$/,
        "Usa solo minúsculas, números y guiones (ej. familia-gutierrez-panqueva).",
      )
      .max(80)
      .optional()
      .or(z.literal("")),
  }),
);

export type UpdateFamilyInput = z.infer<typeof updateFamilySchema>;
