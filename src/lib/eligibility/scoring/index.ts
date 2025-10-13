import type { AnswerMap, Result, Track } from "@/lib/eligibility/types";
import { scoreResidency } from "./residency";
import { scoreCitizenship } from "./citizenship";
import { scoreCorporate } from "./corporate";
import { scoreSkilled } from "./skilled";

export function scoreAssessment(track: Track, answers: AnswerMap): Result {
  switch (track) {
    case "residency":
      return scoreResidency(answers);
    case "citizenship":
      return scoreCitizenship(answers);
    case "corporate":
      return scoreCorporate(answers);
    case "skilled":
      return scoreSkilled(answers);
  }
}
