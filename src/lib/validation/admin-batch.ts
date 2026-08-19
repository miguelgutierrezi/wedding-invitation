import {z} from "zod";

import {ADMIN_BATCH_MAX_IDS} from "@/config/admin";
import {parseAdminExportKind} from "@/services/admin/export-workbook-rows";

export const adminBatchIdListSchema = z
    .array(z.string().uuid())
    .min(1, "Selecciona al menos un registro.")
    .max(
        ADMIN_BATCH_MAX_IDS,
        `Puedes seleccionar como máximo ${ADMIN_BATCH_MAX_IDS} registros.`,
    );

export const adminBatchExportSchema = z
    .object({
        kind: z.string().nullable().optional(),
        familyIds: z.array(z.string().uuid()).max(ADMIN_BATCH_MAX_IDS).optional(),
        guestIds: z.array(z.string().uuid()).max(ADMIN_BATCH_MAX_IDS).optional(),
    })
    .superRefine((value, ctx) => {
        const familyCount = value.familyIds?.length ?? 0;
        const guestCount = value.guestIds?.length ?? 0;
        if (familyCount === 0 && guestCount === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Selecciona al menos un registro.",
            });
        }
        if (familyCount + guestCount > ADMIN_BATCH_MAX_IDS) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Puedes seleccionar como máximo ${ADMIN_BATCH_MAX_IDS} registros.`,
            });
        }
    });

export function parseAdminBatchExportPayload(input: unknown):
    | {
          ok: true;
          kind: ReturnType<typeof parseAdminExportKind>;
          familyIds?: string[];
          guestIds?: string[];
      }
    | {ok: false; error: string} {
    const parsed = adminBatchExportSchema.safeParse(input);
    if (!parsed.success) {
        return {
            ok: false,
            error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
        };
    }

    return {
        ok: true,
        kind: parseAdminExportKind(parsed.data.kind ?? null),
        familyIds: parsed.data.familyIds,
        guestIds: parsed.data.guestIds,
    };
}
