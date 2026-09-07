import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";

import {createFamilyAction} from "@/actions/admin/auth";
import {readAdminFamiliesListReturnHref} from "@/lib/admin/admin-list-return";
import {
    NEW_FAMILY_DEFAULT_GUEST_COUNT,
    clampNewFamilyGuestCount,
} from "@/lib/admin/admin-new-family-layout";

export function useCreateFamilyForm() {
    const router = useRouter();
    const [guestCount, setGuestCount] = useState(NEW_FAMILY_DEFAULT_GUEST_COUNT);
    const [error, setError] = useState<string | null>(null);
    const [invitationUrl, setInvitationUrl] = useState<string | null>(null);
    const [familyId, setFamilyId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function onMaximumGuestsChange(value: number) {
        setGuestCount(clampNewFamilyGuestCount(value));
    }

    function submit(formData: FormData) {
        setError(null);
        startTransition(async () => {
            const result = await createFamilyAction(formData);
            if (!result.ok) {
                setError(result.error);
                return;
            }
            setInvitationUrl(result.invitationUrl ?? null);
            setFamilyId(result.familyId ?? null);
        });
    }

    function goToFamily() {
        if (!familyId) {
            return;
        }
        router.push(`/admin/families/${familyId}`);
    }

    function goToList() {
        router.push(readAdminFamiliesListReturnHref());
    }

    return {
        guestCount,
        error,
        invitationUrl,
        familyId,
        isPending,
        onMaximumGuestsChange,
        submit,
        goToFamily,
        goToList,
    };
}
