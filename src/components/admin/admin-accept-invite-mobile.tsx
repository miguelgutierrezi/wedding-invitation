"use client";

import type {ReactNode} from "react";

import {adminAcceptInvite} from "@/components/admin/admin-ui";
import {weddingConfig} from "@/config/wedding";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    loginCopyright,
    loginCoupleBrand,
} from "@/lib/admin/admin-login-layout";

type AdminAcceptInviteMobileProps = {
    children: ReactNode;
};

/** Figma mobile `158:136` below 834px. */
export function AdminAcceptInviteMobile({
    children,
}: AdminAcceptInviteMobileProps) {
    const {partnerOne, partnerTwo} = weddingConfig.couple;
    const copy = adminCopy.login;

    return (
        <div className={adminAcceptInvite.mobileRoot}>
            <div className={adminAcceptInvite.mobileStack}>
                <p className={adminAcceptInvite.mobileBrand}>
                    <span className={adminAcceptInvite.mobileBrandNames}>
                        {loginCoupleBrand(partnerOne, partnerTwo)}
                    </span>
                    <span className={adminAcceptInvite.mobileBrandBadge}>
                        {copy.brandBadge}
                    </span>
                </p>
                {children}
            </div>
            <p className={adminAcceptInvite.mobileFooter}>
                {loginCopyright(new Date().getFullYear(), partnerOne, partnerTwo)}
            </p>
        </div>
    );
}
