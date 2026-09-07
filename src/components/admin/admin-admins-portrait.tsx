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

export function AdminAdminsPortrait({
    directory,
}: {
    directory: AdminDirectory;
}) {
    const copy = adminCopy.adminsList;
    const {active, pending, currentAdminId} = directory;

    return (
        <div
            className={`hidden min-[834px]:block lg:hidden ${adminResumen.sans} text-admin-ink`}
        >
            <section className={adminResumen.banner}>
                <div className="flex min-w-0 flex-col gap-3">
                    <p
                        className={`flex flex-wrap items-center gap-1.5 ${adminResumen.overline}`}
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
                    <AdminInviteForm tone="figma" stacked />
                </section>

                <section className={adminAdmins.listCard}>
                    <p className={adminAdmins.sectionLabel}>{copy.activeTitle}</p>
                    {active.length === 0 ? (
                        <p className={adminAdmins.empty}>{copy.activeEmpty}</p>
                    ) : (
                        <ul className={adminAdmins.portraitList}>
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
                                    <li
                                        key={account.id}
                                        className={adminAdmins.portraitRow}
                                    >
                                        <div className={adminAdmins.portraitRowHeader}>
                                            <div className={adminAdmins.portraitEmailGroup}>
                                                <p className={adminAdmins.email}>
                                                    {account.email}
                                                </p>
                                                {isCurrent ? (
                                                    <span className={adminAdmins.youBadge}>
                                                        {copy.youBadge}
                                                    </span>
                                                ) : null}
                                            </div>
                                            <span className={adminAdmins.statusActive}>
                                                {copy.statusActive}
                                            </span>
                                        </div>
                                        <p className={adminAdmins.access}>
                                            <span>{lastAccess.prefix} </span>
                                            <span className={adminAdmins.accessValue}>
                                                {lastAccess.value}
                                            </span>
                                        </p>
                                        {showDelete ? (
                                            <ActiveAdminDeleteButton
                                                adminId={account.id}
                                                adminEmail={account.email}
                                                tone="figma"
                                                block
                                            />
                                        ) : (
                                            <span
                                                className={adminAdmins.portraitDisabledBtn}
                                                aria-disabled="true"
                                            >
                                                {copy.unavailable}
                                            </span>
                                        )}
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
                        <ul className={adminAdmins.portraitList}>
                            {pending.map((invite) => {
                                const expired = isAdminInviteLikelyExpired(
                                    invite.invitedAt,
                                );

                                return (
                                    <li
                                        key={invite.id}
                                        className={adminAdmins.portraitRow}
                                    >
                                        <div className={adminAdmins.portraitRowHeader}>
                                            <p className={adminAdmins.email}>
                                                {invite.email}
                                            </p>
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
                                        <p className={adminAdmins.access}>
                                            {formatAdminInviteSentLabel(invite.invitedAt)}
                                        </p>
                                        <PendingAdminInviteActions
                                            inviteId={invite.id}
                                            inviteEmail={invite.email}
                                            tone="figma"
                                            block
                                        />
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
