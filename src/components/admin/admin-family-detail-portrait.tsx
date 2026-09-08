"use client";

import {AdminAlertMessage} from "@/components/admin/admin-alert";
import {
    FamilyDetailBackIcon,
    FamilyDetailBusIcon,
    FamilyDetailCheckIcon,
    FamilyDetailClockIcon,
} from "@/components/admin/admin-family-detail-icons";
import {AdminFamiliesBackButton} from "@/components/admin/admin-page-heading";
import {adminFamilyDetail, adminResumen} from "@/components/admin/admin-ui";
import {CopyInvitationLink} from "@/components/admin/copy-invitation-link";
import {CopyWhatsAppReminder} from "@/components/admin/copy-whatsapp-reminder";
import {useFamilyDetailEditor} from "@/hooks/use-family-detail-editor";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    familyDetailConfirmationLabel,
    familyDetailDeleteTitle,
    familyDetailGuestPills,
    familyDetailGuestPickupLine,
    familyDetailStatusEmailLabel,
    familyDetailStatusPhoneLabel,
    familyDetailStatusPills,
    familyDetailStatusTransportLabel,
    familyDetailTransportLabel,
    familyFormStamp,
    formatFamilyDetailDeadlineChip,
    type FamilyDetailStatusPill,
} from "@/lib/admin/admin-family-detail-layout";
import type {FamilyActivityItem} from "@/lib/admin/family-activity";
import {formatEventDateTimeShort} from "@/lib/datetime/event-timezone";
import {cn} from "@/lib/utils";
import type {AdminFamilyDetail} from "@/services/admin/families";

type AdminFamilyDetailPortraitProps = {
    family: AdminFamilyDetail;
    activity: FamilyActivityItem[];
    deadlineLead: string | null;
};

const pillToneClass: Record<FamilyDetailStatusPill["tone"], string> = {
    confirmed: adminFamilyDetail.pillConfirmed,
    declined: adminFamilyDetail.pillDeclined,
    pending: adminFamilyDetail.pillPending,
    disabled: adminFamilyDetail.pillDisabled,
    bus: adminFamilyDetail.pillBus,
};

function StatusPills({
    pills,
    guest = false,
}: {
    pills: FamilyDetailStatusPill[];
    guest?: boolean;
}) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {pills.map((pill) => (
                <span
                    key={pill.key}
                    className={cn(
                        guest
                            ? adminFamilyDetail.guestPill
                            : adminFamilyDetail.pill,
                        pillToneClass[pill.tone],
                        guest ? "gap-1 text-[11px]" : null,
                    )}
                >
                    {pill.icon === "check" ? <FamilyDetailCheckIcon /> : null}
                    {pill.icon === "bus" ? <FamilyDetailBusIcon /> : null}
                    {pill.label}
                </span>
            ))}
        </div>
    );
}

function EditorFeedback({
    error,
    message,
}: {
    error: string | null;
    message: string | null;
}) {
    if (error) {
        return <AdminAlertMessage message={error} tone="error" />;
    }
    if (message) {
        return <AdminAlertMessage message={message} tone="success" />;
    }
    return null;
}

export function AdminFamilyDetailPortrait({
    family,
    activity,
    deadlineLead,
}: AdminFamilyDetailPortraitProps) {
    return (
        <AdminFamilyDetailPortraitInner
            key={familyFormStamp(family)}
            family={family}
            activity={activity}
            deadlineLead={deadlineLead}
        />
    );
}

