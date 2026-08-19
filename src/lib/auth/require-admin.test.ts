import {afterEach, describe, expect, it, vi} from "vitest";

import {isEmailAllowed, requireAdmin} from "@/lib/auth/require-admin";
import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";

vi.mock("next/navigation", () => ({
    redirect: vi.fn((url: string) => {
        throw new Error(`REDIRECT:${url}`);
    }),
}));

vi.mock("@/lib/supabase/server", () => ({
    createClient: vi.fn(),
}));

describe("admin allowlist", () => {
    afterEach(() => {
        vi.clearAllMocks();
        delete process.env.ADMIN_EMAIL;
        delete process.env.ADMIN_EMAILS;
    });

    it("allows fixed admin emails", () => {
        expect(isEmailAllowed("migueangel97@hotmail.com")).toBe(true);
        expect(isEmailAllowed("nycholpg@gmail.com")).toBe(true);
    });

    it("rejects unknown emails", () => {
        expect(isEmailAllowed("random@example.com")).toBe(false);
    });

    it("requireAdmin redirects when unauthenticated", async () => {
        vi.mocked(createClient).mockResolvedValue({
            auth: {
                getUser: async () => ({data: {user: null}, error: null}),
            },
        } as never);

        await expect(requireAdmin()).rejects.toThrow("REDIRECT:/admin/login");
        expect(redirect).toHaveBeenCalled();
    });

    it("requireAdmin redirects forbidden for non-allowlisted user", async () => {
        vi.mocked(createClient).mockResolvedValue({
            auth: {
                getUser: async () => ({
                    data: {
                        user: {id: "u1", email: "intruder@example.com"},
                    },
                    error: null,
                }),
            },
        } as never);

        await expect(requireAdmin()).rejects.toThrow(
            "REDIRECT:/admin/login?error=forbidden",
        );
    });

    it("requireAdmin returns allowlisted user", async () => {
        vi.mocked(createClient).mockResolvedValue({
            auth: {
                getUser: async () => ({
                    data: {
                        user: {id: "u1", email: "migueangel97@hotmail.com"},
                    },
                    error: null,
                }),
            },
        } as never);

        await expect(requireAdmin()).resolves.toEqual({
            id: "u1",
            email: "migueangel97@hotmail.com",
        });
    });
});
