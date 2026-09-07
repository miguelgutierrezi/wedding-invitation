"use client";

import type {ReactNode} from "react";

import {adminAcceptInvite} from "@/components/admin/admin-ui";
import {weddingConfig} from "@/config/wedding";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    loginCopyright,
    loginCoupleBrand,
} from "@/lib/admin/admin-login-layout";

type AdminAcceptInviteDesktopProps = {
    children: ReactNode;
};

/** Figma landscape `158:72` from `lg` and desktop `158:34` from `xl`. */
export function AdminAcceptInviteDesktop({
    children,
}: AdminAcceptInviteDesktopProps) {
    const {partnerOne, partnerTwo} = weddingConfig.couple;
    const copy = adminCopy.login;

    return (
        <div className={adminAcceptInvite.desktopRoot}>
            <p className={adminAcceptInvite.brand}>
                <span className={adminAcceptInvite.brandNames}>
                    {loginCoupleBrand(partnerOne, partnerTwo)}
                </span>
                <span className={adminAcceptInvite.brandBadge}>
                    {copy.brandBadge}
                </span>
            </p>
            {children}
            <p className={adminAcceptInvite.footer}>
                {loginCopyright(new Date().getFullYear(), partnerOne, partnerTwo)}
            </p>
        </div>
    );
}
