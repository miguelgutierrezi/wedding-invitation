"use server";

import { redirect } from "next/navigation";

import {
  buildInvitationUrl,
  generateInvitationToken,
} from "@/lib/security/generate-invitation-token";
import {
  isEmailAllowed,
  requireAdmin,
} from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import {
  createFamilySchema,
  updateFamilySchema,
} from "@/lib/validation/admin-family";
import {
  createFamily,
  regenerateFamilyToken,
  updateFamily,
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
    return { ok: false, error: "No se pudo iniciar sesión. Revisa tus datos." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email && !isEmailAllowed(user.email)) {
    await supabase.auth.signOut();
    return {
      ok: false,
      error: "Esta cuenta no está autorizada para administrar.",
    };
  }

  const safeNext =
    nextPath.startsWith("/admin") && !nextPath.startsWith("//")
      ? nextPath
      : "/admin";

  redirect(safeNext);
}

export async function signOutAdminAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createFamilyAction(
  formData: FormData,
): Promise<AdminActionResult> {
  await requireAdmin();

  const guestNames = formData
    .getAll("guestNames")
    .map((value) => String(value).trim())
    .filter(Boolean);

  const parsed = createFamilySchema.safeParse({
    displayName: formData.get("displayName"),
    maximumGuests: formData.get("maximumGuests"),
    customMessage: formData.get("customMessage") ?? "",
    guestNames,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  try {
    const { token, tokenHash, tokenPreview } = generateInvitationToken();
    const invitationUrl = buildInvitationUrl(token);

    const result = await createFamily({
      displayName: parsed.data.displayName,
      maximumGuests: parsed.data.maximumGuests,
      customMessage: parsed.data.customMessage || null,
      guestNames: parsed.data.guestNames,
      tokenHash,
      tokenPreview,
      invitationUrl,
    });

    return {
      ok: true,
      familyId: result.familyId,
      invitationUrl: result.invitationUrl,
      message: "Familia creada. Copia el enlace ahora; no se volverá a mostrar.",
    };
  } catch (error) {
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

  const guestNames = formData
    .getAll("guestNames")
    .map((value) => String(value).trim())
    .filter(Boolean);

  const parsed = updateFamilySchema.safeParse({
    familyId: formData.get("familyId"),
    displayName: formData.get("displayName"),
    maximumGuests: formData.get("maximumGuests"),
    customMessage: formData.get("customMessage") ?? "",
    isEnabled: formData.get("isEnabled") === "on" || formData.get("isEnabled") === "true",
    guestNames,
  });

  if (!parsed.success) {
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
    });

    return { ok: true, message: "Familia actualizada." };
  } catch (error) {
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
    const { token, tokenHash, tokenPreview } = generateInvitationToken();
    await regenerateFamilyToken(familyId, tokenHash, tokenPreview);

    return {
      ok: true,
      invitationUrl: buildInvitationUrl(token),
      message:
        "Enlace regenerado. Copia el nuevo enlace; el anterior dejó de funcionar.",
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo regenerar el enlace.",
    };
  }
}
