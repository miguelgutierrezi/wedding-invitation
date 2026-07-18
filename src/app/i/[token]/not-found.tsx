import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col justify-center px-6 py-16 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-medium text-foreground">
        Invitación no disponible
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted">
        No encontramos una invitación válida para este enlace. Si crees que es un
        error, contacta a los organizadores.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center justify-center self-center rounded-full bg-accent px-6 text-sm font-medium text-white"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
