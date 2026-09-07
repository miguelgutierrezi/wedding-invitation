"use client";

import {AdminLoginForm} from "@/components/admin/admin-login-form";
import {adminLogin} from "@/components/admin/admin-ui";
import {weddingConfig} from "@/config/wedding";
import {useAdminLoginForm} from "@/hooks/use-admin-login-form";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    loginCopyright,
    loginCoupleBrand,
} from "@/lib/admin/admin-login-layout";

type AdminLoginPortraitProps = {
    nextPath: string;
    errorFromQuery: string | null;
};

/** Figma portrait `151:30` from 834px until `lg`. Recovery uses `153:80`. */
export function AdminLoginPortrait({
    nextPath,
    errorFromQuery,
}: AdminLoginPortraitProps) {
    const {partnerOne, partnerTwo} = weddingConfig.couple;
    const copy = adminCopy.login;
    const form = useAdminLoginForm(errorFromQuery);
    const reset = form.mode === "reset";
    const card = (
        <AdminLoginForm
            nextPath={nextPath}
            form={form}
            variant="desktop"
        />
    );

    return (
        <div
            className={
                reset ? adminLogin.portraitResetRoot : adminLogin.portraitRoot
            }
        >
            <p
                className={
                    reset
                        ? adminLogin.portraitResetBrand
                        : adminLogin.portraitBrand
                }
            >
                <span
                    className={
                        reset
                            ? adminLogin.portraitResetBrandNames
                            : adminLogin.portraitBrandNames
                    }
                >
                    {loginCoupleBrand(partnerOne, partnerTwo)}
                </span>
                <span
                    className={
                        reset ? adminLogin.resetBrandBadge : adminLogin.brandBadge
                    }
                >
                    {copy.brandBadge}
                </span>
            </p>
            {reset ? (
                card
            ) : (
                <div className={adminLogin.portraitCardWrap}>{card}</div>
            )}
            <p
                className={
                    reset
                        ? adminLogin.portraitResetFooter
                        : adminLogin.portraitFooter
                }
            >
                {loginCopyright(new Date().getFullYear(), partnerOne, partnerTwo)}
            </p>
        </div>
    );
}
