import { AdminMediaQrPanel } from "@/components/admin/admin-media-qr-panel";
import { AdminMediaTable } from "@/components/admin/admin-media-table";
import { AdminShell } from "@/components/admin/admin-shell";
import { admin } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  getAdminMediaStats,
  getPrimaryEventId,
  listAdminMediaUploads,
} from "@/services/admin/guest-media";
import { getAdminEventMediaQrAccess } from "@/services/media/qr-access";

function formatBytes(bytes: number): string {
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export default async function AdminPhotosPage() {
  // Gate before any privileged Storage/DB reads (do not rely only on AdminShell).
  await requireAdmin();

  const [stats, items, eventId] = await Promise.all([
    getAdminMediaStats(),
    listAdminMediaUploads(150),
    getPrimaryEventId(),
  ]);

  const qr = eventId ? await getAdminEventMediaQrAccess(eventId) : null;

  const cards = [
    { label: "Archivos", value: String(stats.totalFiles) },
    {
      label: "Espacio usado",
      value: formatBytes(stats.totalBytes),
    },
    { label: "Fotos", value: String(stats.imageCount) },
    { label: "Videos", value: String(stats.videoCount) },
    { label: "Completados", value: String(stats.uploadedCount) },
    {
      label: "En revisión",
      value: String(stats.pendingCount),
    },
    { label: "Fallidos", value: String(stats.failedCount) },
    {
      label: "Cuota Storage",
      value: `${stats.quotaUsedPercent}%`,
    },
  ] as const;

  return (
    <AdminShell title="Fotos y videos">
      <p className={admin.muted}>
        Moderación de fotos y videos de invitados. Las miniaturas usan enlaces
        temporales. Para descargar muchos archivos a la vez, usa las
        herramientas de Supabase descritas en la documentación del proyecto.
      </p>

      {stats.quotaAlert !== "none" ? (
        <p
          className="mt-4 rounded-xl border-2 border-cover-cta-fg/20 bg-accent/40 px-4 py-3 font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg"
          role="alert"
        >
          Alerta de cuota: uso estimado al {stats.quotaUsedPercent}% del
          presupuesto configurado (umbral {stats.quotaAlert}%).
        </p>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className={`${admin.card} px-5 py-4`}>
            <p className={admin.eyebrow}>{card.label}</p>
            <p className={`mt-2 ${admin.metricValue}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <p className={`mt-4 ${admin.muted}`}>
        Desde invitación: {stats.invitationSourceCount} · Desde código del
        evento: {stats.qrSourceCount} · Aprobados: {stats.approvedCount} ·
        Rechazados: {stats.rejectedCount}
      </p>

      {qr && eventId ? (
        <AdminMediaQrPanel
          eventId={eventId}
          isEnabled={qr.isEnabled}
          tokenPreview={qr.tokenPreview}
          opensAt={qr.opensAt}
          closesAt={qr.closesAt}
        />
      ) : null}

      <AdminMediaTable items={items} />
    </AdminShell>
  );
}
