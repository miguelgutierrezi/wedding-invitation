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

type AdminLoginDesktopProps = {
    nextPath: string;
    errorFromQuery: string | null;
};

/** Figma landscape `149:29` from `lg` and desktop `145:364` from `xl`. Recovery uses `153:57` from `lg` and `153:34` from `xl`. */
export function AdminLoginDesktop({
    nextPath,
    errorFromQuery,
}: AdminLoginDesktopProps) {
    const {partnerOne, partnerTwo} = weddingConfig.couple;
    const copy = adminCopy.login;
    const form = useAdminLoginForm(errorFromQuery);
    const reset = form.mode === "reset";

    return (
        <div className={adminLogin.desktopRoot}>
            <p className={reset ? adminLogin.resetBrand : adminLogin.brand}>
                <span
                    className={
                        reset ? adminLogin.resetBrandNames : adminLogin.brandNames
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
            <AdminLoginForm
                nextPath={nextPath}
                form={form}
                variant="desktop"
            />
            <p className={reset ? adminLogin.resetFooter : adminLogin.footer}>
                {loginCopyright(new Date().getFullYear(), partnerOne, partnerTwo)}
            </p>
        </div>
    );
}
