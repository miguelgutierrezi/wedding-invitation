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

type AdminLoginMobileProps = {
    nextPath: string;
    errorFromQuery: string | null;
};

/** Figma mobile `152:29` below 834px. Recovery uses `153:103`. */
export function AdminLoginMobile({
    nextPath,
    errorFromQuery,
}: AdminLoginMobileProps) {
    const {partnerOne, partnerTwo} = weddingConfig.couple;
    const copy = adminCopy.login;
    const form = useAdminLoginForm(errorFromQuery);
    const reset = form.mode === "reset";

    return (
        <div className={adminLogin.mobileRoot}>
            <p
                className={
                    reset ? adminLogin.mobileResetBrand : adminLogin.mobileBrand
                }
            >
                <span
                    className={
                        reset
                            ? adminLogin.mobileResetBrandNames
                            : adminLogin.mobileBrandNames
                    }
                >
                    {loginCoupleBrand(partnerOne, partnerTwo)}
                </span>
                <span
                    className={
                        reset
                            ? adminLogin.resetBrandBadge
                            : adminLogin.mobileBrandBadge
                    }
                >
                    {copy.brandBadge}
                </span>
            </p>
            <AdminLoginForm
                nextPath={nextPath}
                form={form}
                variant="mobile"
            />
            <p
                className={
                    reset
                        ? adminLogin.mobileResetFooter
                        : adminLogin.mobileFooter
                }
            >
                {loginCopyright(new Date().getFullYear(), partnerOne, partnerTwo)}
            </p>
        </div>
    );
}
