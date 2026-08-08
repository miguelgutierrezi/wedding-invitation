"use client";

import { useState, useTransition } from "react";

import { signInAdminAction } from "@/actions/admin/auth";

type AdminLoginFormProps = {
  nextPath: string;
  errorFromQuery: string | null;
};

export function AdminLoginForm({
  nextPath,
  errorFromQuery,
}: AdminLoginFormProps) {
  const [error, setError] = useState<string | null>(
    errorFromQuery === "forbidden"
      ? "Esta cuenta no está autorizada para administrar."
      : null,
  );
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-5"
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await signInAdminAction(formData);
          if (result && !result.ok) {
            setError(result.error);
          }
        });
      }}
    >
      <input type="hidden" name="next" value={nextPath} />

      <label className="grid gap-1.5 text-sm">
        <span className="text-muted">Correo</span>
        <input
          type="email"
          name="email"
          autoComplete="username"
          required
          className="min-h-11 rounded-xl border border-[color:var(--ring)] bg-white/80 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="text-muted">Contraseña</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          className="min-h-11 rounded-xl border border-[color:var(--ring)] bg-white/80 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </label>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-foreground transition-opacity disabled:opacity-60"
      >
        {isPending ? "Entrando…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
