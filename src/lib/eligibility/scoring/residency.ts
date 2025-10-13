import type { AnswerMap, Result } from "@/lib/eligibility/types";

export function scoreResidency(answers: AnswerMap): Result {
  const inv = String(answers.investment || "");
  if (inv === "1000+" || inv === "500-1000") {
    return {
      tier: "Eligible",
      summary: "Your investment range fits multiple residency-by-investment programs.",
      programs: [
        { name: "Portugal (Alt. routes)", why: "Capital/VC/Donation options" },
        { name: "Greece Property Route", why: "Budget aligns with thresholds" },
      ],
    };
  }
  return {
    tier: "Borderline",
    summary: "Higher investment widens program options; consider Caribbean or UAE routes.",
    programs: [{ name: "Caribbean Residency", why: "Lower thresholds and faster timelines" }],
  };
}
