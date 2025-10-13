import type { Question, AnswerMap } from "@/lib/eligibility/types";

export function questionsResidency(_answers: AnswerMap): Question[] {
  return [
    { key: "nationality", prompt: "What is your nationality?", type: "text" },
    {
      key: "target_region",
      prompt: "Preferred region?",
      type: "radio",
      options: [
        { label: "EU/Schengen", value: "eu" },
        { label: "Middle East", value: "me" },
        { label: "Caribbean", value: "caribbean" },
        { label: "Open to suggestions", value: "any" },
      ],
    },
    {
      key: "investment",
      prompt: "What is your investment capacity (USD)?",
      type: "select",
      options: [
        { label: "100k–250k", value: "100-250" },
        { label: "250k–500k", value: "250-500" },
        { label: "500k–1M", value: "500-1000" },
        { label: "1M+", value: "1000+" },
      ],
    },
    { key: "family", prompt: "Applying with spouse/children?", type: "yesno" },
    {
      key: "timeline",
      prompt: "What is your timeline?",
      type: "radio",
      options: [
        { label: "3–6 months", value: "3-6" },
        { label: "6–12 months", value: "6-12" },
        { label: "12–24 months", value: "12-24" },
      ],
    },
  ];
}
