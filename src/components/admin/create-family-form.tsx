"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createFamilyAction } from "@/actions/admin/auth";
import { CopyInvitationLink } from "@/components/admin/copy-invitation-link";

export function CreateFamilyForm() {
  const router = useRouter();
  const [guestCount, setGuestCount] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (invitationUrl) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-accent/25 bg-cream px-5 py-4">
          <p className="text-sm font-medium text-accent">
            Familia creada correctamente
          </p>
          <p className="mt-1 text-sm text-muted">
            Copia el enlace para enviarlo por WhatsApp. Puedes verlo de nuevo en el
            detalle de la familia.
          </p>
        </div>
        <CopyInvitationLink url={invitationUrl} />
        <div className="flex flex-col gap-3 sm:flex-row">
          {familyId ? (
            <button
              type="button"
              onClick={() => router.push(`/admin/families/${familyId}`)}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-foreground"
            >
              Ver familia
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => router.push("/admin/families")}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[color:var(--ring)] px-5 text-sm font-medium"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="space-y-6"
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await createFamilyAction(formData);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setInvitationUrl(result.invitationUrl ?? null);
          setFamilyId(result.familyId ?? null);
        });
      }}
    >
      <label className="grid gap-1.5 text-sm">
        <span className="text-muted">Nombre de la familia</span>
        <input
          name="displayName"
          required
          className="min-h-11 rounded-xl border border-[color:var(--ring)] bg-white/80 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
          placeholder="Familia García"
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="text-muted">Cupos máximos</span>
        <input
          type="number"
          name="maximumGuests"
          min={1}
          max={30}
          required
          defaultValue={guestCount}
          onChange={(event) => {
            const value = Number(event.target.value) || 1;
            setGuestCount(Math.min(30, Math.max(1, value)));
          }}
          className="min-h-11 rounded-xl border border-[color:var(--ring)] bg-white/80 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="text-muted">Mensaje personalizado (opcional)</span>
        <textarea
          name="customMessage"
          rows={3}
          className="rounded-xl border border-[color:var(--ring)] bg-white/80 px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </label>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold tracking-wide text-accent uppercase">
          Invitados
        </legend>
        <p className="text-sm text-muted">
          El primero se marca como contacto principal. No superes los cupos.
        </p>
        {Array.from({ length: guestCount }, (_, index) => (
          <label key={index} className="grid gap-1.5 text-sm">
            <span className="text-muted">
              Invitado {index + 1}
              {index === 0 ? " (contacto)" : ""}
            </span>
            <input
              name="guestNames"
              required
              className="min-h-11 rounded-xl border border-[color:var(--ring)] bg-white/80 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
        ))}
      </fieldset>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-foreground disabled:opacity-60"
      >
        {isPending ? "Creando…" : "Crear familia y generar enlace"}
      </button>
    </form>
  );
}
