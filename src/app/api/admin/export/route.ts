import {NextResponse} from "next/server";

import {requireAdmin} from "@/lib/auth/require-admin";
import {fingerprintPublicId} from "@/lib/logging/fingerprint";
import {serverLog} from "@/lib/logging/server-log";
import {parseAdminBatchExportPayload} from "@/lib/validation/admin-batch";
import {parseAdminExportKind} from "@/services/admin/export-workbook-rows";
import {buildAdminExportWorkbook} from "@/services/admin/export-workbook";

export const dynamic = "force-dynamic";

function excelResponse(input: {
    buffer: Buffer;
    filename: string;
}): NextResponse {
    return new NextResponse(new Uint8Array(input.buffer), {
        status: 200,
        headers: {
            "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${input.filename}"`,
            "Cache-Control": "no-store",
        },
    });
}

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

        return excelResponse({buffer, filename});
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

export async function POST(request: Request): Promise<NextResponse> {
    const admin = await requireAdmin();

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({error: "Datos inválidos."}, {status: 400});
    }

    const parsed = parseAdminBatchExportPayload(body);
    if (!parsed.ok) {
        return NextResponse.json({error: parsed.error}, {status: 400});
    }

    try {
        const {buffer, filename, sheetCount, guestCount, familyCount} =
            await buildAdminExportWorkbook(parsed.kind, {
                familyIds: parsed.familyIds,
                guestIds: parsed.guestIds,
            });

        serverLog({
            event: "admin.export.xlsx",
            adminId: fingerprintPublicId(admin.id),
            kind: parsed.kind,
            sheetCount,
            guestCount,
            familyCount,
            scoped: true,
        });

        return excelResponse({buffer, filename});
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
