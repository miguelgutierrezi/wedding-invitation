import {rootNotFound} from "@/components/public/root-not-found-ui";
import {weddingConfig} from "@/config/wedding";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    loginCopyright,
    loginCoupleBrand,
} from "@/lib/admin/admin-login-layout";
import {rootNotFoundCopy} from "@/lib/public/root-not-found-layout";

type RootNotFoundCardProps = {
    cardClassName: string;
    infoClassName: string;
    codeClassName: string;
    titleClassName: string;
    bodyClassName: string;
};

function RootNotFoundCard({
    cardClassName,
    infoClassName,
    codeClassName,
    titleClassName,
    bodyClassName,
}: RootNotFoundCardProps) {
    return (
        <div className={cardClassName}>
            <div className={infoClassName}>
                <p className={codeClassName} aria-hidden>
                    {rootNotFoundCopy.code}
                </p>
                <h1 className={titleClassName}>{rootNotFoundCopy.title}</h1>
                <p className={bodyClassName}>{rootNotFoundCopy.body}</p>
            </div>
        </div>
    );
}

function RootNotFoundChrome({
    rootClassName,
    brandClassName = rootNotFound.brand,
    brandNamesClassName = rootNotFound.brandNames,
    brandBadgeClassName = rootNotFound.brandBadge,
    cardClassName = rootNotFound.card,
    infoClassName = rootNotFound.info,
    codeClassName = rootNotFound.code,
    titleClassName = rootNotFound.title,
    bodyClassName = rootNotFound.body,
    footerClassName = rootNotFound.footer,
}: {
    rootClassName: string;
    brandClassName?: string;
    brandNamesClassName?: string;
    brandBadgeClassName?: string;
    cardClassName?: string;
    infoClassName?: string;
    codeClassName?: string;
    titleClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
}) {
    const {partnerOne, partnerTwo} = weddingConfig.couple;

    return (
        <div className={rootClassName}>
            <p className={brandClassName}>
                <span className={brandNamesClassName}>
                    {loginCoupleBrand(partnerOne, partnerTwo)}
                </span>
                <span className={brandBadgeClassName}>
                    {adminCopy.login.brandBadge}
                </span>
            </p>
            <RootNotFoundCard
                cardClassName={cardClassName}
                infoClassName={infoClassName}
                codeClassName={codeClassName}
                titleClassName={titleClassName}
                bodyClassName={bodyClassName}
            />
            <p className={footerClassName}>
                {loginCopyright(new Date().getFullYear(), partnerOne, partnerTwo)}
            </p>
        </div>
    );
}

/** Figma not-found-desktop `158:168` from `xl`. */
function RootNotFoundDesktop() {
    return <RootNotFoundChrome rootClassName={rootNotFound.desktopRoot} />;
}

/** Figma not-found-tablet-landscape `158:183` from `lg` until `xl`. */
function RootNotFoundLandscape() {
    return <RootNotFoundChrome rootClassName={rootNotFound.landscapeRoot} />;
}

/** Figma not-found-tablet-portrait `158:198` from 834px until `lg`. */
function RootNotFoundPortrait() {
    return (
        <RootNotFoundChrome
            rootClassName={rootNotFound.portraitRoot}
            brandClassName={rootNotFound.portraitBrand}
            brandNamesClassName={rootNotFound.portraitBrandNames}
            brandBadgeClassName={rootNotFound.portraitBrandBadge}
        />
    );
}

/** Figma not-found-mobile `158:213` below 834px. */
function RootNotFoundMobile() {
    return (
        <RootNotFoundChrome
            rootClassName={rootNotFound.mobileRoot}
            brandClassName={rootNotFound.mobileBrand}
            brandNamesClassName={rootNotFound.mobileBrandNames}
            brandBadgeClassName={rootNotFound.mobileBrandBadge}
            cardClassName={rootNotFound.mobileCard}
            infoClassName={rootNotFound.mobileInfo}
            codeClassName={rootNotFound.mobileCode}
            titleClassName={rootNotFound.mobileTitle}
            bodyClassName={rootNotFound.mobileBody}
            footerClassName={rootNotFound.mobileFooter}
        />
    );
}

export function RootNotFoundScreens() {
    return (
        <>
            <RootNotFoundDesktop />
            <RootNotFoundLandscape />
            <RootNotFoundPortrait />
            <RootNotFoundMobile />
        </>
    );
}
