import Image from "next/image";

import {InspirationCta} from "@/components/invitation/inspiration-cta";
import {weddingConfig} from "@/config/wedding";
import {cn} from "@/lib/utils";

const inspirationCtaClassName =
    "inline-flex min-h-11 items-center justify-center rounded-full border-2 border-cover-cta-fg bg-accent px-8 py-4 text-center font-[family-name:var(--font-timer)] text-[clamp(1.125rem,3vw,2.5rem)] leading-none text-cover-cta-fg transition-[transform,opacity] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none active:scale-[0.98] sm:min-h-14 sm:px-12 sm:py-6";

function GuidanceList({items}: { items: readonly string[] }) {
    return (
        <ul className="w-full space-y-4 text-left font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.75rem)] leading-8 text-cover-cta-fg">
            {items.map((item) => (
                <li key={item} className="grid grid-cols-[1.25rem_1fr] gap-x-1">
          <span aria-hidden className="text-center">
            -
          </span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

type GenderBlockProps = {
    title: string;
    items: readonly string[];
    inspirationHref: string;
    inspirationLabel: string;
    /** Desktop: pin to outer column edge (start = ELLOS left, end = ELLAS right). */
    align?: "center" | "start" | "end";
};

/**
 * Content column for men/women guidance.
 * On desktop, outer columns hug the edges so palette copy can match that span.
 */
function GenderBlock({
                         title,
                         items,
                         inspirationHref,
                         inspirationLabel,
                         align = "center",
                     }: GenderBlockProps) {
    const justifyClass =
        align === "start"
            ? "justify-center lg:justify-start"
            : align === "end"
                ? "justify-center lg:justify-end"
                : "justify-center";

    return (
        <div className={cn("flex h-full w-full", justifyClass)}>
            <div className="flex h-full w-full max-w-[18rem] flex-col items-center gap-6 sm:max-w-xs xl:max-w-sm">
                <h3 className="w-full text-center font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.75rem)] leading-8 font-bold">
                    {title}
                </h3>
                <GuidanceList items={items}/>
                {/* Stretch + mt-auto keeps both CTAs on the same baseline at lg+. */}
                <div className="mt-auto flex w-full justify-center pt-2">
                    <InspirationCta href={inspirationHref} className={inspirationCtaClassName}>
                        {inspirationLabel}
                    </InspirationCta>
                </div>
            </div>
        </div>
    );
}

function DressCodePhoto({className}: { className?: string }) {
    const src = weddingConfig.assets.dressCodePhoto;
    if (!src) return null;

    // Natural art is ~745×1033; object-contain so feet stay visible.
    return (
        <div className={cn("mx-auto w-full", className ?? "max-w-xs")}>
            <Image
                src={src}
                alt="Referencia de vestimenta formal elegante"
                width={745}
                height={1033}
                className="h-auto w-full object-contain object-top"
                sizes="(max-width: 1024px) 80vw, (max-width: 1280px) 28rem, 32rem"
                unoptimized
            />
        </div>
    );
}

/**
 * Dress code section (Figma Wireframe - 3): cream board, olive Times type,
 * ELLAS/ELLOS columns (ELLOS | foto | ELLAS on desktop); dress photo under subtitle on mobile/portrait tablet.
 */
export function InvitationDressCode() {
    const {dressCode, assets} = weddingConfig;

    /** Shared width for the men/photo/women row and the palette copy below. */
    const contentWidthClass =
        "w-full min-w-0 max-w-5xl lg:max-w-6xl xl:max-w-7xl";

    return (
        <section
            aria-label={dressCode.title}
            className="overflow-x-hidden bg-cream-figma px-6 py-14 text-cover-cta-fg sm:px-10 sm:py-16"
        >
            <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col items-center">
                <h2 className="text-center font-[family-name:var(--font-timer)] text-[clamp(2.5rem,6vw,4rem)] leading-none font-bold">
                    {dressCode.title}
                </h2>
                <p className="mt-4 text-center font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.75rem)] leading-8 font-bold">
                    {dressCode.subtitle}
                </p>

                {/* Mobile + tablet portrait: dress right under the subtitle. */}
                <DressCodePhoto className="mt-8 max-w-xs lg:hidden"/>

                <p className="mt-5 max-w-3xl text-center font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.75rem)] leading-8">
                    {dressCode.description}
                </p>

                <div className={`mt-12 ${contentWidthClass}`}>
                    {/* Desktop: 3 columns (ELLOS | foto | ELLAS). Mobile: men then women. */}
                    <div
                        className="grid w-full min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)_minmax(0,1fr)] lg:items-stretch lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,30rem)_minmax(0,1fr)] xl:gap-10 [&>*]:min-w-0">
                        <GenderBlock
                            title={dressCode.men.title}
                            items={dressCode.men.items}
                            inspirationHref={dressCode.inspirationUrls.men}
                            inspirationLabel={dressCode.inspirationLabel}
                            align="start"
                        />

                        <div className="hidden w-full self-center lg:block">
                            <DressCodePhoto className="max-w-none"/>
                        </div>

                        <GenderBlock
                            title={dressCode.women.title}
                            items={dressCode.women.items}
                            inspirationHref={dressCode.inspirationUrls.women}
                            inspirationLabel={dressCode.inspirationLabel}
                            align="end"
                        />
                    </div>

                    {/* Same horizontal bounds as ELLOS ↔ ELLAS. */}
                    <div className="mt-14 w-full space-y-10 text-center">
                        {assets.allowedPaletteImage ? (
                            <div>
                                <p className="font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.75rem)] leading-8 font-bold">
                                    {dressCode.allowedPaletteTitle}
                                </p>
                                <div className="mx-auto mt-5 w-full">
                                    <Image
                                        src={assets.allowedPaletteImage}
                                        alt="Paleta de colores sugeridos para el código de vestimenta"
                                        width={1228}
                                        height={118}
                                        className="mx-auto h-auto w-full object-contain"
                                        sizes="(max-width: 1024px) 90vw, (max-width: 1280px) 72rem, 80rem"
                                    />
                                </div>
                            </div>
                        ) : null}

                        {assets.forbiddenPaletteImage || dressCode.forbiddenDescription ? (
                            <div className="space-y-5">
                                <p className="font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.75rem)] leading-8 font-bold">
                                    {dressCode.forbiddenTitle}
                                </p>
                                {dressCode.forbiddenDescription ? (
                                    <p className="w-full whitespace-pre-line font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.75rem)] leading-8">
                                        {dressCode.forbiddenDescription}
                                    </p>
                                ) : null}
                                {assets.forbiddenPaletteImage ? (
                                    <div className="mx-auto w-full">
                                        <Image
                                            src={assets.forbiddenPaletteImage}
                                            alt="Paleta de colores no permitidos en el código de vestimenta"
                                            width={1167}
                                            height={81}
                                            className="mx-auto h-auto w-full object-contain"
                                            sizes="(max-width: 1024px) 90vw, (max-width: 1280px) 72rem, 80rem"
                                        />
                                    </div>
                                ) : null}
                            </div>
                        ) : null}

                        {dressCode.closingNote ? (
                            <p className="w-full font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.75rem)] leading-8">
                                {dressCode.closingNote}
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}
