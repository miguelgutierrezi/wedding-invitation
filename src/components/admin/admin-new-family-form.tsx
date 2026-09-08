"use client";

import {AdminAlert, AdminAlertMessage} from "@/components/admin/admin-alert";
import {adminNewFamily} from "@/components/admin/admin-ui";
import {CopyInvitationLink} from "@/components/admin/copy-invitation-link";
import {useCreateFamilyForm} from "@/hooks/use-create-family-form";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    NEW_FAMILY_MAX_GUESTS,
    NEW_FAMILY_MIN_GUESTS,
    newFamilyGuestLabel,
} from "@/lib/admin/admin-new-family-layout";

export function AdminNewFamilyFormCard({
    cardClassName,
    textareaClassName,
    stackedGuests = false,
    figmaAlerts = false,
}: {
    cardClassName: string;
    textareaClassName: string;
    stackedGuests?: boolean;
    figmaAlerts?: boolean;
}) {
    const form = useCreateFamilyForm();
    const copy = adminCopy.newFamily;
    const guestRowClass = stackedGuests
        ? adminNewFamily.mobileGuestRow
        : adminNewFamily.guestRow;
    const guestGenderColClass = stackedGuests
        ? adminNewFamily.mobileGuestGenderCol
        : adminNewFamily.guestGenderCol;
    const guestNameLabelClass = stackedGuests
        ? adminNewFamily.fieldLabel
        : adminNewFamily.guestLabel;
    const guestsTitleClass = stackedGuests
        ? adminNewFamily.mobileGuestsTitle
        : adminNewFamily.guestsTitle;
    const guestsHintClass = stackedGuests
        ? adminNewFamily.mobileGuestsHint
        : adminNewFamily.guestsHint;

    if (form.invitationUrl) {
        return (
            <div className={cardClassName}>
                {figmaAlerts ? (
                    <AdminAlert
                        tone="success"
                        title={copy.successTitle}
                        description={copy.successBody}
                    />
                ) : (
                    <div className={adminNewFamily.success}>
                        <p className="font-semibold">{copy.successTitle}</p>
                        <p className={`mt-1 ${adminNewFamily.guestsHint}`}>
                            {copy.successBody}
                        </p>
                    </div>
                )}
                <CopyInvitationLink
                    url={form.invitationUrl}
                    tone="figma"
                    className={adminNewFamily.btnPrimary}
                />
                <div className="flex w-full flex-col gap-3">
                    {form.familyId ? (
                        <button
                            type="button"
                            onClick={form.goToFamily}
                            className={adminNewFamily.btnPrimary}
                        >
                            {copy.viewFamily}
                        </button>
                    ) : null}
                    <button
                        type="button"
                        onClick={form.goToList}
                        className={adminNewFamily.btnSecondary}
                    >
                        {copy.backToList}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form className={cardClassName} action={form.submit}>
            <label className="grid gap-2">
                <span className={adminNewFamily.fieldLabel}>{copy.nameLabel}</span>
                <input
                    name="displayName"
                    required
                    className={adminNewFamily.input}
                    placeholder={copy.namePlaceholder}
                />
            </label>

            <label className="grid gap-2">
                <span className={adminNewFamily.fieldLabel}>{copy.seatsLabel}</span>
                <input
                    type="number"
                    name="maximumGuests"
                    min={NEW_FAMILY_MIN_GUESTS}
                    max={NEW_FAMILY_MAX_GUESTS}
                    required
                    defaultValue={form.guestCount}
                    onChange={(event) => {
                        form.onMaximumGuestsChange(
                            Number(event.target.value) || NEW_FAMILY_MIN_GUESTS,
                        );
                    }}
                    className={adminNewFamily.input}
                />
            </label>

            <label className="grid gap-2">
                <span className={adminNewFamily.fieldLabel}>
                    {stackedGuests ? (
                        <>
                            {copy.messageLabelLead}{" "}
                            <span className={adminNewFamily.messageOptional}>
                                {copy.messageOptional}
                            </span>
                        </>
                    ) : (
                        copy.messageLabel
                    )}
                </span>
                <textarea
                    name="customMessage"
                    placeholder={copy.messagePlaceholder}
                    className={textareaClassName}
                />
            </label>

            <div className="flex w-full flex-col gap-3">
                <div className={adminNewFamily.guestsDivider} />
                <div className="flex flex-col gap-1">
                    <p className={guestsTitleClass}>{copy.guestsTitle}</p>
                    <p className={guestsHintClass}>{copy.guestsHint}</p>
                </div>
            </div>

            {Array.from({length: form.guestCount}, (_, index) => (
                <div key={index} className={guestRowClass}>
                    <label className={adminNewFamily.guestNameCol}>
                        <span className={guestNameLabelClass}>
                            {newFamilyGuestLabel(index)}
                        </span>
                        <input
                            name="guestNames"
                            required
                            className={adminNewFamily.input}
                            placeholder={copy.guestNamePlaceholder}
                        />
                    </label>
                    <label className={guestGenderColClass}>
                        <span className={adminNewFamily.guestLabel}>
                            {copy.genderLabel}
                        </span>
                        <select
                            name="guestGenders"
                            required
                            defaultValue=""
                            className={adminNewFamily.select}
                        >
                            <option value="" disabled>
                                {copy.genderPlaceholder}
                            </option>
                            <option value="female">Mujer</option>
                            <option value="male">Hombre</option>
                            <option value="unspecified">Sin género</option>
                        </select>
                    </label>
                </div>
            ))}

            {form.error ? (
                figmaAlerts ? (
                    <AdminAlertMessage message={form.error} tone="error" />
                ) : (
                    <p className={adminNewFamily.error} role="alert">
                        {form.error}
                    </p>
                )
            ) : null}

            <button
                type="submit"
                disabled={form.isPending}
                className={adminNewFamily.btnPrimary}
            >
                {form.isPending ? copy.submitting : copy.submit}
            </button>
        </form>
    );
}
