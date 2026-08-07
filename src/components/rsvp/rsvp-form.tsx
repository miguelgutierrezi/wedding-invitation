"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { submitRsvpAction } from "@/actions/rsvp/submit-rsvp";
import { cn } from "@/lib/utils";
import {
  submitRsvpSchema,
  type SubmitRsvpInput,
} from "@/lib/validation/rsvp";
import type {
  InvitationGuest,
  InvitationRsvp,
} from "@/services/invitations/get-invitation-by-token";

type RsvpFormProps = {
  token: string;
  maximumGuests: number;
  guests: InvitationGuest[];
  existingRsvp: InvitationRsvp | null;
  canSubmitRsvp: boolean;
  closedReason: "closed" | "deadline" | null;
};

function buildDefaultValues(
  token: string,
  guests: InvitationGuest[],
  existingRsvp: InvitationRsvp | null,
): SubmitRsvpInput {
  const existingByGuestId = new Map(
    existingRsvp?.guests.map((guest) => [guest.guestId, guest]) ?? [],
  );

  return {
    token,
    willAttend: existingRsvp?.willAttend ?? true,
    contactEmail: existingRsvp?.contactEmail ?? "",
    contactPhone: existingRsvp?.contactPhone ?? "",
    message: existingRsvp?.message ?? "",
    website: "",
    guests: guests.map((guest) => {
      const existing = existingByGuestId.get(guest.id);

      return {
        guestId: guest.id,
        willAttend:
          existing?.willAttend ?? guest.attendanceStatus === "attending",
        dietaryRestrictions:
          existing?.dietaryRestrictions ?? guest.dietaryRestrictions ?? "",
        menuOption: existing?.menuOption ?? guest.menuOption ?? "",
      };
    }),
  };
}

