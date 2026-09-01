export type AssessmentInput = {
  location: string;
  parcelIdentity?: string;
  hectares: number;
  terrain: "flat" | "rolling" | "steep";
  soil: "rich" | "mixed" | "sandy" | "clay";
  infrastructure: "high" | "medium" | "low";
  budget: "premium" | "standard" | "lean";
  goal: "balanced" | "development" | "agriculture";
  ownership?: "owned" | "leased" | "shared" | "planning";
  currentUse?: "unused" | "crops" | "grazing" | "residential";
  waterAccess?: "reliable" | "seasonal" | "none";
  powerAccess?: "connected" | "nearby" | "none";
  roadAccess?: "paved" | "unpaved" | "none";
  targetTimeline?: "now" | "one-year" | "exploring";
  notes?: string;
};

export type Recommendation = {
  type: "development" | "agriculture";
  confidence: number;
  headline: string;
  summary: string;
  factors: string[];
  disclaimer: string;
  development?: {
    scale: string;
    timeline: string;
    totalCost: string;
    costBreakdown: { label: string; value: string; share: number }[];
  };
  agriculture?: {
    crops: { name: string; fit: string; duration: string; detail: string; color: string }[];
    considerations: string[];
  };
};

export function buildRecommendation(input: AssessmentInput): Recommendation {
  let developmentScore = input.goal === "development" ? 4 : input.goal === "agriculture" ? 0 : 2;
  developmentScore += input.infrastructure === "high" ? 3 : input.infrastructure === "medium" ? 1 : -1;
  developmentScore += input.terrain === "flat" ? 2 : input.terrain === "steep" ? -2 : 0;
  developmentScore += input.budget === "premium" ? 1 : input.budget === "lean" ? -1 : 0;
  developmentScore += input.hectares >= 20 ? 1 : 0;

  const isDevelopment = developmentScore >= 6;
  const confidence = Math.min(94, Math.max(68, 70 + Math.abs(developmentScore - 5) * 4));
  const baseFactors = [
    input.infrastructure === "high" ? "Strong infrastructure access reduces setup friction." : input.infrastructure === "medium" ? "Existing infrastructure is workable with phased investment." : "Limited infrastructure favors a lower-complexity first phase.",
    input.terrain === "flat" ? "Flat terrain supports efficient site preparation." : input.terrain === "rolling" ? "Rolling terrain supports a mixed, carefully zoned plan." : "Steeper terrain increases earthworks and erosion-management needs.",
  ];

  if (isDevelopment) {
    const scale = input.hectares >= 30 && input.budget === "premium" ? "Low-rise residential compound" : input.hectares >= 10 ? "Small multi-home cluster" : "Efficient single-family homestead";
    const timeline = input.infrastructure === "high" ? "10–16 months" : input.infrastructure === "medium" ? "14–22 months" : "18–28 months";
    const totalCost = input.budget === "premium" ? "$420k–$680k" : input.budget === "standard" ? "$220k–$390k" : "$95k–$180k";
    return { type: "development", confidence, headline: "Development has the stronger first move", summary: `A ${scale.toLowerCase()} fits the parcel profile while keeping the plan phased and financeable.`, factors: [...baseFactors, "The stated goal and available budget support built infrastructure.", `${input.hectares} hectares leaves room for access, services, and future expansion.`], disclaimer: "BuildABlock provides informational planning guidance, not a survey, permit, valuation, engineering opinion, or financial guarantee. Confirm every decision with qualified local professionals.", development: { scale, timeline, totalCost, costBreakdown: [{ label: "Core construction", value: input.budget === "premium" ? "$270k–$430k" : "$125k–$250k", share: 58 }, { label: "Site preparation", value: "$35k–$95k", share: 20 }, { label: "Utilities & access", value: "$25k–$75k", share: 15 }, { label: "Contingency", value: "$15k–$40k", share: 7 }] } };
  }

  const crops = input.soil === "rich" ? [
    { name: "Maize", fit: "92% fit", duration: "3–4 months", detail: "Reliable staple with strong market familiarity; rotate with legumes.", color: "#d6a631" },
    { name: "Beans", fit: "88% fit", duration: "2–3 months", detail: "Adds nitrogen value and creates a practical rotation partner.", color: "#9a6a43" },
    { name: "Vegetables", fit: "81% fit", duration: "1–3 months", detail: "High-value option near reliable water and nearby markets.", color: "#6e9f65" },
  ] : input.soil === "sandy" ? [
    { name: "Groundnuts", fit: "90% fit", duration: "3–4 months", detail: "Performs well in lighter soils with good drainage.", color: "#c8864e" },
    { name: "Sorghum", fit: "84% fit", duration: "4–5 months", detail: "More resilient in dry conditions and useful for rotation.", color: "#bb6a47" },
    { name: "Cowpeas", fit: "80% fit", duration: "2–3 months", detail: "A hardy legume with soil-improvement benefits.", color: "#86a65e" },
  ] : [
    { name: "Sorghum", fit: "86% fit", duration: "4–5 months", detail: "Resilient staple suited to variable soil and rainfall patterns.", color: "#bb6a47" },
    { name: "Beans", fit: "82% fit", duration: "2–3 months", detail: "Flexible rotation crop; improve drainage on heavier soil.", color: "#9a6a43" },
    { name: "Sweet potatoes", fit: "78% fit", duration: "4–5 months", detail: "Good food-security crop with manageable field operations.", color: "#d47e50" },
  ];
  return { type: "agriculture", confidence, headline: "Agriculture is the stronger first move", summary: "A phased crop plan can begin producing value while preserving flexibility for future infrastructure.", factors: [...baseFactors, "The land profile supports a lower-capital, staged start.", "Crop diversification balances dependable staples with higher-value opportunities."], disclaimer: "BuildABlock provides informational planning guidance, not agronomic, legal, environmental, or financial advice. Confirm crop choices, water needs, and market assumptions with qualified local professionals.", agriculture: { crops, considerations: ["Test soil nutrients and pH before committing to large acreage.", "Confirm year-round water access and a route to market.", "Start with a pilot block, measure yield, then scale the best performers."] } };
}
