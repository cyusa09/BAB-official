import type { AssessmentInput } from "./recommendations";

export type AssessmentErrors = Partial<Record<keyof AssessmentInput, string>>;

export function validateAssessmentInput(input: AssessmentInput): AssessmentErrors {
  const errors: AssessmentErrors = {};
  if (input.location.trim().length < 2) errors.location = "Add a location with at least 2 characters.";
  if (!Number.isFinite(input.hectares) || input.hectares <= 0) errors.hectares = "Enter a land size greater than 0.";
  if (!input.terrain) errors.terrain = "Choose the terrain that best matches the parcel.";
  if (!input.soil) errors.soil = "Choose a soil condition to continue.";
  if (!input.infrastructure) errors.infrastructure = "Choose the available infrastructure access.";
  if (!input.budget) errors.budget = "Choose an investment level to continue.";
  if (!input.goal) errors.goal = "Choose the outcome you want from this land.";
  return errors;
}
