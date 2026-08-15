"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { submitRsvpAction } from "@/actions/rsvp/submit-rsvp";
import {
  isTransportBoardingPointId,
  type TransportBoardingPointId,
} from "@/config/transport";
import { weddingConfig } from "@/config/wedding";
import { cn } from "@/lib/utils";
import {
  submitRsvpSchema,
  type SubmitRsvpInput,
} from "@/lib/validation/rsvp";
import type {
  InvitationGuest,
  InvitationRsvp,
} from "@/services/invitations/get-invitation-by-token";

function toBoardingDefault(
  value: string | null | undefined,
): "" | TransportBoardingPointId {
  if (value && isTransportBoardingPointId(value)) {
    return value;
  }
  return "";
}

type RsvpFormProps = {
  slug: string;
  maximumGuests: number;
  guests: InvitationGuest[];
  existingRsvp: InvitationRsvp | null;
  canSubmitRsvp: boolean;
  closedReason: "closed" | "deadline" | null;
};

const labelClass =
  "font-[family-name:var(--font-timer)] text-[clamp(1rem,2vw,1.25rem)] leading-7 text-cover-cta-fg";

const fieldLabelClass = `${labelClass} font-bold`;

const inputClass =
  "min-h-11 w-full rounded-full border-2 border-cover-cta-fg/35 bg-white/80 px-4 font-[family-name:var(--font-timer)] text-[clamp(1rem,2vw,1.125rem)] text-cover-cta-fg outline-none transition-[border-color,box-shadow] placeholder:text-cover-cta-fg/45 focus-visible:border-cover-cta-fg focus-visible:ring-2 focus-visible:ring-accent";

const textareaClass =
  "w-full rounded-3xl border-2 border-cover-cta-fg/35 bg-white/80 px-4 py-3 font-[family-name:var(--font-timer)] text-[clamp(1rem,2vw,1.125rem)] text-cover-cta-fg outline-none transition-[border-color,box-shadow] placeholder:text-cover-cta-fg/45 focus-visible:border-cover-cta-fg focus-visible:ring-2 focus-visible:ring-accent";

const choiceClass =
  "inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-full border-2 border-cover-cta-fg/40 bg-white/50 px-5 py-2.5 font-[family-name:var(--font-timer)] text-[clamp(1rem,2vw,1.125rem)] text-cover-cta-fg transition-[background-color,border-color] has-[:checked]:border-cover-cta-fg has-[:checked]:bg-accent/35";

const sectionLegendClass =
  "font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.375rem)] leading-8 font-bold text-cover-cta-fg";

const statusBoxClass =
  "rounded-2xl border-2 border-cover-cta-fg/25 bg-white/50 px-4 py-3 font-[family-name:var(--font-timer)] text-[clamp(1rem,2vw,1.125rem)] leading-7 text-cover-cta-fg";

function buildDefaultValues(
  slug: string,
  guests: InvitationGuest[],
  existingRsvp: InvitationRsvp | null,
): SubmitRsvpInput {
  const existingByGuestId = new Map(
    existingRsvp?.guests.map((guest) => [guest.guestId, guest]) ?? [],
  );

  return {
    slug,
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
        needsTransport:
          existing?.needsTransport ?? guest.needsTransport ?? false,
        transportBoardingPoint: toBoardingDefault(
          existing?.transportBoardingPoint ?? guest.transportBoardingPoint,
        ),
        dietaryRestrictions:
          existing?.dietaryRestrictions ?? guest.dietaryRestrictions ?? "",
        menuOption: existing?.menuOption ?? guest.menuOption ?? "",
        fullName: guest.needsNameConfirmation ? "" : guest.fullName,
        needsNameConfirmation: guest.needsNameConfirmation,
      };
    }),
  };
}

