// src/components/PersonalBooking/ProblemSolution/index.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ShieldCheck,
  ClipboardList,
  FileCheck2,
  Globe2,
  Landmark,
  TimerReset,
  BadgeCheck,
  Banknote,
  Building2,
  Scale,
  FileText,
  Fingerprint,
  BriefcaseBusiness,
  GraduationCap,
} from "lucide-react";

/**
 * ProblemSolutionCompare (HNI edition)
 * - Tailored for HNIs: RBI/CBI, corporate mobility, and high-net-worth skilled routes
 * - Mobile-first; md+ shows side-by-side rows
 * - Designed for paid booking pages: includes a deliverables box ("What you get")
 * - Neutral, compliance-first copy aligned with IMC/FATF expectations
 */

type Pair = {
  id: string;
  problem: { title: string; desc: string; tag?: string; icon?: React.ReactNode };
  solution: { title: string; desc: string; note?: string; icon?: React.ReactNode };
};

const PAIRS: Pair[] = [
  {
    id: "pathway-fit",
    problem: {
      title: "Program noise, shifting rules, and one-size-fits-all advice",
      desc:
        "HNI families face a maze of options (RBI/CBI, entrepreneur, skilled, family) with frequent policy changes and conflicting market narratives.",
      tag: "Strategy Risk",
      icon: <Globe2 className="h-5 w-5 text-amber-600" />,
    },
    solution: {
      title: "IMC-aligned discovery & dual-track plan",
      desc:
        "Independent shortlisting across jurisdictions with a primary and contingency route (e.g., fund/investment vs. skills/corporate), so pivots are pre-planned if rules shift.",
      note: "Keeps optionality while avoiding dead-ends.",
      icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
    },
  },
  {
    id: "sof-aml",
    problem: {
      title: "Complex source-of-funds (SoF) & AML/KYC scrutiny",
      desc:
        "Multi-asset wealth (private companies, real estate exits, carried interest, trusts) generates DD friction; PEP checks and adverse media can trigger slowdowns.",
      tag: "Due-Diligence",
      icon: <Fingerprint className="h-5 w-5 text-amber-600" />,
    },
    solution: {
      title: "Forensic SoF narrative & DD-ready pack",
      desc:
        "A coherent funds trail (audited statements, SPAs, distributions, trust deeds) plus PEP/adverse-media screening upfront—presented in regulator-friendly structure.",
      note: "Built to AML expectations; reduces back-and-forth.",
      icon: <FileCheck2 className="h-5 w-5 text-emerald-600" />,
    },
  },
  {
    id: "investment-execution",
    problem: {
      title: "Instrument risk & execution (escrow, fund terms, liquidity)",
      desc:
        "Unclear escrow terms, side letters, and redemption mechanics expose capital to delays or lock-ups; real-estate options are restricted in some programs.",
      tag: "Capital Risk",
      icon: <Banknote className="h-5 w-5 text-amber-600" />,
    },
    solution: {
      title: "Curated, policy-compliant routes & risk brief",
      desc:
        "We align the route with current program policy, summarize key risks (governance, liquidity, fees), and co-ordinate counsel for subscription/escrow document checks.",
      note: "We do not provide investment advice—process & compliance only.",
      icon: <Scale className="h-5 w-5 text-emerald-600" />,
    },
  },
  {
    id: "tax-residency",
    problem: {
      title: "Tax residency & presence-day traps",
      desc:
        "Unplanned days on the ground, tie-breaker rules and reporting (CRS/AEOI) can create unexpected tax outcomes for globally mobile families.",
      tag: "Tax/Reporting",
      icon: <Landmark className="h-5 w-5 text-amber-600" />,
    },
    solution: {
      title: "Pre-landing planning with accredited advisors",
      desc:
        "We flag tax-residency impacts at strategy stage, then co-ordinate opinions with specialist counsel on timing, domicile, and reporting to avoid unpleasant surprises.",
      note: "Sequencing avoids accidental tax residence.",
      icon: <FileText className="h-5 w-5 text-emerald-600" />,
    },
  },
  {
    id: "governance-family",
    problem: {
      title: "Family governance (spouse, dependants, education, succession)",
      desc:
        "Cut-off ages, dependency rules, and study plans are often misaligned with the chosen route; succession/estate angles get missed.",
      tag: "Family",
      icon: <GraduationCap className="h-5 w-5 text-amber-600" />,
    },
    solution: {
      title: "Whole-household routing & documentation map",
      desc:
        "We blueprint eligibility across family members, align education timelines, and highlight succession/estate touchpoints for counsel review.",
      note: "Avoids last-minute dependent exclusions.",
      icon: <ClipboardList className="h-5 w-5 text-emerald-600" />,
    },
  },
  {
    id: "corporate-mobility",
    problem: {
      title: "Corporate mobility & PE/payroll compliance",
      desc:
        "C-suite relocations, intra-company transfers and remote leadership risk permanent establishment, payroll leakage and license breaches.",
      tag: "Corporate",
      icon: <BriefcaseBusiness className="h-5 w-5 text-amber-600" />,
    },
    solution: {
      title: "Business-case kits & host-country compliance",
      desc:
        "We assemble visa-fit business cases, co-ordinate with local counsel for entity/PE/payroll checks, and stage entry so licenses and reporting stay in sync.",
      note: "Protects both executive and enterprise.",
      icon: <Building2 className="h-5 w-5 text-emerald-600" />,
    },
  },
  {
    id: "timelines",
    problem: {
      title: "Missed timelines & expiring docs (PCCs, bank letters, medicals)",
      desc:
        "Critical documents lapse or land out of sequence, causing re-work and queue resets.",
      tag: "Execution",
      icon: <TimerReset className="h-5 w-5 text-amber-600" />,
    },
    solution: {
      title: "Milestone calendar with proactive refreshes",
      desc:
        "We maintain a live tracker for time-sensitive documents, file early, and respond fast to clarifications until decision and landing.",
      note: "Minimizes idle time and duplicate effort.",
      icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
    },
  },
  {
    id: "misrepresentation",
    problem: {
      title: "Unlicensed intermediaries & over-promising",
      desc:
        "Informal advisory and unverified claims create refusal risk and reputational exposure for HNIs.",
      tag: "Governance",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    },
    solution: {
      title: "IMC-certified leadership & transparent scope",
      desc:
        "Engagements are documented with clear scope, compliant marketing, and ethics-first guidance under IMC’s code of conduct.",
      note: "Led by a Fellow Certified Investment Migration Consultant (FIMC).",
      icon: <BadgeCheck className="h-5 w-5 text-emerald-600" />,
    },
  },
];

