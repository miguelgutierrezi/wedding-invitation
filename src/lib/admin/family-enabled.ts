export function nextFamilyStatusAfterEnabled(
    currentStatus: "pending" | "responded" | "disabled",
    isEnabled: boolean,
): "pending" | "responded" | "disabled" {
    if (!isEnabled) {
        return "disabled";
    }
    if (currentStatus === "disabled") {
        return "pending";
    }
    return currentStatus;
}
