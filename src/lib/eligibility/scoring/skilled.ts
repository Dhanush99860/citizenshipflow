import type { AnswerMap, Result } from "@/lib/eligibility/types";

export function scoreSkilled(answers: AnswerMap): Result {
  const age = Number(answers.age ?? 0);
  const edu = answers.education;
  const eng = answers.english;
  let score = 0;
  if (age >= 22 && age <= 35) score += 40;
  if (edu === "master" || edu === "phd") score += 30;
  if (eng === "advanced") score += 30;

  if (score >= 80) {
    return {
      tier: "Eligible",
      summary: "You meet key criteria for points-based pathways.",
      programs: [
        { name: "Canada Express Entry", why: "Strong age/education/language profile" },
        { name: "Australia Skilled Independent (189)", why: "Competitive points estimate" },
      ],
    };
  } else if (score >= 60) {
    return {
      tier: "Borderline",
      summary: "You’re close — language score or experience could improve eligibility.",
      programs: [
        { name: "Australia Skilled Nominated (190)", why: "Potential with improved points" },
        { name: "Canada Provincial Nominee", why: "Stronger with job offer or study" },
      ],
    };
  }
  return {
    tier: "Not Yet Eligible",
    summary: "Consider study-to-PR or employer-sponsored routes while building points.",
    programs: [
      { name: "Employer-Sponsored Visa", why: "Alternative when points are low" },
      { name: "Study → PR Pathways", why: "Build local credentials to qualify" },
    ],
  };
}
