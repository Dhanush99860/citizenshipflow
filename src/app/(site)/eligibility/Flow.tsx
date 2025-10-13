"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { CategoryTile } from "@/components/Eligibility/CategoryTile";
import { QuestionCard } from "@/components/Eligibility/QuestionCard";
import { ProgressBar } from "@/components/Eligibility/ProgressBar";
import { LeadGate } from "@/components/Eligibility/LeadGate";
import { ResultCard } from "@/components/Eligibility/ResultCard";
import { getQuestionsForTrack } from "@/lib/eligibility/questions";
import { scoreAssessment } from "@/lib/eligibility/scoring";
import type { Track, AnswerMap } from "@/lib/eligibility/types";
import { trackEvent } from "@/lib/eligibility/analytics";

type Stage = "select" | "quiz" | "lead" | "result";

const STORAGE_KEY = "eligibility_flow_v1";

const TRACK_LABEL: Record<Track, string> = {
  residency: "Residency",
  citizenship: "Citizenship",
  corporate: "Corporate",
  skilled: "Skilled",
};

const SPRING = { type: "spring", stiffness: 340, damping: 32, mass: 0.72 };

const UI = {
  surface:
    "",
  pad: "px-3 py-3 md:px-4 md:py-4",
};

export default function Flow() {
  const router = useRouter();
  const search = useSearchParams();
  const reduceMotion = useReducedMotion();
  const shellRef = useRef<HTMLDivElement | null>(null);

  const [track, setTrack] = useState<Track | null>(null);
  const [stage, setStage] = useState<Stage>("select");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  /* ---- autosave ---- */
  const saveTimer = useRef<number | null>(null);
  const scheduleSave = useCallback(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ track, stage, answers, stepIndex, name, email, phone })
        );
      } catch {}
    }, 150);
  }, [track, stage, answers, stepIndex, name, email, phone]);
  useEffect(() => {
    scheduleSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track, stage, answers, stepIndex, name, email, phone]);

  /* ---- restore on mount ---- */
  useEffect(() => {
    const t = search.get("track") as Track | null;
    if (t && ["residency", "citizenship", "corporate", "skilled"].includes(t)) {
      startTrack(t, true);
      return;
    }
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as {
          track: Track | null;
          stage: Stage;
          answers: AnswerMap;
          stepIndex: number;
          name: string;
          email: string;
          phone: string;
        };
        if (s?.track) {
          setTrack(s.track);
          setStage(s.stage ?? "quiz");
          setAnswers(s.answers ?? {});
          setStepIndex(s.stepIndex ?? 0);
          setName(s.name ?? "");
          setEmail(s.email ?? "");
          setPhone(s.phone ?? "");
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- questions ---- */
  const questions = useMemo(
    () => (track ? getQuestionsForTrack(track, answers) : []),
    [track, answers]
  );

  const progressPct = useMemo(() => {
    if (!questions.length) return 0;
    return Math.max(
      0,
      Math.min(100, Math.round((stepIndex / questions.length) * 100))
    );
  }, [questions.length, stepIndex]);
  const progressText = useMemo(() => {
    if (!questions.length) return "";
    return `Step ${Math.min(stepIndex + 1, questions.length)} of ${
      questions.length
    }`;
  }, [questions.length, stepIndex]);
  const etaText = useMemo(() => {
    if (!questions.length) return "2–4 min";
    const remaining = Math.max(questions.length - stepIndex, 1);
    const mins = Math.max(1, Math.round((remaining * 12) / 60));
    return `${mins} min left`;
  }, [questions.length, stepIndex]);

  /* ---- navigation helpers ---- */
  const startTrack = useCallback(
    (t: Track, replaceOnly = false) => {
      setTrack(t);
      setStage("quiz");
      setAnswers({});
      setStepIndex(0);
      trackEvent("select_track", { track: t });

      const nav = `/eligibility?track=${t}`;
      replaceOnly
        ? router.replace(nav, { scroll: false })
        : router.push(nav, { scroll: false });

      requestAnimationFrame(() => {
        const el = shellRef.current;
        if (!el) return;
        el.style.scrollMarginTop = "12px";
        el.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    },
    [reduceMotion, router]
  );

  /** Robustly go back to the select screen and clear ?track from the URL */
  const goToSelect = useCallback(() => {
    // reset state first
    setTrack(null);
    setStage("select");
    setAnswers({});
    setStepIndex(0);

    // clear ?track from URL (history fallback ensures Next state updates immediately)
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has("track")) {
        url.searchParams.delete("track");
        window.history.replaceState({}, "", url.pathname + url.search);
      }
    } catch {}
    router.replace("/eligibility", { scroll: false });
  }, [router]);

  /* keep URL and state in sync (URL is source of truth only when it has track) */
  useEffect(() => {
    const urlTrack = search.get("track") as Track | null;
    if (urlTrack && urlTrack !== track) {
      startTrack(urlTrack, true);
      return;
    }
    // If URL has no track, do nothing here: goToSelect handles the reset instantly.
  }, [search, track, startTrack]);

  const onAnswer = useCallback(
    (key: string, value: unknown) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
      const next = stepIndex + 1;
      if (next >= questions.length) {
        setStage("lead");
        trackEvent("show_lead_gate", { track });
      } else {
        setStepIndex(next);
      }
    },
    [questions.length, stepIndex, track]
  );

  const back = useCallback(() => {
    if (stage === "quiz") {
      if (stepIndex > 0) setStepIndex((i) => i - 1);
      else goToSelect(); // back from first question → select
      return;
    }
    if (stage === "lead") {
      setStage("quiz");
      return;
    }
    if (stage === "result") {
      setStage("lead");
      return;
    }
  }, [stage, stepIndex, goToSelect]);

  /* keyboard back */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "ArrowLeft") back();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [back]);

  const submitLead = useCallback(async () => {
    const payload = { name, email, phone, track, answers };
    try {
      await fetch("/api/eligibility/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {}
    setStage("result");
    trackEvent("result_viewed", { track });
  }, [name, email, phone, track, answers]);

  /* ------------------------------- RENDER ------------------------------- */
  return (
    <div ref={shellRef} className="w-full">
      <div className={`${UI.surface} overflow-hidden`}>
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 to-indigo-500" />
        <div className={`${UI.pad}`}>
          <AnimatePresence mode="wait" initial={false}>
            {/* SELECT */}
            {stage === "select" && (
              <Section key="select">

                {/* 1-up (mobile) → 2-up (sm) → 4-up (md+) */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 min-w-0">
                  <Tile>
                    <CategoryTile
                      title="Residency"
                      onClickAction={() => startTrack("residency")}
                    />
                  </Tile>
                  <Tile>
                    <CategoryTile
                      title="Citizenship"
                      onClickAction={() => startTrack("citizenship")}
                    />
                  </Tile>
                  <Tile>
                    <CategoryTile
                      title="Corporate"
                      onClickAction={() => startTrack("corporate")}
                    />
                  </Tile>
                  <Tile>
                    <CategoryTile
                      title="Skilled"
                      onClickAction={() => startTrack("skilled")}
                    />
                  </Tile>
                </div>
              </Section>
            )}

            {/* QUIZ */}
            {stage === "quiz" && track && (
              <Section key="quiz">
                <TopBar
                  back={back}
                  onChangePathway={goToSelect}
                  changeLabel="Change pathway"
                >
                  <span className="inline-flex items-center gap-2 rounded-full ring-1 ring-black/10 dark:ring-white/20 bg-black/5 dark:bg-white/10 px-2 py-1 text-xs font-medium">
                    {TRACK_LABEL[track]}
                  </span>
                  <span
                    className="text-xs md:text-sm opacity-80"
                    aria-live="polite"
                  >
                    {progressText} • {etaText}
                  </span>
                </TopBar>

                <div className="mt-2">
                  <ProgressBar value={progressPct} text={progressText} />
                </div>

                <motion.div
                  key={questions[stepIndex]?.key ?? `q-${stepIndex}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={reduceMotion ? undefined : SPRING}
                  className="mt-2"
                >
                  {Boolean(questions[stepIndex]) ? (
  <QuestionCard
    question={questions[stepIndex]!}
    value={answers[questions[stepIndex]!.key]}
    onSubmitAction={(val) => onAnswer(questions[stepIndex]!.key, val)}
    onBackAction={back}
  />
) : null}

                </motion.div>
              </Section>
            )}

            {/* LEAD */}
            {stage === "lead" && track && (
              <Section key="lead">
                <TopBar
                  back={back}
                  onChangePathway={goToSelect}
                  changeLabel="Change pathway"
                >
                  <span className="text-xs opacity-80">Almost done</span>
                </TopBar>

                <div className="mt-2 mb-2">
                  <ProgressBar value={100} text="Almost done" />
                </div>

                <div className="relative z-10 pointer-events-auto">
                <LeadGate
  track={track}
  answers={answers}
  name={name}
  setName={setName}
  email={email}
  setEmail={setEmail}
  phone={phone}
  setPhone={setPhone}
  onSubmitAction={submitLead}   // ← use it directly
/>

                </div>
              </Section>
            )}

            {/* RESULT */}
            {stage === "result" && track && (
              <Section key="result">
                <TopBar
                  back={back}
                  onChangePathway={goToSelect}
                  changeLabel="Change pathway"
                >
                  <span className="text-xs opacity-80">Results</span>
                </TopBar>

                <div className="relative z-10 pointer-events-auto">
                  <ResultCard
                    track={track}
                    result={scoreAssessment(track, answers)}
                    name={name}
                    answers={answers}
                    onBackAction={back}
                  />
                </div>
              </Section>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Print */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            nav, header, footer { display: none !important; }
            a[href]:after { content: ""; }
          }
        `,
        }}
      />
    </div>
  );
}

/* ---------------- small, fast UI primitives ---------------- */

function Section({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={reduceMotion ? undefined : SPRING}
      className="pointer-events-auto"
    >
      {children}
    </motion.section>
  );
}

function HeaderRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">{children}</div>
  );
}

/** Grid item wrapper */
function Tile({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={reduceMotion ? undefined : SPRING}
      className="min-w-0 w-full"
    >
      {children}
    </motion.div>
  );
}

/** Top bar with Back + optional Change Pathway. Always above other layers. */
function TopBar({
  back,
  children,
  onChangePathway,
  changeLabel,
}: {
  back: () => void;
  children?: React.ReactNode;
  onChangePathway?: () => void;
  changeLabel?: string;
}) {
  return (
    <div className="relative z-30 flex items-center gap-2">
      <button
        type="button"
        onClick={back}
        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1 ring-black/10 hover:ring-black/20 dark:ring-white/15 dark:hover:ring-white/25"
        aria-label="Go back"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path
            d="M7.5 2.5L4 6l3.5 3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </button>

      {children}

      {onChangePathway ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onChangePathway();
          }}
          className="ml-auto text-xs underline hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label={changeLabel || "Change pathway"}
        >
          {changeLabel || "Change pathway"}
        </button>
      ) : null}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full ring-1 ring-black/10 dark:ring-white/15 px-2 py-0.5">
      {children}
    </span>
  );
}
