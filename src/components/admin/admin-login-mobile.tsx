import {AdminLoginForm} from "@/components/admin/admin-login-form";
import {adminLogin} from "@/components/admin/admin-ui";
import {weddingConfig} from "@/config/wedding";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    loginCopyright,
    loginCoupleBrand,
} from "@/lib/admin/admin-login-layout";

type AdminLoginMobileProps = {
    nextPath: string;
    errorFromQuery: string | null;
};

/** Figma mobile `152:29` below 834px. */
export function AdminLoginMobile({
    nextPath,
    errorFromQuery,
}: AdminLoginMobileProps) {
    const {partnerOne, partnerTwo} = weddingConfig.couple;
    const copy = adminCopy.login;

    return (
        <div className={adminLogin.mobileRoot}>
            <p className={adminLogin.mobileBrand}>
                <span className={adminLogin.mobileBrandNames}>
                    {loginCoupleBrand(partnerOne, partnerTwo)}
                </span>
                <span className={adminLogin.mobileBrandBadge}>{copy.brandBadge}</span>
            </p>
            <AdminLoginForm
                nextPath={nextPath}
                errorFromQuery={errorFromQuery}
                variant="mobile"
            />
            <p className={adminLogin.mobileFooter}>
                {loginCopyright(new Date().getFullYear(), partnerOne, partnerTwo)}
            </p>
        </div>
    );
}
