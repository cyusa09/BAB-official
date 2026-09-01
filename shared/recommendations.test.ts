import { describe, expect, it } from "vitest";
import { buildRecommendation } from "./recommendations";

describe("BuildABlock recommendation engine", () => {
  it("recommends development for connected, flat premium parcels", () => {
    const result = buildRecommendation({ location: "Nakuru", hectares: 50, terrain: "flat", soil: "mixed", infrastructure: "high", budget: "premium", goal: "balanced" });
    expect(result.type).toBe("development");
    expect(result.development?.scale).toContain("Low-rise");
    expect(result.development?.costBreakdown.length).toBeGreaterThan(2);
    expect(result.disclaimer).toContain("informational");
  });

  it("recommends agriculture for a lean, off-grid parcel and ranks crops", () => {
    const result = buildRecommendation({ location: "Kitui", hectares: 18, terrain: "rolling", soil: "sandy", infrastructure: "low", budget: "lean", goal: "agriculture" });
    expect(result.type).toBe("agriculture");
    expect(result.agriculture?.crops).toHaveLength(3);
    expect(result.agriculture?.crops[0]?.name).toBe("Groundnuts");
    expect(result.agriculture?.considerations.length).toBeGreaterThan(1);
  });
});
