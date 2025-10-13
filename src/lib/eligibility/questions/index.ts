import type { AnswerMap, Question, Track } from "@/lib/eligibility/types";
import { questionsResidency } from "./residency";
import { questionsCitizenship } from "./citizenship";
import { questionsCorporate } from "./corporate";
import { questionsSkilled } from "./skilled";

export function getQuestionsForTrack(track: Track, answers: AnswerMap): Question[] {
  switch (track) {
    case "residency":
      return questionsResidency(answers);
    case "citizenship":
      return questionsCitizenship(answers);
    case "corporate":
      return questionsCorporate(answers);
    case "skilled":
      return questionsSkilled(answers);
  }
}
