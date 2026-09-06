import {listAdminDirectory} from "@/actions/admin/auth";
import {ActiveAdminDeleteButton} from "@/components/admin/active-admin-delete-button";
import {AdminShell} from "@/components/admin/admin-shell";
import {AdminInviteForm} from "@/components/admin/admin-invite-form";
import {PendingAdminInviteDeleteButton} from "@/components/admin/pending-admin-invite-delete-button";
import {admin} from "@/components/admin/admin-ui";
import {canDeleteActiveAdmin} from "@/lib/auth/admin-invite";
import {formatEventDateTime} from "@/lib/datetime/event-timezone";

export default async function AdminAdminsPage() {
    const {active, pending, currentAdminId} = await listAdminDirectory();

    return (
        <AdminShell title="Admins">
            <section className={`${admin.card} p-5`}>
                <p className={admin.eyebrow}>Administradores</p>
                <h2 className="mt-2 text-2xl font-semibold text-cover-cta-fg">
                    Invitar nuevo admin
                </h2>
                <p className={`mt-2 ${admin.muted}`}>
                    Envía la invitación por correo para que pueda acceder al panel con su cuenta de Supabase.
                </p>
                <div className="mt-6">
                    <AdminInviteForm />
                </div>
            </section>

            <section className={`${admin.card} mt-6 p-5`}>
                <p className={admin.eyebrow}>Admins activos</p>
                {active.length === 0 ? (
                    <p className={`mt-3 ${admin.muted}`}>
                        Todavía no hay administradores que hayan iniciado sesión.
                    </p>
                ) : (
                    <ul className="mt-4 space-y-3">
                        {active.map((account) => {
                            const isCurrent = account.id === currentAdminId;
                            const showDelete = canDeleteActiveAdmin(
                                account.id,
                                currentAdminId,
                            );

                            return (
                                <li
                                    key={account.id}
                                    className="flex flex-col gap-3 rounded-2xl border border-cover-cta-fg/15 bg-white/40 p-3 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div>
                                        <p className="font-medium text-cover-cta-fg">
                                            {account.email}
                                            {isCurrent ? " (tú)" : ""}
                                        </p>
                                        <p className={`text-sm ${admin.muted}`}>
                                            Último acceso:{" "}
                                            {formatEventDateTime(
                                                account.lastSignInAt,
                                                "Sin registro",
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-stretch gap-2 sm:items-end">
                                        <span className={admin.badgeResponded}>Activo</span>
                                        {showDelete ? (
                                            <ActiveAdminDeleteButton
                                                adminId={account.id}
                                                adminEmail={account.email}
                                            />
                                        ) : (
                                            <p className={`text-sm ${admin.muted}`}>
                                                Tu cuenta no se puede borrar desde aquí.
                                            </p>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>

            <section className={`${admin.card} mt-6 p-5`}>
                <p className={admin.eyebrow}>Invitaciones pendientes</p>
                {pending.length === 0 ? (
                    <p className={`mt-3 ${admin.muted}`}>
                        No hay invitaciones pendientes por aceptar.
                    </p>
                ) : (
                    <ul className="mt-4 space-y-3">
                        {pending.map((invite) => (
                            <li
                                key={invite.id}
                                className="flex flex-col gap-3 rounded-2xl border border-cover-cta-fg/15 bg-white/40 p-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="font-medium text-cover-cta-fg">{invite.email}</p>
                                    <p className={`text-sm ${admin.muted}`}>
                                        Invitación enviada y aún no aceptada.
                                    </p>
                                </div>
                                <div className="flex flex-col items-stretch gap-2 sm:items-end">
                                    <span className={admin.badgePending}>Pendiente</span>
                                    <PendingAdminInviteDeleteButton inviteId={invite.id} />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </AdminShell>
    );
}
