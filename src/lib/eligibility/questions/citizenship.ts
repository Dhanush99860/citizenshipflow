import type { Question, AnswerMap } from "@/lib/eligibility/types";

export function questionsCitizenship(_answers: AnswerMap): Question[] {
  return [
    {
      key: "route",
      prompt: "Which route interests you most?",
      type: "radio",
      options: [
        { label: "By Investment", value: "cbi" },
        { label: "By Descent (ancestry)", value: "descent" },
        { label: "Naturalization", value: "naturalization" },
      ],
    },
    {
      key: "ancestry",
      prompt: "Any parent/grandparent from EU/Italy/Ireland/Poland?",
      type: "yesno",
    },
    {
      key: "investment",
      prompt: "Investment capacity (USD)?",
      type: "select",
      options: [
        { label: "100k–250k", value: "100-250" },
        { label: "250k–500k", value: "250-500" },
        { label: "500k–1M", value: "500-1000" },
        { label: "1M+", value: "1000+" },
      ],
    },
    { key: "clean_record", prompt: "Do you have a clean background record?", type: "yesno" },
  ];
}
