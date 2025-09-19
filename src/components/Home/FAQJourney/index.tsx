// FILE: src/components/Common/FAQSectionXiphas.tsx
"use client";

import * as React from "react";

type FAQ = { q: string; a: string };

const DEFAULT_FAQS: FAQ[] = [
  {
    q: "How does my journey with XIPHIAS start?",
    a:
      "With a private discovery call (20–30 mins). We clarify your goals—relocation, work, investment, family, or a second home—along with timelines and budget. You leave with a shortlist of routes and a first roadmap tailored to your profile.",
  },
  {
    q: "What happens after the consultation?",
    a:
      "We complete structured profile diligence (work history, education, assets, source of funds, travel history, dependants) and lock the best-fit program. You receive milestones, documentation lists, fees, and estimated decision windows.",
  },
  {
    q: "Which documents will I need to prepare?",
    a:
      "Typically: passports, civil status, education/work proofs, bank statements, and police clearances. Investment/business routes may require source-of-funds and company papers. We provide checklists, templates, and QC guidance for each step.",
  },
  {
    q: "How long does the process usually take?",
    a:
      "It varies by country and route. Fast-track visas: ~1–3 months. Investment PR/Golden Visa: ~3–9 months. Some citizenship-by-exception routes: ~4–8 months. We keep a milestone tracker and update you if authorities request more evidence.",
  },
  {
    q: "Can my family be included in the same file?",
    a:
      "Yes. Most programs include spouse and dependent children; some allow parents. We plan sequencing so school/work schedules face minimal disruption and everyone moves through the process smoothly.",
  },
  {
    q: "What support do I get post-approval and on landing?",
    a:
      "We guide visa stamping, landing formalities, IDs/tax numbers, and local registrations. Our relocation desk coordinates housing, schools, banking, insurance and—on business routes—entity setup and light compliance so you can settle quickly.",
  },
];

export default function FAQSectionXiphas({
  faqs = DEFAULT_FAQS,
  title = "Your journey with XIPHIAS — Top FAQs",
  subtitle = "A quick overview from first consultation to post-landing support.",
  className = "",
}: {
  faqs?: FAQ[];
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  // open first by default
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  // Stable slugs for #hash deep links
  const slugs = React.useMemo(() => (faqs ?? []).map((f) => slugify(f.q)), [faqs]);

  // Open matching hash on load / when hash changes
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const applyHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace("#", ""));
      if (!hash) return;
      const idx = slugs.indexOf(hash);
      if (idx >= 0) setOpenIndex(idx);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [slugs]);

  // ✅ Update URL hash AFTER render when the open item changes
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (openIndex === null) {
      // clear hash but keep path + search
      const url = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, "", url);
    } else {
      const nextHash = `#${slugs[openIndex]}`;
      const url = `${window.location.pathname}${window.location.search}${nextHash}`;
      window.history.replaceState(null, "", url);
    }
  }, [openIndex, slugs]);

  const onToggle = React.useCallback((idx: number) => {
    setOpenIndex((cur) => (cur === idx ? null : idx));
  }, []);

  if (!faqs?.length) return null;

  return (
    <section
      id="faq"
      role="region"
      aria-label="Frequently asked questions"
      className={`relative py-10 sm:py-12 md:py-14 ${className}`}
    >
      {/* Soft background accents (no heavy cards/boxes) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-10 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
        {subtitle && (
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            {subtitle}
          </p>
        )}
        </header>

        {/* Elegant accordion */}
        <div className="overflow-visible rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-neutral-900/60 dark:to-neutral-900/20 ring-1 ring-slate-200/70 dark:ring-neutral-800/70 shadow-sm divide-y divide-slate-200/70 dark:divide-neutral-800/70">
          {faqs.slice(0, 6).map((f, i) => {
            const isOpen = openIndex === i;
            const panelId = `faq-panel-${i}-${slugs[i]}`;
            const buttonId = `faq-button-${i}-${slugs[i]}`;
            return (
              <div key={panelId} className="px-4 sm:px-5">
                <h3 className="m-0">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => onToggle(i)}
                    className="group flex w-full items-center justify-between gap-3 py-4 sm:py-5 text-left text-[15px] sm:text-base font-semibold rounded-lg hover:bg-white/60 dark:hover:bg-neutral-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500/60 text-neutral-900 dark:text-neutral-100 transition"
                  >
                    <span className="pr-2">{f.q}</span>
                    <Chevron
                      className={[
                        "h-5 w-5 shrink-0 text-neutral-600 dark:text-neutral-300 transition-transform duration-300",
                        isOpen ? "rotate-180" : "rotate-0",
                      ].join(" ")}
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={[
                    "grid transition-all duration-300 ease-out motion-reduce:transition-none",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <div className="pb-4 sm:pb-5 text-[15px] leading-7 text-black/80 dark:text-gray-200 whitespace-pre-line">
                      {f.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Still curious? Book a private consultation—we’ll map your best options, documents and timelines.
        </p>
      </div>

      {/* SEO: FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqLd(faqs.slice(0, 6))),
        }}
      />
    </section>
  );
}

/* helpers */
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function buildFaqLd(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
