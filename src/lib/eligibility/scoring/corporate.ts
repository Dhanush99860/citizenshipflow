import type { AnswerMap, Result } from "@/lib/eligibility/types";

export function scoreCorporate(answers: AnswerMap): Result {
  if (answers.objective === "sponsor") {
    return {
      tier: "Eligible",
      summary: "Employer-sponsored/global mobility options available.",
      programs: [
        { name: "Intra-Company Transfer", why: "Relocate key staff efficiently" },
        { name: "UAE Golden Visa (Talent/Investor)", why: "Attractive for executives" },
      ],
    };
  }
  return {
    tier: "Borderline",
    summary: "Entity setup plus visa privileges may be required; let’s scope your needs.",
    programs: [{ name: "Entity + Employer Visa", why: "Combine setup with sponsorship" }],
  };
}
