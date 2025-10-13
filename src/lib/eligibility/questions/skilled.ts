import type { Question, AnswerMap } from "@/lib/eligibility/types";

export function questionsSkilled(_answers: AnswerMap): Question[] {
  return [
    {
      key: "age",
      prompt: "What is your age?",
      type: "number",
      helper: "Age impacts most points-based systems.",
    },
    {
      key: "education",
      prompt: "Highest education level?",
      type: "radio",
      options: [
        { label: "Bachelor's", value: "bachelor" },
        { label: "Master's", value: "master" },
        { label: "PhD", value: "phd" },
        { label: "Other", value: "other" },
      ],
    },
    {
      key: "experience",
      prompt: "Years of skilled work experience",
      type: "select",
      options: [
        { label: "0–2", value: "0-2" },
        { label: "3–5", value: "3-5" },
        { label: "6–8", value: "6-8" },
        { label: "9+", value: "9+" },
      ],
    },
    {
      key: "english",
      prompt: "English proficiency",
      type: "radio",
      options: [
        { label: "Basic", value: "basic" },
        { label: "Good", value: "good" },
        { label: "Advanced (IELTS 7+)", value: "advanced" },
      ],
    },
    { key: "job_offer", prompt: "Do you have a job offer in your target country?", type: "yesno" },
  ];
}
