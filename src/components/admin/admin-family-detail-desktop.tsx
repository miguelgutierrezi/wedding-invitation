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

type AdminFamilyDetailDesktopProps = {
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
                        guest ? adminFamilyDetail.guestPill : adminFamilyDetail.pill,
                        pillToneClass[pill.tone],
                        guest && pill.key === "bus" ? "hidden xl:inline-flex" : null,
                    )}
                >
                    {pill.icon === "check" ? (
                        <span className={guest ? "hidden xl:inline-flex" : undefined}>
                            <FamilyDetailCheckIcon />
                        </span>
                    ) : null}
                    {pill.icon === "bus" ? (
                        <span className={guest ? "hidden xl:inline-flex" : undefined}>
                            <FamilyDetailBusIcon />
                        </span>
                    ) : null}
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

export function AdminFamilyDetailDesktop({
    family,
    activity,
    deadlineLead,
}: AdminFamilyDetailDesktopProps) {
    return (
        <AdminFamilyDetailDesktopInner
            key={familyFormStamp(family)}
            family={family}
            activity={activity}
            deadlineLead={deadlineLead}
        />
    );
}

function AdminFamilyDetailDesktopInner({
    family,
    activity,
    deadlineLead,
}: AdminFamilyDetailDesktopProps) {
    const editor = useFamilyDetailEditor(family, "desktop-");
    const copy = adminCopy.familyDetail;
    const deadlineChip = formatFamilyDetailDeadlineChip(deadlineLead);
    const statusPills = familyDetailStatusPills(family);
    const activityCopy = adminCopy.activity;

    return (
        <div className={`hidden lg:block ${adminResumen.sans} text-admin-ink`}>
            <section className={adminResumen.banner}>
                <div className="flex min-w-0 flex-1 flex-col gap-2 xl:gap-3">
                    <p className={adminResumen.overline}>{copy.overline}</p>
                    <div className="flex min-w-0 items-center gap-3 xl:gap-4">
                        <AdminFamiliesBackButton className={adminFamilyDetail.backBtn}>
                            <FamilyDetailBackIcon />
                        </AdminFamiliesBackButton>
                        <h1 className={adminFamilyDetail.bannerTitle}>
                            {family.displayName}
                        </h1>
                    </div>
                    <p className={adminResumen.bannerBody}>{copy.bannerBody}</p>
                </div>
                {deadlineChip ? (
                    <div className={adminFamilyDetail.deadlineWrap}>
                        <p className={adminFamilyDetail.deadlinePill}>
                            <FamilyDetailClockIcon />
                            {deadlineChip}
                        </p>
                    </div>
                ) : null}
            </section>

            <div className={adminResumen.workspace}>
                <div className={adminFamilyDetail.columns}>
                    <div className={adminFamilyDetail.leftCol}>
                        <section className={adminFamilyDetail.card}>
                            <p className={adminFamilyDetail.sectionLabel}>
                                {copy.statusTitle}
                            </p>
                            <div className={adminFamilyDetail.statusGrid}>
                                <div className="flex min-w-0 flex-col gap-1.5">
                                    <p className={adminFamilyDetail.statusLabel}>Estado</p>
                                    <StatusPills pills={statusPills} />
                                </div>
                                <div className="flex min-w-0 flex-col gap-1.5">
                                    <p className={adminFamilyDetail.statusLabel}>
                                        {copy.lastUpdated}
                                    </p>
                                    <p className={adminFamilyDetail.statusValue}>
                                        {formatEventDateTimeShort(family.updatedAt)}
                                    </p>
                                </div>
                                <div className="flex min-w-0 flex-col gap-1.5">
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
                            <div className={adminFamilyDetail.statusGrid}>
                                <div className="flex min-w-0 flex-col gap-1.5">
                                    <p className={adminFamilyDetail.statusLabel}>
                                        <span className="xl:hidden">
                                            {familyDetailStatusPhoneLabel(true)}
                                        </span>
                                        <span className="hidden xl:inline">
                                            {familyDetailStatusPhoneLabel(false)}
                                        </span>
                                    </p>
                                    <p className={adminFamilyDetail.statusValue}>
                                        {family.contactPhone ?? "—"}
                                    </p>
                                </div>
                                <div className="flex min-w-0 flex-col gap-1.5">
                                    <p className={adminFamilyDetail.statusLabel}>
                                        <span className="xl:hidden">
                                            {familyDetailStatusEmailLabel(true)}
                                        </span>
                                        <span className="hidden xl:inline">
                                            {familyDetailStatusEmailLabel(false)}
                                        </span>
                                    </p>
                                    <p className={`${adminFamilyDetail.statusValue} break-all`}>
                                        {family.contactEmail ?? "—"}
                                    </p>
                                </div>
                                <div className="flex min-w-0 flex-col gap-1.5">
                                    <p className={adminFamilyDetail.statusLabel}>
                                        <span className="xl:hidden">
                                            {familyDetailStatusTransportLabel(true)}
                                        </span>
                                        <span className="hidden xl:inline">
                                            {familyDetailStatusTransportLabel(false)}
                                        </span>
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

                        <section className={`${adminFamilyDetail.card} gap-5`}>
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

                                <fieldset className="flex w-full flex-col gap-3">
                                    <legend className={adminFamilyDetail.guestsSectionLabel}>
                                        {copy.guestsTitle}
                                    </legend>
                                    {editor.guestRows.map((row, index) => (
                                        <div
                                            key={row.id || `new-${index}`}
                                            className={adminFamilyDetail.guestRow}
                                        >
                                            <input
                                                type="hidden"
                                                name="guestIds"
                                                value={row.id}
                                            />
                                            <label className="grid gap-2">
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
                                            <label className="grid gap-2">
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
                                            {family.guests[index]?.needsNameConfirmation ? (
                                                <p
                                                    className={`col-span-2 ${adminFamilyDetail.hint}`}
                                                >
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

                        <section className={adminFamilyDetail.cardCompact}>
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
                    </div>

                    <div className={adminFamilyDetail.rightCol}>
                        <section className={adminFamilyDetail.cardCompact}>
                            <p className={adminFamilyDetail.sectionLabel}>
                                {adminCopy.invitation.link}
                            </p>
                            <p className={adminFamilyDetail.urlBox}>
                                {family.invitationUrl}
                            </p>
                            <div className="flex w-full flex-col gap-2.5">
                                <CopyInvitationLink
                                    url={family.invitationUrl}
                                    tone="figma"
                                />
                                <CopyWhatsAppReminder
                                    familyName={family.displayName}
                                    invitationUrl={family.invitationUrl}
                                    tone="figma"
                                />
                            </div>
                        </section>

                        <section className={adminFamilyDetail.card}>
                            <p className={adminFamilyDetail.sectionLabel}>
                                {copy.familyGuestsTitle}
                            </p>
                            <ul className="flex w-full flex-col">
                                {family.guests.map((guest) => {
                                    const pickup = familyDetailGuestPickupLine(
                                        guest.needsTransport,
                                        guest.transportBoardingPoint,
                                    );
                                    const pickupCompact = familyDetailGuestPickupLine(
                                        guest.needsTransport,
                                        guest.transportBoardingPoint,
                                        "address",
                                    );
                                    const attendancePills = familyDetailGuestPills({
                                        attendanceStatus: guest.attendanceStatus,
                                        needsTransport: guest.needsTransport,
                                    });

                                    return (
                                        <li
                                            key={guest.id}
                                            className="flex flex-col gap-2 border-b border-admin-border py-3 last:border-0 last:pb-0 first:pt-0 xl:py-4"
                                        >
                                            <div className="flex min-w-0 flex-wrap items-start justify-between gap-2 xl:gap-3">
                                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                                    <div className="flex flex-wrap items-center justify-between gap-2 xl:justify-start">
                                                        <p className={adminFamilyDetail.guestName}>
                                                            {guest.fullName}
                                                        </p>
                                                        <StatusPills
                                                            pills={attendancePills}
                                                            guest
                                                        />
                                                    </div>
                                                    {pickupCompact ? (
                                                        <p className={`${adminFamilyDetail.guestMeta} xl:hidden`}>
                                                            {pickupCompact}
                                                        </p>
                                                    ) : null}
                                                    {pickup ? (
                                                        <p className={`${adminFamilyDetail.guestMeta} hidden xl:block`}>
                                                            {pickup}
                                                        </p>
                                                    ) : null}
                                                    {guest.dietaryRestrictions ? (
                                                        <p className={adminFamilyDetail.guestMeta}>
                                                            {guest.dietaryRestrictions}
                                                        </p>
                                                    ) : null}
                                                </div>
                                                <div className={adminFamilyDetail.guestContact}>
                                                    <p className={adminFamilyDetail.guestPhone}>
                                                        {guest.phone ?? "—"}
                                                    </p>
                                                    <p className={adminFamilyDetail.guestEmail}>
                                                        {guest.email ?? "—"}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>

                        <section className={adminFamilyDetail.card}>
                            <p className={adminFamilyDetail.sectionLabel}>
                                {activityCopy.title}
                            </p>
                            {activity.length === 0 ? (
                                <p className={adminFamilyDetail.hint}>
                                    {activityCopy.empty}
                                </p>
                            ) : (
                                <ol className="flex w-full flex-col gap-4 xl:gap-0">
                                    {activity.map((item, index) => {
                                        const last = index === activity.length - 1;
                                        return (
                                            <li
                                                key={item.id}
                                                className="flex gap-3 xl:gap-4"
                                            >
                                                <div className="flex w-3 shrink-0 flex-col items-center xl:w-4">
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
                                                    className={`flex min-w-0 flex-1 flex-col gap-0.5 xl:flex-row xl:items-start xl:justify-between xl:gap-3 ${last ? "" : "xl:pb-5"}`}
                                                >
                                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                                        <p className={adminFamilyDetail.timelineTitle}>
                                                            {item.title}
                                                        </p>
                                                        {item.detail ? (
                                                            <p className={adminFamilyDetail.timelineDetail}>
                                                                {item.detail}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                    <p className={adminFamilyDetail.timelineDate}>
                                                        {formatEventDateTimeShort(item.createdAt)}
                                                    </p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ol>
                            )}
                        </section>

                        <section className={adminFamilyDetail.cardDanger}>
                            <div className="flex flex-col gap-1">
                                <h2 className={adminFamilyDetail.dangerTitle}>
                                    <span className="xl:hidden">
                                        {familyDetailDeleteTitle(true)}
                                    </span>
                                    <span className="hidden xl:inline">
                                        {familyDetailDeleteTitle(false)}
                                    </span>
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
            </div>
        </div>
    );
}
