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
        className="bg-cream px-6 py-14 text-center sm:px-10 sm:py-16"
      >
        <p className="font-[family-name:var(--font-display)] text-2xl text-accent sm:text-3xl">
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
      className="bg-cream px-6 py-14 sm:px-10 sm:py-16"
    >
      <div className="mx-auto max-w-xl text-center">
        <p className="font-[family-name:var(--font-display)] text-xl tracking-wide text-accent sm:text-2xl">
          Faltan
        </p>

        <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4">
          {units.map((unit, index) => (
            <div key={unit.label} className="relative">
              {index > 0 ? (
                <span
                  aria-hidden
                  className="absolute top-1/3 -left-1.5 hidden text-2xl text-gold sm:block"
                >
                  :
                </span>
              ) : null}
              <p className="font-[family-name:var(--font-display)] text-3xl font-medium tabular-nums text-foreground sm:text-4xl md:text-5xl">
                {unit.label === "Días" ? unit.value : pad(unit.value)}
              </p>
              <p className="mt-2 text-[0.65rem] font-medium tracking-[0.18em] text-muted uppercase sm:text-xs">
                {unit.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
