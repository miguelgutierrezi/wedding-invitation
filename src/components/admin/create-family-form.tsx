"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createFamilyAction } from "@/actions/admin/auth";
import { admin } from "@/components/admin/admin-ui";
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
        <div className={admin.alertSuccess}>
          <p className="font-bold">Familia creada correctamente</p>
          <p className={`mt-1 ${admin.muted}`}>
            Copia el enlace para enviarlo por WhatsApp. Puedes verlo de nuevo en el
            detalle de la familia.
          </p>
        </div>
        <CopyInvitationLink url={invitationUrl} />
        <div className="flex flex-col gap-3 lg:flex-row">
          {familyId ? (
            <button
              type="button"
              onClick={() => router.push(`/admin/families/${familyId}`)}
              className={admin.btnPrimary}
            >
              Ver familia
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => router.push("/admin/families")}
            className={admin.btnSecondary}
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
      <label className="grid gap-2">
        <span className={admin.label}>Nombre de la familia</span>
        <input
          name="displayName"
          required
          className={admin.input}
          placeholder="Familia García"
        />
      </label>

      <label className="grid gap-2">
        <span className={admin.label}>Cupos máximos</span>
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
          className={admin.input}
        />
      </label>

      <label className="grid gap-2">
        <span className={admin.label}>Mensaje personalizado (opcional)</span>
        <textarea name="customMessage" rows={3} className={admin.textarea} />
      </label>

      <fieldset className="space-y-3">
        <legend className={admin.label}>Invitados</legend>
        <p className={admin.muted}>
          El primero se marca como contacto principal. Indica nombre y género
          (para el saludo si es una sola persona). No superes los cupos.
        </p>
        {Array.from({ length: guestCount }, (_, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_9rem] sm:items-end">
            <label className="grid gap-2">
              <span className={admin.muted}>
                Invitado {index + 1}
                {index === 0 ? " (contacto principal)" : ""}
              </span>
              <input name="guestNames" required className={admin.input} />
            </label>
            <label className="grid gap-2">
              <span className={admin.muted}>Género</span>
              <select
                name="guestGenders"
                required
                defaultValue=""
                className={admin.select}
              >
                <option value="" disabled>
                  Elegir
                </option>
                <option value="female">Mujer</option>
                <option value="male">Hombre</option>
                <option value="unspecified">Sin género</option>
              </select>
            </label>
          </div>
        ))}
      </fieldset>

      {error ? (
        <p className={admin.error} role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className={admin.btnPrimary}
      >
        {isPending ? "Creando…" : "Crear familia y generar enlace"}
      </button>
    </form>
  );
}
