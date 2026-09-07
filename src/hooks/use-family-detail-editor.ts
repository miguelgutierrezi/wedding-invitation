"use client";

import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";

import {
    deleteFamilyAction,
    regenerateInvitationAction,
    updateFamilyAction,
} from "@/actions/admin/auth";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    guestRowsFromFamily,
    resizeGuestRows,
    type GuestFormRow,
} from "@/lib/admin/admin-family-detail-layout";
import {familyDeleteNameMatches} from "@/lib/admin/family-delete-name";
import type {AdminFamilyDetail} from "@/services/admin/families";

export function useFamilyDetailEditor(
    family: AdminFamilyDetail,
    formIdPrefix = "",
) {
    const router = useRouter();
    const [displayName, setDisplayName] = useState(family.displayName);
    const [invitationSlug, setInvitationSlug] = useState(family.invitationSlug);
    const [maximumGuests, setMaximumGuests] = useState(family.maximumGuests);
    const [customMessage, setCustomMessage] = useState(
        family.customMessage ?? "",
    );
    const [isEnabled, setIsEnabled] = useState(family.isEnabled);
    const [guestRows, setGuestRows] = useState(() =>
        guestRowsFromFamily(family, Math.max(family.guests.length, 1)),
    );
    const [confirmDeleteName, setConfirmDeleteName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const saveFormId = `${formIdPrefix}admin-family-save`;
    const deleteFormId = `${formIdPrefix}admin-family-delete`;
    const deleteNameMatches = familyDeleteNameMatches(
        confirmDeleteName,
        family.displayName,
        displayName,
    );

    function setGuestName(index: number, name: string) {
        setGuestRows((current) =>
            current.map((guest, guestIndex) =>
                guestIndex === index ? {...guest, name} : guest,
            ),
        );
    }

    function setGuestGender(index: number, gender: GuestFormRow["gender"]) {
        setGuestRows((current) =>
            current.map((guest, guestIndex) =>
                guestIndex === index ? {...guest, gender} : guest,
            ),
        );
    }

    function onMaximumGuestsChange(value: number) {
        const nextCount = Math.min(30, Math.max(1, value || 1));
        setMaximumGuests(value);
        setGuestRows((current) => resizeGuestRows(current, nextCount));
    }

    function onEnabledChange(nextEnabled: boolean) {
        if (
            isEnabled &&
            !nextEnabled &&
            !window.confirm(adminCopy.actions.disableConfirm)
        ) {
            return;
        }
        setIsEnabled(nextEnabled);
    }

    function submitSave(formData: FormData) {
        setError(null);
        setMessage(null);
        startTransition(async () => {
            const result = await updateFamilyAction(formData);
            if (!result.ok) {
                setError(result.error);
                return;
            }
            setMessage(result.message ?? "Guardado.");
            router.refresh();
        });
    }

    function submitRegenerate() {
        if (!window.confirm(adminCopy.actions.regenerateConfirm)) {
            return;
        }
        setError(null);
        setMessage(null);
        startTransition(async () => {
            const result = await regenerateInvitationAction(family.id);
            if (!result.ok) {
                setError(result.error);
                return;
            }
            setMessage(result.message ?? null);
            router.refresh();
        });
    }

    function submitDelete(formData: FormData) {
        if (
            !familyDeleteNameMatches(
                String(formData.get("confirmName") ?? ""),
                family.displayName,
                displayName,
            )
        ) {
            setError("El nombre escrito no coincide con el de la familia.");
            return;
        }
        formData.set("confirmName", family.displayName);
        setError(null);
        setMessage(null);
        startTransition(async () => {
            const result = await deleteFamilyAction(formData);
            if (result && !result.ok) {
                setError(result.error);
            }
        });
    }

    return {
        family,
        displayName,
        setDisplayName,
        invitationSlug,
        setInvitationSlug,
        maximumGuests,
        onMaximumGuestsChange,
        customMessage,
        setCustomMessage,
        isEnabled,
        onEnabledChange,
        guestRows,
        setGuestName,
        setGuestGender,
        confirmDeleteName,
        setConfirmDeleteName,
        error,
        message,
        isPending,
        saveFormId,
        deleteFormId,
        deleteNameMatches,
        submitSave,
        submitRegenerate,
        submitDelete,
    };
}

export type FamilyDetailEditor = ReturnType<typeof useFamilyDetailEditor>;
