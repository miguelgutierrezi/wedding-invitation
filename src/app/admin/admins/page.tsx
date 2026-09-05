import {listPendingAdminInvites} from "@/actions/admin/auth";
import {AdminShell} from "@/components/admin/admin-shell";
import {AdminInviteForm} from "@/components/admin/admin-invite-form";
import {PendingAdminInviteDeleteButton} from "@/components/admin/pending-admin-invite-delete-button";
import {admin} from "@/components/admin/admin-ui";

export default async function AdminAdminsPage() {
    const pendingInvites = await listPendingAdminInvites();

    return (
        <AdminShell title="Invitar admin">
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
                <p className={admin.eyebrow}>Invitaciones pendientes</p>
                {pendingInvites.length === 0 ? (
                    <p className={`mt-3 ${admin.muted}`}>
                        No hay invitaciones pendientes por aceptar.
                    </p>
                ) : (
                    <ul className="mt-4 space-y-3">
                        {pendingInvites.map((invite) => (
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
                                <PendingAdminInviteDeleteButton inviteId={invite.id} />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </AdminShell>
    );
}
