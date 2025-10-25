"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ContactForm from "@/components/ContactForm";

/* ------------------------------ Types ------------------------------ */
export type FAQ = { question: string; answer: string };

export type FAQWithFormProps = {
  title?: string;
  highlight?: string;
  subtitle?: string;
  faqs?: FAQ[];
  defaultOpen?: number;          // which FAQ is open initially (default 0)
  peekOnHover?: boolean;         // open item on hover (default true on md+)
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
      "Timelines vary by country and program. Typical ranges are 4–24 weeks. We’ll share a tailored timeline after your assessment.",
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
  highlight = "We’re here to help.",
  subtitle = "Quick answers to common questions. If you don’t see yours, send us a message.",
  faqs = DEFAULT_FAQS,
  defaultOpen = 0,
  peekOnHover = true,
  className = "",
  formSlot,
}: FAQWithFormProps) {
  const [openIdx, setOpenIdx] = React.useState<number>(Math.min(defaultOpen, faqs.length - 1));
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);

  const useHover = peekOnHover; // simple flag; behavior is the same on all breakpoints

  const activeIdx = useHover && hoverIdx !== null ? hoverIdx : openIdx;

  const onToggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section className={[ "container mx-auto px-4 lg:max-w-screen-xl", className, ].join(" ")}
      aria-labelledby="faq-heading"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)]">
        {/* ------------------ Left: FAQs ------------------ */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          className="min-w-0"
        >
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
              const isOpen = activeIdx === idx;
              const qId = `faq-q-${idx}`;
              const aId = `faq-a-${idx}`;

              return (
                <li key={idx}>
                  <div
                    className="overflow-hidden rounded-xl ring-1 ring-blue-100/80 bg-white/90 dark:ring-blue-900/40 dark:bg-white/[0.03]"
                    onMouseEnter={useHover ? () => setHoverIdx(idx) : undefined}
                    onMouseLeave={useHover ? () => setHoverIdx(null) : undefined}
                  >
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
                          "h-5 w-5 shrink-0 transition-transform",
                          isOpen ? "rotate-180 text-blue-700 dark:text-blue-300" : "text-black/50 dark:text-white/60",
                        ].join(" ")}
                        aria-hidden
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={aId}
                          role="region"
                          aria-labelledby={qId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                          <div className="px-4 pb-4 text-sm text-zinc-800 dark:text-zinc-300">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* ------------------ Right: Form ------------------ */}
        <motion.aside
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          className="min-w-0 md:pl-2 lg:pl-3"
        >
          <div className="rounded-2xl ring-1 ring-blue-100/80 bg-white/90 p-3 sm:p-4 dark:ring-blue-900/40 dark:bg-white/[0.03]">
            {formSlot ?? <ContactForm />}
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
