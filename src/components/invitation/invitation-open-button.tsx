"use client";

import {useRouter} from "next/navigation";

import {weddingConfig} from "@/config/wedding";
import {startInvitationMusic} from "@/lib/invitation-audio";
import {cn} from "@/lib/utils";

type InvitationOpenButtonProps = {
    slug: string;
    label: string;
    className?: string;
};

/**
 * Cover CTA: user gesture starts soundtrack, then navigates to the body.
 */
export function InvitationOpenButton({
                                         slug,
                                         label,
                                         className,
                                     }: InvitationOpenButtonProps) {
    const router = useRouter();
    const musicSrc = weddingConfig.assets.music;
    const musicEnabled = weddingConfig.features.music && Boolean(musicSrc);

    return (
        <button
            type="button"
            className={cn(className)}
            onClick={() => {
                if (musicEnabled && musicSrc) {
                    void startInvitationMusic(musicSrc);
                }
                router.push(`/i/${encodeURIComponent(slug)}/invitacion`);
            }}
        >
            {label}
        </button>
    );
}
