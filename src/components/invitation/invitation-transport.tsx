import { weddingConfig } from "@/config/wedding";

function BusIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 40"
      className="mx-auto h-10 w-16 text-on-dark"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="4" y="8" width="56" height="22" rx="4" />
      <path d="M12 8V6a2 2 0 0 1 2-2h36a2 2 0 0 1 2 2v2" />
      <path d="M4 22h56" />
      <circle cx="16" cy="32" r="3" />
      <circle cx="48" cy="32" r="3" />
      <path d="M18 14h10M36 14h10" />
    </svg>
  );
}

export function InvitationTransport() {
  const { transport } = weddingConfig;

  return (
    <section
      aria-label={transport.title}
      className="torn-edge torn-edge-top-cream torn-edge-bottom-cream bg-accent px-6 py-16 text-on-dark sm:px-10 sm:py-20"
    >
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-wide sm:text-4xl">
          {transport.title}
        </h2>
        <div className="mt-8">
          <BusIcon />
        </div>
        <p className="mt-6 text-sm leading-relaxed text-on-dark/90 sm:text-base">
          {transport.body}
        </p>
        <ul className="mt-8 space-y-4 text-left text-sm sm:text-base">
          {transport.meetingPoints.map((point) => (
            <li
              key={point.label}
              className="rounded-2xl border border-on-dark/15 bg-forest/15 px-4 py-3"
            >
              <p className="font-medium">{point.label}</p>
              <p className="mt-1 text-on-dark/80">{point.detail}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm font-medium tracking-wide text-gold-soft uppercase">
          {transport.returnNote}
        </p>
      </div>
    </section>
  );
}
