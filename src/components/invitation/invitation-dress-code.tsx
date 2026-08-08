import Image from "next/image";

import { weddingConfig } from "@/config/wedding";

function DressIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 64"
      className="h-14 w-11 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M18 8c0-3 3-6 6-6s6 3 6 6" />
      <path d="M18 10c-4 8-10 22-12 36h36c-2-14-8-28-12-36" />
      <path d="M20 10h8" />
    </svg>
  );
}

function SuitIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 64"
      className="h-14 w-11 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M16 8h16l6 12-8 4v32H18V24l-8-4 6-12z" />
      <path d="M24 8v16" />
      <path d="M18 24h12" />
    </svg>
  );
}

export function InvitationDressCode() {
  const { dressCode, assets } = weddingConfig;
  const allowedImage = assets.allowedPaletteImage;
  const forbiddenImage = assets.forbiddenPaletteImage;

  return (
    <section
      aria-label={dressCode.title}
      className="bg-cream px-6 py-16 sm:px-10 sm:py-20"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium text-accent sm:text-4xl">
          {dressCode.title}
        </h2>
        <p className="mt-3 text-xs font-semibold tracking-[0.24em] text-gold uppercase">
          {dressCode.subtitle}
        </p>
        {dressCode.description ? (
          <p className="mt-4 text-sm text-muted sm:text-base">
            {dressCode.description}
          </p>
        ) : null}

        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-8">
          <div className="flex flex-col items-center gap-4">
            <DressIcon />
            <h3 className="text-sm font-semibold tracking-[0.18em] text-accent uppercase">
              {dressCode.women.title}
            </h3>
            <p className="text-sm text-muted">{dressCode.women.guidance}</p>
            {dressCode.inspirationUrls.women ? (
              <a
                href={dressCode.inspirationUrls.women}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
              >
                {dressCode.inspirationLabel}
              </a>
            ) : (
              <span className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent/80 px-6 text-sm font-medium text-foreground">
                {dressCode.inspirationLabel}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-4">
            <SuitIcon />
            <h3 className="text-sm font-semibold tracking-[0.18em] text-accent uppercase">
              {dressCode.men.title}
            </h3>
            <p className="text-sm text-muted">{dressCode.men.guidance}</p>
            {dressCode.inspirationUrls.men ? (
              <a
                href={dressCode.inspirationUrls.men}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
              >
                {dressCode.inspirationLabel}
              </a>
            ) : (
              <span className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent/80 px-6 text-sm font-medium text-foreground">
                {dressCode.inspirationLabel}
              </span>
            )}
          </div>
        </div>

        <div className="mt-12 space-y-8">
          {allowedImage || dressCode.allowedPalette.length > 0 ? (
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                Paleta sugerida
              </p>
              {allowedImage ? (
                <div className="mx-auto mt-4 w-full max-w-lg">
                  <Image
                    src={allowedImage}
                    alt="Paleta de colores sugeridos para el código de vestimenta"
                    width={1228}
                    height={118}
                    className="h-auto w-full object-contain"
                    sizes="(max-width: 640px) 100vw, 32rem"
                  />
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {dressCode.allowedPalette.map((color) => (
                    <span
                      key={color}
                      className="size-8 rounded-full border border-foreground/10 shadow-sm sm:size-9"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {forbiddenImage || dressCode.forbiddenPalette.length > 0 ? (
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                No permitido
              </p>
              {forbiddenImage ? (
                <div className="mx-auto mt-4 w-full max-w-lg">
                  <Image
                    src={forbiddenImage}
                    alt="Paleta de colores no permitidos en el código de vestimenta"
                    width={1167}
                    height={81}
                    className="h-auto w-full object-contain"
                    sizes="(max-width: 640px) 100vw, 32rem"
                  />
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {dressCode.forbiddenPalette.map((color) => (
                    <span
                      key={color}
                      className="relative size-8 overflow-hidden rounded-full border border-foreground/15 sm:size-9"
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      <span
                        aria-hidden
                        className="absolute inset-0 flex items-center justify-center text-sm font-bold text-red-700/90"
                      >
                        ×
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
