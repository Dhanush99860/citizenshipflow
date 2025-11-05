"use client";

// src/components/FAQWithForm/index.tsx

import * as React from "react";
import { ChevronDown } from "lucide-react";
import ContactForm from "@/components/ContactForm";

/* ------------------------------ Types ------------------------------ */
export type FAQ = { question: string; answer: string };

export type FAQWithFormProps = {
  title?: string;
  highlight?: string;
  subtitle?: string;
  faqs?: FAQ[];
  /** which FAQ is open initially; set to -1 for none */
  defaultOpen?: number;
  /** kept for backward-compat but ignored (hover-to-open removed) */
  peekOnHover?: boolean;
  className?: string;
  /** Inject a custom form (defaults to your ContactForm) */
  formSlot?: React.ReactNode;
};

/* --------------------------- Default content ------------------------ */
const DEFAULT_FAQS: FAQ[] = [
  {
    question: "What services do you provide?",
    answer:
      "End-to-end immigration services: assessment, strategy, documentation, filings, and post-landing support across multiple destinations.",
  },
  {
    question: "How long does the process take?",
    answer:
      "Timelines vary by country and program. Typical ranges are 4â€“24 weeks. Weâ€™ll share a tailored timeline after your assessment.",
  },
  {
    question: "Do you work with clients outside India?",
    answer:
      "Yes. We support applicants worldwide and coordinate across time zones for calls, document reviews, and filings.",
  },
  {
    question: "Is the first consultation free?",
    answer:
      "Yes. The first consultation helps us understand your goals and eligibility before recommending a pathway.",
  },
];

/* ----------------------------- Component --------------------------- */
export default function FAQWithForm({
  title = "Your journey with XIPHIAS",
  highlight = "Weâ€™re here to help.",
  subtitle = "Quick answers to common questions. If you donâ€™t see yours, send us a message.",
  faqs = DEFAULT_FAQS,
  defaultOpen = 0,
  // hover open removed; prop ignored to keep API stable
  peekOnHover, // eslint-disable-line @typescript-eslint/no-unused-vars
  className = "",
  formSlot,
}: FAQWithFormProps) {
  const initialOpen =
    Number.isFinite(defaultOpen) && defaultOpen! >= 0 && defaultOpen! < faqs.length
      ? defaultOpen!
      : -1;

  const [openIdx, setOpenIdx] = React.useState<number>(initialOpen);

  const onToggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section
      className={["container mx-auto px-4 lg:max-w-screen-2xl", className].join(" ")}
      aria-labelledby="faq-heading"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)]">
        {/* ------------------ Left: FAQs ------------------ */}
        <div className="min-w-0">
          {/* Header */}
          <div className="rounded-2xl ring-1 ring-blue-100/80 bg-white/80 p-4 dark:ring-blue-900/40 dark:bg-white/[0.03]">
            <div className="inline-flex items-center gap-2 text-[12px]">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span className="font-semibold">FAQs</span>
            </div>
            <h2 id="faq-heading" className="mt-2 text-xl md:text-2xl font-semibold tracking-tight">
              {title} <span className="text-blue-700 dark:text-blue-300">{highlight}</span>
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-black/70 dark:text-white/70">{subtitle}</p>
            )}
          </div>

          {/* List */}
          <ul className="mt-4 space-y-2">
            {faqs.map((item, idx) => {
              const isOpen = openIdx === idx;
              const qId = `faq-q-${idx}`;
              const aId = `faq-a-${idx}`;

              return (
                <li key={idx}>
                  <div className="overflow-hidden rounded-xl ring-1 ring-blue-100/80 bg-white/90 dark:ring-blue-900/40 dark:bg-white/[0.03]">
                    <button
                      id={qId}
                      aria-expanded={isOpen}
                      aria-controls={aId}
                      onClick={() => onToggle(idx)}
                      className={[
                        "flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-[15px] font-medium",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                      ].join(" ")}
                    >
                      <span className="min-w-0 truncate">{item.question}</span>
                      <ChevronDown
                        className={[
                          "h-5 w-5 shrink-0", // no transition classes (no animations)
                          isOpen
                            ? "rotate-180 text-blue-700 dark:text-blue-300"
                            : "text-black/50 dark:text-white/60",
                        ].join(" ")}
                        aria-hidden
                      />
                    </button>

                    {isOpen && (
                      <div
                        id={aId}
                        role="region"
                        aria-labelledby={qId}
                        className="px-4 pb-4 text-sm text-zinc-800 dark:text-zinc-300"
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ------------------ Right: Form ------------------ */}
        <aside className="min-w-0 md:pl-2 lg:pl-3">
          <div className="pb-5">
            {formSlot ?? <ContactForm />}
          </div>
        </aside>
      </div>
    </section>
  );
}

