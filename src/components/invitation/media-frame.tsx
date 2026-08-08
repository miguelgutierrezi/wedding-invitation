import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MediaFrameProps = {
  src?: string;
  alt: string;
  className?: string;
  overlayClassName?: string;
  children?: ReactNode;
  label?: string;
  /**
   * CSS background-position, or `false` to let a class control it responsively
   * (inline styles would override media-query utilities).
   */
  backgroundPosition?: string | false;
};

/** Encode each path segment so spaces and & work in CSS url("..."). */
function toCssBackgroundUrl(path: string): string {
  const encoded = path
    .split("/")
    .map((segment) => (segment === "" ? "" : encodeURIComponent(segment)))
    .join("/");
  return `url("${encoded}")`;
}

/**
 * Full-bleed media surface. Uses a CSS placeholder when no asset path is set.
 * Swap `src` under public/invitation once Canva exports land.
 */
export function MediaFrame({
  src,
  alt,
  className,
  overlayClassName,
  children,
  label = "Imagen pendiente",
  backgroundPosition = "center",
}: MediaFrameProps) {
  const hasSrc = Boolean(src);

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative overflow-hidden bg-photo-placeholder",
        !hasSrc && "media-placeholder",
        className,
      )}
      style={
        hasSrc && src
          ? {
              backgroundImage: toCssBackgroundUrl(src),
              backgroundSize: "cover",
              ...(backgroundPosition === false
                ? {}
                : { backgroundPosition }),
            }
          : undefined
      }
    >
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0", overlayClassName)}
      />
      {!hasSrc ? (
        <span className="pointer-events-none absolute right-3 bottom-3 z-10 rounded-full bg-black/35 px-3 py-1 text-[0.65rem] tracking-[0.14em] text-on-dark/80 uppercase">
          {label}
        </span>
      ) : null}
      {children}
    </div>
  );
}
