import {AdminLoginForm} from "@/components/admin/admin-login-form";
import {adminLogin} from "@/components/admin/admin-ui";
import {weddingConfig} from "@/config/wedding";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    loginCopyright,
    loginCoupleBrand,
} from "@/lib/admin/admin-login-layout";

type AdminLoginPortraitProps = {
    nextPath: string;
    errorFromQuery: string | null;
};

/** Figma portrait `151:30` from 834px until `lg`. */
export function AdminLoginPortrait({
    nextPath,
    errorFromQuery,
}: AdminLoginPortraitProps) {
    const {partnerOne, partnerTwo} = weddingConfig.couple;
    const copy = adminCopy.login;

    return (
        <div className={adminLogin.portraitRoot}>
            <p className={adminLogin.portraitBrand}>
                <span className={adminLogin.portraitBrandNames}>
                    {loginCoupleBrand(partnerOne, partnerTwo)}
                </span>
                <span className={adminLogin.brandBadge}>{copy.brandBadge}</span>
            </p>
            <div className={adminLogin.portraitCardWrap}>
                <AdminLoginForm
                    nextPath={nextPath}
                    errorFromQuery={errorFromQuery}
                    variant="desktop"
                />
            </div>
            <p className={adminLogin.portraitFooter}>
                {loginCopyright(new Date().getFullYear(), partnerOne, partnerTwo)}
            </p>
        </div>
    );
}
