"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  regenerateInvitationAction,
  updateFamilyAction,
} from "@/actions/admin/auth";
import { admin } from "@/components/admin/admin-ui";
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
      <div className={`${admin.panel} space-y-3 p-5`}>
        <p className={admin.label}>Enlace de invitación</p>
        <p className={admin.muted}>
          Slug:{" "}
          <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-cover-cta-fg">
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

        <label className="grid gap-2">
          <span className={admin.label}>Nombre de la familia</span>
          <input
            name="displayName"
            required
            defaultValue={family.displayName}
            className={admin.input}
          />
        </label>

        <label className="grid gap-2">
          <span className={admin.label}>Slug de la URL (minúsculas)</span>
          <input
            name="invitationSlug"
            required
            defaultValue={family.invitationSlug}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            className={`${admin.input} font-mono text-sm`}
            placeholder="familia-gutierrez-panqueva"
          />
          <span className={admin.muted}>
            La invitación queda en /i/{family.invitationSlug}
          </span>
        </label>

        <label className="grid gap-2">
          <span className={admin.label}>Cupos máximos</span>
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
            className={admin.input}
          />
        </label>

        <label className="grid gap-2">
          <span className={admin.label}>Mensaje personalizado</span>
          <textarea
            name="customMessage"
            rows={3}
            defaultValue={family.customMessage ?? ""}
            className={admin.textarea}
          />
        </label>

        <label className="inline-flex min-h-11 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="isEnabled"
            value="true"
            defaultChecked={family.isEnabled}
            className="size-4 accent-[color:var(--accent-deep)]"
          />
          <span className={admin.body}>Invitación habilitada</span>
        </label>

        <fieldset className="space-y-3">
          <legend className={admin.label}>Invitados</legend>
          {Array.from({ length: guestCount }, (_, index) => (
            <label key={index} className="grid gap-2">
              <span className={admin.muted}>
                Invitado {index + 1}
                {family.guests[index]?.attendanceStatus
                  ? ` · ${family.guests[index].attendanceStatus}`
                  : ""}
              </span>
              <input
                name="guestNames"
                required
                defaultValue={family.guests[index]?.fullName ?? ""}
                className={admin.input}
              />
            </label>
          ))}
        </fieldset>

        {error ? (
          <p className={admin.error} role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className={admin.alertSuccess} role="status">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className={admin.btnPrimary}
        >
          {isPending ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>

      <div className="border-t-2 border-cover-cta-fg/15 pt-8">
        <h2 className="font-[family-name:var(--font-timer)] text-xl font-bold text-cover-cta-fg">
          Regenerar slug desde el nombre
        </h2>
        <p className={`mt-2 ${admin.muted}`}>
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
          className={`mt-4 ${admin.btnSecondary}`}
        >
          Regenerar slug
        </button>
      </div>
    </div>
  );
}
