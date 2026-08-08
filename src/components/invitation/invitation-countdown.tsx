"use client";

import { useSyncExternalStore } from "react";

type InvitationCountdownProps = {
  targetDate: string;
};

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

function computeRemaining(targetDate: string, nowMs: number): Remaining {
  const targetMs = new Date(targetDate).getTime();
  const diff = targetMs - nowMs;

  if (Number.isNaN(targetMs) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isPast: false };
}

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function subscribeToSecondTicks(onStoreChange: () => void): () => void {
  const id = window.setInterval(onStoreChange, 1000);
  return () => window.clearInterval(id);
}

function getClientNow(): number {
  return Date.now();
}

/** Stable server snapshot; client hydrates with live clock via store. */
function getServerNow(): number {
  return new Date("2026-08-06T00:00:00.000Z").getTime();
}

/**
 * Full-bleed Canva-style timer: numbers fill nearly the width; title uses
 * Canva olive-gold (#beb950) and Times New Roman.
 */
export function InvitationCountdown({ targetDate }: InvitationCountdownProps) {
  const nowMs = useSyncExternalStore(
    subscribeToSecondTicks,
    getClientNow,
    getServerNow,
  );
  const remaining = computeRemaining(targetDate, nowMs);

  if (remaining.isPast) {
    return (
      <section
        aria-label="Cuenta regresiva"
        className="bg-cream px-4 py-20 text-center sm:px-6 sm:py-28"
      >
        <p className="font-[family-name:var(--font-timer)] text-[clamp(2rem,7vw,3rem)] leading-tight text-timer-title">
          ¡Llegó el gran día!
        </p>
      </section>
    );
  }

  const units = [
    { label: "Días", value: remaining.days },
    { label: "Horas", value: remaining.hours },
    { label: "Minutos", value: remaining.minutes },
    { label: "Segundos", value: remaining.seconds },
  ] as const;

  return (
    <section
      aria-label="Cuenta regresiva"
      className="bg-cream px-2 py-20 sm:px-4 sm:py-28 md:px-6 md:py-32"
    >
      {/* Near full width — only light side padding; mirrors Canva full-row timer */}
      <div className="mx-auto w-full max-w-[min(100%,48rem)] text-center sm:max-w-[min(100%,56rem)]">
        <p className="font-[family-name:var(--font-timer)] text-[clamp(1.75rem,6.5vw,2.75rem)] leading-none tracking-[0.08em] text-timer-title">
          Faltan
        </p>

        <div className="mt-10 grid w-full grid-cols-4 items-start gap-0 sm:mt-14">
          {units.map((unit, index) => (
            <div key={unit.label} className="relative min-w-0 w-full px-[1%] text-center">
              {index > 0 ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-[0.08em] left-0 -translate-x-1/2 font-[family-name:var(--font-timer)] text-[clamp(3.25rem,15vw,7rem)] leading-none text-timer-title/70"
                >
                  :
                </span>
              ) : null}
              <p className="font-[family-name:var(--font-timer)] text-[clamp(3.25rem,16vw,7rem)] leading-none font-normal tabular-nums tracking-tight text-foreground">
                {unit.label === "Días" ? unit.value : pad(unit.value)}
              </p>
              <p className="mt-4 font-[family-name:var(--font-timer)] text-[clamp(0.75rem,3vw,1.125rem)] leading-none font-normal tracking-[0.16em] text-muted uppercase sm:mt-5">
                {unit.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
