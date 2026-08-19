export async function copyPlainText(value: string): Promise<boolean> {
    if (!value.trim()) {
        return false;
    }

    try {
        await navigator.clipboard.writeText(value);
        return true;
    } catch {
        return false;
    }
}

export async function downloadAdminExport(payload: {
    kind?: string;
    familyIds?: string[];
    guestIds?: string[];
}): Promise<{ok: true} | {ok: false; error: string}> {
    const response = await fetch("/api/admin/export", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        return {ok: false, error: "No se pudo descargar la lista."};
    }

    const blob = await response.blob();
    const header = response.headers.get("Content-Disposition") ?? "";
    const match = header.match(/filename="([^"]+)"/);
    const filename = match?.[1] ?? "lista.xlsx";
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
    return {ok: true};
}
