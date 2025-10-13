import type { AnswerMap, Result } from "@/lib/eligibility/types";

export function scoreCitizenship(answers: AnswerMap): Result {
  if (answers.ancestry === true) {
    return {
      tier: "Eligible",
      summary: "You may qualify for citizenship by descent.",
      programs: [
        { name: "Italy by Descent", why: "Direct ancestry path" },
        { name: "Ireland by Descent", why: "Grandparent link potential" },
      ],
    };
  }
  if (
    answers.route === "cbi" &&
    (answers.investment === "500-1000" || answers.investment === "1000+")
  ) {
    return {
      tier: "Eligible",
      summary: "Your budget fits citizenship-by-investment options.",
      programs: [
        { name: "Malta (Exceptional Services)", why: "Meets capital thresholds" },
        { name: "Caribbean CBI", why: "Streamlined process; faster timeline" },
      ],
    };
  }
  return {
    tier: "Borderline",
    summary: "Descent or residency-first routes may suit you; speak with an advisor.",
    programs: [{ name: "Residency → Naturalization", why: "Path to citizenship over time" }],
  };
}
