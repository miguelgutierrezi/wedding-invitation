/**
 * Branded HTML for the Supabase Auth “Invite user” email.
 * Paste `emails/admin-invite.html` into the hosted Auth email template.
 * The app still sends invites with `inviteUserByEmail`; this file is the
 * visual source of truth, not a Resend integration.
 */
export const adminInviteEmailSubject =
    "Invitación al panel · Nychol & Miguel";

/** Required Go placeholder in the hosted Supabase invite template. */
export const adminInviteEmailConfirmationUrlPlaceholder =
    "{{ .ConfirmationURL }}" as const;

export const adminInviteEmailBrand = {
    pageBg: "#f5f4eb",
    cardBorder: "#e4e3da",
    accent: "#b1b363",
    olive: "#454411",
    ink: "#2e2d17",
    muted: "#7a7969",
} as const;

export const adminInviteEmailCopy = {
    kicker: "ADMINISTRACIÓN",
    title: "Te invitamos a administrar nuestra celebración",
    cta: "Aceptar invitación",
    body: [
        "Recibiste acceso al panel de administración de la invitación de nuestra boda.",
        "Desde allí podrás consultar confirmaciones, invitados, transporte y fotos del evento.",
    ],
    disclaimer:
        "Al aceptar, crearás tu contraseña e iniciarás sesión en el panel. Si no esperabas este correo, puedes ignorarlo con seguridad.",
    signOff: "Con cariño,",
} as const;

const ADMIN_INVITE_EMAIL_RELATIVE_PATH = "emails/admin-invite.html";

export function adminInviteEmailTemplatePath(
    cwd: string = process.cwd(),
): string {
    return `${cwd.replace(/\/$/, "")}/${ADMIN_INVITE_EMAIL_RELATIVE_PATH}`;
}

export function missingAdminInviteEmailMarkers(html: string): string[] {
    const required = [
        adminInviteEmailConfirmationUrlPlaceholder,
        `href="${adminInviteEmailConfirmationUrlPlaceholder}"`,
        adminInviteEmailBrand.pageBg,
        adminInviteEmailBrand.accent,
        adminInviteEmailBrand.olive,
        adminInviteEmailBrand.ink,
        adminInviteEmailBrand.muted,
        adminInviteEmailCopy.kicker,
        adminInviteEmailCopy.title,
        adminInviteEmailCopy.cta,
        ...adminInviteEmailCopy.body,
        adminInviteEmailCopy.disclaimer,
        adminInviteEmailCopy.signOff,
    ];

    return required.filter((marker) => !html.includes(marker));
}
