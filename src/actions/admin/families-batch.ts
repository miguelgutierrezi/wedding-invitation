"use server";

import {revalidatePath} from "next/cache";

import {requireAdmin} from "@/lib/auth/require-admin";
import {adminBatchIdListSchema} from "@/lib/validation/admin-batch";
import {setFamiliesEnabled} from "@/services/admin/families";

export type FamilyBatchActionResult =
    | {ok: true; updated: number; missing: number}
    | {ok: false; error: string};

export async function setFamiliesEnabledBatchAction(
    familyIds: string[],
    isEnabled: boolean,
): Promise<FamilyBatchActionResult> {
    await requireAdmin();

    const parsed = adminBatchIdListSchema.safeParse(familyIds);
    if (!parsed.success) {
        return {
            ok: false,
            error: parsed.error.issues[0]?.message ?? "Selección inválida.",
        };
    }

    try {
        const result = await setFamiliesEnabled(parsed.data, isEnabled);
        revalidatePath("/admin");
        revalidatePath("/admin/families");
        revalidatePath("/admin/guests");
        revalidatePath("/admin/analytics");
        return {ok: true, ...result};
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "No se pudieron actualizar las familias.",
        };
    }
}
