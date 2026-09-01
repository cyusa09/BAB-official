import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("assessment persistence boundary", () => {
  it("requires an authenticated account before saving", async () => {
    const ctx: TrpcContext = {
      user: undefined,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    await expect(caller.assessment.save({ location: "Nakuru", hectares: 1, terrain: "flat", soil: "rich", infrastructure: "medium", budget: "standard", goal: "balanced", title: "Protected plan", recommendation: {} })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
