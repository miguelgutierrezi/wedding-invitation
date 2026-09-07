import Link from "next/link";
import type {ReactNode} from "react";

import {guestFotos} from "@/components/media/guest-fotos-ui";
import {weddingConfig} from "@/config/wedding";
import {
    guestFotosCopy,
    guestFotosCopyright,
    guestFotosCoupleBrand,
} from "@/lib/media/guest-fotos-layout";

type GuestFotosChromeProps = {
    children: ReactNode;
    backHref?: string;
};

export function GuestFotosChrome({
    children,
    backHref,
}: GuestFotosChromeProps) {
    const {partnerOne, partnerTwo} = weddingConfig.couple;
    const brand = guestFotosCoupleBrand(partnerOne, partnerTwo);
    const year = new Date().getFullYear();

    return (
        <div className={guestFotos.root}>
            <header className={guestFotos.banner}>
                <p className={guestFotos.brand}>
                    <span className={guestFotos.brandNames}>{brand}</span>
                    <span className={guestFotos.brandBadge}>
                        {guestFotosCopy.brandBadge}
                    </span>
                </p>
                <div className={guestFotos.titleBlock}>
                    <h1 className={guestFotos.title}>{guestFotosCopy.title}</h1>
                    <p className={guestFotos.lead}>{guestFotosCopy.lead}</p>
                </div>
            </header>

            <main className={guestFotos.main}>
                {children}
                {backHref ? (
                    <p className={guestFotos.backWrap}>
                        <Link href={backHref} className={guestFotos.backLink}>
                            {guestFotosCopy.backToInvitation}
                        </Link>
                    </p>
                ) : null}
            </main>

            <footer className={guestFotos.footer}>
                <p className={guestFotos.footerText}>
                    {guestFotosCopyright(year, partnerOne, partnerTwo)}
                </p>
            </footer>
        </div>
    );
}