export function RsvpForm({
  token,
  maximumGuests,
  guests,
  existingRsvp,
  canSubmitRsvp,
  closedReason,
}: RsvpFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const defaultValues = useMemo(
    () => buildDefaultValues(token, guests, existingRsvp),
    [token, guests, existingRsvp],
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubmitRsvpInput>({
    resolver: zodResolver(submitRsvpSchema),
    defaultValues,
  });

  const { fields } = useFieldArray({
    control,
    name: "guests",
  });

  const willAttend = useWatch({ control, name: "willAttend" });
  const guestValues = useWatch({ control, name: "guests" }) ?? [];
  const attendingCount = guestValues.filter((guest) => guest.willAttend).length;

  const closedMessage =
    closedReason === "deadline"
      ? "La fecha límite para confirmar ya pasó."
      : closedReason === "closed"
        ? "Las confirmaciones están cerradas por ahora."
        : null;

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await submitRsvpAction(values);

      if (!result.ok) {
        setFormError(result.error);
        return;
      }

      setSuccessMessage(
        result.action === "rsvp_updated"
          ? "Actualizamos tu confirmación. Gracias."
          : "Recibimos tu confirmación. Gracias.",
      );
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <div className="space-y-3">
        <p className="text-sm text-muted">
          Cupos reservados: {maximumGuests}. Puedes actualizar tu respuesta
          mientras el RSVP esté abierto.
        </p>
      </div>

      {closedMessage ? (
        <p
          className="rounded-xl border border-[color:var(--ring)] bg-[rgba(31,42,36,0.04)] px-4 py-3 text-sm text-muted"
          role="status"
        >
          {closedMessage}
        </p>
      ) : null}

      {existingRsvp ? (
        <p className="rounded-xl border border-[color:var(--ring)] bg-surface px-4 py-3 text-sm text-foreground">
          Ya registraron una respuesta
          {existingRsvp.willAttend
            ? ` con ${existingRsvp.confirmedGuestCount} asistente(s)`
            : " indicando que no podrán asistir"}
          .
        </p>
      ) : null}

      <fieldset className="space-y-3" disabled={!canSubmitRsvp || isPending}>
        <legend className="text-sm font-semibold tracking-wide text-accent uppercase">
          ¿Podrán acompañarnos?
        </legend>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-full border border-[color:var(--ring)] px-4 py-2">
            <input
              type="radio"
              className="size-4 accent-[color:var(--accent)]"
              checked={willAttend}
              onChange={() => setValue("willAttend", true, { shouldDirty: true })}
            />
            <span className="text-sm font-medium">Sí, asistiremos</span>
          </label>
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-full border border-[color:var(--ring)] px-4 py-2">
            <input
              type="radio"
              className="size-4 accent-[color:var(--accent)]"
              checked={!willAttend}
              onChange={() =>
                setValue("willAttend", false, { shouldDirty: true })
              }
            />
            <span className="text-sm font-medium">No podremos asistir</span>
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4" disabled={!canSubmitRsvp || isPending}>
        <legend className="text-sm font-semibold tracking-wide text-accent uppercase">
          Invitados
        </legend>
        {willAttend ? (
          <p className="text-sm text-muted">
            Seleccionados: {attendingCount} / {maximumGuests}
          </p>
        ) : null}
        <div className="space-y-4">
          {fields.map((field, index) => {
            const guest = guests[index];

            return (
              <div
                key={field.id}
                className="rounded-2xl border border-[color:var(--ring)] bg-surface p-4 sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {guest?.fullName ?? `Invitado ${index + 1}`}
                    </p>
                    {guest?.isPrimaryContact ? (
                      <p className="text-xs tracking-wide text-muted uppercase">
                        Contacto principal
                      </p>
                    ) : null}
                  </div>
                  {willAttend ? (
                    <label className="inline-flex min-h-11 cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        className="size-4 accent-[color:var(--accent)]"
                        checked={Boolean(guestValues[index]?.willAttend)}
                        onChange={(event) =>
                          setValue(
                            `guests.${index}.willAttend`,
                            event.target.checked,
                            { shouldDirty: true, shouldValidate: true },
                          )
                        }
                      />
                      <span className="text-sm">Asistirá</span>
                    </label>
                  ) : null}
                </div>

                <input
                  type="hidden"
                  {...register(`guests.${index}.guestId`)}
                />

                {willAttend ? (
                  <div className="mt-4 grid gap-3">
                    <label className="grid gap-1.5 text-sm">
                      <span className="text-muted">
                        Restricciones alimentarias
                      </span>
                      <input
                        type="text"
                        className="min-h-11 rounded-xl border border-[color:var(--ring)] bg-white/70 px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        placeholder="Opcional"
                        {...register(`guests.${index}.dietaryRestrictions`)}
                      />
                    </label>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        {errors.guests?.message || errors.guests?.root?.message ? (
          <p className="text-sm text-red-700" role="alert">
            {errors.guests.message ?? errors.guests.root?.message}
          </p>
        ) : null}
      </fieldset>

      <fieldset className="grid gap-4" disabled={!canSubmitRsvp || isPending}>
        <legend className="text-sm font-semibold tracking-wide text-accent uppercase">
          Contacto y mensaje
        </legend>
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted">Correo (opcional)</span>
          <input
            type="email"
            autoComplete="email"
            className="min-h-11 rounded-xl border border-[color:var(--ring)] bg-white/70 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
            {...register("contactEmail")}
          />
          {errors.contactEmail ? (
            <span className="text-red-700">{errors.contactEmail.message}</span>
          ) : null}
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted">Teléfono (opcional)</span>
          <input
            type="tel"
            autoComplete="tel"
            className="min-h-11 rounded-xl border border-[color:var(--ring)] bg-white/70 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
            {...register("contactPhone")}
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted">Mensaje (opcional)</span>
          <textarea
            rows={4}
            className="rounded-xl border border-[color:var(--ring)] bg-white/70 px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
            {...register("message")}
          />
        </label>
      </fieldset>

      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </label>
      </div>

      {formError ? (
        <p className="text-sm text-red-700" role="alert">
          {formError}
        </p>
      ) : null}

      {successMessage ? (
        <p className="text-sm text-accent" role="status">
          {successMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmitRsvp || isPending}
        className={cn(
          "inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium tracking-wide text-white transition-opacity",
          (!canSubmitRsvp || isPending) && "cursor-not-allowed opacity-60",
        )}
      >
        {isPending
          ? "Guardando..."
          : existingRsvp
            ? "Actualizar confirmación"
            : "Enviar confirmación"}
      </button>
    </form>
  );
}
