import {listAdminDirectory} from "@/actions/admin/auth";
import {ActiveAdminDeleteButton} from "@/components/admin/active-admin-delete-button";
import {AdminShell} from "@/components/admin/admin-shell";
import {AdminInviteForm} from "@/components/admin/admin-invite-form";
import {PendingAdminInviteActions} from "@/components/admin/pending-admin-invite-actions";
import {admin} from "@/components/admin/admin-ui";
import {
    adminDirectoryActionsClass,
    adminDirectoryBadgeSlotClass,
    adminDirectoryBtnImmutableClass,
    adminDirectoryEmailClass,
    adminDirectoryEyebrowClass,
    adminDirectoryIdentityClass,
    adminDirectoryLeadClass,
    adminDirectoryLeftClusterClass,
    adminDirectoryListClass,
    adminDirectoryMetaClass,
    adminDirectoryPageClass,
    adminDirectoryRightClusterClass,
    adminDirectoryRowClass,
    adminDirectoryRowCurrentClass,
    adminDirectorySectionClass,
    adminDirectorySectionTitleClass,
    adminDirectoryStatusActiveClass,
    adminDirectoryStatusPendingClass,
    adminDirectoryTitleClass,
    adminDirectoryYouBadgeClass,
} from "@/lib/admin/admin-directory-layout";
import {
    canDeleteActiveAdmin,
    formatAdminInviteSentLabel,
    isAdminInviteLikelyExpired,
} from "@/lib/auth/admin-invite";
import {formatEventDateTime} from "@/lib/datetime/event-timezone";

export default async function AdminAdminsPage() {
    const {active, pending, currentAdminId} = await listAdminDirectory();

    return (
        <AdminShell title="Admins">
            <div className={adminDirectoryPageClass}>
                <section className={adminDirectorySectionClass}>
                    <div className="space-y-1 md:space-y-2">
                        <p className={adminDirectoryEyebrowClass}>Administradores</p>
                        <h2 className={adminDirectoryTitleClass}>Invitar nuevo admin</h2>
                        <p className={`${adminDirectoryLeadClass} md:hidden`}>
                            Envía la invitación por correo electrónico.
                        </p>
                        <p className={`${adminDirectoryLeadClass} hidden md:block`}>
                            Envía la invitación por correo para que pueda acceder al panel
                            con su cuenta de Supabase.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-5 lg:mt-6">
                        <AdminInviteForm />
                    </div>
                </section>

                <section className={adminDirectorySectionClass}>
                    <p className={adminDirectorySectionTitleClass}>Admins activos</p>
                    {active.length === 0 ? (
                        <p className={`mt-3 ${admin.muted}`}>
                            Todavía no hay administradores que hayan iniciado sesión.
                        </p>
                    ) : (
                        <ul className={adminDirectoryListClass}>
                            {active.map((account) => {
                                const isCurrent = account.id === currentAdminId;
                                const showDelete = canDeleteActiveAdmin(
                                    account.id,
                                    currentAdminId,
                                    account.email,
                                );
                                const lastAccess = formatEventDateTime(
                                    account.lastSignInAt,
                                    "Sin registro",
                                );

                                return (
                                    <li
                                        key={account.id}
                                        className={
                                            isCurrent
                                                ? adminDirectoryRowCurrentClass
                                                : adminDirectoryRowClass
                                        }
                                    >
                                        <div className={adminDirectoryLeftClusterClass}>
                                            <div className={adminDirectoryIdentityClass}>
                                                <p className={adminDirectoryEmailClass}>
                                                    {account.email}
                                                </p>
                                                {isCurrent ? (
                                                    <span
                                                        className={adminDirectoryYouBadgeClass}
                                                    >
                                                        TÚ
                                                    </span>
                                                ) : null}
                                            </div>
                                            <p className={adminDirectoryMetaClass}>
                                                <span className="md:hidden">{lastAccess}</span>
                                                <span className="hidden md:inline">
                                                    Último acceso: {lastAccess}
                                                </span>
                                            </p>
                                        </div>
                                        <div className={adminDirectoryRightClusterClass}>
                                            <div className={adminDirectoryBadgeSlotClass}>
                                                <span
                                                    className={adminDirectoryStatusActiveClass}
                                                >
                                                    Activo
                                                </span>
                                            </div>
                                            <div className={adminDirectoryActionsClass}>
                                                {showDelete ? (
                                                    <ActiveAdminDeleteButton
                                                        adminId={account.id}
                                                        adminEmail={account.email}
                                                    />
                                                ) : (
                                                    <span
                                                        className={
                                                            adminDirectoryBtnImmutableClass
                                                        }
                                                        aria-disabled="true"
                                                    >
                                                        No disponible
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>

                <section className={adminDirectorySectionClass}>
                    <p className={adminDirectorySectionTitleClass}>
                        Invitaciones pendientes
                    </p>
                    {pending.length === 0 ? (
                        <p className={`mt-3 ${admin.muted}`}>
                            No hay invitaciones pendientes por aceptar.
                        </p>
                    ) : (
                        <ul className={adminDirectoryListClass}>
                            {pending.map((invite) => {
                                const expired = isAdminInviteLikelyExpired(
                                    invite.invitedAt,
                                );

                                return (
                                <li key={invite.id} className={adminDirectoryRowClass}>
                                    <div className={adminDirectoryLeftClusterClass}>
                                        <div className={adminDirectoryIdentityClass}>
                                            <p className={adminDirectoryEmailClass}>
                                                {invite.email}
                                            </p>
                                        </div>
                                        <p className={adminDirectoryMetaClass}>
                                            {formatAdminInviteSentLabel(invite.invitedAt)}
                                        </p>
                                    </div>
                                    <div className={adminDirectoryRightClusterClass}>
                                        <div className={adminDirectoryBadgeSlotClass}>
                                            <span
                                                className={adminDirectoryStatusPendingClass}
                                            >
                                                {expired ? "Caducada" : "Pendiente"}
                                            </span>
                                        </div>
                                        <div className={adminDirectoryActionsClass}>
                                            <PendingAdminInviteActions
                                                inviteId={invite.id}
                                                inviteEmail={invite.email}
                                            />
                                        </div>
                                    </div>
                                </li>
                                );
                            })}
                        </ul>
                    )}
                </section>
            </div>
        </AdminShell>
    );
}
