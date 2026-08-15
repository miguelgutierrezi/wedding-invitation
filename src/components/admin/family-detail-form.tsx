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
import type { GuestGender } from "@/types/guest";

function attendanceStatusLabel(status: string): string {
  if (status === "attending") {
    return "asiste";
  }
  if (status === "not_attending") {
    return "no asiste";
  }
  return "pendiente";
}

type GuestFormRow = {
  id: string;
  name: string;
  gender: "" | GuestGender;
};

function familyFormStamp(family: AdminFamilyDetail): string {
  return [
    family.id,
    family.displayName,
    family.invitationSlug,
    String(family.maximumGuests),
    family.customMessage ?? "",
    family.isEnabled ? "1" : "0",
    family.guests
      .map((guest) => `${guest.id}:${guest.fullName}:${guest.gender ?? ""}`)
      .join(","),
  ].join("|");
}

function guestRowsFromFamily(
  family: AdminFamilyDetail,
  count: number,
): GuestFormRow[] {
  return Array.from({ length: count }, (_, index) => ({
    id: family.guests[index]?.id ?? "",
    name: family.guests[index]?.fullName ?? "",
    gender: family.guests[index]?.gender ?? "",
  }));
}

function resizeGuestRows(
  current: GuestFormRow[],
  nextCount: number,
): GuestFormRow[] {
  if (nextCount <= current.length) {
    return current.slice(0, nextCount);
  }

  return [
    ...current,
    ...Array.from({ length: nextCount - current.length }, () => ({
      id: "",
      name: "",
      gender: "" as const,
    })),
  ];
}

type FamilyDetailFormProps = {
  family: AdminFamilyDetail;
};

export function FamilyDetailForm({ family }: FamilyDetailFormProps) {
  return (
    <FamilyDetailFormInner key={familyFormStamp(family)} family={family} />
  );
}

function FamilyDetailFormInner({ family }: FamilyDetailFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(family.displayName);
  const [invitationSlug, setInvitationSlug] = useState(family.invitationSlug);
  const [maximumGuests, setMaximumGuests] = useState(family.maximumGuests);
  const [customMessage, setCustomMessage] = useState(
    family.customMessage ?? "",
  );
  const [isEnabled, setIsEnabled] = useState(family.isEnabled);
  const [guestRows, setGuestRows] = useState(() =>
    guestRowsFromFamily(family, Math.max(family.guests.length, 1)),
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
        <input
          type="hidden"
          name="isEnabled"
          value={isEnabled ? "true" : "false"}
        />

        <label className="grid gap-2">
          <span className={admin.label}>Nombre de la familia</span>
          <input
            name="displayName"
            required
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className={admin.input}
          />
        </label>

        <label className="grid gap-2">
          <span className={admin.label}>Slug de la URL (minúsculas)</span>
          <input
            name="invitationSlug"
            required
            value={invitationSlug}
            onChange={(event) => setInvitationSlug(event.target.value)}
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
            value={maximumGuests}
            onChange={(event) => {
              const value = Number(event.target.value) || 1;
              const nextCount = Math.min(30, Math.max(1, value));
              setMaximumGuests(value);
              setGuestRows((current) => resizeGuestRows(current, nextCount));
            }}
            className={admin.input}
          />
        </label>

        <label className="grid gap-2">
          <span className={admin.label}>Mensaje personalizado</span>
          <textarea
            name="customMessage"
            rows={3}
            value={customMessage}
            onChange={(event) => setCustomMessage(event.target.value)}
            className={admin.textarea}
          />
        </label>

        <label className="inline-flex min-h-11 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(event) => setIsEnabled(event.target.checked)}
            className="size-4 accent-[color:var(--accent-deep)]"
          />
          <span className={admin.body}>Invitación habilitada</span>
        </label>

        <fieldset className="space-y-3">
          <legend className={admin.label}>Invitados</legend>
          <p className={admin.muted}>
            El género define Querido/Querida cuando la invitación es para una sola
            persona.
          </p>
          {guestRows.map((row, index) => (
            <div
              key={row.id || `new-${index}`}
              className="grid gap-2 sm:grid-cols-[1fr_10rem] sm:items-end"
            >
              <input type="hidden" name="guestIds" value={row.id} />
              <label className="grid gap-2">
                <span className={admin.muted}>
                  Invitado {index + 1}
                  {family.guests[index]?.attendanceStatus
                    ? ` · ${attendanceStatusLabel(family.guests[index].attendanceStatus)}`
                    : ""}
                </span>
                <input
                  name="guestNames"
                  required
                  value={row.name}
                  onChange={(event) => {
                    const name = event.target.value;
                    setGuestRows((current) =>
                      current.map((guest, guestIndex) =>
                        guestIndex === index ? { ...guest, name } : guest,
                      ),
                    );
                  }}
                  className={admin.input}
                />
              </label>
              <label className="grid gap-2">
                <span className={admin.muted}>Género</span>
                <select
                  name="guestGenders"
                  required
                  value={row.gender}
                  onChange={(event) => {
                    const gender = event.target.value as GuestFormRow["gender"];
                    setGuestRows((current) =>
                      current.map((guest, guestIndex) =>
                        guestIndex === index ? { ...guest, gender } : guest,
                      ),
                    );
                  }}
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
              {family.guests[index]?.needsNameConfirmation ? (
                <p className={`sm:col-span-2 ${admin.muted}`}>
                  En el RSVP le pediremos el nombre real de esta persona.
                </p>
              ) : null}
            </div>
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
