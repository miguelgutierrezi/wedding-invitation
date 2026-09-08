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

type AdminFamilyDetailMobileProps = {
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
        <div className="flex flex-wrap gap-1">
            {pills.map((pill) => (
                <span
                    key={pill.key}
                    className={cn(
                        guest
                            ? adminFamilyDetail.guestPill
                            : adminFamilyDetail.pill,
                        pillToneClass[pill.tone],
                        guest ? "gap-1" : "gap-1 text-[11px]",
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

export function AdminFamilyDetailMobile({
    family,
    activity,
    deadlineLead,
}: AdminFamilyDetailMobileProps) {
    return (
        <AdminFamilyDetailMobileInner
            key={familyFormStamp(family)}
            family={family}
            activity={activity}
            deadlineLead={deadlineLead}
        />
    );
}

function AdminFamilyDetailMobileInner({
    family,
    activity,
    deadlineLead,
}: AdminFamilyDetailMobileProps) {
    const editor = useFamilyDetailEditor(family, "mobile-");
    const copy = adminCopy.familyDetail;
    const deadlineChip = formatFamilyDetailDeadlineChip(deadlineLead);
    const statusPills = familyDetailStatusPills(family);
    const activityCopy = adminCopy.activity;

    return (
        <div className={`${adminFamilyDetail.mobileRoot} ${adminResumen.sans} text-admin-ink`}>
            <section className={adminResumen.banner}>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <p className={adminFamilyDetail.mobileOverline}>{copy.overline}</p>
                    <div className="flex min-w-0 items-center gap-2.5">
                        <AdminFamiliesBackButton
                            className={adminFamilyDetail.mobileBackBtn}
                        >
                            <FamilyDetailBackIcon />
                        </AdminFamiliesBackButton>
                        <h1 className={adminFamilyDetail.mobileBannerTitle}>
                            {family.displayName}
                        </h1>
                    </div>
                    <p className={adminResumen.bannerBody}>{copy.bannerBody}</p>
                </div>
                {deadlineChip ? (
                    <p className={adminFamilyDetail.deadlinePill}>
                        <FamilyDetailClockIcon />
                        {deadlineChip}
                    </p>
                ) : null}
            </section>

            <div className={adminFamilyDetail.mobileWorkspace}>
                <section className={adminFamilyDetail.mobileCard}>
                    <p className={adminFamilyDetail.sectionLabel}>
                        {copy.statusTitle}
                    </p>
                    <div className={adminFamilyDetail.mobileStatusGrid}>
                        <div className={adminFamilyDetail.mobileStatusPair}>
                            <div className={adminFamilyDetail.mobileStatusCell}>
                                <p className={adminFamilyDetail.mobileStatusLabel}>
                                    Estado
                                </p>
                                <StatusPills pills={statusPills} />
                            </div>
                            <div className={adminFamilyDetail.mobileStatusCell}>
                                <p className={adminFamilyDetail.mobileStatusLabel}>
                                    {adminCopy.rsvp.noun}
                                </p>
                                <p className={adminFamilyDetail.mobileStatusValue}>
                                    {familyDetailConfirmationLabel(
                                        family.willAttend,
                                        family.confirmedGuestCount,
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className={adminFamilyDetail.mobileStatusPair}>
                            <div className={adminFamilyDetail.mobileStatusCell}>
                                <p className={adminFamilyDetail.mobileStatusLabel}>
                                    {copy.lastUpdated}
                                </p>
                                <p className={adminFamilyDetail.mobileStatusValue}>
                                    {formatEventDateTimeShort(family.updatedAt)}
                                </p>
                            </div>
                            <div className={adminFamilyDetail.mobileStatusCell}>
                                <p className={adminFamilyDetail.mobileStatusLabel}>
                                    {familyDetailStatusPhoneLabel(true)}
                                </p>
                                <p className={adminFamilyDetail.mobileStatusValue}>
                                    {family.contactPhone ?? "—"}
                                </p>
                            </div>
                        </div>
                        <div className={adminFamilyDetail.mobileStatusCell}>
                            <p className={adminFamilyDetail.mobileStatusLabel}>
                                {familyDetailStatusEmailLabel(false)}
                            </p>
                            <p
                                className={`${adminFamilyDetail.mobileStatusValue} truncate`}
                            >
                                {family.contactEmail ?? "—"}
                            </p>
                        </div>
                        <div className={adminFamilyDetail.mobileStatusCell}>
                            <p className={adminFamilyDetail.mobileStatusLabel}>
                                {familyDetailStatusTransportLabel(false)}
                            </p>
                            <p className={adminFamilyDetail.mobileStatusValue}>
                                {familyDetailTransportLabel(
                                    family.guestsTransportCount,
                                )}
                            </p>
                        </div>
                        {family.rsvpMessage ? (
                            <div className={adminFamilyDetail.mobileStatusCell}>
                                <p className={adminFamilyDetail.mobileStatusLabel}>
                                    Mensaje
                                </p>
                                <p className={adminFamilyDetail.mobileStatusValue}>
                                    {family.rsvpMessage}
                                </p>
                            </div>
                        ) : null}
                    </div>
                </section>

                <section className={adminFamilyDetail.mobileCardCompact}>
                    <p className={adminFamilyDetail.sectionLabel}>
                        {adminCopy.invitation.link}
                    </p>
                    <p className={adminFamilyDetail.urlBox}>
                        {family.invitationUrl}
                    </p>
                    <div className={adminFamilyDetail.mobileLinkActions}>
                        <CopyInvitationLink
                            url={family.invitationUrl}
                            tone="figma"
                            className={adminFamilyDetail.mobileBtn}
                        />
                        <CopyWhatsAppReminder
                            familyName={family.displayName}
                            invitationUrl={family.invitationUrl}
                            tone="figma"
                            className={adminFamilyDetail.mobileBtn}
                        />
                    </div>
                </section>

                <section className={adminFamilyDetail.mobileCard}>
                    <p className={adminFamilyDetail.sectionLabel}>
                        {copy.editTitle}
                    </p>
                    <form
                        id={editor.saveFormId}
                        className="flex w-full flex-col gap-4"
                        action={editor.submitSave}
                    >
                        <input type="hidden" name="familyId" value={family.id} />
                        <input
                            type="hidden"
                            name="isEnabled"
                            value={editor.isEnabled ? "true" : "false"}
                        />

                        <label className="grid gap-1.5">
                            <span className={adminFamilyDetail.mobileFieldLabel}>
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

                        <label className="grid gap-1.5">
                            <span className={adminFamilyDetail.mobileFieldLabel}>
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

                        <label className="grid gap-1.5">
                            <span className={adminFamilyDetail.mobileFieldLabel}>
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

                        <label className="grid gap-1.5">
                            <span className={adminFamilyDetail.mobileFieldLabel}>
                                Mensaje personalizado
                            </span>
                            <textarea
                                name="customMessage"
                                value={editor.customMessage}
                                onChange={(event) =>
                                    editor.setCustomMessage(event.target.value)
                                }
                                placeholder={copy.customMessagePlaceholder}
                                className={`${adminFamilyDetail.textarea} h-[72px]`}
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

                        <fieldset className="flex w-full flex-col gap-3 pt-2">
                            <legend className={adminFamilyDetail.sectionLabel}>
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
                                    <label className="grid gap-1">
                                        <span
                                            className={adminFamilyDetail.mobileGuestFieldLabel}
                                        >
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
                                    <label className="grid gap-1">
                                        <span
                                            className={adminFamilyDetail.mobileGuestFieldLabel}
                                        >
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
                            className={cn(
                                adminFamilyDetail.btnPrimary,
                                adminFamilyDetail.mobileBtn,
                            )}
                        >
                            {editor.isPending ? "Guardando…" : "Guardar cambios"}
                        </button>
                    </form>
                </section>

                <section className={adminFamilyDetail.mobileCardCompact}>
                    <p className={adminFamilyDetail.sectionLabel}>
                        {copy.familyGuestsTitle}
                    </p>
                    <ul className="flex w-full flex-col gap-4">
                        {family.guests.map((guest) => {
                            const pickup = familyDetailGuestPickupLine(
                                guest.needsTransport,
                                guest.transportBoardingPoint,
                                "pickup",
                            );
                            const attendancePills = familyDetailGuestPills({
                                attendanceStatus: guest.attendanceStatus,
                                needsTransport: guest.needsTransport,
                            });

                            return (
                                <li
                                    key={guest.id}
                                    className="flex flex-col gap-2 border-b border-admin-border pb-3 last:border-0 last:pb-0"
                                >
                                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                                        <p className={adminFamilyDetail.guestName}>
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
                                    <div className={adminFamilyDetail.mobileGuestContact}>
                                        <p className={`${adminFamilyDetail.guestPhone} text-xs`}>
                                            {guest.phone ?? "—"}
                                        </p>
                                        <p
                                            className={`${adminFamilyDetail.guestEmail} min-w-0 flex-1 text-xs`}
                                        >
                                            {guest.email ?? "—"}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <section className={adminFamilyDetail.mobileCard}>
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
                                    <li key={item.id} className="flex gap-3">
                                        <div className="flex w-3 shrink-0 flex-col items-center">
                                            <span
                                                className="size-1.5 shrink-0 rounded-full bg-admin-olive"
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
                                            className={`flex min-w-0 flex-1 flex-col gap-1 ${last ? "" : "pb-4"}`}
                                        >
                                            <p className={adminFamilyDetail.timelineTitle}>
                                                {item.title}
                                            </p>
                                            <p className={adminFamilyDetail.timelineDate}>
                                                {formatEventDateTimeShort(
                                                    item.createdAt,
                                                )}
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    )}
                </section>

                <section className={adminFamilyDetail.mobileCardCompact}>
                    <h2 className={adminFamilyDetail.mobileRegenerateTitle}>
                        {copy.regenerateTitle}
                    </h2>
                    <p className={adminFamilyDetail.hint}>{copy.regenerateBody}</p>
                    <button
                        type="button"
                        disabled={editor.isPending}
                        onClick={editor.submitRegenerate}
                        className={cn(
                            adminFamilyDetail.btnSecondary,
                            adminFamilyDetail.mobileBtn,
                        )}
                    >
                        {copy.regenerateButton}
                    </button>
                </section>

                <section className={adminFamilyDetail.mobileCardDanger}>
                    <div className="flex flex-col gap-1">
                        <h2 className={adminFamilyDetail.mobileDangerTitle}>
                            {familyDetailDeleteTitle(false)}
                        </h2>
                        <p className={adminFamilyDetail.dangerBody}>
                            {adminCopy.family.deleteWarning}
                        </p>
                    </div>
                    <form
                        id={editor.deleteFormId}
                        noValidate
                        className="flex w-full flex-col gap-2.5"
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
                            className={cn(
                                adminFamilyDetail.dangerBtn,
                                adminFamilyDetail.mobileBtn,
                            )}
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