export default function ProblemSolutionCompare({ className = "" }: { className?: string }) {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-5">
    <section
      className={[
        "relative w-full py-5 sm:py-5",
        "bg-gradient-to-b from-slate-50 via-white to-slate-100",
        "dark:from-slate-900 dark:via-slate-950 dark:to-black",
        className,
      ].join(" ")}
      aria-labelledby="ps-compare-title"
    >
      {/* background accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4">
        {/* header */}
        <div className="max-w-3xl">
          <h2
            id="ps-compare-title"
            className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-800 dark:text-slate-100 leading-tight"
          >
            Built for{" "}
            <span className="bg-gradient-to-r from-primary/70 to-primary bg-clip-text text-transparent">
              HNI families & leaders
            </span>
            : problems we solve—side by side
          </h2>
          <p className="mt-3 text-base md:text-lg text-slate-600 dark:text-slate-300">
            A compliance-first pathway under IMC standards—clear strategy, due-diligence-ready
            documentation, and coordinated execution from discovery to landing.
          </p>
        </div>

        {/* rows */}
        <div className="mt-8 space-y-4">
          {PAIRS.map((row) => (
            <Row key={row.id} pair={row} />
          ))}
        </div>

        {/* Deliverables: What they get in a paid consultation */}
        <DeliverablesBox />

        {/* CTA */}
        <div className="mt-10">
          <Link
            href="/personal-booking"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-white font-semibold shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80"
          >
            Book your paid strategy call
          </Link>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Note: We do not provide investment or tax advice; we coordinate with licensed advisors.
          </p>
        </div>
      </div>
    </section>
    </div>
  );
}