function AdminFamilyDetailPortraitInner({
    family,
    activity,
    deadlineLead,
}: AdminFamilyDetailPortraitProps) {
    const editor = useFamilyDetailEditor(family, "portrait-");
    const copy = adminCopy.familyDetail;
    const deadlineChip = formatFamilyDetailDeadlineChip(deadlineLead);
    const statusPills = familyDetailStatusPills(family);
    const activityCopy = adminCopy.activity;

    return (
        <div className={`${adminFamilyDetail.portraitRoot} ${adminResumen.sans} text-admin-ink`}>
            <section className={adminResumen.banner}>
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                    <p className={adminResumen.overline}>{copy.overline}</p>
                    <div className="flex min-w-0 items-center gap-4">
                        <AdminFamiliesBackButton
                            className={adminFamilyDetail.portraitBackBtn}
                        >
                            <FamilyDetailBackIcon />
                        </AdminFamiliesBackButton>
                        <h1 className={adminFamilyDetail.portraitBannerTitle}>
                            {family.displayName}
                        </h1>
                    </div>
                    <div className={adminFamilyDetail.portraitBannerBottom}>
                        <p className={`max-w-[450px] ${adminResumen.bannerBody}`}>
                            {copy.bannerBody}
                        </p>
                        {deadlineChip ? (
                            <p className={adminFamilyDetail.deadlinePill}>
                                <FamilyDetailClockIcon />
                                {deadlineChip}
                            </p>
                        ) : null}
                    </div>
                </div>
            </section>

            <div className={adminFamilyDetail.portraitWorkspace}>
                <section className={adminFamilyDetail.portraitCard}>
                    <p className={adminFamilyDetail.sectionLabel}>
                        {copy.statusTitle}
                    </p>
                    <div className={adminFamilyDetail.portraitStatusRow}>
                        <div className={adminFamilyDetail.portraitStatusCell}>
                            <p className={adminFamilyDetail.statusLabel}>Estado</p>
                            <StatusPills pills={statusPills} />
                        </div>
                        <div className={adminFamilyDetail.portraitStatusCellWide}>
                            <p className={adminFamilyDetail.statusLabel}>
                                {copy.lastUpdated}
                            </p>
                            <p className={adminFamilyDetail.statusValue}>
                                {formatEventDateTimeShort(family.updatedAt)}
                            </p>
                        </div>
                        <div className={adminFamilyDetail.portraitStatusCellWide}>
                            <p className={adminFamilyDetail.statusLabel}>
                                {adminCopy.rsvp.noun}
                            </p>
                            <p className={adminFamilyDetail.statusValue}>
                                {familyDetailConfirmationLabel(
                                    family.willAttend,
                                    family.confirmedGuestCount,
                                )}
                            </p>
                        </div>
                    </div>
                    <div className={adminFamilyDetail.portraitStatusDivider} />
                    <div className={adminFamilyDetail.portraitStatusRow}>
                        <div className={adminFamilyDetail.portraitStatusCell}>
                            <p className={adminFamilyDetail.statusLabel}>
                                {familyDetailStatusPhoneLabel(false)}
                            </p>
                            <p className={adminFamilyDetail.statusValue}>
                                {family.contactPhone ?? "—"}
                            </p>
                        </div>
                        <div className={adminFamilyDetail.portraitStatusCellWide}>
                            <p className={adminFamilyDetail.statusLabel}>
                                {familyDetailStatusEmailLabel(false)}
                            </p>
                            <p className={`${adminFamilyDetail.statusValue} break-all`}>
                                {family.contactEmail ?? "—"}
                            </p>
                        </div>
                        <div className={adminFamilyDetail.portraitStatusCellWide}>
                            <p className={adminFamilyDetail.statusLabel}>
                                {familyDetailStatusTransportLabel(false)}
                            </p>
                            <p className={adminFamilyDetail.statusValue}>
                                {familyDetailTransportLabel(
                                    family.guestsTransportCount,
                                )}
                            </p>
                        </div>
                    </div>
                    {family.rsvpMessage ? (
                        <div className="flex min-w-0 flex-col gap-1.5">
                            <p className={adminFamilyDetail.statusLabel}>Mensaje</p>
                            <p className={adminFamilyDetail.statusValue}>
                                {family.rsvpMessage}
                            </p>
                        </div>
                    ) : null}
                </section>

                <section className={adminFamilyDetail.portraitCardCompact}>
                    <p className={adminFamilyDetail.sectionLabel}>
                        {adminCopy.invitation.link}
                    </p>
                    <p className={adminFamilyDetail.urlBox}>
                        {family.invitationUrl}
                    </p>
                    <div className={adminFamilyDetail.portraitLinkActions}>
                        <CopyInvitationLink
                            url={family.invitationUrl}
                            tone="figma"
                            className={adminFamilyDetail.portraitLinkBtn}
                        />
                        <CopyWhatsAppReminder
                            familyName={family.displayName}
                            invitationUrl={family.invitationUrl}
                            tone="figma"
                            className={adminFamilyDetail.portraitLinkBtn}
                        />
                    </div>
                </section>

                <section className={adminFamilyDetail.portraitCard}>
                    <p className={adminFamilyDetail.sectionLabel}>
                        {copy.editTitle}
                    </p>
                    <form
                        id={editor.saveFormId}
                        className="flex w-full flex-col gap-5"
                        action={editor.submitSave}
                    >
                        <input type="hidden" name="familyId" value={family.id} />
                        <input
                            type="hidden"
                            name="isEnabled"
                            value={editor.isEnabled ? "true" : "false"}
                        />

                        <label className="grid gap-2">
                            <span className={adminFamilyDetail.fieldLabel}>
                                Nombre de la familia
                            </span>
                            <input
                                name="displayName"
                                required
                                value={editor.displayName}
                                onChange={(event) =>
                                    editor.setDisplayName(event.target.value)
                                }
                                className={adminFamilyDetail.input}
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className={adminFamilyDetail.fieldLabel}>
                                {adminCopy.invitation.slug}
                            </span>
                            <input
                                name="invitationSlug"
                                required
                                value={editor.invitationSlug}
                                onChange={(event) =>
                                    editor.setInvitationSlug(event.target.value)
                                }
                                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                                className={adminFamilyDetail.input}
                                placeholder="familia-gutierrez-panqueva"
                            />
                            <span className={adminFamilyDetail.hint}>
                                {adminCopy.invitation.slugHint}.
                            </span>
                        </label>

                        <label className="grid gap-2">
                            <span className={adminFamilyDetail.fieldLabel}>
                                Cupos máximos
                            </span>
                            <input
                                type="number"
                                name="maximumGuests"
                                min={1}
                                max={30}
                                required
                                value={editor.maximumGuests}
                                onChange={(event) =>
                                    editor.onMaximumGuestsChange(
                                        Number(event.target.value) || 1,
                                    )
                                }
                                className={adminFamilyDetail.input}
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className={adminFamilyDetail.fieldLabel}>
                                Mensaje personalizado
                            </span>
                            <textarea
                                name="customMessage"
                                value={editor.customMessage}
                                onChange={(event) =>
                                    editor.setCustomMessage(event.target.value)
                                }
                                placeholder={copy.customMessagePlaceholder}
                                className={adminFamilyDetail.textarea}
                            />
                        </label>

                        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2.5">
                            <input
                                type="checkbox"
                                checked={editor.isEnabled}
                                onChange={(event) =>
                                    editor.onEnabledChange(event.target.checked)
                                }
                                className={adminFamilyDetail.checkbox}
                            />
                            <span className={adminFamilyDetail.checkboxLabel}>
                                {copy.enabledCheckbox}
                            </span>
                        </label>

                        <div className={adminFamilyDetail.portraitStatusDivider} />

                        <fieldset className="flex w-full flex-col gap-4">
                            <legend className={`${adminFamilyDetail.guestsSectionLabel} text-xs`}>
                                {copy.guestsTitle}
                            </legend>
                            {editor.guestRows.map((row, index) => (
                                <div
                                    key={row.id || `new-${index}`}
                                    className="flex w-full flex-col gap-2"
                                >
                                    <input
                                        type="hidden"
                                        name="guestIds"
                                        value={row.id}
                                    />
                                    <div className={adminFamilyDetail.portraitGuestFormRow}>
                                        <label className="grid min-w-0 flex-1 gap-2">
                                            <span className={adminFamilyDetail.fieldLabel}>
                                                Invitado {index + 1}
                                            </span>
                                            <input
                                                name="guestNames"
                                                required
                                                value={row.name}
                                                onChange={(event) =>
                                                    editor.setGuestName(
                                                        index,
                                                        event.target.value,
                                                    )
                                                }
                                                className={adminFamilyDetail.input}
                                            />
                                        </label>
                                        <label className={adminFamilyDetail.portraitGenderCol}>
                                            <span className={adminFamilyDetail.fieldLabel}>
                                                Género
                                            </span>
                                            <select
                                                name="guestGenders"
                                                required
                                                value={row.gender}
                                                onChange={(event) =>
                                                    editor.setGuestGender(
                                                        index,
                                                        event.target
                                                            .value as (typeof row)["gender"],
                                                    )
                                                }
                                                className={adminFamilyDetail.select}
                                            >
                                                <option value="" disabled>
                                                    Elegir
                                                </option>
                                                <option value="female">Mujer</option>
                                                <option value="male">Hombre</option>
                                                <option value="unspecified">
                                                    Sin género
                                                </option>
                                            </select>
                                        </label>
                                    </div>
                                    {family.guests[index]?.needsNameConfirmation ? (
                                        <p className={adminFamilyDetail.hint}>
                                            {adminCopy.guest.placeholderNameHint}
                                        </p>
                                    ) : null}
                                </div>
                            ))}
                        </fieldset>

                        <EditorFeedback
                            error={editor.error}
                            message={editor.message}
                        />

                        <button
                            type="submit"
                            form={editor.saveFormId}
                            disabled={editor.isPending}
                            className={adminFamilyDetail.btnPrimary}
                        >
                            {editor.isPending ? "Guardando…" : "Guardar cambios"}
                        </button>
                    </form>
                </section>

                <section className={adminFamilyDetail.portraitCard}>
                    <p className={adminFamilyDetail.sectionLabel}>
                        {copy.familyGuestsTitle}
                    </p>
                    <ul className="flex w-full flex-col">
                        {family.guests.map((guest) => {
                            const pickup = familyDetailGuestPickupLine(
                                guest.needsTransport,
                                guest.transportBoardingPoint,
                            );
                            const attendancePills = familyDetailGuestPills({
                                attendanceStatus: guest.attendanceStatus,
                                needsTransport: guest.needsTransport,
                            });

                            return (
                                <li
                                    key={guest.id}
                                    className="flex flex-col gap-3 border-b border-admin-border py-4 last:border-0 last:pb-0 first:pt-0"
                                >
                                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                                        <p className={`${adminFamilyDetail.guestName} text-base`}>
                                            {guest.fullName}
                                        </p>
                                        <StatusPills
                                            pills={attendancePills}
                                            guest
                                        />
                                    </div>
                                    {pickup ? (
                                        <p className={adminFamilyDetail.guestMeta}>
                                            {pickup}
                                        </p>
                                    ) : null}
                                    {guest.dietaryRestrictions ? (
                                        <p className={adminFamilyDetail.guestMeta}>
                                            {guest.dietaryRestrictions}
                                        </p>
                                    ) : null}
                                    <div className={adminFamilyDetail.portraitGuestContact}>
                                        <p className={adminFamilyDetail.guestPhone}>
                                            {guest.phone ?? "—"}
                                        </p>
                                        <p className={adminFamilyDetail.guestEmail}>
                                            {guest.email ?? "—"}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <section className={adminFamilyDetail.portraitCard}>
                    <p className={adminFamilyDetail.sectionLabel}>
                        {activityCopy.title}
                    </p>
                    {activity.length === 0 ? (
                        <p className={adminFamilyDetail.hint}>
                            {activityCopy.empty}
                        </p>
                    ) : (
                        <ol className="flex w-full flex-col">
                            {activity.map((item, index) => {
                                const last = index === activity.length - 1;
                                return (
                                    <li
                                        key={item.id}
                                        className="flex gap-4"
                                    >
                                        <div className="flex w-4 shrink-0 flex-col items-center">
                                            <span
                                                className="size-2 shrink-0 rounded-full bg-admin-olive"
                                                aria-hidden="true"
                                            />
                                            {last ? null : (
                                                <span
                                                    className="mt-1 w-px flex-1 bg-admin-border"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </div>
                                        <div
                                            className={`flex min-w-0 flex-1 flex-col gap-1 ${last ? "" : "pb-5"}`}
                                        >
                                            <div className="flex w-full items-start justify-between gap-3">
                                                <p className={`${adminFamilyDetail.timelineTitle} text-sm`}>
                                                    {item.title}
                                                </p>
                                                <p
                                                    className={`${adminFamilyDetail.timelineDate} shrink-0 text-right`}
                                                >
                                                    {formatEventDateTimeShort(
                                                        item.createdAt,
                                                    )}
                                                </p>
                                            </div>
                                            {item.detail ? (
                                                <p className={adminFamilyDetail.portraitTimelineDetail}>
                                                    {item.detail}
                                                </p>
                                            ) : null}
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    )}
                </section>

                <section className={adminFamilyDetail.portraitCardCompact}>
                    <h2 className={adminFamilyDetail.regenerateTitle}>
                        {copy.regenerateTitle}
                    </h2>
                    <p className={adminFamilyDetail.hint}>{copy.regenerateBody}</p>
                    <button
                        type="button"
                        disabled={editor.isPending}
                        onClick={editor.submitRegenerate}
                        className={adminFamilyDetail.btnSecondary}
                    >
                        {copy.regenerateButton}
                    </button>
                </section>

                <section className={adminFamilyDetail.portraitCardDanger}>
                    <div className="flex flex-col gap-1">
                        <h2 className={adminFamilyDetail.portraitDangerTitle}>
                            {familyDetailDeleteTitle(false)}
                        </h2>
                        <p className={adminFamilyDetail.dangerBody}>
                            {adminCopy.family.deleteWarning}
                        </p>
                    </div>
                    <form
                        id={editor.deleteFormId}
                        noValidate
                        className="flex w-full flex-col gap-3"
                        action={editor.submitDelete}
                    >
                        <input type="hidden" name="familyId" value={family.id} />
                        <label className="grid gap-2">
                            <span className={adminFamilyDetail.dangerLabel}>
                                {adminCopy.family.deleteConfirmLabel}:
                            </span>
                            <input
                                form={editor.deleteFormId}
                                name="confirmName"
                                value={editor.confirmDeleteName}
                                onChange={(event) =>
                                    editor.setConfirmDeleteName(event.target.value)
                                }
                                autoComplete="off"
                                placeholder={
                                    editor.displayName || family.displayName
                                }
                                className={adminFamilyDetail.dangerInput}
                            />
                        </label>
                        <button
                            type="submit"
                            form={editor.deleteFormId}
                            formNoValidate
                            disabled={
                                editor.isPending || !editor.deleteNameMatches
                            }
                            className={adminFamilyDetail.dangerBtn}
                        >
                            {editor.isPending
                                ? adminCopy.family.deleting
                                : adminCopy.family.deleteButton}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}