export function RsvpForm({
  slug,
  maximumGuests,
  guests,
  existingRsvp,
  canSubmitRsvp,
  closedReason,
}: RsvpFormProps) {
  const router = useRouter();
  const { rsvp } = weddingConfig;
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const defaultValues = useMemo(
    () => buildDefaultValues(slug, guests, existingRsvp),
    [slug, guests, existingRsvp],
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

    const payload: SubmitRsvpInput = {
      ...values,
      guests: values.guests.map((guest, index) => ({
        ...guest,
        needsNameConfirmation: Boolean(guests[index]?.needsNameConfirmation),
        fullName: guests[index]?.needsNameConfirmation
          ? guest.fullName
          : guests[index]?.fullName ?? guest.fullName,
      })),
    };

    startTransition(async () => {
      const result = await submitRsvpAction(payload);

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
    <form
      onSubmit={onSubmit}
      className="space-y-8 font-[family-name:var(--font-timer)] text-cover-cta-fg"
      noValidate
    >
      <p className={`${labelClass} text-center text-cover-cta-fg/85`}>
        Cupos de esta invitación: {maximumGuests}. Puedes actualizar tu
        respuesta mientras el formulario esté abierto.
      </p>

      {closedMessage ? (
        <p className={statusBoxClass} role="status">
          {closedMessage}
        </p>
      ) : null}

      {existingRsvp ? (
        <p className={statusBoxClass} role="status">
          Ya registraron una respuesta
          {existingRsvp.willAttend
            ? ` con ${existingRsvp.confirmedGuestCount} asistente(s)`
            : " indicando que no podrán asistir"}
          .
        </p>
      ) : null}

      <fieldset className="space-y-4" disabled={!canSubmitRsvp || isPending}>
        <legend className={sectionLegendClass}>¿Podrán acompañarnos?</legend>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <label className={choiceClass}>
            <input
              type="radio"
              className="size-4 accent-[color:var(--accent-deep)]"
              checked={willAttend}
              onChange={() =>
                setValue("willAttend", true, { shouldDirty: true })
              }
            />
            <span>Sí, asistiremos</span>
          </label>
          <label className={choiceClass}>
            <input
              type="radio"
              className="size-4 accent-[color:var(--accent-deep)]"
              checked={!willAttend}
              onChange={() =>
                setValue("willAttend", false, { shouldDirty: true })
              }
            />
            <span>No podremos asistir</span>
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4" disabled={!canSubmitRsvp || isPending}>
        <legend className={sectionLegendClass}>Invitados</legend>
        {willAttend ? (
          <p className={`${labelClass} text-cover-cta-fg/85`}>
            Seleccionados: {attendingCount} / {maximumGuests}
          </p>
        ) : null}
        <div className="space-y-4">
          {fields.map((field, index) => {
            const guest = guests[index];

            return (
              <div
                key={field.id}
                className="rounded-3xl border-2 border-cover-cta-fg/20 bg-white/55 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className={`${labelClass} font-bold`}>
                      {guest?.fullName ?? `Invitado ${index + 1}`}
                    </p>
                    {guest?.isPrimaryContact ? (
                      <p className="mt-1 font-[family-name:var(--font-timer)] text-sm tracking-wide text-cover-cta-fg/70 uppercase">
                        Contacto principal
                      </p>
                    ) : null}
                    {guest?.needsNameConfirmation ? (
                      <p className="mt-1 font-[family-name:var(--font-timer)] text-sm leading-6 text-cover-cta-fg/80">
                        Por favor escribe el nombre de esta persona.
                      </p>
                    ) : null}
                  </div>
                  {willAttend ? (
                    <label className={choiceClass}>
                      <input
                        type="checkbox"
                        className="size-4 accent-[color:var(--accent-deep)]"
                        checked={Boolean(guestValues[index]?.willAttend)}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setValue(`guests.${index}.willAttend`, checked, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          if (!checked) {
                            setValue(`guests.${index}.needsTransport`, false, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            setValue(
                              `guests.${index}.transportBoardingPoint`,
                              "",
                              { shouldDirty: true, shouldValidate: true },
                            );
                          }
                        }}
                      />
                      <span>Asistirá</span>
                    </label>
                  ) : null}
                </div>

                <input
                  type="hidden"
                  {...register(`guests.${index}.guestId`)}
                />

                {guest?.needsNameConfirmation ? (
                  <label className="mt-4 grid gap-2">
                    <span className={fieldLabelClass}>Nombre completo</span>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      className={inputClass}
                      placeholder="Nombre y apellido"
                      {...register(`guests.${index}.fullName`)}
                    />
                    {errors.guests?.[index]?.fullName ? (
                      <p className="text-sm text-red-800" role="alert">
                        {errors.guests[index].fullName.message}
                      </p>
                    ) : null}
                  </label>
                ) : (
                  <input type="hidden" {...register(`guests.${index}.fullName`)} />
                )}

                {willAttend && guestValues[index]?.willAttend ? (
                  <div className="mt-4 grid gap-3">
                    <label className={choiceClass}>
                      <input
                        type="checkbox"
                        className="size-4 accent-[color:var(--accent-deep)]"
                        checked={Boolean(guestValues[index]?.needsTransport)}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setValue(
                            `guests.${index}.needsTransport`,
                            checked,
                            { shouldDirty: true, shouldValidate: true },
                          );
                          if (!checked) {
                            setValue(
                              `guests.${index}.transportBoardingPoint`,
                              "",
                              { shouldDirty: true, shouldValidate: true },
                            );
                          }
                        }}
                      />
                      <span>Usará el transporte (bus)</span>
                    </label>
                    {errors.guests?.[index]?.needsTransport ? (
                      <p className="text-sm text-red-800" role="alert">
                        {errors.guests[index].needsTransport.message}
                      </p>
                    ) : null}
                    {guestValues[index]?.needsTransport ? (
                      <fieldset className="space-y-3">
                        <legend className={fieldLabelClass}>
                          Punto de encuentro del bus
                        </legend>
                        <div className="grid gap-2">
                          {weddingConfig.transport.meetingPoints.map(
                            (point) => (
                              <label key={point.id} className={choiceClass}>
                                <input
                                  type="radio"
                                  className="size-4 accent-[color:var(--accent-deep)]"
                                  value={point.id}
                                  checked={
                                    guestValues[index]
                                      ?.transportBoardingPoint === point.id
                                  }
                                  onChange={() =>
                                    setValue(
                                      `guests.${index}.transportBoardingPoint`,
                                      point.id,
                                      {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      },
                                    )
                                  }
                                />
                                <span className="text-left">
                                  <span className="block font-bold">
                                    {point.title}
                                  </span>
                                  <span className="block text-[0.95em] text-cover-cta-fg/80">
                                    {point.place}
                                  </span>
                                </span>
                              </label>
                            ),
                          )}
                        </div>
                        {errors.guests?.[index]?.transportBoardingPoint ? (
                          <p className="text-sm text-red-800" role="alert">
                            {
                              errors.guests[index].transportBoardingPoint
                                .message
                            }
                          </p>
                        ) : null}
                      </fieldset>
                    ) : null}
                    <label className="grid gap-2">
                      <span className={fieldLabelClass}>
                        Restricciones alimentarias
                      </span>
                      <input
                        type="text"
                        className={inputClass}
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
          <p className="text-sm text-red-800" role="alert">
            {errors.guests.message ?? errors.guests.root?.message}
          </p>
        ) : null}
      </fieldset>

      <fieldset className="grid gap-4" disabled={!canSubmitRsvp || isPending}>
        <legend className={sectionLegendClass}>Contacto y mensaje</legend>
        <label className="grid gap-2">
          <span className={fieldLabelClass}>Correo (opcional)</span>
          <input
            type="email"
            autoComplete="email"
            className={inputClass}
            {...register("contactEmail")}
          />
          {errors.contactEmail ? (
            <span className="text-sm text-red-800">
              {errors.contactEmail.message}
            </span>
          ) : null}
        </label>
        <label className="grid gap-2">
          <span className={fieldLabelClass}>Teléfono</span>
          <input
            type="tel"
            autoComplete="tel"
            required
            aria-required="true"
            className={inputClass}
            {...register("contactPhone")}
          />
          {errors.contactPhone ? (
            <span className="text-sm text-red-800">
              {errors.contactPhone.message}
            </span>
          ) : null}
        </label>
        <label className="grid gap-2">
          <span className={fieldLabelClass}>Mensaje (opcional)</span>
          <textarea
            rows={4}
            className={textareaClass}
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
        <p className="text-center text-sm text-red-800" role="alert">
          {formError}
        </p>
      ) : null}

      {successMessage ? (
        <p
          className="text-center font-[family-name:var(--font-timer)] text-[clamp(1rem,2vw,1.25rem)] font-bold text-cover-cta-fg"
          role="status"
        >
          {successMessage}
        </p>
      ) : null}

      <div className="flex justify-center pt-2">
        <button
          type="submit"
          disabled={!canSubmitRsvp || isPending}
          className={cn(
            "inline-flex min-h-11 items-center justify-center rounded-full border-2 border-cover-cta-fg bg-accent px-8 py-4 font-[family-name:var(--font-timer)] text-[clamp(1.125rem,3vw,2rem)] leading-none text-cover-cta-fg transition-[transform,opacity] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none active:scale-[0.98] sm:min-h-14 sm:px-12 sm:py-6",
            (!canSubmitRsvp || isPending) && "cursor-not-allowed opacity-60",
          )}
        >
          {isPending
            ? "Guardando..."
            : existingRsvp
              ? rsvp.updateCtaLabel
              : rsvp.ctaLabel}
        </button>
      </div>
    </form>
  );
}
