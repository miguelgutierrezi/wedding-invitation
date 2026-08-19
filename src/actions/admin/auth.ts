"use server";

import { redirect } from "next/navigation";

import {
  isEmailAllowed,
  requireAdmin,
} from "@/lib/auth/require-admin";
import { fingerprintPublicId } from "@/lib/logging/fingerprint";
import { serverLog } from "@/lib/logging/server-log";
import {
  buildInvitationUrl,
  slugFromDisplayName,
} from "@/lib/security/generate-invitation-slug";
import { createClient } from "@/lib/supabase/server";
import {
  createFamilySchema,
  deleteFamilySchema,
  parseAdminGuestFormEntries,
  parseIsEnabledFormValue,
  updateFamilySchema,
} from "@/lib/validation/admin-family";
import {
  createFamily,
  deleteFamily,
  updateFamily,
  updateFamilyInvitationSlug,
} from "@/services/admin/families";

export type AdminActionResult =
  | { ok: true; message?: string; invitationUrl?: string; familyId?: string }
  | { ok: false; error: string };

export async function signInAdminAction(
  formData: FormData,
): Promise<AdminActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { ok: false, error: "Correo y contraseña son obligatorios." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    serverLog({
      level: "warn",
      event: "admin_sign_in_failed",
      errorCode: "credentials",
    });
    return { ok: false, error: "No se pudo iniciar sesión. Revisa tus datos." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email && !isEmailAllowed(user.email)) {
    await supabase.auth.signOut();
    serverLog({
      level: "warn",
      event: "admin_sign_in_denied",
      errorCode: "allowlist",
    });
    return {
      ok: false,
      error: "Esta cuenta no está autorizada para administrar.",
    };
  }

  const safeNext =
    nextPath.startsWith("/admin") && !nextPath.startsWith("//")
      ? nextPath
      : "/admin";

  serverLog({
    level: "info",
    event: "admin_sign_in_ok",
  });

  redirect(safeNext);
}

export async function signOutAdminAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  serverLog({
    level: "info",
    event: "admin_sign_out_ok",
  });
  redirect("/admin/login");
}

export async function createFamilyAction(
  formData: FormData,
): Promise<AdminActionResult> {
  await requireAdmin();

  const guestEntries = parseAdminGuestFormEntries(formData);
  const guestNames = guestEntries.map((guest) => guest.name);
  const guestGenders = guestEntries.map((guest) => guest.gender);

  const parsed = createFamilySchema.safeParse({
    displayName: formData.get("displayName"),
    maximumGuests: formData.get("maximumGuests"),
    customMessage: formData.get("customMessage") ?? "",
    guestNames,
    guestGenders,
  });

  if (!parsed.success) {
    serverLog({
      level: "warn",
      event: "admin_family_create_validation_failed",
      issueCount: parsed.error.issues.length,
    });
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  try {
    const result = await createFamily({
      displayName: parsed.data.displayName,
      maximumGuests: parsed.data.maximumGuests,
      customMessage: parsed.data.customMessage || null,
      guestNames: parsed.data.guestNames,
      guestGenders: parsed.data.guestGenders,
    });

    return {
      ok: true,
      familyId: result.familyId,
      invitationUrl: result.invitationUrl,
      message:
        "Familia creada. Puedes copiar y compartir el enlace cuando quieras.",
    };
  } catch (error) {
    serverLog({
      level: "error",
      event: "admin_family_create_action_failed",
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo crear la familia.",
    };
  }
}

export async function updateFamilyAction(
  formData: FormData,
): Promise<AdminActionResult> {
  await requireAdmin();

  const guestEntries = parseAdminGuestFormEntries(formData);
  const guestNames = guestEntries.map((guest) => guest.name);
  const guestGenders = guestEntries.map((guest) => guest.gender);
  const guestIds = guestEntries.map((guest) => guest.id);

  const parsed = updateFamilySchema.safeParse({
    familyId: formData.get("familyId"),
    displayName: formData.get("displayName"),
    maximumGuests: formData.get("maximumGuests"),
    customMessage: formData.get("customMessage") ?? "",
    isEnabled: parseIsEnabledFormValue(formData),
    guestNames,
    guestGenders,
    guestIds,
    invitationSlug: formData.get("invitationSlug") ?? "",
  });

  if (!parsed.success) {
    serverLog({
      level: "warn",
      event: "admin_family_update_validation_failed",
      issueCount: parsed.error.issues.length,
    });
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  try {
    await updateFamily({
      familyId: parsed.data.familyId,
      displayName: parsed.data.displayName,
      maximumGuests: parsed.data.maximumGuests,
      customMessage: parsed.data.customMessage || null,
      isEnabled: parsed.data.isEnabled,
      guestNames: parsed.data.guestNames,
      guestGenders: parsed.data.guestGenders,
      guestIds: parsed.data.guestIds,
      invitationSlug: parsed.data.invitationSlug || undefined,
    });

    return { ok: true, message: "Familia actualizada." };
  } catch (error) {
    serverLog({
      level: "error",
      event: "admin_family_update_action_failed",
      slugFp: fingerprintPublicId(parsed.data.familyId),
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la familia.",
    };
  }
}

export async function regenerateInvitationAction(
  familyId: string,
): Promise<AdminActionResult> {
  await requireAdmin();

  if (!familyId) {
    return { ok: false, error: "Familia no indicada." };
  }

  try {
    const { getFamilyById } = await import("@/services/admin/families");
    const family = await getFamilyById(familyId);

    if (!family) {
      serverLog({
        level: "warn",
        event: "admin_family_slug_regen_action_failed",
        errorCode: "family_not_found",
      });
      return { ok: false, error: "Familia no encontrada." };
    }

    const slug = await updateFamilyInvitationSlug(
      familyId,
      slugFromDisplayName(family.displayName),
    );

    return {
      ok: true,
      invitationUrl: buildInvitationUrl(slug),
      message:
        "Enlace nuevo generado a partir del nombre de la familia. El enlace anterior deja de funcionar si era distinto.",
    };
  } catch (error) {
    serverLog({
      level: "error",
      event: "admin_family_slug_regen_action_failed",
      slugFp: fingerprintPublicId(familyId),
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo regenerar el enlace.",
    };
  }
}

export async function deleteFamilyAction(
  formData: FormData,
): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = deleteFamilySchema.safeParse({
    familyId: formData.get("familyId"),
    confirmName: formData.get("confirmName"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  const { getFamilyById } = await import("@/services/admin/families");
  const family = await getFamilyById(parsed.data.familyId);

  if (!family) {
    return { ok: false, error: "Familia no encontrada." };
  }

  if (
    family.displayName.trim().toLocaleLowerCase() !==
    parsed.data.confirmName.toLocaleLowerCase()
  ) {
    return {
      ok: false,
      error: "El nombre escrito no coincide con el de la familia.",
    };
  }

  try {
    await deleteFamily(parsed.data.familyId);
    redirect("/admin/families");
  } catch (error) {
    serverLog({
      level: "error",
      event: "admin_family_delete_action_failed",
      slugFp: fingerprintPublicId(parsed.data.familyId),
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la familia.",
    };
  }
}
