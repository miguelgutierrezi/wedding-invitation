"use server";

import {redirect} from "next/navigation";

import {ADMIN_ACCEPT_INVITE_PATH} from "@/lib/auth/admin-accept-invite";
import {
    canDeleteActiveAdmin,
    isActiveAdminAccount,
    isPendingAdminInvite,
} from "@/lib/auth/admin-invite";
import {
    listAllAuthUsers,
    partitionAdminDirectory,
    toAdminInviteUser,
} from "@/lib/auth/list-pending-admin-invites";
import {requireAdmin} from "@/lib/auth/require-admin";
import {fingerprintPublicId} from "@/lib/logging/fingerprint";
import {serverLog} from "@/lib/logging/server-log";
import {buildInvitationUrl, slugFromDisplayName,} from "@/lib/security/generate-invitation-slug";
import {createAdminClient} from "@/lib/supabase/admin";
import {createClient} from "@/lib/supabase/server";
import {
    createFamilySchema,
    deleteFamilySchema,
    parseAdminGuestFormEntries,
    parseIsEnabledFormValue,
    updateFamilySchema,
} from "@/lib/validation/admin-family";
import {createFamily, deleteFamily, updateFamily, updateFamilyInvitationSlug,} from "@/services/admin/families";

export type AdminActionResult =
    | { ok: true; message?: string; invitationUrl?: string; familyId?: string }
    | { ok: false; error: string };

export type PendingAdminInvite = {
    id: string;
    email: string;
};

export type ActiveAdminAccount = {
    id: string;
    email: string;
    lastSignInAt: string | null;
};

export type AdminDirectory = {
    currentAdminId: string;
    active: ActiveAdminAccount[];
    pending: PendingAdminInvite[];
};

export async function listAdminDirectory(): Promise<AdminDirectory> {
    const currentAdmin = await requireAdmin();

    const {users, error} = await listAllAuthUsers();

    if (error) {
        serverLog({
            level: "error",
            event: "admin_directory_list_failed",
            errorCode: error.message,
        });
        throw new Error("No se pudieron cargar los administradores.");
    }

    const {active, pending} = partitionAdminDirectory(users);
    return {
        currentAdminId: currentAdmin.id,
        active: active.map((entry) => ({
            id: entry.id,
            email: entry.email,
            lastSignInAt: entry.lastSignInAt ?? null,
        })),
        pending,
    };
}

/** @deprecated Prefer `listAdminDirectory().pending` — kept for existing callers/tests. */
export async function listPendingAdminInvites(): Promise<PendingAdminInvite[]> {
    const directory = await listAdminDirectory();
    return directory.pending;
}

