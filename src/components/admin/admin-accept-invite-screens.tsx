"use client";

import {AdminAcceptInviteDesktop} from "@/components/admin/admin-accept-invite-desktop";
import {AdminAcceptInviteForm} from "@/components/admin/admin-accept-invite-form";
import {AdminAcceptInviteMobile} from "@/components/admin/admin-accept-invite-mobile";
import {AdminAcceptInvitePortrait} from "@/components/admin/admin-accept-invite-portrait";
import {useAdminAcceptInviteSession} from "@/hooks/use-admin-accept-invite-session";

type AdminAcceptInviteScreensProps = {
    supabaseUrl: string;
    supabaseAnonKey: string;
};

/** One invite session: Figma mobile below 834px, portrait from 834px, landscape from `lg`, desktop from `xl`. */
export function AdminAcceptInviteScreens({
    supabaseUrl,
    supabaseAnonKey,
}: AdminAcceptInviteScreensProps) {
    const session = useAdminAcceptInviteSession(supabaseUrl, supabaseAnonKey);

    return (
        <>
            <AdminAcceptInviteDesktop>
                <AdminAcceptInviteForm
                    supabaseUrl={supabaseUrl}
                    supabaseAnonKey={supabaseAnonKey}
                    session={session}
                    variant="desktop"
                />
            </AdminAcceptInviteDesktop>
            <AdminAcceptInvitePortrait>
                <AdminAcceptInviteForm
                    supabaseUrl={supabaseUrl}
                    supabaseAnonKey={supabaseAnonKey}
                    session={session}
                    variant="portrait"
                />
            </AdminAcceptInvitePortrait>
            <AdminAcceptInviteMobile>
                <AdminAcceptInviteForm
                    supabaseUrl={supabaseUrl}
                    supabaseAnonKey={supabaseAnonKey}
                    session={session}
                    variant="mobile"
                />
            </AdminAcceptInviteMobile>
        </>
    );
}
