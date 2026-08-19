import {beforeEach, describe, expect, it, vi} from "vitest";

import {setFamiliesEnabledBatchAction} from "@/actions/admin/families-batch";

const {requireAdmin, setFamiliesEnabled, revalidatePath} = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    setFamiliesEnabled: vi.fn(),
    revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth/require-admin", () => ({requireAdmin}));
vi.mock("@/services/admin/families", () => ({setFamiliesEnabled}));
vi.mock("next/cache", () => ({revalidatePath}));

const familyId = "11111111-1111-4111-8111-111111111111";

describe("setFamiliesEnabledBatchAction", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        requireAdmin.mockResolvedValue({id: "admin-1", email: "a@test.com"});
    });

    it("rejects an empty selection", async () => {
        const result = await setFamiliesEnabledBatchAction([], false);
        expect(result.ok).toBe(false);
        expect(setFamiliesEnabled).not.toHaveBeenCalled();
    });

    it("disables a validated list", async () => {
        setFamiliesEnabled.mockResolvedValue({updated: 1, missing: 0});
        const result = await setFamiliesEnabledBatchAction([familyId], false);
        expect(result).toEqual({ok: true, updated: 1, missing: 0});
        expect(setFamiliesEnabled).toHaveBeenCalledWith([familyId], false);
        expect(revalidatePath).toHaveBeenCalledWith("/admin/families");
    });
});
