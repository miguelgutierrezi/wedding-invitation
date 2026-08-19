import { weddingConfig } from "@/config/wedding";

const PLACEHOLDERS = {
  family: "{familia}",
  link: "{enlace}",
  couple: "{pareja}",
} as const;

export function formatWhatsAppReminderMessage(input: {
  familyName: string;
  invitationUrl: string;
}): string {
  const couple = `${weddingConfig.couple.partnerOne} y ${weddingConfig.couple.partnerTwo}`;

  return weddingConfig.admin.whatsappReminderTemplate
    .replaceAll(PLACEHOLDERS.family, input.familyName.trim())
    .replaceAll(PLACEHOLDERS.link, input.invitationUrl.trim())
    .replaceAll(PLACEHOLDERS.couple, couple)
    .trim();
}
