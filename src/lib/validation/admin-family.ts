import {z} from "zod";

const guestNameSchema = z
    .string()
    .trim()
    .min(1, "El nombre del invitado es obligatorio.")
    .max(120);

export const guestGenderSchema = z.enum(["male", "female", "unspecified"], {
    message: "Selecciona el género de cada invitado.",
});

export type AdminGuestFormEntry = {
    id: string;
    name: string;
    gender: string;
};

export function parseAdminGuestFormEntries(
    formData: FormData,
): AdminGuestFormEntry[] {
    const names = formData.getAll("guestNames");
    const genders = formData.getAll("guestGenders");
    const ids = formData.getAll("guestIds");

    return names
        .map((value, index) => ({
            id: String(ids[index] ?? "").trim(),
            name: String(value).trim(),
            gender: String(genders[index] ?? "").trim(),
        }))
        .filter((guest) => guest.name.length > 0);
}

export function parseIsEnabledFormValue(formData: FormData): boolean {
    const value = formData.get("isEnabled");
    return value === "on" || value === "true";
}

const guestsWithGendersRefine = <
    T extends {
        guestNames: string[];
        guestGenders: string[];
        guestIds?: string[];
    },
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

        if (
            value.guestIds !== undefined &&
            value.guestIds.length !== value.guestNames.length
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "No se pudieron asociar los invitados.",
                path: ["guestIds"],
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
        guestIds: z
            .array(z.union([z.string().uuid(), z.literal("")]))
            .max(30)
            .optional(),
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

export const deleteFamilySchema = z.object({
    familyId: z.string().uuid(),
    confirmName: z
        .string()
        .trim()
        .min(1, "Escribe el nombre de la familia para confirmar."),
});

export type DeleteFamilyInput = z.infer<typeof deleteFamilySchema>;
