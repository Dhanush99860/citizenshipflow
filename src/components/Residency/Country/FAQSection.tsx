// src/components/Residency/Country/FAQSection.tsx
// Elegant, accessible FAQ accordion for an immigration site.
// - "use client" + plain React (Next 14 friendly)
// - Clean UI, neutral accents (no unexpected blue rings on refresh)
// - Deep-linkable (#faq-your-question) and hash-sync
// - Smooth height animation (CSS grid rows)
// - SEO: schema.org FAQPage JSON-LD
// - Works in light & dark themes; mobile-first

"use client";

import * as React from "react";

type FAQ = { q: string; a: string };

export default function FAQSection({ faqs }: { faqs?: FAQ[] }) {
  if (!faqs?.length) return null;

  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  // Stable slugs for #hash deep links
  const slugs = React.useMemo(() => faqs.map((f) => slugify(f.q)), [faqs]);

  // Open the item matching the hash on load / hash change (no programmatic focus = no visible ring)
  React.useEffect(() => {
    const applyHash = () => {
      const hash = decodeURIComponent(
        (typeof window !== "undefined" ? window.location.hash : "").replace("#", "")
      );
      if (!hash) return;
      const idx = slugs.indexOf(hash);
      if (idx >= 0) setOpenIndex(idx);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [slugs]);

  const onToggle = (idx: number) => {
    setOpenIndex((cur) => {
      const next = cur === idx ? null : idx;
      // Update hash without adding history entries
      if (typeof window !== "undefined" && window.history?.replaceState) {
        const nextHash = next === null ? "" : `#${slugs[next]}`;
        const url = nextHash
          ? `${window.location.pathname}${window.location.search}${nextHash}`
          : `${window.location.pathname}${window.location.search}`;
        window.history.replaceState(null, "", url);
      }
      return next;
    });
  };

  return (
    <section
      id="faq"
      role="region"
      aria-label="Frequently asked questions"
      className="mt-5"
    >
      {/* Card container */}
      <div
        className="
          overflow-visible rounded-2xl
          bg-gradient-to-br from-slate-50 to-white dark:from-neutral-900/60 dark:to-neutral-900/20
          ring-1 ring-slate-200/70 dark:ring-neutral-800/70
          shadow-sm divide-y divide-slate-200/70 dark:divide-neutral-800/70
        "
      >
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;
          const panelId = `faq-panel-${i}-${slugs[i]}`;
          const buttonId = `faq-button-${i}-${slugs[i]}`;

          return (
            <div key={panelId} className="px-4 sm:px-5">
              {/* Question row */}
              <h3 className="m-0">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => onToggle(i)}
                  className="
                    group flex w-full items-center justify-between gap-3 py-4 sm:py-5 text-left
                    text-[15px] sm:text-base font-semibold
                    rounded-lg
                    hover:bg-white/60 dark:hover:bg-neutral-900/60
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500/60
                    text-neutral-900 dark:text-neutral-100
                    transition
                  "
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

              {/* Answer (animated height) */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={[
                  // use grid rows so height animates smoothly
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

      {/* JSON-LD for FAQ rich results */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqLd(faqs)) }}
      />
    </section>
  );
}

/* ------------ helpers ------------ */
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
