"use client";

/**
 * Returns to the previous page (invitation body) when possible.
 */
export function InspirationBackButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          window.history.back();
          return;
        }
        window.location.assign("/");
      }}
      className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border-2 border-cover-cta-fg bg-cream-figma/80 px-5 py-2 font-[family-name:var(--font-timer)] text-base font-bold text-cover-cta-fg transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
    >
      Volver
    </button>
  );
}