export async function signInAdminAction(
    formData: FormData,
): Promise<AdminActionResult> {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const nextPath = String(formData.get("next") ?? "/admin");

    if (!email || !password) {
        return {ok: false, error: "Correo y contraseña son obligatorios."};
    }

    const supabase = await createClient();
    const {error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        serverLog({
            level: "warn",
            event: "admin_sign_in_failed",
            errorCode: "credentials",
        });
        return {ok: false, error: "No se pudo iniciar sesión. Revisa tus datos."};
    }

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user?.email) {
        await supabase.auth.signOut();
        serverLog({
            level: "warn",
            event: "admin_sign_in_denied",
            errorCode: "missing_email",
        });
        return {
            ok: false,
            error: "No se pudo validar la sesión de administración.",
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

export async function inviteAdminAction(
    formData: FormData,
): Promise<AdminActionResult> {
    await requireAdmin();

    const email = String(formData.get("email") ?? "").trim();
    if (!email) {
        return {ok: false, error: "Indica un correo para invitar al administrador."};
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return {ok: false, error: "El correo no es válido."};
    }

    const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (!rawAppUrl) {
        return {
            ok: false,
            error: "Falta NEXT_PUBLIC_APP_URL para enviar la invitación.",
        };
    }

    const appUrl = rawAppUrl.replace(/\/$/, "");
    const supabase = createAdminClient();
    const {users, error: usersError} = await listAllAuthUsers(supabase);

    if (usersError) {
        serverLog({
            level: "error",
            event: "admin_invite_lookup_failed",
            errorCode: usersError.message,
        });
        return {ok: false, error: "No se pudo validar la invitación anterior."};
    }

    const normalizedEmail = email.toLocaleLowerCase();
    const previousInvite = users.find(
        (user) =>
            user.email?.toLocaleLowerCase() === normalizedEmail &&
            isPendingAdminInvite(toAdminInviteUser(user)),
    );

    if (previousInvite) {
        const {error: deleteError} = await supabase.auth.admin.deleteUser(
            previousInvite.id,
        );
        if (deleteError) {
            serverLog({
                level: "error",
                event: "admin_invite_replace_failed",
                errorCode: deleteError.message,
            });
            return {ok: false, error: "No se pudo reemplazar la invitación anterior."};
        }
    }

    const {data: invited, error} = await supabase.auth.admin.inviteUserByEmail(
        email,
        {
            redirectTo: `${appUrl}${ADMIN_ACCEPT_INVITE_PATH}`,
            data: {role: "admin"},
        },
    );

    if (error) {
        serverLog({
            level: "error",
            event: "admin_invite_failed",
            errorCode: error.message,
        });
        return {
            ok: false,
            error: "No se pudo enviar la invitación. Intenta de nuevo.",
        };
    }

    if (invited.user?.id) {
        const {error: roleError} = await supabase.auth.admin.updateUserById(
            invited.user.id,
            {
                app_metadata: {
                    ...invited.user.app_metadata,
                    role: "admin",
                },
                user_metadata: {
                    ...invited.user.user_metadata,
                    role: "admin",
                },
            },
        );
        if (roleError) {
            serverLog({
                level: "warn",
                event: "admin_invite_role_metadata_failed",
                errorCode: roleError.message,
            });
        }
    }

    serverLog({
        level: "info",
        event: "admin_invite_sent",
    });

    return {
        ok: true,
        message: `Invitación enviada a ${email}. Al aceptar el correo podrá crear su contraseña y entrar al panel.`,
    };
}

export async function deletePendingAdminInviteAction(
    formData: FormData,
): Promise<AdminActionResult> {
    await requireAdmin();

    const userId = String(formData.get("userId") ?? "").trim();
    if (!userId) {
        return {ok: false, error: "No se indicó la invitación a eliminar."};
    }

    const supabase = createAdminClient();
    const {users, error: listError} = await listAllAuthUsers(supabase);

    if (listError) {
        serverLog({
            level: "error",
            event: "admin_invite_delete_lookup_failed",
            errorCode: listError.message,
        });
        return {ok: false, error: "No se pudo validar la invitación pendiente."};
    }

    const invite = users.find(
        (user) =>
            user.id === userId && isPendingAdminInvite(toAdminInviteUser(user)),
    );

    if (!invite) {
        return {
            ok: false,
            error: "Solo se pueden eliminar invitaciones pendientes sin aceptar.",
        };
    }

    try {
        const {error} = await supabase.auth.admin.deleteUser(userId);
        if (error) {
            serverLog({
                level: "error",
                event: "admin_invite_delete_failed",
                errorCode: error.message,
            });
            return {
                ok: false,
                error: "No se pudo borrar la invitación pendiente.",
            };
        }

        return {
            ok: true,
            message: `Invitación eliminada para ${invite.email}.`,
        };
    } catch (error) {
        serverLog({
            level: "error",
            event: "admin_invite_delete_failed",
            errorName: error instanceof Error ? error.name : "UnknownError",
        });
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "No se pudo borrar la invitación pendiente.",
        };
    }
}

export async function deleteActiveAdminAction(
    formData: FormData,
): Promise<AdminActionResult> {
    const currentAdmin = await requireAdmin();

    const userId = String(formData.get("userId") ?? "").trim();
    if (!userId) {
        return {ok: false, error: "No se indicó el administrador a eliminar."};
    }

    if (!canDeleteActiveAdmin(userId, currentAdmin.id)) {
        return {
            ok: false,
            error: "No puedes eliminar tu propia cuenta mientras estás en sesión.",
        };
    }

    const supabase = createAdminClient();
    const {users, error: listError} = await listAllAuthUsers(supabase);

    if (listError) {
        serverLog({
            level: "error",
            event: "admin_active_delete_lookup_failed",
            errorCode: listError.message,
        });
        return {ok: false, error: "No se pudo validar el administrador."};
    }

    const account = users.find(
        (user) =>
            user.id === userId && isActiveAdminAccount(toAdminInviteUser(user)),
    );

    if (!account) {
        return {
            ok: false,
            error: "Solo se pueden eliminar administradores activos.",
        };
    }

    try {
        const {error} = await supabase.auth.admin.deleteUser(userId);
        if (error) {
            serverLog({
                level: "error",
                event: "admin_active_delete_failed",
                errorCode: error.message,
            });
            return {
                ok: false,
                error: "No se pudo borrar el administrador.",
            };
        }

        serverLog({
            level: "info",
            event: "admin_active_deleted",
        });

        return {
            ok: true,
            message: `Administrador eliminado: ${account.email}.`,
        };
    } catch (error) {
        serverLog({
            level: "error",
            event: "admin_active_delete_failed",
            errorName: error instanceof Error ? error.name : "UnknownError",
        });
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "No se pudo borrar el administrador.",
        };
    }
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

        return {ok: true, message: "Familia actualizada."};
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
        return {ok: false, error: "Familia no indicada."};
    }

    try {
        const {getFamilyById} = await import("@/services/admin/families");
        const family = await getFamilyById(familyId);

        if (!family) {
            serverLog({
                level: "warn",
                event: "admin_family_slug_regen_action_failed",
                errorCode: "family_not_found",
            });
            return {ok: false, error: "Familia no encontrada."};
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

    const {getFamilyById} = await import("@/services/admin/families");
    const family = await getFamilyById(parsed.data.familyId);

    if (!family) {
        return {ok: false, error: "Familia no encontrada."};
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
