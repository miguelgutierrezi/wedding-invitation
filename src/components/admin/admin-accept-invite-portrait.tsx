"use client";

import type {ReactNode} from "react";

import {adminAcceptInvite} from "@/components/admin/admin-ui";
import {weddingConfig} from "@/config/wedding";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    loginCopyright,
    loginCoupleBrand,
} from "@/lib/admin/admin-login-layout";

type AdminAcceptInvitePortraitProps = {
    children: ReactNode;
};

/** Figma portrait `158:103` from 834px until `lg`. */
export function AdminAcceptInvitePortrait({
    children,
}: AdminAcceptInvitePortraitProps) {
    const {partnerOne, partnerTwo} = weddingConfig.couple;
    const copy = adminCopy.login;

    return (
        <div className={adminAcceptInvite.portraitRoot}>
            <p className={adminAcceptInvite.portraitBrand}>
                <span className={adminAcceptInvite.portraitBrandNames}>
                    {loginCoupleBrand(partnerOne, partnerTwo)}
                </span>
                <span className={adminAcceptInvite.portraitBrandBadge}>
                    {copy.brandBadge}
                </span>
            </p>
            <div className={adminAcceptInvite.portraitCardWrap}>{children}</div>
            <p className={adminAcceptInvite.portraitFooter}>
                {loginCopyright(new Date().getFullYear(), partnerOne, partnerTwo)}
            </p>
        </div>
    );
}
