import { describe, expect, it } from "vitest";
import { validateAssessmentInput } from "./assessmentValidation";
import type { AssessmentInput } from "./recommendations";

const completeInput: AssessmentInput = {
  location: "Kigali, Rwanda",
  hectares: 50,
  terrain: "flat",
  soil: "rich",
  infrastructure: "medium",
  budget: "standard",
  goal: "balanced",
};

describe("validateAssessmentInput", () => {
  it("reports clear errors for missing parcel details and required choices", () => {
    const errors = validateAssessmentInput({
      ...completeInput,
      location: " ",
      hectares: 0,
      terrain: "",
      soil: "",
      infrastructure: "",
      budget: "",
      goal: "",
    });

    expect(Object.keys(errors)).toEqual([
      "location",
      "hectares",
      "terrain",
      "soil",
      "infrastructure",
      "budget",
      "goal",
    ]);
  });

  it("accepts a complete assessment", () => {
    expect(validateAssessmentInput(completeInput)).toEqual({});
  });
});
