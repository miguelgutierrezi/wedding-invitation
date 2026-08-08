"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  regenerateInvitationAction,
  updateFamilyAction,
} from "@/actions/admin/auth";
import { CopyInvitationLink } from "@/components/admin/copy-invitation-link";
import type { AdminFamilyDetail } from "@/services/admin/families";

type FamilyDetailFormProps = {
  family: AdminFamilyDetail;
};

export function FamilyDetailForm({ family }: FamilyDetailFormProps) {
  const router = useRouter();
  const [guestCount, setGuestCount] = useState(
    Math.max(family.guests.length, 1),
  );
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-10">
      <div className="space-y-3 rounded-2xl border border-accent/25 bg-cream p-5">
        <p className="text-sm font-medium text-accent">Enlace de invitación</p>
        <p className="text-sm text-muted">
          Slug:{" "}
          <code className="rounded bg-white/70 px-1.5 py-0.5">
            {family.invitationSlug}
          </code>
        </p>
        <CopyInvitationLink url={family.invitationUrl} />
      </div>

      <form
        className="space-y-6"
        action={(formData) => {
          setError(null);
          setMessage(null);
          startTransition(async () => {
            const result = await updateFamilyAction(formData);
            if (!result.ok) {
              setError(result.error);
              return;
            }
            setMessage(result.message ?? "Guardado.");
            router.refresh();
          });
        }}
      >
        <input type="hidden" name="familyId" value={family.id} />

        <label className="grid gap-1.5 text-sm">
          <span className="text-muted">Nombre de la familia</span>
          <input
            name="displayName"
            required
            defaultValue={family.displayName}
            className="min-h-11 rounded-xl border border-[color:var(--ring)] bg-white/80 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="text-muted">Slug de la URL (minúsculas)</span>
          <input
            name="invitationSlug"
            required
            defaultValue={family.invitationSlug}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            className="min-h-11 rounded-xl border border-[color:var(--ring)] bg-white/80 px-3 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
            placeholder="familia-gutierrez-panqueva"
          />
          <span className="text-xs text-muted">
            La invitación queda en /i/{family.invitationSlug}
          </span>
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="text-muted">Cupos máximos</span>
          <input
            type="number"
            name="maximumGuests"
            min={1}
            max={30}
            required
            defaultValue={family.maximumGuests}
            onChange={(event) => {
              const value = Number(event.target.value) || 1;
              setGuestCount(Math.min(30, Math.max(1, value)));
            }}
            className="min-h-11 rounded-xl border border-[color:var(--ring)] bg-white/80 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="text-muted">Mensaje personalizado</span>
          <textarea
            name="customMessage"
            rows={3}
            defaultValue={family.customMessage ?? ""}
            className="rounded-xl border border-[color:var(--ring)] bg-white/80 px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </label>

        <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="isEnabled"
            value="true"
            defaultChecked={family.isEnabled}
            className="size-4 accent-[color:var(--accent)]"
          />
          <span>Invitación habilitada</span>
        </label>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold tracking-wide text-accent uppercase">
            Invitados
          </legend>
          {Array.from({ length: guestCount }, (_, index) => (
            <label key={index} className="grid gap-1.5 text-sm">
              <span className="text-muted">
                Invitado {index + 1}
                {family.guests[index]?.attendanceStatus
                  ? ` · ${family.guests[index].attendanceStatus}`
                  : ""}
              </span>
              <input
                name="guestNames"
                required
                defaultValue={family.guests[index]?.fullName ?? ""}
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
        {message ? (
          <p className="text-sm text-accent" role="status">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-foreground disabled:opacity-60"
        >
          {isPending ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>

      <div className="border-t border-[color:var(--ring)] pt-8">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-accent">
          Regenerar slug desde el nombre
        </h2>
        <p className="mt-2 text-sm text-muted">
          Vuelve a generar el slug a partir del nombre de la familia (p. ej. Familia
          Gutiérrez Panqueva → familia-gutierrez-panqueva). El enlace anterior deja
          de funcionar.
        </p>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setError(null);
            setMessage(null);
            startTransition(async () => {
              const result = await regenerateInvitationAction(family.id);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              setMessage(result.message ?? null);
              router.refresh();
            });
          }}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-[color:var(--ring)] px-5 text-sm font-medium disabled:opacity-60"
        >
          Regenerar slug
        </button>
      </div>
    </div>
  );
}
