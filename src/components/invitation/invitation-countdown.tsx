"use client";

import { Fragment, useSyncExternalStore } from "react";

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
 * Countdown band (Figma Desktop - 1): cream #F5F5DC, Times, “Faltan” in brand yellow.
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
        className="bg-cream-figma px-6 py-16 text-center sm:py-20"
      >
        <p className="font-[family-name:var(--font-timer)] text-[clamp(2rem,6vw,3.5rem)] leading-tight font-bold text-accent">
          ¡Llegó el gran día!
        </p>
      </section>
    );
  }

  const units = [
    { label: "DÍAS", value: String(remaining.days) },
    { label: "HORAS", value: pad(remaining.hours) },
    { label: "MINUTOS", value: pad(remaining.minutes) },
    { label: "SEGUNDOS", value: pad(remaining.seconds) },
  ] as const;

  return (
    <section
      aria-label="Cuenta regresiva"
      className="flex min-h-[17.6875rem] flex-col items-center justify-center bg-cream-figma px-4 py-6 sm:px-6"
    >
      <p className="font-[family-name:var(--font-timer)] text-[clamp(2rem,5vw,3.5rem)] leading-none font-bold text-accent">
        Faltan
      </p>

      <div
        className="mt-6 flex w-full min-w-0 max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-6 px-1 sm:mt-8 sm:gap-x-12"
        role="timer"
        aria-live="polite"
        aria-atomic="true"
      >
        {units.map((unit, index) => (
          <Fragment key={unit.label}>
            {index > 0 ? (
              <span
                aria-hidden
                className="hidden self-start font-[family-name:var(--font-timer)] text-[clamp(2.5rem,7vw,5rem)] leading-none text-countdown-number sm:inline"
              >
                :
              </span>
            ) : null}

            <div className="flex min-w-0 basis-[4.5rem] flex-col items-center gap-2 sm:basis-[5.5rem]">
              <p className="font-[family-name:var(--font-timer)] text-[clamp(2rem,7vw,5rem)] leading-none font-normal tabular-nums text-countdown-number">
                {unit.value}
              </p>
              <p className="font-[family-name:var(--font-timer)] text-[clamp(0.75rem,2vw,1.25rem)] leading-none font-normal tracking-[0.02em] text-countdown-number">
                {unit.label}
              </p>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
