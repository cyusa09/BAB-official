import { describe, expect, it } from "vitest";
import { getAssessmentsByUser } from "./db";

describe("assessment persistence helpers", () => {
  it("returns a typed personal workspace collection for a user", async () => {
    const result = await getAssessmentsByUser(999999);
    expect(Array.isArray(result)).toBe(true);
  });
});
