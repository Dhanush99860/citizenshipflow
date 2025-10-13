import type { Question, AnswerMap } from "@/lib/eligibility/types";

export function questionsCorporate(_answers: AnswerMap): Question[] {
  return [
    {
      key: "company_type",
      prompt: "What best describes you?",
      type: "radio",
      options: [
        { label: "Startup/Founder", value: "startup" },
        { label: "SME", value: "sme" },
        { label: "Enterprise/HR", value: "enterprise" },
      ],
    },
    {
      key: "objective",
      prompt: "Main objective?",
      type: "radio",
      options: [
        { label: "Open an entity", value: "entity" },
        { label: "Sponsor visas / relocate staff", value: "sponsor" },
        { label: "Remote hub / EOR", value: "eor" },
      ],
    },
    {
      key: "jurisdiction",
      prompt: "Target jurisdictions",
      type: "radio",
      options: [
        { label: "UAE", value: "uae" },
        { label: "Singapore", value: "sg" },
        { label: "UK/EU", value: "ukeu" },
        { label: "North America", value: "na" },
      ],
    },
    {
      key: "headcount",
      prompt: "How many people to relocate?",
      type: "select",
      options: [
        { label: "1–5", value: "1-5" },
        { label: "6–20", value: "6-20" },
        { label: "20+", value: "20+" },
      ],
    },
  ];
}
