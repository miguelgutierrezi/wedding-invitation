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

export function AdminAdminsMobile({
    directory,
}: {
    directory: AdminDirectory;
}) {
    const copy = adminCopy.adminsList;
    const {active, pending, currentAdminId} = directory;

    return (
        <div className={`min-[834px]:hidden ${adminResumen.sans} text-admin-ink`}>
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
                    <h1 className={adminAdmins.mobileBannerTitle}>
                        {copy.bannerTitle}
                    </h1>
                    <p className={adminResumen.bannerBody}>{copy.bannerBody}</p>
                </div>
            </section>

            <div className={adminResumen.workspace}>
                <section className={adminAdmins.mobileCard}>
                    <div className="flex flex-col gap-1.5">
                        <p className={adminAdmins.sectionLabel}>{copy.inviteEyebrow}</p>
                        <h2 className={adminAdmins.mobileInviteTitle}>
                            {copy.inviteTitle}
                        </h2>
                        <p className={adminAdmins.inviteLead}>{copy.inviteLead}</p>
                    </div>
                    <AdminInviteForm tone="figma" stacked compact />
                </section>

                <section className={adminAdmins.mobileCard}>
                    <p className={adminAdmins.sectionLabel}>{copy.activeTitle}</p>
                    {active.length === 0 ? (
                        <p className={adminAdmins.mobileEmpty}>{copy.activeEmpty}</p>
                    ) : (
                        <ul className={adminAdmins.mobileList}>
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
                                    <li key={account.id} className={adminAdmins.mobileRow}>
                                        <div className={adminAdmins.portraitRowHeader}>
                                            <div className={adminAdmins.mobileEmailGroup}>
                                                <p className={adminAdmins.mobileEmail}>
                                                    {account.email}
                                                </p>
                                                {isCurrent ? (
                                                    <span className={adminAdmins.mobileYouBadge}>
                                                        {copy.youBadge}
                                                    </span>
                                                ) : null}
                                            </div>
                                            <span className={adminAdmins.mobileStatusActive}>
                                                {copy.statusActive}
                                            </span>
                                        </div>
                                        <p className={adminAdmins.mobileAccess}>
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
                                                compact
                                            />
                                        ) : (
                                            <span
                                                className={adminAdmins.mobileDisabledBtn}
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

                <section className={adminAdmins.mobilePendingCard}>
                    <p className={adminAdmins.sectionLabel}>{copy.pendingTitle}</p>
                    {pending.length === 0 ? (
                        <p className={adminAdmins.mobileEmpty}>{copy.pendingEmpty}</p>
                    ) : (
                        <ul className={adminAdmins.mobileList}>
                            {pending.map((invite) => {
                                const expired = isAdminInviteLikelyExpired(
                                    invite.invitedAt,
                                );

                                return (
                                    <li key={invite.id} className={adminAdmins.mobileRow}>
                                        <div className={adminAdmins.portraitRowHeader}>
                                            <p className={adminAdmins.mobileEmail}>
                                                {invite.email}
                                            </p>
                                            <span
                                                className={
                                                    expired
                                                        ? adminAdmins.mobileStatusExpired
                                                        : adminAdmins.mobileStatusPending
                                                }
                                            >
                                                {adminsPendingStatusLabel(expired)}
                                            </span>
                                        </div>
                                        <p className={adminAdmins.mobileAccess}>
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
