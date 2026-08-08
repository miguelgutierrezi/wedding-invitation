import Image from "next/image";
import type { ReactNode } from "react";

import { weddingConfig } from "@/config/wedding";

function InspirationCta({ href, children }: { href: string; children: ReactNode }) {
  const className =
    "inline-flex min-h-11 items-center justify-center rounded-full border-2 border-cover-cta-fg bg-accent px-8 py-4 font-[family-name:var(--font-timer)] text-[clamp(1.125rem,3vw,2.5rem)] leading-none text-cover-cta-fg transition-[transform,opacity] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none active:scale-[0.98] sm:min-h-14 sm:px-12 sm:py-6";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <span className={`${className} cursor-not-allowed opacity-80`} aria-disabled="true">
      {children}
    </span>
  );
}

function GuidanceList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-4 text-left font-[family-name:var(--font-timer)] text-[clamp(0.9375rem,2vw,1.4375rem)] leading-snug text-cover-cta-fg">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden className="shrink-0">
            -
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function DressCodePhoto({ className }: { className?: string }) {
  const src = weddingConfig.assets.dressCodePhoto;
  if (!src) return null;

  return (
    <div
      className={`relative mx-auto aspect-[347/439] w-full max-w-xs overflow-hidden ${className ?? ""}`}
    >
      <Image
        src={src}
        alt="Referencia de vestimenta formal elegante"
        fill
        className="object-cover object-top"
        sizes="(max-width: 1024px) 80vw, 320px"
      />
    </div>
  );
}

/**
 * Dress code section (Figma Wireframe - 3): cream board, olive Times type,
 * ELLAS | foto | ELLOS on desktop; dress photo under subtitle on mobile/portrait tablet.
 */
export function InvitationDressCode() {
  const { dressCode, assets } = weddingConfig;

  return (
    <section
      aria-label={dressCode.title}
      className="bg-cream-figma px-6 py-14 text-cover-cta-fg sm:px-10 sm:py-16"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        <h2 className="text-center font-[family-name:var(--font-timer)] text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight">
          {dressCode.title}
        </h2>
        <p className="mt-4 text-center font-[family-name:var(--font-timer)] text-[clamp(1rem,2.2vw,1.4375rem)] font-bold">
          {dressCode.subtitle}
        </p>

        {/* Mobile + tablet portrait: dress right under the subtitle. */}
        <DressCodePhoto className="mt-8 lg:hidden" />

        <p className="mt-5 max-w-3xl text-center font-[family-name:var(--font-timer)] text-[clamp(0.9375rem,2vw,1.4375rem)] leading-snug">
          {dressCode.description}
        </p>

        {/* Desktop: 3 columns (ELLAS | foto | ELLOS). Mobile: women then men. */}
        <div className="mt-12 grid w-full gap-10 lg:grid-cols-[1fr_minmax(12rem,20rem)_1fr] lg:items-start lg:gap-8">
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:pt-4 lg:text-left">
            <h3 className="font-[family-name:var(--font-timer)] text-[clamp(1rem,2.2vw,1.4375rem)] font-bold">
              {dressCode.women.title}
            </h3>
            <GuidanceList items={dressCode.women.items} />
            <InspirationCta href={dressCode.inspirationUrls.women}>
              {dressCode.inspirationLabel}
            </InspirationCta>
          </div>

          <div className="hidden w-full max-w-none lg:block">
            <DressCodePhoto className="max-w-none" />
          </div>

          <div className="flex flex-col items-center gap-6 text-center lg:items-end lg:pt-4 lg:text-left">
            <h3 className="font-[family-name:var(--font-timer)] text-[clamp(1rem,2.2vw,1.4375rem)] font-bold lg:self-center">
              {dressCode.men.title}
            </h3>
            <div className="w-full max-w-sm lg:max-w-none">
              <GuidanceList items={dressCode.men.items} />
            </div>
            <div className="lg:self-center">
              <InspirationCta href={dressCode.inspirationUrls.men}>
                {dressCode.inspirationLabel}
              </InspirationCta>
            </div>
          </div>
        </div>

        <div className="mt-14 w-full max-w-5xl space-y-10 text-center">
          {assets.allowedPaletteImage ? (
            <div>
              <p className="font-[family-name:var(--font-timer)] text-[clamp(1rem,2.2vw,1.4375rem)] font-bold">
                {dressCode.allowedPaletteTitle}
              </p>
              <div className="mt-5 w-full">
                <Image
                  src={assets.allowedPaletteImage}
                  alt="Paleta de colores sugeridos para el código de vestimenta"
                  width={1228}
                  height={118}
                  className="mx-auto h-auto w-full object-contain"
                  sizes="(max-width: 1024px) 100vw, 64rem"
                />
              </div>
            </div>
          ) : null}

          {assets.forbiddenPaletteImage || dressCode.forbiddenDescription ? (
            <div className="space-y-5">
              <p className="font-[family-name:var(--font-timer)] text-[clamp(1rem,2.2vw,1.4375rem)] font-bold">
                {dressCode.forbiddenTitle}
              </p>
              {dressCode.forbiddenDescription ? (
                <p className="mx-auto max-w-3xl whitespace-pre-line font-[family-name:var(--font-timer)] text-[clamp(0.9375rem,2vw,1.4375rem)] leading-snug">
                  {dressCode.forbiddenDescription}
                </p>
              ) : null}
              {assets.forbiddenPaletteImage ? (
                <Image
                  src={assets.forbiddenPaletteImage}
                  alt="Paleta de colores no permitidos en el código de vestimenta"
                  width={1167}
                  height={81}
                  className="mx-auto h-auto w-full max-w-5xl object-contain"
                  sizes="(max-width: 1024px) 100vw, 64rem"
                />
              ) : null}
            </div>
          ) : null}

          {dressCode.closingNote ? (
            <p className="mx-auto max-w-3xl font-[family-name:var(--font-timer)] text-[clamp(0.9375rem,2vw,1.4375rem)] leading-snug">
              {dressCode.closingNote}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
