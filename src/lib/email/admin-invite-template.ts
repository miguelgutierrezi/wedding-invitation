/**
 * Branded HTML for the Supabase Auth “Invite user” email.
 * Paste `emails/admin-invite.html` into the hosted Auth email template.
 * The app still sends invites with `inviteUserByEmail`; this file is the
 * visual source of truth, not a Resend integration.
 *
 * Palette matches Figma email-admin-invite (`80:40`) and admin chrome:
 * olive gradient header/footer, cream body, olive pill CTA with white text.
 */
export const adminInviteEmailSubject =
    "Invitación al panel · Nychol & Miguel";

/** Required Go placeholder in the hosted Supabase invite template. */
export const adminInviteEmailConfirmationUrlPlaceholder =
    "{{ .ConfirmationURL }}" as const;

export const adminInviteEmailBrand = {
    pageBg: "#f5f4eb",
    bodyBg: "#f5f3eb",
    cardBorder: "#e4e3da",
    olive: "#5f6446",
    oliveEnd: "#888f68",
    accent: "#beb950",
    ink: "#303026",
    muted: "#727263",
    wash: "#f0f2ea",
    ctaText: "#ffffff",
    headerGradient:
        "linear-gradient(10.5deg,#5f6446 25%,#888f68 75%)",
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
        "Al aceptar, podrás crear tu contraseña e iniciar sesión en el panel. Si no esperabas este correo, puedes ignorarlo con seguridad.",
    signOff: "Con cariño,",
} as const;

export const adminResetPasswordEmailSubject =
    "Restablecer contraseña · Nychol & Miguel";

/** Same Figma 80:40 chrome as invite; reset-specific title, body, and CTA. */
export const adminResetPasswordEmailCopy = {
    kicker: adminInviteEmailCopy.kicker,
    title: "Restablece tu contraseña del panel",
    cta: "Crear contraseña nueva",
    body: [
        "Recibimos una solicitud para crear una contraseña nueva para el panel de administración de la invitación.",
        "Si fuiste tú, continúa con el botón. Desde allí podrás volver a confirmaciones, invitados, transporte y fotos del evento.",
    ],
    disclaimer:
        "El enlace caduca en 24 horas. Si no esperabas este correo, puedes ignorarlo con seguridad.",
    signOff: adminInviteEmailCopy.signOff,
} as const;

const ADMIN_INVITE_EMAIL_RELATIVE_PATH = "emails/admin-invite.html";
const ADMIN_RESET_EMAIL_RELATIVE_PATH = "emails/admin-reset-password.html";

export function adminInviteEmailTemplatePath(
    cwd: string = process.cwd(),
): string {
    return `${cwd.replace(/\/$/, "")}/${ADMIN_INVITE_EMAIL_RELATIVE_PATH}`;
}

export function adminResetPasswordEmailTemplatePath(
    cwd: string = process.cwd(),
): string {
    return `${cwd.replace(/\/$/, "")}/${ADMIN_RESET_EMAIL_RELATIVE_PATH}`;
}

/** Shared chrome that Invite user and Reset password must keep in sync. */
export function missingAdminAuthEmailBrandMarkers(html: string): string[] {
    const required = [
        adminInviteEmailConfirmationUrlPlaceholder,
        `href="${adminInviteEmailConfirmationUrlPlaceholder}"`,
        adminInviteEmailBrand.pageBg,
        adminInviteEmailBrand.bodyBg,
        adminInviteEmailBrand.olive,
        adminInviteEmailBrand.oliveEnd,
        adminInviteEmailBrand.accent,
        adminInviteEmailBrand.ink,
        adminInviteEmailBrand.muted,
        adminInviteEmailBrand.wash,
        adminInviteEmailBrand.headerGradient,
        adminInviteEmailCopy.kicker,
        adminInviteEmailCopy.signOff,
    ];

    return required.filter((marker) => !html.includes(marker));
}

export function missingAdminInviteEmailMarkers(html: string): string[] {
    const required = [
        ...missingAdminAuthEmailBrandMarkers(html),
        adminInviteEmailBrand.ctaText,
        adminInviteEmailCopy.title,
        adminInviteEmailCopy.cta,
        ...adminInviteEmailCopy.body,
        adminInviteEmailCopy.disclaimer,
    ];

    return required.filter((marker) => !html.includes(marker));
}

export function missingAdminResetPasswordEmailMarkers(html: string): string[] {
    const required = [
        ...missingAdminAuthEmailBrandMarkers(html),
        adminInviteEmailBrand.ctaText,
        adminResetPasswordEmailCopy.title,
        adminResetPasswordEmailCopy.cta,
        ...adminResetPasswordEmailCopy.body,
        adminResetPasswordEmailCopy.disclaimer,
    ];

    return required.filter((marker) => !html.includes(marker));
}
