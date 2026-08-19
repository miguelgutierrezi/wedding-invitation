import "server-only";

import ExcelJS from "exceljs";

import {getAnalyticsSnapshot, listAllGuests,} from "@/services/admin/analytics";
import {listFamilies} from "@/services/admin/families";
import {
    type AdminExportKind,
    buildExportSheetsForKind,
    exportFilenameForKind,
    type ExportSheet,
} from "@/services/admin/export-workbook-rows";
import {filterActiveFamilies} from "@/lib/admin/active-invitation";
import {EVENT_TIMEZONE} from "@/lib/datetime/event-timezone";

const HEADER_FILL: ExcelJS.Fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {argb: "FFBEB950"},
};

function applySheet(workbook: ExcelJS.Workbook, sheet: ExportSheet): void {
    const worksheet = workbook.addWorksheet(sheet.name, {
        views: [{state: "frozen", ySplit: 1}],
    });

    worksheet.columns = sheet.headers.map((header) => ({
        header,
        width: Math.min(42, Math.max(14, header.length + 4)),
    }));

    const headerRow = worksheet.getRow(1);
    headerRow.font = {bold: true, color: {argb: "FF3D3A2E"}};
    headerRow.fill = HEADER_FILL;
    headerRow.alignment = {vertical: "middle"};

    for (const row of sheet.rows) {
        worksheet.addRow(row);
    }

    // Widen columns from content (cap for long URLs).
    worksheet.columns.forEach((column, index) => {
        const header = sheet.headers[index] ?? "";
        let max = header.length;
        for (const row of sheet.rows) {
            const cell = row[index] ?? "";
            max = Math.max(max, Math.min(cell.length, 48));
        }
        column.width = Math.min(48, Math.max(12, max + 2));
    });
}

export async function buildAdminExportWorkbook(
    kind: AdminExportKind = "full",
): Promise<{
    buffer: Buffer;
    filename: string;
    sheetCount: number;
    guestCount: number;
    familyCount: number;
}> {
    const [guests, families, snapshot] = await Promise.all([
        listAllGuests(),
        listFamilies(),
        getAnalyticsSnapshot(),
    ]);

    const activeFamilies = filterActiveFamilies(families);
    const sheets = buildExportSheetsForKind(kind, {
        guests,
        families: activeFamilies,
        snapshot,
    });
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Wedding invitation admin";
    workbook.created = new Date();

    for (const sheet of sheets) {
        applySheet(workbook, sheet);
    }

    const raw = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.from(raw);

    const dateStamp = new Intl.DateTimeFormat("en-CA", {
        timeZone: EVENT_TIMEZONE,
    }).format(new Date());

    return {
        buffer,
        filename: exportFilenameForKind(kind, dateStamp),
        sheetCount: sheets.length,
        guestCount: guests.length,
        familyCount: activeFamilies.length,
    };
}
