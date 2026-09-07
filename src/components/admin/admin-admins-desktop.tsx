import type {AdminDirectory} from "@/actions/admin/auth";
import {ActiveAdminDeleteButton} from "@/components/admin/active-admin-delete-button";
import {AdminInviteForm} from "@/components/admin/admin-invite-form";
import {adminAdmins, adminResumen} from "@/components/admin/admin-ui";
import {PendingAdminInviteActions} from "@/components/admin/pending-admin-invite-actions";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    adminsLastAccessParts,
    adminsPendingStatusLabel,
} from "@/lib/admin/admin-admins-layout";
import {
    canDeleteActiveAdmin,
    formatAdminInviteSentLabel,
    isAdminInviteLikelyExpired,
} from "@/lib/auth/admin-invite";

export function AdminAdminsDesktop({
    directory,
}: {
    directory: AdminDirectory;
}) {
    const copy = adminCopy.adminsList;
    const {active, pending, currentAdminId} = directory;

    return (
        <div className={`hidden lg:block ${adminResumen.sans} text-admin-ink`}>
            <section className={adminResumen.banner}>
                <div className="flex min-w-0 flex-col gap-2">
                    <p
                        className={`flex flex-wrap items-center gap-2 ${adminResumen.overline}`}
                    >
                        <span>{copy.overlineAdmin}</span>
                        <span
                            className="size-1 shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                        />
                        <span>{copy.overlineSection}</span>
                    </p>
                    <h1 className={adminAdmins.bannerTitle}>{copy.bannerTitle}</h1>
                    <p className={adminResumen.bannerBody}>{copy.bannerBody}</p>
                </div>
            </section>

            <div className={adminResumen.workspace}>
                <section className={adminAdmins.card}>
                    <div className="flex flex-col gap-1.5">
                        <p className={adminAdmins.sectionLabel}>{copy.inviteEyebrow}</p>
                        <h2 className={adminAdmins.inviteTitle}>{copy.inviteTitle}</h2>
                        <p className={adminAdmins.inviteLead}>{copy.inviteLead}</p>
                    </div>
                    <AdminInviteForm tone="figma" />
                </section>

                <section className={adminAdmins.listCard}>
                    <p className={adminAdmins.sectionLabel}>{copy.activeTitle}</p>
                    {active.length === 0 ? (
                        <p className={adminAdmins.empty}>{copy.activeEmpty}</p>
                    ) : (
                        <ul>
                            {active.map((account) => {
                                const isCurrent = account.id === currentAdminId;
                                const showDelete = canDeleteActiveAdmin(
                                    account.id,
                                    currentAdminId,
                                    account.email,
                                );
                                const lastAccess = adminsLastAccessParts(
                                    account.lastSignInAt,
                                );

                                return (
                                    <li key={account.id} className={adminAdmins.row}>
                                        <div className={adminAdmins.emailCol}>
                                            <p className={adminAdmins.email}>
                                                {account.email}
                                            </p>
                                            {isCurrent ? (
                                                <span className={adminAdmins.youBadge}>
                                                    {copy.youBadge}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className={adminAdmins.accessCol}>
                                            <p className={adminAdmins.access}>
                                                <span>{lastAccess.prefix} </span>
                                                <span className={adminAdmins.accessValue}>
                                                    {lastAccess.value}
                                                </span>
                                            </p>
                                        </div>
                                        <div className={adminAdmins.statusCol}>
                                            <span className={adminAdmins.statusActive}>
                                                {copy.statusActive}
                                            </span>
                                        </div>
                                        <div className={adminAdmins.actionCol}>
                                            {showDelete ? (
                                                <ActiveAdminDeleteButton
                                                    adminId={account.id}
                                                    adminEmail={account.email}
                                                    tone="figma"
                                                />
                                            ) : (
                                                <span
                                                    className={adminAdmins.disabledBtn}
                                                    aria-disabled="true"
                                                >
                                                    {copy.unavailable}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>

                <section className={adminAdmins.pendingCard}>
                    <p className={adminAdmins.sectionLabel}>{copy.pendingTitle}</p>
                    {pending.length === 0 ? (
                        <p className={adminAdmins.empty}>{copy.pendingEmpty}</p>
                    ) : (
                        <ul>
                            {pending.map((invite) => {
                                const expired = isAdminInviteLikelyExpired(
                                    invite.invitedAt,
                                );

                                return (
                                    <li key={invite.id} className={adminAdmins.row}>
                                        <div className={adminAdmins.emailCol}>
                                            <p className={adminAdmins.email}>
                                                {invite.email}
                                            </p>
                                        </div>
                                        <div className={adminAdmins.accessCol}>
                                            <p className={adminAdmins.access}>
                                                {formatAdminInviteSentLabel(
                                                    invite.invitedAt,
                                                )}
                                            </p>
                                        </div>
                                        <div className={adminAdmins.statusCol}>
                                            <span
                                                className={
                                                    expired
                                                        ? adminAdmins.statusExpired
                                                        : adminAdmins.statusPending
                                                }
                                            >
                                                {adminsPendingStatusLabel(expired)}
                                            </span>
                                        </div>
                                        <div className={adminAdmins.pendingActionCol}>
                                            <PendingAdminInviteActions
                                                inviteId={invite.id}
                                                inviteEmail={invite.email}
                                                tone="figma"
                                            />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}