/* ----------------------------- Row component ----------------------------- */

function Row({ pair }: { pair: Pair }) {
  const { problem, solution } = pair;
  return (
    <article
      className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-700/60 bg-white/80 dark:bg-white/[0.03] shadow-sm"
      role="group"
      aria-label={`${problem.title} vs ${solution.title}`}
    >
      {/* Problem side */}
      <div className="p-5 sm:p-6 border-b md:border-b-0 md:border-r border-slate-200/70 dark:border-slate-700/50 bg-gradient-to-b from-amber-50/70 to-transparent dark:from-amber-500/10">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Problem
          </span>
          {problem.tag && (
            <span className="ml-2 rounded-full bg-white/80 px-2 py-0.5 text-[11px] ring-1 ring-amber-200/70 dark:bg-white/10 dark:ring-amber-700/40">
              {problem.tag}
            </span>
          )}
        </div>
        <h3 className="mt-2 text-[17px] sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
          {problem.title}
        </h3>
        <p className="mt-2 text-[15px] text-slate-700 dark:text-slate-200">{problem.desc}</p>
        {problem.icon && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs ring-1 ring-amber-200/70 dark:bg-white/10 dark:ring-amber-700/40">
            {problem.icon}
            Risk to timelines/compliance
          </div>
        )}
      </div>

      {/* Solution side */}
      <div className="p-5 sm:p-6 bg-gradient-to-b from-emerald-50/70 to-transparent dark:from-emerald-500/10">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Solution
          </span>
        </div>
        <h3 className="mt-2 text-[17px] sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
          {solution.title}
        </h3>
        <p className="mt-2 text-[15px] text-slate-700 dark:text-slate-200">{solution.desc}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {solution.icon && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs ring-1 ring-emerald-200/70 dark:bg-white/10 dark:ring-emerald-800/40">
              {solution.icon}
              Implemented by experts
            </span>
          )}
          {solution.note && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs ring-1 ring-blue-200/70 dark:bg-white/10 dark:ring-blue-900/40">
              <BadgeCheck className="h-4 w-4 text-blue-600" />
              {solution.note}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/* --------------------------- Deliverables component --------------------------- */

function DeliverablesBox() {
  const points: { icon: React.ReactNode; title: string; desc: string }[] = [
    {
      icon: <ClipboardList className="h-4 w-4 text-primary" />,
      title: "Primary + contingency route",
      desc:
        "A short-listed primary program with a ready-to-pivot Plan B that fits your timelines and risk profile.",
    },
    {
      icon: <FileCheck2 className="h-4 w-4 text-primary" />,
      title: "DD-ready document map",
      desc:
        "Program-specific checklist, SoF narrative outline, and translation/notarization plan to reduce queries.",
    },
    {
      icon: <FileText className="h-4 w-4 text-primary" />,
      title: "Timeline & milestone calendar",
      desc:
        "Presence-day guidance, expiring docs, and filing windows organized into a live milestone schedule.",
    },
    {
      icon: <Scale className="h-4 w-4 text-primary" />,
      title: "Risk & assumption brief",
      desc:
        "A plain-English summary of policy dependencies and operational risks; we coordinate legal/tax counsel where required.",
    },
  ];

  return (
    <div className=" rounded-2xl ring-1 ring-blue-100/70 dark:ring-blue-900/40 bg-white/80 dark:bg-white/[0.03] p-5 sm:p-6">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
        <BadgeCheck className="h-4 w-4 text-primary" />
        What you get in a paid strategy call
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {points.map((p, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 ring-1 ring-blue-100 dark:bg-blue-900/20 dark:ring-blue-900/50">
              {p.icon}
            </div>
            <div>
              <div className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">
                {p.title}
              </div>
              <div className="text-[13px] text-slate-700 dark:text-slate-300">{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
