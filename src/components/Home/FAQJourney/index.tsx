// FILE: src/components/Common/FAQSectionXiphas.tsx
"use client";

import * as React from "react";

type FAQ = { q: string; a: string };

const DEFAULT_FAQS: FAQ[] = [
  {
    q: "How does my journey with XIPHIAS start?",
    a: "With a private discovery call (20–30 mins). We clarify your goals—relocation, work, investment, family, or a second home—along with timelines and budget. You leave with a shortlist of routes and a first roadmap tailored to your profile.",
  },
  {
    q: "What happens after the consultation?",
    a: "We complete structured profile diligence (work history, education, assets, source of funds, travel history, dependants) and lock the best-fit program. You receive milestones, documentation lists, fees, and estimated decision windows.",
  },
  {
    q: "Which documents will I need to prepare?",
    a: "Typically: passports, civil status, education/work proofs, bank statements, and police clearances. Investment/business routes may require source-of-funds and company papers. We provide checklists, templates, and QC guidance for each step.",
  },
  {
    q: "How long does the process usually take?",
    a: "It varies by country and route. Fast-track visas: ~1–3 months. Investment PR/Golden Visa: ~3–9 months. Some citizenship-by-exception routes: ~4–8 months. We keep a milestone tracker and update you if authorities request more evidence.",
  },
  {
    q: "Can my family be included in the same file?",
    a: "Yes. Most programs include spouse and dependent children; some allow parents. We plan sequencing so school/work schedules face minimal disruption and everyone moves through the process smoothly.",
  },
  {
    q: "What support do I get post-approval and on landing?",
    a: "We guide visa stamping, landing formalities, IDs/tax numbers, and local registrations. Our relocation desk coordinates housing, schools, banking, insurance and—on business routes—entity setup and light compliance so you can settle quickly.",
  },
];

export default function FAQSectionXiphas({
  faqs = DEFAULT_FAQS,
  title = "Your journey with XIPHIAS — Top FAQs",
  subtitle = "A quick overview from first consultation to post-landing support.",
  className = "",
  hashMode = "replace", // "replace" | "push"
  clearHashOnClose = false,
}: {
  faqs?: FAQ[];
  title?: string;
  subtitle?: string;
  className?: string;
  hashMode?: "replace" | "push";
  clearHashOnClose?: boolean;
}) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const userChangedRef = React.useRef(false);

  const slugs = React.useMemo(() => (faqs ?? []).map((f) => slugify(f.q)), [faqs]);

  // On load: if hash matches a question, open it and scroll to it.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (!hash) return;
    const idx = slugs.indexOf(hash);
    if (idx >= 0) {
      setOpenIndex(idx);
      // scroll to anchor on initial load
      requestAnimationFrame(() => scrollToSlug(hash));
    }
  }, [slugs]);

  // After a USER toggle, write/clear hash and scroll to the opened item.
  React.useEffect(() => {
    if (typeof window === "undefined" || !userChangedRef.current) return;

    const base = `${window.location.pathname}${window.location.search}`;
    const write = (url: string) =>
      hashMode === "push"
        ? window.history.pushState?.(null, "", url)
        : window.history.replaceState?.(null, "", url);

    if (openIndex === null) {
      if (clearHashOnClose) write(base);
    } else {
      const slug = slugs[openIndex];
      write(`${base}#${slug}`);
      // smooth scroll to newly opened item
      scrollToSlug(slug);
    }
    userChangedRef.current = false;
  }, [openIndex, slugs, hashMode, clearHashOnClose]);

  const onToggle = React.useCallback((idx: number) => {
    userChangedRef.current = true;
    setOpenIndex((cur) => (cur === idx ? null : idx));
  }, []);

  if (!faqs?.length) return null;

  return (
    <section
      id="faq"
      role="region"
      aria-label="Frequently asked questions"
      className={`py-10 sm:py-12 md:py-14 ${className}`}
    >
      <div className="container mx-auto lg:max-w-screen-2xl px-4 sm:px-6 lg:px-8 overflow-x-clip">
        <header className="mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white break-words">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 max-w-3xl text-sm sm:text-base text-zinc-700 dark:text-zinc-300 break-words">
              {subtitle}
            </p>
          )}
        </header>

        {/* Simple, clean accordion */}
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200 shadow-sm dark:bg-white/5 dark:ring-white/10 divide-y divide-zinc-200 dark:divide-white/10">
          {faqs.slice(0, 6).map((f, i) => {
            const isOpen = openIndex === i;
            const slug = slugs[i];
            const panelId = `faq-panel-${i}-${slug}`;
            const buttonId = `faq-button-${i}-${slug}`;

            return (
              <div key={panelId} className="px-4 sm:px-5">
                {/* anchor target so #hash scrolls correctly */}
                <span id={slug} className="block scroll-mt-28" aria-hidden />

                <h3 className="m-0">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => onToggle(i)}
                    className="group flex w-full items-center justify-between gap-3 py-4 sm:py-5 text-left text-[15px] sm:text-base font-semibold rounded-lg hover:bg-zinc-50/80 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 text-zinc-900 dark:text-zinc-100 transition"
                  >
                    <span className="pr-2 break-words">{f.q}</span>
                    <Chevron
                      className={[
                        "h-5 w-5 shrink-0 text-zinc-600 dark:text-zinc-300 transition-transform duration-300",
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
                    <div className="pb-4 sm:pb-5 text-[15px] leading-7 text-zinc-800 dark:text-zinc-200 whitespace-pre-line">
                      {f.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
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
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Smoothly scrolls to the anchor for a slug (respects reduced motion). */
function scrollToSlug(slug: string) {
  try {
    const el = document.getElementById(slug);
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  } catch {
    /* no-op */
  }
}
