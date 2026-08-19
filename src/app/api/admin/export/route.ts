import {NextResponse} from "next/server";

import {requireAdmin} from "@/lib/auth/require-admin";
import {fingerprintPublicId} from "@/lib/logging/fingerprint";
import {serverLog} from "@/lib/logging/server-log";
import {parseAdminExportKind} from "@/services/admin/export-workbook-rows";
import {buildAdminExportWorkbook} from "@/services/admin/export-workbook";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
    const admin = await requireAdmin();
    const kind = parseAdminExportKind(
        new URL(request.url).searchParams.get("kind"),
    );

    try {
        const {buffer, filename, sheetCount, guestCount, familyCount} =
            await buildAdminExportWorkbook(kind);

        serverLog({
            event: "admin.export.xlsx",
            adminId: fingerprintPublicId(admin.id),
            kind,
            sheetCount,
            guestCount,
            familyCount,
        });

        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        serverLog({
            event: "admin.export.xlsx_failed",
            level: "error",
            adminId: fingerprintPublicId(admin.id),
            reason: error instanceof Error ? error.message : "unknown",
        });

        return NextResponse.json(
            {error: "No se pudo generar el Excel."},
            {status: 500},
        );
    }
}
